import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'portfolio-media';
const outDir = path.join(process.cwd(), 'public', 'assets');
fs.mkdirSync(outDir, { recursive: true });

function slugifyName(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function walk(prefix = '') {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw error;
  let out = [];
  for (const item of data || []) {
    const p = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) out.push(p);
    else out = out.concat(await walk(p));
  }
  return out;
}

const nameMap = new Map();
const certKeys = new Set();

function register(mediaOrUrl, label, isCert = false) {
  if (!mediaOrUrl) return;
  const url = typeof mediaOrUrl === 'string' ? mediaOrUrl : mediaOrUrl.url;
  const publicId = typeof mediaOrUrl === 'object' ? mediaOrUrl.publicId : null;
  const key = publicId || (url && url.includes(`/${bucket}/`) ? url.split(`/${bucket}/`)[1] : null);
  if (!key) return;
  if (isCert) certKeys.add(key);
  if (label && !nameMap.has(key)) {
    nameMap.set(key, slugifyName(label));
  }
}

const [aboutRes, projectsRes, expRes, certsRes, blogRes, galleryRes, testRes, settingsRes] = await Promise.all([
  supabase.from('about').select('*').limit(1).maybeSingle(),
  supabase.from('projects').select('*'),
  supabase.from('experience').select('*'),
  supabase.from('certificates').select('*'),
  supabase.from('blog_posts').select('*'),
  supabase.from('gallery_images').select('*'),
  supabase.from('testimonials').select('*'),
  supabase.from('site_settings').select('*').limit(1).maybeSingle(),
]);

const about = aboutRes.data;
if (about) {
  register(about.profile_photo, 'preethika-poojary-profile');
  register(about.cover_banner, 'preethika-poojary-cover-banner');
  for (const rv of about.resume_versions || []) {
    register(rv.file, rv.label ? `resume-${rv.label}` : 'preethika-poojary-resume');
  }
}

for (const p of projectsRes.data || []) {
  const base = p.slug || slugifyName(p.title);
  register(p.cover_image, `${base}-cover`);
  register(p.report_pdf, `${base}-report`);
  (p.screenshots || []).forEach((s, i) => register(s, `${base}-screenshot-${i + 1}`));
}

for (const e of expRes.data || []) {
  const base = e.slug || slugifyName(e.role || e.title || e.company);
  register(e.certificate, `${base}-certificate`, true);
  register(e.proof_file, `${base}-proof`);
  register(e.project_report_pdf, `${base}-report`);
  (e.attachments || []).forEach((a, i) => register(a, a.alt || `${base}-photo-${i + 1}`));
}

for (const c of certsRes.data || []) {
  const base = c.slug || slugifyName(c.title);
  register(c.image, base, true);
  (c.event_photos || []).forEach((p, i) => register(p, p.caption || p.alt || `${base}-event-${i + 1}`));
}

for (const b of blogRes.data || []) {
  register(b.cover_image, `blog-${b.slug || slugifyName(b.title)}`);
}

for (const g of galleryRes.data || []) {
  register(g.image, g.caption || g.category || 'gallery-photo');
}

for (const t of testRes.data || []) {
  register(t.avatar, `testimonial-${t.slug || slugifyName(t.name)}`);
}

const settings = settingsRes.data;
if (settings) {
  register(settings.logo, 'site-logo');
  register(settings.favicon, 'site-favicon');
  register(settings.seo?.ogImage, 'site-og-image');
}

const allFiles = await walk();
const usedFilenames = new Set();

for (const storagePath of allFiles) {
  const origExt = path.extname(storagePath).toLowerCase() || '.bin';
  const isCert = certKeys.has(storagePath) || /certificate/i.test(storagePath);
  const isRaster = ['.jpg', '.jpeg', '.png', '.webp'].includes(origExt);
  const targetExt = !isRaster ? origExt : isCert ? '.png' : '.webp';

  let base = nameMap.get(storagePath);
  if (!base) {
    const raw = path.basename(storagePath, origExt).replace(/^\d+-([a-z0-9]{4}-)?/i, '');
    const folder = path.dirname(storagePath).replace(/[^a-z0-9]+/gi, '-');
    base = slugifyName(raw.length > 8 ? `${folder}-${raw}` : `${folder}-asset`);
  }

  let filename = `${base}${targetExt}`;
  let counter = 2;
  while (usedFilenames.has(filename)) {
    filename = `${base}-${counter}${targetExt}`;
    counter += 1;
  }
  usedFilenames.add(filename);

  const { data: blob, error: dlErr } = await supabase.storage.from(bucket).download(storagePath);
  if (dlErr) {
    console.error('Failed:', storagePath, dlErr.message);
    continue;
  }
  let buf = Buffer.from(await blob.arrayBuffer());
  if (isRaster) {
    buf = isCert
      ? await sharp(buf).rotate().png({ compressionLevel: 9 }).toBuffer()
      : await sharp(buf).rotate().webp({ quality: 88 }).toBuffer();
  }
  fs.writeFileSync(path.join(outDir, filename), buf);
  console.log(`Synced: public/assets/${filename}`);
}

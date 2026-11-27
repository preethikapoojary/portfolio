function sanitizeFilename(name) {
  return String(name || 'testimonial')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'testimonial';
}

function wrapText(ctx, text, maxWidth) {
  const paragraphs = String(text || '').split(/\n+/);
  const lines = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const test = `${current} ${words[i]}`;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

function loadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function downloadTestimonialImage(testimonial) {
  if (!testimonial || typeof document === 'undefined') return;

  const width = 1200;
  const paddingX = 96;
  const paddingY = 88;
  const contentWidth = width - paddingX * 2;
  const lineHeight = 46;

  // Measure wrapped quote lines first to size canvas dynamically
  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d');
  mCtx.font = 'italic 30px Georgia, "Times New Roman", serif';
  const quoteText = `“${testimonial.message || ''}”`;
  const lines = wrapText(mCtx, quoteText, contentWidth);

  const headerHeight = 80;
  const quoteBlockHeight = Math.max(120, lines.length * lineHeight);
  const footerHeight = 148;
  const height = Math.max(640, paddingY * 2 + headerHeight + quoteBlockHeight + footerHeight);

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Warm ivory background
  ctx.fillStyle = '#F6F4EF';
  ctx.fillRect(0, 0, width, height);

  // Subtle card surface
  ctx.fillStyle = '#EFECE4';
  ctx.fillRect(36, 36, width - 72, height - 72);

  // Editorial outer border
  ctx.strokeStyle = '#DCD9D1';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Top accent rule
  ctx.fillStyle = '#85806D';
  ctx.fillRect(paddingX, paddingY, 56, 3);

  // Eyebrow label
  ctx.fillStyle = '#89877F';
  ctx.font = '600 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('TESTIMONIAL', paddingX, paddingY + 34);

  // Large decorative quote mark
  ctx.fillStyle = '#DCD9D1';
  ctx.font = '700 84px Georgia, serif';
  ctx.fillText('“', width - paddingX - 48, paddingY + 62);

  // Quote body
  ctx.fillStyle = '#22221F';
  ctx.font = 'italic 30px Georgia, "Times New Roman", serif';
  let y = paddingY + headerHeight + 28;
  for (const line of lines) {
    ctx.fillText(line, paddingX, y);
    y += lineHeight;
  }

  // Divider line before author footer
  const footerTop = height - paddingY - 108;
  ctx.strokeStyle = '#DCD9D1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingX, footerTop);
  ctx.lineTo(width - paddingX, footerTop);
  ctx.stroke();

  // Avatar or initial circle
  const avatarX = paddingX + 32;
  const avatarY = footerTop + 56;
  const avatarR = 32;
  const avatarImg = await loadImage(testimonial.avatar?.url);

  if (avatarImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const aspect = avatarImg.width / avatarImg.height;
    let drawW = avatarR * 2;
    let drawH = avatarR * 2;
    if (aspect > 1) drawW = drawH * aspect;
    else drawH = drawW / aspect;
    ctx.drawImage(avatarImg, avatarX - drawW / 2, avatarY - drawH / 2, drawW, drawH);
    ctx.restore();

    ctx.strokeStyle = '#DCD9D1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#E9E5DC';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DCD9D1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#22221F';
    ctx.font = '600 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      (testimonial.name || 'T').charAt(0).toUpperCase(),
      avatarX,
      avatarY + 1
    );
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  // Author name & role/company
  const textX = paddingX + 82;
  ctx.fillStyle = '#22221F';
  ctx.font = '600 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(testimonial.name || 'Anonymous', textX, avatarY - 4);

  const meta = [testimonial.role, testimonial.company].filter(Boolean).join(', ');
  if (meta) {
    ctx.fillStyle = '#89877F';
    ctx.font = '400 17px system-ui, -apple-system, sans-serif';
    ctx.fillText(meta, textX, avatarY + 24);
  }

  // Subtle attribution on the right
  ctx.fillStyle = '#89877F';
  ctx.font = '500 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Preethika Poojary · Portfolio', width - paddingX, avatarY + 6);
  ctx.textAlign = 'left';

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `${sanitizeFilename(testimonial.slug || testimonial.name)}-testimonial.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

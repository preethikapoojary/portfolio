import { useState } from 'react';
import { FiStar, FiLinkedin, FiGithub, FiUpload } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

const emptyForm = {
  name: '',
  role: '',
  company: '',
  email: '',
  linkedinUrl: '',
  githubUrl: '',
  message: '',
  avatar: null,
};

export default function Testimonials() {
  const { data: testimonials, loading } = useFetch(api.getApprovedTestimonials, []);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const media = await api.uploadTestimonialAvatar(file);
      setForm((f) => ({ ...f, avatar: media }));
    } catch {
      // Non-fatal — the testimonial can still be submitted without a photo.
    } finally {
      setUploadingAvatar(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.submitTestimonial(form);
      setStatus('sent');
      setForm(emptyForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Testimonials" title="What people say" />

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse" />
          ))}
        </div>
      ) : !testimonials?.length ? (
        <EmptyState message="Approved testimonials will appear here." />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TiltCard key={t._id} delay={i * 0.06} className="glass-card p-6 transition-shadow hover:shadow-glow">
              {t.rating && (
                <div className="mb-2 flex gap-1 text-accent">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} fill="currentColor" />
                  ))}
                </div>
              )}
              <p className="text-sm text-slate-300">&ldquo;{t.message}&rdquo;</p>

              <div className="mt-4 flex items-center gap-3">
                {t.avatar?.url ? (
                  <img src={t.avatar.url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm text-slate-400">
                    {t.name?.[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {t.role} {t.company ? `· ${t.company}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 text-slate-400">
                  {t.linkedinUrl && (
                    <a href={t.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
                      <FiLinkedin />
                    </a>
                  )}
                  {t.githubUrl && (
                    <a href={t.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
                      <FiGithub />
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="glass-card mt-10 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2 flex items-center gap-4">
          {form.avatar?.url ? (
            <img src={form.avatar.url} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-500">
              <FiUpload />
            </div>
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            {uploadingAvatar ? 'Uploading…' : 'Upload your photo (optional)'}
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploadingAvatar} />
          </label>
        </div>

        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          required
          placeholder="Role / Designation"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          placeholder="Company / College (optional)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          placeholder="LinkedIn profile URL (optional)"
          value={form.linkedinUrl}
          onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          placeholder="GitHub profile URL (optional)"
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <textarea
          required
          placeholder="Share your experience working with me..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary sm:col-span-2"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="justify-self-start rounded-full px-6 py-2.5 text-sm font-medium text-surface transition duration-300 hover:scale-[1.04] hover:shadow-glow disabled:opacity-60 sm:col-span-2"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        >
          {status === 'sending' ? 'Submitting…' : 'Submit testimonial'}
        </button>
        {status === 'sent' && (
          <p className="text-sm text-emerald-400 sm:col-span-2">
            Thanks! Your testimonial is pending approval.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400 sm:col-span-2">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}

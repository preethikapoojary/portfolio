import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiLinkedin, FiGithub, FiUpload, FiCheckCircle } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { Turnstile } from '@marsidev/react-turnstile';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

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
  const featuredTestimonials = (testimonials || []).slice(0, 3);
  const [form, setForm] = useState(emptyForm);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const turnstileRef = useRef(null);

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
    setErrorMessage('');

    if (googleClientId && !googleCredential) {
      setErrorMessage('Please sign in with Google to submit your testimonial.');
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage('Please complete the security check.');
      return;
    }

    setStatus('sending');
    try {
      await api.submitTestimonial({
        ...form,
        ...(googleCredential ? { googleCredential, googleUser } : {}),
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      setStatus('sent');
      setForm(emptyForm);
      setGoogleCredential(null);
      setGoogleUser(null);
      setTurnstileToken('');
      turnstileRef.current?.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
      setTurnstileToken('');
      turnstileRef.current?.reset();
    }
  };

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Testimonials" title="What people say" />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse" />
          ))}
        </div>
      ) : !testimonials?.length ? (
        <EmptyState message="Approved testimonials will appear here." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTestimonials.map((t, i) => (
              <TiltCard key={t._id} delay={i * 0.06} className="glass-card p-6 transition-shadow hover:shadow-glow flex flex-col justify-between">
                <div>
                  {t.rating && (
                    <div className="mb-2 flex gap-1 text-accent">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <FiStar key={j} fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-slate-300">&ldquo;{t.message}&rdquo;</p>
                </div>

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

          <div className="mt-8 mb-12 text-center">
            <Link
              to="/testimonials"
              className="glass-card inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-slate-200 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
            >
              View More Testimonials →
            </Link>
          </div>
        </>
      )}

      <form onSubmit={submit} className="glass-card mt-10 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2 flex flex-col gap-3 rounded-lg bg-white/5 p-4 border border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Step 1: Verification Required
          </p>
          {googleClientId ? (
            googleUser ? (
              <div className="flex items-center justify-between gap-3 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  {googleUser.picture ? (
                    <img src={googleUser.picture} alt={googleUser.name} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 font-semibold">
                      {googleUser.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-200 flex items-center gap-1.5">
                      {googleUser.name} <FiCheckCircle className="text-emerald-400" />
                    </p>
                    <p className="text-xs text-slate-400">{googleUser.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleCredential(null);
                    setGoogleUser(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Change Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs text-slate-400">Sign in with Google to verify your identity before posting:</p>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      setGoogleCredential(credentialResponse.credential);
                      const payload = parseJwtPayload(credentialResponse.credential);
                      if (payload) {
                        setGoogleUser({ name: payload.name, email: payload.email, picture: payload.picture });
                        setForm((f) => ({
                          ...f,
                          name: payload.name || f.name,
                          email: payload.email || f.email,
                        }));
                      }
                      setErrorMessage('');
                    }
                  }}
                  onError={() => {
                    setErrorMessage('Google Sign-In failed. Please try again.');
                  }}
                  theme="filled_dark"
                />
              </div>
            )
          ) : (
            <p className="text-xs text-slate-400">Google identity verification (optional in local dev).</p>
          )}
        </div>

        <div className="sm:col-span-2 flex items-center gap-4">
          {form.avatar?.url || googleUser?.picture ? (
            <img src={form.avatar?.url || googleUser?.picture} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-500">
              <FiUpload />
            </div>
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            {uploadingAvatar ? 'Uploading…' : 'Upload custom photo (optional)'}
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploadingAvatar} />
          </label>
        </div>

        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          readOnly={Boolean(googleUser?.name)}
          className={`rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            googleUser?.name ? 'opacity-80 cursor-not-allowed' : ''
          }`}
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
          placeholder="Email (verified via Google)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          readOnly={Boolean(googleUser?.email)}
          className={`rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            googleUser?.email ? 'opacity-80 cursor-not-allowed' : ''
          }`}
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

        {turnstileSiteKey && (
          <div className="sm:col-span-2 my-1 flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setErrorMessage('');
              }}
              onExpire={() => setTurnstileToken('')}
              onError={() => setTurnstileToken('')}
              options={{ theme: 'dark' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            status === 'sending' ||
            (Boolean(googleClientId) && !googleCredential) ||
            (Boolean(turnstileSiteKey) && !turnstileToken)
          }
          className="justify-self-start rounded-full px-6 py-2.5 text-sm font-medium text-surface transition duration-300 hover:scale-[1.04] hover:shadow-glow disabled:opacity-60 sm:col-span-2"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        >
          {status === 'sending' ? 'Submitting…' : 'Submit testimonial'}
        </button>

        {status === 'sent' && (
          <p className="text-sm text-emerald-400 sm:col-span-2">
            Thanks! Your testimonial has been submitted and is pending admin approval.
          </p>
        )}
        {(status === 'error' || errorMessage) && (
          <p className="text-sm text-red-400 sm:col-span-2">{errorMessage || 'Something went wrong. Please try again.'}</p>
        )}
      </form>
    </section>
  );
}

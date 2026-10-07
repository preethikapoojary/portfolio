import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { Turnstile } from '@marsidev/react-turnstile';
import SectionHeading from '../components/common/SectionHeading';
import SocialIcon from '../components/common/SocialIcon';
import { useSettings } from '../context/SettingsContext';
import { getSocialLinks } from '../utils/socialLinks';
import api from '../api/endpoints';

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function ContactPage() {
  const { profile } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const turnstileRef = useRef(null);

  const socialLinks = getSocialLinks(profile);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage('Please complete the security check.');
      return;
    }

    setStatus('sending');
    try {
      await api.submitContactMessage({
        ...form,
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
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
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link
        to="/"
        className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <SectionHeading
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Have a project in mind, a question, or just want to connect? Send a message below."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-10 md:grid-cols-2"
      >
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-3">
            <h3 className="font-display text-lg font-semibold text-slate-200">Contact Information</h3>
            <div className="space-y-2 text-sm text-slate-400">
              {profile?.phone && <p><span className="text-slate-300 font-medium">Phone:</span> {profile.phone}</p>}
              {profile?.location && <p><span className="text-slate-300 font-medium">Location:</span> {profile.location}</p>}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="glass-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Connect with me</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ platform, href, Icon }) => (
                  <a
                    key={platform + href}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="glass-card flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
                  >
                    <SocialIcon icon={Icon} className="text-base" /> {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="glass-card grid gap-4 p-6">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
          />
          <input
            placeholder="Subject / Purpose"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
          />
          <textarea
            required
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
          />

          {turnstileSiteKey && (
            <div className="my-1 flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setErrorMessage('');
                }}
                onExpire={() => setTurnstileToken('')}
                onError={() => setTurnstileToken('')}
                options={{
                  theme: 'dark',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || (Boolean(turnstileSiteKey) && !turnstileToken)}
            className="justify-self-start inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-surface transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <FiSend /> {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && <p className="text-sm text-emerald-400">Message sent — thank you!</p>}
          {(status === 'error' || errorMessage) && (
            <p className="text-sm text-red-400">{errorMessage || 'Something went wrong. Please try again.'}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

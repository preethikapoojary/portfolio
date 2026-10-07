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
  const [form, setForm] = useState({
    name: '',
    email: '',
    purpose: '',
    message: '',
    company: '',
    linkedinUrl: '',
    githubUrl: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const turnstileRef = useRef(null);

  const socialLinks = getSocialLinks(profile);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.purpose) {
      setErrorMessage('Please select a purpose for your message.');
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage('Please complete the security check.');
      return;
    }

    setStatus('sending');

    let fullMessage = form.message;
    const optionalDetails = [];
    if (form.company?.trim()) optionalDetails.push(`Company / Organization: ${form.company.trim()}`);
    if (form.linkedinUrl?.trim()) optionalDetails.push(`LinkedIn Profile: ${form.linkedinUrl.trim()}`);
    if (form.githubUrl?.trim()) optionalDetails.push(`GitHub Profile: ${form.githubUrl.trim()}`);

    if (optionalDetails.length > 0) {
      fullMessage += `\n\n---\nAdditional Details:\n` + optionalDetails.join('\n');
    }

    try {
      await api.submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.purpose,
        message: fullMessage,
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      setStatus('sent');
      setForm({
        name: '',
        email: '',
        purpose: '',
        message: '',
        company: '',
        linkedinUrl: '',
        githubUrl: '',
      });
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
        className="grid gap-10 md:grid-cols-2 items-start"
      >
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-4">
            <h3 className="font-display text-xl font-semibold text-slate-100">Let&apos;s Connect</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have a project in mind, a job opportunity, or just want to connect? Send me a message and I&apos;ll get back to you promptly.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available for new opportunities
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="glass-card p-6 md:p-8 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connect with me</h4>
              <div className="flex flex-wrap gap-2.5">
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

        <form onSubmit={submit} className="glass-card grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 md:p-8">
          <input
            required
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
          />
          <input
            required
            type="email"
            placeholder="Your Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
          />

          <select
            required
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="sm:col-span-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary cursor-pointer border-r-[16px] border-transparent"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Select Purpose *
            </option>
            <option value="Internship Opportunity" className="bg-slate-900 text-slate-200">
              Internship Opportunity
            </option>
            <option value="Collaboration" className="bg-slate-900 text-slate-200">
              Collaboration
            </option>
            <option value="Project Discussion" className="bg-slate-900 text-slate-200">
              Project Discussion
            </option>
            <option value="Networking" className="bg-slate-900 text-slate-200">
              Networking
            </option>
            <option value="Feedback" className="bg-slate-900 text-slate-200">
              Feedback
            </option>
            <option value="Other" className="bg-slate-900 text-slate-200">
              Other
            </option>
          </select>

          <textarea
            required
            placeholder="Your Message *"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="sm:col-span-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
          />

          <input
            type="text"
            placeholder="Company / Organization (optional)"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="sm:col-span-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
          />

          <input
            type="url"
            placeholder="LinkedIn Profile URL (optional)"
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
          />
          <input
            type="url"
            placeholder="GitHub Profile URL (optional)"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-primary placeholder:text-slate-500"
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
                options={{
                  theme: 'dark',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || (Boolean(turnstileSiteKey) && !turnstileToken)}
            className="sm:col-span-2 justify-self-start inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-surface transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <FiSend /> {status === 'sending' ? 'Sending…' : 'Start a Conversation'}
          </button>
          {status === 'sent' && (
            <p className="sm:col-span-2 text-sm text-emerald-400">Message sent — thank you! I&apos;ll get back to you soon.</p>
          )}
          {(status === 'error' || errorMessage) && (
            <p className="sm:col-span-2 text-sm text-red-400">{errorMessage || 'Something went wrong. Please try again.'}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}


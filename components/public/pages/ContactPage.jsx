'use client';

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { FiCheck, FiSend } from 'react-icons/fi';
import api from '@/api/endpoints';
import { useSettings } from '@/context/SettingsContext';
import { getContactEmail, getNonEmailSocialLinks } from '@/utils/socialLinks';
import PageHeader from '@/components/public/common/PageHeader';

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactPage() {
  const { profile } = useSettings();
  const socialLinks = getNonEmailSocialLinks(profile);
  const contactEmail = getContactEmail(profile);
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
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.purpose) {
      setError('Please select a reason for contacting.');
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitContactMessage({ ...form, subject: form.purpose, turnstileToken });
      setSent(true);
      setForm({
        name: '',
        email: '',
        purpose: '',
        message: '',
        company: '',
        linkedinUrl: '',
        githubUrl: '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Contact"
        title="Let's Connect"
        description="Open to software engineering internships, collaborative projects, and technical conversations."
      />

      <div className="grid gap-14 py-14 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:col-span-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Direct Email
            </p>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-2 inline-block border-b border-[#DCD9D1] pb-1 text-base font-medium text-[#22221F] transition-colors hover:border-[#22221F]"
              >
                {contactEmail}
              </a>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="border-t border-[#DCD9D1] pt-6">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
                Profiles
              </p>
              <div className="flex flex-col items-start gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="editorial-link"
                  >
                    {link.platform === 'Linkedln' ? 'LinkedIn' : link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="border border-[#DCD9D1] bg-[#E9E5DC]/45 p-8">
              <div className="flex items-center gap-2.5 text-[#22221F]">
                <FiCheck size={18} />
                <h2 className="font-display text-2xl font-medium">Message Received</h2>
              </div>
              <p className="mt-2 text-sm text-[#89877F]">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="editorial-link mt-6"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 border border-[#DCD9D1] bg-[#E9E5DC]/25 p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g., John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="purpose" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                  Purpose *
                </label>
                <select
                  id="purpose"
                  required
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                >
                  <option value="">Select a reason for contacting</option>
                  <option value="Internship Opportunity">Internship Opportunity</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Project Discussion">Project Discussion</option>
                  <option value="Networking">Networking</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  placeholder="How can I help you? Please share details..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                />
              </div>

              <div>
                <label htmlFor="company" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                  Company / Organization
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g., Acme Corp (Optional)"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="linkedinUrl" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>

                <div>
                  <label htmlFor="githubUrl" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                    GitHub URL
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>
              </div>

              {turnstileSiteKey && (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken('')}
                  onError={() => setTurnstileToken('')}
                />
              )}

              {error && <p className="text-xs text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 border border-[#22221F] bg-[#22221F] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D] disabled:opacity-60"
              >
                <FiSend size={13} />
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

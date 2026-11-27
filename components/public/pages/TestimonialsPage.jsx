'use client';

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { FiCheck, FiExternalLink, FiSend, FiStar, FiUpload, FiX } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TestimonialsPage() {
  const { data: testimonials, loading, refetch } = useFetch(api.getApprovedTestimonials, []);
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    message: '',
    rating: 5,
    avatar: { url: null, publicId: null, alt: '' },
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError('');
    try {
      const uploaded = await api.uploadTestimonialAvatar(file);
      setForm((prev) => ({ ...prev, avatar: uploaded }));
    } catch {
      setError('Unable to upload photo. Please try a smaller image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.message.trim()) {
      setError('Name and message are required.');
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitTestimonial({ ...form, turnstileToken });
      setSubmitted(true);
      setForm({
        name: '',
        role: '',
        company: '',
        email: '',
        linkedinUrl: '',
        githubUrl: '',
        message: '',
        rating: 5,
        avatar: { url: null, publicId: null, alt: '' },
      });
      refetch();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const approved = testimonials || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
      <PageHeader
        eyebrow="Endorsements"
        title="Testimonials"
        description="Reflections and endorsements from collaborators, peers, and mentors."
      />

      <div className="grid gap-14 py-14 lg:grid-cols-12 lg:gap-16">
        {/* Approved Testimonials List */}
        <div className="lg:col-span-7">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Published Notes ({approved.length})
          </p>

          {loading ? (
            <p className="text-sm text-[#89877F]">Loading testimonials…</p>
          ) : approved.length === 0 ? (
            <div className="border border-[#DCD9D1] bg-[#E9E5DC]/25 p-8">
              <p className="font-display text-2xl text-[#22221F]">
                No testimonials published yet.
              </p>
              <p className="mt-2 text-sm text-[#89877F]">
                Be the first to share your experience working with Preethika using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {approved.map((item) => (
                <blockquote
                  key={item._id}
                  className="border border-[#DCD9D1] bg-[#E9E5DC]/25 p-7"
                >
                  <div className="mb-4 flex items-center gap-1 text-[#85806D]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <FiStar key={i} size={13} className="fill-current" />
                    ))}
                  </div>

                  <p className="text-base leading-relaxed text-[#22221F] sm:text-lg">
                    “{item.message}”
                  </p>

                  <footer className="mt-6 flex items-center justify-between gap-4 border-t border-[#DCD9D1] pt-4">
                    <div className="flex items-center gap-3">
                      {item.avatar?.url ? (
                        <img
                          src={item.avatar.url}
                          alt={item.name}
                          className="h-10 w-10 rounded-full border border-[#DCD9D1] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center border border-[#DCD9D1] bg-[#E9E5DC] font-display text-sm font-semibold text-[#22221F]">
                          {item.name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#22221F]">{item.name}</p>
                        {(item.role || item.company) && (
                          <p className="text-xs text-[#89877F]">
                            {[item.role, item.company].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#89877F]">
                      {item.linkedinUrl && (
                        <a
                          href={item.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#22221F]"
                        >
                          LinkedIn <FiExternalLink size={11} />
                        </a>
                      )}
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#22221F]"
                        >
                          GitHub <FiExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>

        {/* Submit Testimonial Form */}
        <div className="lg:col-span-5">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Write a Testimonial
          </p>

          {submitted ? (
            <div className="border border-[#DCD9D1] bg-[#E9E5DC]/40 p-8">
              <div className="flex items-center gap-2.5 text-[#22221F]">
                <FiCheck size={18} />
                <h2 className="font-display text-2xl font-medium">Thank You</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#89877F]">
                Your testimonial has been submitted and will appear once approved.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="editorial-link mt-6"
              >
                Submit another note
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 border border-[#DCD9D1] bg-[#E9E5DC]/25 p-6 sm:p-8"
            >
              <div>
                <label
                  htmlFor="t-name"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                >
                  Full Name *
                </label>
                <input
                  id="t-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="t-role"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                  >
                    Role / Title
                  </label>
                  <input
                    id="t-role"
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="t-company"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                  >
                    Organization
                  </label>
                  <input
                    id="t-company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. NMAMIT"
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="t-linkedin"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    id="t-linkedin"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="t-email"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                  >
                    Email (Private)
                  </label>
                  <input
                    id="t-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                  Rating
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      aria-label={`Rate ${star} stars`}
                      className={`p-1 transition-colors ${
                        star <= form.rating ? 'text-[#22221F]' : 'text-[#DCD9D1]'
                      }`}
                    >
                      <FiStar
                        size={18}
                        className={star <= form.rating ? 'fill-current' : ''}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Photo Upload */}
              <div>
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                  Photo (Optional)
                </span>
                {form.avatar?.url ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={form.avatar.url}
                      alt="Uploaded avatar"
                      className="h-11 w-11 rounded-full border border-[#DCD9D1] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, avatar: { url: null, publicId: null, alt: '' } })
                      }
                      className="inline-flex items-center gap-1 text-xs text-[#89877F] hover:text-[#22221F]"
                    >
                      <FiX size={13} /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex cursor-pointer items-center gap-2 border border-[#DCD9D1] bg-[#F6F4EF] px-4 py-2 text-xs font-medium text-[#22221F] transition-colors hover:border-[#22221F]">
                    <FiUpload size={13} />
                    <span>{uploadingAvatar ? 'Uploading…' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="t-message"
                    className="block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
                  >
                    Testimonial *
                  </label>
                  <span className="text-[11px] text-[#89877F]">
                    {form.message.length}/600
                  </span>
                </div>
                <textarea
                  id="t-message"
                  rows={4}
                  required
                  maxLength={600}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share your experience collaborating or working together…"
                  className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
                />
              </div>

              {turnstileSiteKey && (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              )}

              {error && <p className="text-xs text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 border border-[#22221F] bg-[#22221F] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D] disabled:opacity-60"
              >
                <FiSend size={13} />
                {submitting ? 'Submitting…' : 'Submit Testimonial'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  FiCheck,
  FiCheckCircle,
  FiGithub,
  FiInfo,
  FiLinkedin,
  FiShield,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';
import VerifiedProfileLinks from '@/components/public/common/VerifiedProfileLinks';
import ImageCropModal from '@/components/common/ImageCropModal';
import { downloadTestimonialImage } from '@/utils/downloadTestimonialImage';
import { getCroppedImageStyle } from '@/utils/croppedImage';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function TestimonialsPage() {
  const { data: testimonials, loading, refetch } = useFetch(api.getApprovedTestimonials, []);
  const [googleUser, setGoogleUser] = useState(null);
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
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = (credentialResponse) => {
    const payload = decodeJwtPayload(credentialResponse?.credential);
    if (!payload) return;
    setGoogleUser(payload);
    setForm((prev) => ({
      ...prev,
      name: prev.name || payload.name || '',
      email: prev.email || payload.email || '',
      avatar: prev.avatar?.url
        ? prev.avatar
        : { url: payload.picture || null, publicId: null, alt: payload.name || '' },
    }));
  };

  const uploadCroppedAvatar = async (file, crop) => {
    if (!file) return;
    setUploadingAvatar(true);
    setError('');
    try {
      const uploaded = await api.uploadTestimonialAvatar(file);
      setForm((prev) => ({
        ...prev,
        avatar: uploaded ? { ...uploaded, ...(crop ? { crop } : {}) } : prev.avatar,
      }));
    } catch {
      setError('Unable to upload photo. Please try an image under 10 MB.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPendingAvatarFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.role.trim() || !form.message.trim()) {
      setError('Full name, role, and testimonial message are required.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const linkedin = form.linkedinUrl.trim();
    if (!/^https:\/\/(www\.)?linkedin\.com\/in\/[^/\s]+/i.test(linkedin)) {
      setError('Please enter a valid LinkedIn profile URL starting with https://www.linkedin.com/in/');
      return;
    }
    const github = form.githubUrl.trim();
    if (github && !/^https:\/\/(www\.)?github\.com\/[^/\s]+/i.test(github)) {
      setError('GitHub URL must start with https://github.com/');
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
  const showGoogleGate = Boolean(googleClientId && !googleUser);

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Profile Picture Box */}
      <div className="flex flex-col gap-4 border border-[#DCD9D1] bg-[#F6F4EF] p-4 sm:flex-row sm:items-center">
        {form.avatar?.url ? (
          <img
            src={form.avatar.url}
            alt={form.name || 'Profile'}
            className="h-14 w-14 shrink-0 rounded-full border border-[#DCD9D1] object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#DCD9D1] bg-[#E9E5DC] font-display text-xl font-semibold text-[#22221F]">
            {form.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
        )}

        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#22221F]">
            Profile Picture
          </p>
          <p className="mt-0.5 text-[11px] text-[#89877F]">
            PNG, JPEG, HEIC, or WEBP under 10 MB. No PDFs or videos.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 border border-[#DCD9D1] bg-[#E9E5DC]/40 px-3.5 py-1.5 text-xs font-medium text-[#22221F] transition-colors hover:border-[#22221F]">
              <FiUpload size={12} />
              <span>{uploadingAvatar ? 'Uploading…' : 'Upload Custom Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
            {form.avatar?.url && (
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, avatar: { url: null, publicId: null, alt: '' } })
                }
                className="inline-flex items-center gap-1 text-xs text-[#89877F] hover:text-[#22221F]"
              >
                <FiX size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <ImageCropModal
        file={pendingAvatarFile}
        defaultAspect="circle"
        onCancel={() => setPendingAvatarFile(null)}
        onConfirm={({ file, crop }) => {
          setPendingAvatarFile(null);
          uploadCroppedAvatar(file, crop);
        }}
      />

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
          placeholder="Your full name"
          className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
        />
      </div>

      <div>
        <label
          htmlFor="t-role"
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
        >
          Role / Title *
        </label>
        <input
          id="t-role"
          type="text"
          required
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="e.g., Peer, ISE'28, NMAMIT or Software Engineer at XYZ"
          className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
        />
      </div>

      <div>
        <label
          htmlFor="t-email"
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
        >
          Email *
        </label>
        <input
          id="t-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="t-message"
            className="block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
          >
            Testimonial Message *
          </label>
          <span className="text-[11px] text-[#89877F]">
            {form.message.length} characters
          </span>
        </div>
        <textarea
          id="t-message"
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Share your experience…"
          className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="t-linkedin"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
          >
            LinkedIn URL *
          </label>
          <input
            id="t-linkedin"
            type="url"
            required
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            placeholder="https://www.linkedin.com/in/your-profile"
            className="w-full border border-[#DCD9D1] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#22221F] outline-none transition-colors focus:border-[#22221F]"
          />
        </div>

        <div>
          <label
            htmlFor="t-github"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]"
          >
            GitHub URL (Optional)
          </label>
          <input
            id="t-github"
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            placeholder="https://github.com/your-username"
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
        className="w-full border border-[#22221F] bg-[#22221F] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D] disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Testimonial'}
      </button>
    </form>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:px-8 sm:pt-20">
      {/* Centered Page Header */}
      <header className="mb-14 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#89877F]">
          What others say
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight text-[#22221F] sm:text-6xl">
          Testimonials
        </h1>
        <p className="mt-3 text-sm italic text-[#89877F] sm:text-base">
          All testimonials are manually reviewed before publication.
        </p>

        <div className="mt-7">
          <a
            href="#testimonial-form"
            className="inline-block border border-[#22221F] bg-transparent px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#22221F] transition-colors hover:bg-[#22221F] hover:text-[#F6F4EF]"
          >
            Leave a testimonial
          </a>
        </div>
      </header>

      {/* 3-Column Approved Testimonials Grid */}
      {loading ? (
        <p className="py-12 text-center text-sm text-[#89877F]">Loading testimonials…</p>
      ) : approved.length > 0 ? (
        <section className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((item) => {
            const itemPath = `/testimonials-${item.slug || item._id}`;
            return (
            <blockquote
              key={item._id}
              className="flex flex-col justify-between border border-[#DCD9D1] bg-[#E9E5DC]/25 p-6 transition-colors hover:border-[#85806D]"
            >
              <div className="flex-1">
                <p className="text-center text-sm italic leading-relaxed text-[#22221F] sm:text-[15px]">
                  “{item.message}”
                </p>
              </div>

              <footer className="mt-6 flex items-center gap-3.5 border-t border-[#DCD9D1] pt-4">
                <Link href={itemPath} className="flex min-w-0 flex-1 items-center gap-3.5">
                  {item.avatar?.url ? (
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#DCD9D1]">
                      <img
                        src={item.avatar.url}
                        alt={item.name}
                        style={getCroppedImageStyle(item.avatar)}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DCD9D1] bg-[#E9E5DC] font-display text-base font-semibold text-[#22221F]">
                      {item.name?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#22221F]">{item.name}</p>
                    {item.role && (
                      <p className="truncate text-xs text-[#89877F]">{item.role}</p>
                    )}
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                  <VerifiedProfileLinks item={item} />
                  <ShareMenu
                    path={itemPath}
                    title={`Testimonial by ${item.name}`}
                    onDownload={() => downloadTestimonialImage(item)}
                  />
                </div>
              </footer>
            </blockquote>
            );
          })}
        </section>
      ) : (
        <div className="mb-20 border border-[#DCD9D1] bg-[#E9E5DC]/25 p-10 text-center">
          <p className="font-display text-2xl text-[#22221F]">
            No testimonials published yet.
          </p>
          <p className="mt-2 text-sm text-[#89877F]">
            Be the first to share a note below.
          </p>
        </div>
      )}

      {/* Leave a Testimonial Section */}
      <section
        id="testimonial-form"
        className="border border-[#DCD9D1] bg-[#E9E5DC]/25 p-6 sm:p-10 lg:p-12"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Heading & Moderation Policies */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-4xl">
              Leave a Testimonial
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#89877F]">
              Please review the moderation policies before submitting.
            </p>

            <div className="mt-8 space-y-3.5">
              <div className="flex items-start gap-3 border border-[#DCD9D1] bg-[#F6F4EF] p-4">
                <FiShield size={16} className="mt-0.5 shrink-0 text-[#85806D]" />
                <p className="text-xs leading-relaxed text-[#89877F]">
                  All testimonials are manually reviewed by admin before publication.
                </p>
              </div>

              <div className="flex items-start gap-3 border border-[#DCD9D1] bg-[#F6F4EF] p-4">
                <FiCheckCircle size={16} className="mt-0.5 shrink-0 text-[#85806D]" />
                <p className="text-xs leading-relaxed text-[#89877F]">
                  Verified profiles help maintain authenticity and reduce spam.
                </p>
              </div>

              <div className="flex items-start gap-3 border border-[#DCD9D1] bg-[#F6F4EF] p-4">
                <FiInfo size={16} className="mt-0.5 shrink-0 text-[#85806D]" />
                <p className="text-xs leading-relaxed text-[#89877F]">
                  Public testimonials display your name, role, avatar, and verified links.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Google Sign-In Gate (if configured) or Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="flex h-full flex-col items-start justify-center border border-[#DCD9D1] bg-[#F6F4EF] p-8">
                <div className="flex items-center gap-2.5 text-[#22221F]">
                  <FiCheck size={18} />
                  <h3 className="font-display text-2xl font-medium">
                    Testimonial Submitted
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#89877F]">
                  Thank you! Your note has been received and will appear once approved.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="editorial-link mt-6"
                >
                  Submit another testimonial
                </button>
              </div>
            ) : showGoogleGate ? (
              <GoogleOAuthProvider clientId={googleClientId}>
                <div className="flex h-full min-h-[20rem] flex-col items-center justify-center border border-dashed border-[#DCD9D1] bg-[#F6F4EF] p-8 text-center">
                  <h3 className="font-display text-2xl font-medium text-[#22221F]">
                    Join to Leave a Testimonial
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-[#89877F]">
                    Google sign-in helps maintain authentic and trusted testimonials.
                  </p>
                  <div className="mt-6">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in failed. Please try again.')}
                    />
                  </div>
                  {error && <p className="mt-4 text-xs text-red-700">{error}</p>}
                </div>
              </GoogleOAuthProvider>
            ) : (
              formContent
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

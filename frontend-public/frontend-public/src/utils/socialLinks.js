import {
  FiLinkedin,
  FiGithub,
  FiMail,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiCode,
  FiTerminal,
  FiGlobe,
  FiLink,
} from 'react-icons/fi';

/**
 * Single source of truth for rendering social links anywhere on the public
 * site (Hero, Contact, Footer, and any future section). Every consumer
 * calls getSocialLinks(profile) and renders whatever comes back.
 *
 * Data source: Profile.socialLinks — [{ platform, url, icon }].
 *
 * Icon selection is fully explicit, not inferred. `icon` holds either one
 * of the canonical codes below (chosen from a dropdown in Admin) or a
 * custom image URL (when "Custom" is chosen). There is deliberately no
 * fallback that guesses an icon from the platform name — a link with no
 * icon chosen renders a neutral placeholder icon rather than a guess, so
 * the same input always produces the same, correct result.
 */

// The ONLY icon codes this app understands, plus what each renders as.
// ICON_TYPE_OPTIONS (below) is the exact same list, shown as the Admin
// dropdown — so a chosen value can never fail to resolve to the right icon.
const ICON_MAP = {
  linkedin: FiLinkedin,
  github: FiGithub,
  email: FiMail,
  instagram: FiInstagram,
  twitter: FiTwitter,
  facebook: FiFacebook,
  youtube: FiYoutube,
  leetcode: FiCode,
  codechef: FiCode,
  hackerrank: FiTerminal,
  portfolio: FiGlobe,
};

// Exported so the Admin dropdown and this resolver can never drift apart.
// 'custom' is handled separately below (its "icon" value is an image URL,
// not one of these codes).
export const ICON_TYPE_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'codechef', label: 'CodeChef' },
  { value: 'hackerrank', label: 'HackerRank' },
  { value: 'portfolio', label: 'Portfolio Website' },
  { value: 'custom', label: 'Custom (image URL)' },
];

function isBareEmailAddress(url) {
  return !!url && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url);
}

/**
 * Ensures Email links always produce a working mailto:, whether the icon
 * was explicitly set to "email" or the URL itself is just a bare address
 * (e.g. an admin picked a different icon but still typed a plain email).
 * This is about link *behavior*, not icon selection, so it doesn't
 * reintroduce icon-guessing.
 */
function resolveHref(icon, url) {
  if (!url) return null;
  if (icon === 'email' || isBareEmailAddress(url)) {
    return url.startsWith('mailto:') ? url : `mailto:${url}`;
  }
  return url;
}

/**
 * The icon a link renders is determined ENTIRELY by its stored `icon`
 * value — a known code, or a custom image URL. No platform-name matching
 * happens here. An empty/unrecognized value renders a neutral placeholder
 * rather than trying to guess, per the "icon selection is authoritative"
 * requirement.
 */
function resolveIcon(iconValue) {
  if (iconValue && ICON_MAP[iconValue]) return ICON_MAP[iconValue];
  if (iconValue && /^https?:\/\//i.test(iconValue)) return iconValue; // Custom icon image URL
  return FiLink; // no icon chosen — neutral placeholder, not a guess
}

export function getSocialLinks(profile) {
  return (profile?.socialLinks || [])
    .filter((link) => link.url)
    .map((link) => ({
      platform: link.platform || 'Link',
      url: link.url,
      href: resolveHref(link.icon, link.url),
      Icon: resolveIcon(link.icon),
    }));
}

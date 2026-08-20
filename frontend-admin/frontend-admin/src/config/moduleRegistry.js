import {
  FiGrid,
  FiUser,
  FiBookOpen,
  FiCpu,
  FiFolder,
  FiBriefcase,
  FiAward,
  FiStar,
  FiImage,
  FiEdit3,
  FiFileText,
  FiMessageSquare,
  FiMail,
  FiSettings,
  FiLayers,
  FiActivity,
  FiCode,
} from 'react-icons/fi';

/**
 * Single source of truth for the sidebar. Adding a brand-new future module
 * (e.g. "Speaking Engagements") means adding one object here — the Sidebar
 * component itself never changes (see architecture §9, Module Registry
 * Pattern). `status: 'phase2'` items render with a "Coming soon" badge and
 * route to the shared ComingSoon page until their backend routes ship.
 */
export const moduleRegistry = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/', status: 'live' },
  { key: 'profile', label: 'Profile', icon: FiUser, path: '/profile', status: 'live' },
  { key: 'education', label: 'Education', icon: FiBookOpen, path: '/education', status: 'live' },
  { key: 'skills', label: 'Skills', icon: FiCpu, path: '/skills', status: 'live' },
  { key: 'projects', label: 'Projects', icon: FiFolder, path: '/projects', status: 'live' },
  { key: 'experience', label: 'Experience', icon: FiBriefcase, path: '/experience', status: 'live' },
  { key: 'certificates', label: 'Certificates', icon: FiAward, path: '/certificates', status: 'live' },
  { key: 'achievements', label: 'Achievements', icon: FiStar, path: '/achievements', status: 'live' },
  { key: 'gallery', label: 'Gallery', icon: FiImage, path: '/gallery', status: 'live' },
  { key: 'blog', label: 'Blog', icon: FiEdit3, path: '/blog', status: 'live' },
  { key: 'resume', label: 'Resume', icon: FiFileText, path: '/resume', status: 'live' },
  { key: 'coding-profiles', label: 'Coding Profiles', icon: FiCode, path: '/coding-profiles', status: 'live' },
  { key: 'testimonials', label: 'Testimonials', icon: FiMessageSquare, path: '/testimonials', status: 'live' },
  { key: 'messages', label: 'Messages', icon: FiMail, path: '/messages', status: 'live' },
  { key: 'sections', label: 'Sections', icon: FiLayers, path: '/sections', status: 'live' },
  { key: 'settings', label: 'Settings', icon: FiSettings, path: '/settings', status: 'live' },
  { key: 'activity-log', label: 'Activity Log', icon: FiActivity, path: '/activity-log', status: 'live' },
];

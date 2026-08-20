import * as FiIcons from 'react-icons/fi';

/**
 * Achievement.icon and CodingProfile.icon are free-text admin fields that
 * can hold either a react-icons/fi component name (e.g. "FiAward") or a
 * direct image URL. This renders whichever was actually provided instead
 * of a section always falling back to one hardcoded icon.
 */
export default function DynamicIcon({ icon, fallback: Fallback, className }) {
  if (!icon) return <Fallback className={className} />;

  if (/^https?:\/\//i.test(icon)) {
    return <img src={icon} alt="" className={`h-6 w-6 rounded object-contain ${className || ''}`} />;
  }

  const name = icon.startsWith('Fi') ? icon : `Fi${icon}`;
  const IconComponent = FiIcons[name];
  return IconComponent ? <IconComponent className={className} /> : <Fallback className={className} />;
}

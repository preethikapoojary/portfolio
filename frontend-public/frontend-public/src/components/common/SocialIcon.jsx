/**
 * getSocialLinks() can resolve `Icon` to either a react-icons component
 * (the common case) or a raw image URL string (when an admin's Icon Type
 * override is a custom image). This renders whichever it got.
 */
export default function SocialIcon({ icon, className }) {
  if (typeof icon === 'string') {
    return <img src={icon} alt="" className={`${className} rounded object-contain`} />;
  }
  const Icon = icon;
  return <Icon className={className} />;
}

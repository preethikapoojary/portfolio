import { useSettings } from '../context/SettingsContext';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Certificates from '../components/sections/Certificates';
import Achievements from '../components/sections/Achievements';
import Gallery from '../components/sections/Gallery';
import Blog from '../components/sections/Blog';
import Testimonials from '../components/sections/Testimonials';
import Resume from '../components/sections/Resume';
import CodingProfiles from '../components/sections/CodingProfiles';
import Contact from '../components/sections/Contact';

// Maps each Section.key to its component. Home always renders first (it's
// the hero) regardless of DB order, since it has no real "position" concept
// on a single-page layout — every other section renders in whatever order
// the admin has configured, skipping any marked isVisible: false.
//
// Note: 'github' is intentionally NOT mapped here. The GitHub integration
// (profile/pinned-repos/contributions) described in the architecture isn't
// implemented on the backend yet (no /api/v1/github route exists), so
// GithubSection would only ever render its "not configured yet" placeholder.
// Rather than show that to visitors, the section is omitted entirely until
// the integration is actually built — re-add it here once /github is live.
const SECTION_COMPONENTS = {
  about: About,
  education: Education,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  certificates: Certificates,
  achievements: Achievements,
  gallery: Gallery,
  blog: Blog,
  testimonials: Testimonials,
  resume: Resume,
  coding_profiles: CodingProfiles,
  contact: Contact,
};

export default function Home() {
  const { sections } = useSettings();

  const orderedVisible = sections.filter((s) => s.isVisible && SECTION_COMPONENTS[s.key]);

  return (
    <>
      <Hero />
      {orderedVisible.map((section) => {
        const Component = SECTION_COMPONENTS[section.key];
        return <Component key={section.key} />;
      })}
    </>
  );
}

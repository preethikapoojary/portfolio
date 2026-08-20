import { FiDownload } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import api from '../../api/endpoints';

export default function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-4xl px-6 py-24 text-center">
      <SectionHeading eyebrow="Resume" title="Take a copy with you" />
      <a
        href={api.downloadResumeUrl()}
        download
        className="glass-card inline-flex items-center gap-2 px-8 py-4 font-medium transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow"
      >
        <FiDownload /> Download Resume
      </a>
    </section>
  );
}

'use client';

import Hero from '@/components/public/sections/Hero';
import About from '@/components/public/sections/About';
import Projects from '@/components/public/sections/Projects';
import Experience from '@/components/public/sections/Experience';
import Achievements from '@/components/public/sections/Achievements';
import Certificates from '@/components/public/sections/Certificates';
import Blog from '@/components/public/sections/Blog';
import Contact from '@/components/public/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Certificates />
      <Blog />
      <Contact />
    </>
  );
}

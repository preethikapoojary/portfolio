import { Routes, Route } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import BackToTop from './components/common/BackToTop';
import StarfieldBackground from './components/common/StarfieldBackground';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export default function App() {
  const { ready } = useSettings();

  if (!ready) return <LoadingScreen />;

  return (
    <>
      <StarfieldBackground />
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

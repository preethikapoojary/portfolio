import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SectionsPage from './pages/SectionsPage';
import ActivityLogPage from './pages/ActivityLogPage';
import EducationPage from './pages/EducationPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import CertificatesPage from './pages/CertificatesPage';
import AchievementsPage from './pages/AchievementsPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import ResumePage from './pages/ResumePage';
import CodingProfilesPage from './pages/CodingProfilesPage';
import MessagesPage from './pages/MessagesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ComingSoon from './pages/ComingSoon';
import { moduleRegistry } from './config/moduleRegistry';

const phase2Paths = moduleRegistry.filter((m) => m.status === 'phase2').map((m) => m.path);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="activity-log" element={<ActivityLogPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="coding-profiles" element={<CodingProfilesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        {phase2Paths.map((path) => (
          <Route key={path} path={path.slice(1)} element={<ComingSoon />} />
        ))}
      </Route>
    </Routes>
  );
}

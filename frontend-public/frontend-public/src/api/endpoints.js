import axiosClient from './axiosClient';

/**
 * Every function here returns response.data.data (unwrapping the ApiResponse
 * envelope from the backend). Phase 1 endpoints (profile, settings, sections)
 * are live today. Phase 2 endpoints (projects, skills, blog, ...) are wired
 * to the same URL conventions the backend architecture defines, so this file
 * doesn't need to change again once those routes ship — components already
 * calling them will simply start receiving real data instead of 404s.
 */
const unwrap = (promise) => promise.then((res) => res.data.data);

export const api = {
  // --- Phase 1, live ---
  getProfile: () => unwrap(axiosClient.get('/profile')),
  getSettings: () => unwrap(axiosClient.get('/settings')),
  getSections: () => unwrap(axiosClient.get('/sections')),

  // --- Phase 2, forward-compatible ---
  getEducation: () => unwrap(axiosClient.get('/education')),
  getSkills: () => unwrap(axiosClient.get('/skills')),
  getProjects: (params) => unwrap(axiosClient.get('/projects', { params })),
  getProjectBySlug: (slug) => unwrap(axiosClient.get(`/projects/${slug}`)),
  getExperience: () => unwrap(axiosClient.get('/experience')),
  getCertificates: () => unwrap(axiosClient.get('/certificates')),
  getAchievements: () => unwrap(axiosClient.get('/achievements')),
  getGallery: (params) => unwrap(axiosClient.get('/gallery', { params })),
  getBlogPosts: (params) => unwrap(axiosClient.get('/blog', { params })),
  getBlogPostBySlug: (slug) => unwrap(axiosClient.get(`/blog/${slug}`)),
  getApprovedTestimonials: () => unwrap(axiosClient.get('/testimonials')),
  getCodingProfiles: () => unwrap(axiosClient.get('/coding-profiles')),
  getGithub: () => unwrap(axiosClient.get('/github')),

  downloadResumeUrl: () => `${axiosClient.defaults.baseURL}/resume/download`,

  submitContactMessage: (payload) => unwrap(axiosClient.post('/contact', payload)),
  submitTestimonial: (payload) => unwrap(axiosClient.post('/testimonials', payload)),
  uploadTestimonialAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient
      .post('/testimonials/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data.data);
  },
};

export default api;

import axiosClient from './axiosClient';

const unwrap = (promise) => promise.then((res) => res.data);

export const authApi = {
  login: (email, password) => unwrap(axiosClient.post('/admin/auth/login', { email, password })),
  logout: () => unwrap(axiosClient.post('/admin/auth/logout')),
  me: () => unwrap(axiosClient.get('/admin/auth/me')),
};

export const profileApi = {
  get: () => unwrap(axiosClient.get('/admin/profile')),
  update: (payload) => unwrap(axiosClient.put('/admin/profile', payload)),
};

export const settingsApi = {
  get: () => unwrap(axiosClient.get('/admin/settings')),
  update: (payload) => unwrap(axiosClient.put('/admin/settings', payload)),
};

export const dashboardApi = {
  stats: () => unwrap(axiosClient.get('/admin/dashboard/stats')),
};

export const notificationsApi = {
  summary: () => unwrap(axiosClient.get('/admin/notifications/summary')),
  list: () => unwrap(axiosClient.get('/admin/notifications')),
  markRead: (id) => unwrap(axiosClient.patch(`/admin/notifications/${id}/read`)),
};

export const activityLogApi = {
  list: (params) => unwrap(axiosClient.get('/admin/activity-log', { params })),
};

/**
 * Generic client for any module built on the backend's buildCrudRouter
 * factory. Every Phase 2 module (Projects, Skills, Blog, ...) gets full
 * list/get/create/update/delete/reorder/visibility support from this one
 * function — mirroring the backend's factory pattern on the frontend, so
 * adding a new module's API layer is a single line, not a new file.
 *
 * Usage: const projectsApi = createCrudApi('/admin/projects');
 */
export function createCrudApi(basePath) {
  return {
    list: (params) => unwrap(axiosClient.get(basePath, { params })),
    get: (id) => unwrap(axiosClient.get(`${basePath}/${id}`)),
    create: (payload) => unwrap(axiosClient.post(basePath, payload)),
    update: (id, payload) => unwrap(axiosClient.put(`${basePath}/${id}`, payload)),
    remove: (id) => unwrap(axiosClient.delete(`${basePath}/${id}`)),
    reorder: (items) => unwrap(axiosClient.patch(`${basePath}/reorder`, { items })),
    toggleVisibility: (id) => unwrap(axiosClient.patch(`${basePath}/${id}/visibility`)),
  };
}

// Section is already live on the Phase 1 backend and follows the factory
// pattern exactly — a direct example of createCrudApi in use today.
export const sectionsApi = createCrudApi('/admin/sections');

// Phase 2 content modules — every one of these mirrors the same
// list/get/create/update/remove/reorder/toggleVisibility URL shape on the
// backend (whether it's built from the CRUD factory directly, like Education,
// or a custom controller with the same route shape, like Project/Blog).
export const educationApi = createCrudApi('/admin/education');
export const skillsApi = createCrudApi('/admin/skills');
export const projectsApi = createCrudApi('/admin/projects');
export const experienceApi = createCrudApi('/admin/experience');
export const certificatesApi = createCrudApi('/admin/certificates');
export const achievementsApi = createCrudApi('/admin/achievements');
export const galleryApi = createCrudApi('/admin/gallery');
export const blogApi = createCrudApi('/admin/blog');
export const codingProfilesApi = createCrudApi('/admin/coding-profiles');

// Resume doesn't fit the standard shape (upload/activate/delete instead of
// create/update), so it gets its own small client.
export const resumeApi = {
  list: () => unwrap(axiosClient.get('/admin/resume')),
  upload: (file, label) => {
    const formData = new FormData();
    formData.append('file', file);
    if (label) formData.append('label', label);
    return unwrap(axiosClient.post('/admin/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }));
  },
  activate: (id) => unwrap(axiosClient.patch(`/admin/resume/${id}/activate`)),
  remove: (id) => unwrap(axiosClient.delete(`/admin/resume/${id}`)),
};

export const messagesApi = {
  list: (params) => unwrap(axiosClient.get('/admin/messages', { params })),
  toggleRead: (id) => unwrap(axiosClient.patch(`/admin/messages/${id}/read`)),
  remove: (id) => unwrap(axiosClient.delete(`/admin/messages/${id}`)),
};

export const testimonialsApi = {
  list: (params) => unwrap(axiosClient.get('/admin/testimonials', { params })),
  update: (id, payload) => unwrap(axiosClient.put(`/admin/testimonials/${id}`, payload)),
  remove: (id) => unwrap(axiosClient.delete(`/admin/testimonials/${id}`)),
  approve: (id) => unwrap(axiosClient.patch(`/admin/testimonials/${id}/approve`)),
  reject: (id) => unwrap(axiosClient.patch(`/admin/testimonials/${id}/reject`)),
  toggleVisibility: (id) => unwrap(axiosClient.patch(`/admin/testimonials/${id}/visibility`)),
};

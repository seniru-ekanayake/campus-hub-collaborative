import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/api';

const getAnnouncements = () => apiClient.get(ENDPOINTS.ANNOUNCEMENTS);
const getEvents = () => apiClient.get(ENDPOINTS.EVENTS);
const getFacilities = () => apiClient.get(ENDPOINTS.FACILITIES);
const getTransport = () => apiClient.get(ENDPOINTS.TRANSPORT);
const getClubs = () => apiClient.get(ENDPOINTS.CLUBS);
const joinClub = (id) => apiClient.post(`${ENDPOINTS.CLUBS}/${id}/join`);
const leaveClub = (id) => apiClient.delete(`${ENDPOINTS.CLUBS}/${id}/leave`);
const postCheckIn = (locationId, locationType) =>
  apiClient.post(ENDPOINTS.CHECKIN, { locationId, locationType });
const getMyCheckIns = () => apiClient.get(ENDPOINTS.CHECKIN_MY);
const getRewards = () => apiClient.get(ENDPOINTS.REWARDS);
const getCounselors = () => apiClient.get(ENDPOINTS.COUNSELORS);
const getMySessions = () => apiClient.get(ENDPOINTS.SESSIONS_MY);
const bookSession = (payload) => apiClient.post(ENDPOINTS.SESSIONS, payload);
const cancelSession = (id) =>
  apiClient.patch(`${ENDPOINTS.SESSIONS}/${id}/cancel`);

const createAnnouncement = (data) => apiClient.post('/api/admin/announcements', data);
const createEvent = (data) => apiClient.post('/api/admin/events', data);
const createFacility = (data) => apiClient.post('/api/admin/facilities', data);
const createTransport = (data) => apiClient.post('/api/admin/transport', data);
const createClub = (data) => apiClient.post('/api/admin/clubs', data);

export {
  getAnnouncements,
  getEvents,
  getFacilities,
  getTransport,
  getClubs,
  joinClub,
  leaveClub,
  postCheckIn,
  getMyCheckIns,
  getRewards,
  getCounselors,
  getMySessions,
  bookSession,
  cancelSession,
  createAnnouncement,
  createEvent,
  createFacility,
  createTransport,
  createClub,
};

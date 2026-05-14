const BASE_URL = 'http://localhost:8080';

const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  FACILITIES: '/api/facilities',
  EVENTS: '/api/events',
  ANNOUNCEMENTS: '/api/announcements',
  TRANSPORT: '/api/transport',
  CLUBS: '/api/clubs',
  CHECKIN: '/api/checkin',
  CHECKIN_MY: '/api/checkin/my',
  REWARDS: '/api/rewards',
  COUNSELORS: '/api/counseling/counselors',
  SESSIONS: '/api/counseling/sessions',
  SESSIONS_MY: '/api/counseling/sessions/my',
};

export { BASE_URL, ENDPOINTS };

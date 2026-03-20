module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./setup.js'],
  collectCoverageFrom: ['../campus-hub-phase1/backend/src/main/resources/static/js/*.js'],
  coverageReporters: ['text', 'html'],
  testMatch: ['**/tests/**/*.test.js']
};

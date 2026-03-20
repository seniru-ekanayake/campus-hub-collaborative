/**
 * TC-FE-AUTH-001 through TC-FE-AUTH-012
 * Unit tests for the Auth utility object in app.js
 */

// Inline the Auth object (mirrors app.js exactly)
const Auth = {
  getToken: () => localStorage.getItem('ch_token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('ch_user')); }
    catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('ch_token'),
  isAdmin: () => { const u = Auth.getUser(); return u && u.role === 'ROLE_ADMIN'; },
  isStudent: () => { const u = Auth.getUser(); return u && u.role === 'ROLE_STUDENT'; },

  save(data) {
    localStorage.setItem('ch_token', data.token);
    localStorage.setItem('ch_user', JSON.stringify({
      id: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName
    }));
  },

  logout() {
    localStorage.removeItem('ch_token');
    localStorage.removeItem('ch_user');
    window.location.href = '/pages/login.html';
  },

  requireLogin() {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!Auth.isLoggedIn()) { window.location.href = '/pages/login.html'; return false; }
    if (!Auth.isAdmin()) { window.location.href = '/pages/dashboard.html'; return false; }
    return true;
  }
};

// ─── Setup ───────────────────────────────────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
  window.location.href = '';
});

const studentData = {
  token: 'eyJ.student.token',
  userId: 42,
  username: 'jsmith',
  email: 'jsmith@wlv.ac.uk',
  role: 'ROLE_STUDENT',
  firstName: 'John',
  lastName: 'Smith'
};

const adminData = {
  token: 'eyJ.admin.token',
  userId: 1,
  username: 'admin',
  email: 'admin@wlv.ac.uk',
  role: 'ROLE_ADMIN',
  firstName: 'System',
  lastName: 'Admin'
};

// ── TC-FE-AUTH-001 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-001 | isLoggedIn returns false when no token present', () => {
  expect(Auth.isLoggedIn()).toBe(false);
});

// ── TC-FE-AUTH-002 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-002 | isLoggedIn returns true after Auth.save()', () => {
  Auth.save(studentData);
  expect(Auth.isLoggedIn()).toBe(true);
});

// ── TC-FE-AUTH-003 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-003 | getToken returns correct token after save', () => {
  Auth.save(studentData);
  expect(Auth.getToken()).toBe('eyJ.student.token');
});

// ── TC-FE-AUTH-004 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-004 | getUser returns parsed user object with all fields', () => {
  Auth.save(studentData);
  const user = Auth.getUser();
  expect(user).not.toBeNull();
  expect(user.username).toBe('jsmith');
  expect(user.email).toBe('jsmith@wlv.ac.uk');
  expect(user.role).toBe('ROLE_STUDENT');
  expect(user.firstName).toBe('John');
  expect(user.lastName).toBe('Smith');
});

// ── TC-FE-AUTH-005 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-005 | isAdmin returns false for ROLE_STUDENT', () => {
  Auth.save(studentData);
  expect(Auth.isAdmin()).toBe(false);
});

// ── TC-FE-AUTH-006 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-006 | isAdmin returns true for ROLE_ADMIN', () => {
  Auth.save(adminData);
  expect(Auth.isAdmin()).toBe(true);
});

// ── TC-FE-AUTH-007 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-007 | isStudent returns true for ROLE_STUDENT', () => {
  Auth.save(studentData);
  expect(Auth.isStudent()).toBe(true);
});

// ── TC-FE-AUTH-008 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-008 | isStudent returns false for ROLE_ADMIN', () => {
  Auth.save(adminData);
  expect(Auth.isStudent()).toBe(false);
});

// ── TC-FE-AUTH-009 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-009 | logout clears token and user from localStorage', () => {
  Auth.save(studentData);
  Auth.logout();
  expect(localStorage.getItem('ch_token')).toBeNull();
  expect(localStorage.getItem('ch_user')).toBeNull();
});

// ── TC-FE-AUTH-010 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-010 | logout redirects to /pages/login.html', () => {
  Auth.save(studentData);
  Auth.logout();
  expect(window.location.href).toBe('/pages/login.html');
});

// ── TC-FE-AUTH-011 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-011 | requireLogin returns false and redirects when not logged in', () => {
  const result = Auth.requireLogin();
  expect(result).toBe(false);
  expect(window.location.href).toBe('/pages/login.html');
});

// ── TC-FE-AUTH-012 ────────────────────────────────────────────────────────────
test('TC-FE-AUTH-012 | requireAdmin returns false and redirects student to dashboard', () => {
  Auth.save(studentData);
  const result = Auth.requireAdmin();
  expect(result).toBe(false);
  expect(window.location.href).toBe('/pages/dashboard.html');
});

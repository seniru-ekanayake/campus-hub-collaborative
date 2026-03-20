/**
 * TC-FE-HTTP-001 through TC-FE-HTTP-007
 * Unit tests for the Http client utility in app.js
 * Mocks the global fetch API to test request construction and error handling.
 */

// Inline Auth and Http (mirrors app.js exactly)
const Auth = {
  getToken: () => localStorage.getItem('ch_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('ch_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('ch_token'),
  logout() {
    localStorage.removeItem('ch_token');
    localStorage.removeItem('ch_user');
    window.location.href = '/pages/login.html';
  },
  save(data) {
    localStorage.setItem('ch_token', data.token);
    localStorage.setItem('ch_user', JSON.stringify(data));
  }
};

const API_BASE = '/api';

const Http = {
  async request(method, endpoint, body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    const token = Auth.getToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE + endpoint, opts);

    if (res.status === 401) { Auth.logout(); return null; }
    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  },
  get:    (ep)        => Http.request('GET',    ep),
  post:   (ep, body)  => Http.request('POST',   ep, body),
  put:    (ep, body)  => Http.request('PUT',    ep, body),
  delete: (ep)        => Http.request('DELETE', ep),
};

beforeEach(() => {
  localStorage.clear();
  window.location.href = '';
  global.fetch = jest.fn();
});

afterEach(() => jest.resetAllMocks());

const mockResponse = (status, data) => ({
  status,
  ok: status >= 200 && status < 300,
  json: jest.fn().mockResolvedValue(data),
});

// ── TC-FE-HTTP-001 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-001 | GET request is made to correct URL with GET method', async () => {
  global.fetch.mockResolvedValue(mockResponse(200, []));
  await Http.get('/events');
  expect(fetch).toHaveBeenCalledWith('/api/events', expect.objectContaining({ method: 'GET' }));
});

// ── TC-FE-HTTP-002 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-002 | POST request includes JSON body and Content-Type header', async () => {
  global.fetch.mockResolvedValue(mockResponse(200, { id: 1 }));
  await Http.post('/auth/login', { username: 'u', password: 'p' });

  const [, opts] = fetch.mock.calls[0];
  expect(opts.method).toBe('POST');
  expect(opts.headers['Content-Type']).toBe('application/json');
  expect(JSON.parse(opts.body)).toEqual({ username: 'u', password: 'p' });
});

// ── TC-FE-HTTP-003 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-003 | Authorization header added when token present in localStorage', async () => {
  Auth.save({ token: 'my.jwt.token', username: 'u', role: 'ROLE_STUDENT' });
  global.fetch.mockResolvedValue(mockResponse(200, {}));
  await Http.get('/auth/profile');

  const [, opts] = fetch.mock.calls[0];
  expect(opts.headers['Authorization']).toBe('Bearer my.jwt.token');
});

// ── TC-FE-HTTP-004 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-004 | No Authorization header when no token stored', async () => {
  global.fetch.mockResolvedValue(mockResponse(200, []));
  await Http.get('/events');

  const [, opts] = fetch.mock.calls[0];
  expect(opts.headers['Authorization']).toBeUndefined();
});

// ── TC-FE-HTTP-005 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-005 | 401 response triggers Auth.logout and returns null', async () => {
  Auth.save({ token: 'expired.token', username: 'u', role: 'ROLE_STUDENT' });
  global.fetch.mockResolvedValue({ status: 401, ok: false, json: jest.fn() });

  const result = await Http.get('/auth/profile');
  expect(result).toBeNull();
  expect(localStorage.getItem('ch_token')).toBeNull();
  expect(window.location.href).toBe('/pages/login.html');
});

// ── TC-FE-HTTP-006 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-006 | Non-2xx response throws Error with server error message', async () => {
  global.fetch.mockResolvedValue(mockResponse(400, { error: 'Username already taken' }));
  await expect(Http.post('/auth/register', {})).rejects.toThrow('Username already taken');
});

// ── TC-FE-HTTP-007 ────────────────────────────────────────────────────────────
test('TC-FE-HTTP-007 | 204 No Content response returns null without calling json()', async () => {
  const jsonFn = jest.fn();
  global.fetch.mockResolvedValue({ status: 204, ok: true, json: jsonFn });

  const result = await Http.delete('/some/resource');
  expect(result).toBeNull();
  expect(jsonFn).not.toHaveBeenCalled();
});

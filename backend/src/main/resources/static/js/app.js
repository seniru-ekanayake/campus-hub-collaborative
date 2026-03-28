// app.js — shared utilities used by every page
// Amashi wrote Auth + Toast, Jude Tirosh added Http (needed for API calls with the JWT header)

const API_BASE = '/api';

// --- Auth ---
// Token and user info live in localStorage under ch_token / ch_user.
// The ch_ prefix avoids clashing with anything else that might use localStorage.
const Auth = {
  getToken: () => localStorage.getItem('ch_token'),
  getUser:  () => { try { return JSON.parse(localStorage.getItem('ch_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('ch_token'),
  isAdmin:    () => { const u = Auth.getUser(); return u && u.role === 'ROLE_ADMIN'; },
  isStudent:  () => { const u = Auth.getUser(); return u && u.role === 'ROLE_STUDENT'; },

  save(data) {
    localStorage.setItem('ch_token', data.token);
    localStorage.setItem('ch_user', JSON.stringify({
      id:        data.userId,
      username:  data.username,
      email:     data.email,
      role:      data.role,
      firstName: data.firstName,
      lastName:  data.lastName
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
    if (!Auth.isAdmin())    { window.location.href = '/pages/dashboard.html'; return false; }
    return true;
  }
};

// --- HTTP client ---
// Wraps fetch so we don't have to repeat the Authorization header on every call.
// Auto-redirects to login on 401 (expired/invalid token).
const Http = {
  async request(method, endpoint, body = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const token = Auth.getToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (body)  opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE + endpoint, opts);

    if (res.status === 401) {
      Auth.logout();
      return null;
    }

    if (res.status === 204) return null;  // no content

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    return data;
  },

  get:    (ep)       => Http.request('GET',    ep),
  post:   (ep, body) => Http.request('POST',   ep, body),
  put:    (ep, body) => Http.request('PUT',    ep, body),
  patch:  (ep, body) => Http.request('PATCH',  ep, body),
  delete: (ep)       => Http.request('DELETE', ep)
};

// --- Toast notifications ---
// Small slide-in toasts — Amashi built these to replace the ugly browser alert() calls
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${message}`;
    this.container.appendChild(t);
    setTimeout(() => t.style.opacity = '0', duration - 400);
    setTimeout(() => t.remove(), duration);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
  info:    (msg) => Toast.show(msg, 'info')
};

// --- Modal manager ---
// Used by clubs and events pages for create/edit forms
const Modal = {
  show(id) { document.getElementById(id)?.classList.remove('hidden'); },
  hide(id) { document.getElementById(id)?.classList.add('hidden'); },

  // Dynamically created modals — id is returned so the caller can close it later
  create({ title, body, footer = '', size = '' }) {
    const id = 'modal-' + Date.now();
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = id;
    el.innerHTML = `
      <div class="modal ${size}">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="document.getElementById('${id}').remove()">&times;</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>`;
    // click outside the modal to close it
    el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    document.body.appendChild(el);
    return id;
  }
};

// --- Misc helpers ---
const Utils = {
  formatDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatDateTime(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  // "2h ago", "3d ago" etc. — used on the announcements page
  timeAgo(dt) {
    const diff = Date.now() - new Date(dt);
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  },

  statusBadge(status) {
    const map = {
      'OPEN': 'success', 'CLOSED': 'danger', 'BUSY': 'warning',
      'CONFIRMED': 'success', 'PENDING': 'warning', 'CANCELLED': 'danger', 'COMPLETED': 'info'
    };
    return `<span class="badge badge-${map[status] || 'navy'}">${status}</span>`;
  },

  loading(container, msg = 'Loading...') {
    if (container) container.innerHTML = `
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span>${msg}</span>
      </div>`;
  },

  empty(container, msg = 'No items found.', icon = '📭') {
    if (container) container.innerHTML = `
      <div class="loading-overlay">
        <div style="font-size:3rem">${icon}</div>
        <span style="color:var(--text-light)">${msg}</span>
      </div>`;
  },

  // Escape before putting any user-provided strings into innerHTML
  escape(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
};

// Show the logged-in user's name in the nav and toggle admin/student-only elements
function renderNavUser() {
  const user = Auth.getUser();
  const el = document.getElementById('nav-user');
  if (el && user) {
    el.textContent = user.firstName || user.username;
  }
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = Auth.isAdmin() ? '' : 'none';
  });
  document.querySelectorAll('.student-only').forEach(el => {
    el.style.display = Auth.isStudent() ? '' : 'none';
  });
}

// Highlight the current page's link in the sidebar
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar a, .navbar-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('.html','').split('/').pop())) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  renderNavUser();
  setActiveNav();
  document.getElementById('btn-logout')?.addEventListener('click', () => Auth.logout());
});

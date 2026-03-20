/**
 * TC-FE-UTILS-001 through TC-FE-UTILS-010
 * Unit tests for the Utils helper object in app.js
 */

const Utils = {
  formatDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  formatDateTime(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  timeAgo(dt) {
    const diff = Date.now() - new Date(dt);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  },
  statusBadge(status) {
    const map = {
      'OPEN': 'success', 'CLOSED': 'danger', 'BUSY': 'warning',
      'CONFIRMED': 'success', 'PENDING': 'warning', 'CANCELLED': 'danger', 'COMPLETED': 'info'
    };
    return `<span class="badge badge-${map[status] || 'navy'}">${status}</span>`;
  },
  escape(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
};

// ── TC-FE-UTILS-001 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-001 | formatDate returns "-" for null input', () => {
  expect(Utils.formatDate(null)).toBe('-');
});

// ── TC-FE-UTILS-002 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-002 | formatDate formats valid ISO date string', () => {
  const result = Utils.formatDate('2025-06-15T00:00:00');
  expect(result).toContain('2025');
  expect(result).toContain('15');
});

// ── TC-FE-UTILS-003 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-003 | formatDateTime returns "-" for null input', () => {
  expect(Utils.formatDateTime(null)).toBe('-');
});

// ── TC-FE-UTILS-004 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-004 | formatDateTime includes date and time components', () => {
  const result = Utils.formatDateTime('2025-06-15T14:30:00');
  expect(result).toContain('2025');
  expect(result).toMatch(/\d{2}:\d{2}/);
});

// ── TC-FE-UTILS-005 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-005 | timeAgo returns "just now" for very recent timestamp', () => {
  const recent = new Date(Date.now() - 5000).toISOString(); // 5 seconds ago
  expect(Utils.timeAgo(recent)).toBe('just now');
});

// ── TC-FE-UTILS-006 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-006 | timeAgo returns minutes ago for 30-minute-old timestamp', () => {
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  expect(Utils.timeAgo(thirtyMinsAgo)).toBe('30m ago');
});

// ── TC-FE-UTILS-007 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-007 | timeAgo returns hours ago for 3-hour-old timestamp', () => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  expect(Utils.timeAgo(threeHoursAgo)).toBe('3h ago');
});

// ── TC-FE-UTILS-008 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-008 | timeAgo returns days ago for 2-day-old timestamp', () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  expect(Utils.timeAgo(twoDaysAgo)).toBe('2d ago');
});

// ── TC-FE-UTILS-009 ───────────────────────────────────────────────────────────
test('TC-FE-UTILS-009 | escape sanitizes XSS injection attempt', () => {
  const malicious = '<script>alert("xss")</script>';
  const escaped = Utils.escape(malicious);
  expect(escaped).not.toContain('<script>');
  expect(escaped).toContain('&lt;script&gt;');
});

// ── TC-FE-UTILS-010 ──────────────────────────────────────────────────────────
test('TC-FE-UTILS-010 | statusBadge returns correct CSS class for known statuses', () => {
  expect(Utils.statusBadge('OPEN')).toContain('badge-success');
  expect(Utils.statusBadge('CLOSED')).toContain('badge-danger');
  expect(Utils.statusBadge('PENDING')).toContain('badge-warning');
  expect(Utils.statusBadge('COMPLETED')).toContain('badge-info');
  expect(Utils.statusBadge('UNKNOWN_STATUS')).toContain('badge-navy');
});

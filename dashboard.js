const PASS = 'cecilia2025';
const BASE = location.origin;
let allLeads = [];

function checkAuth() {
  if (document.getElementById('auth-pw').value === PASS) {
    localStorage.setItem('kdp-cecilia-auth', '1');
    showDash();
  } else {
    document.getElementById('auth-err').classList.remove('hidden');
  }
}

function showDash() {
  document.getElementById('auth-gate').classList.add('hidden');
  document.getElementById('dash-main').classList.remove('hidden');
  refreshData();
}

(function init() {
  if (localStorage.getItem('kdp-cecilia-auth') === '1') showDash();
  else document.getElementById('auth-gate').classList.remove('hidden');
})();

async function refreshData() {
  let remote = null;
  if (window.SDC_SYNC) {
    try { remote = await SDC_SYNC.pull(); } catch (_) {}
  }
  allLeads = remote || JSON.parse(localStorage.getItem('kdp-cecilia-leads') || '[]');
  if (remote) localStorage.setItem('kdp-cecilia-leads', JSON.stringify(remote));
  renderTable();
  renderStats();
}

function renderStats() {
  document.getElementById('stat-total').textContent = allLeads.length;
  document.getElementById('stat-new').textContent = allLeads.filter(l => !l.status || l.status === 'New').length;
  document.getElementById('stat-contacted').textContent = allLeads.filter(l => l.status === 'Contacted').length;
  document.getElementById('stat-paid').textContent = allLeads.filter(l => l.status === 'Paid').length;
}

function renderTable() {
  const q  = (document.getElementById('search').value || '').toLowerCase();
  const fs = document.getElementById('filter-status').value;
  let leads = [...allLeads].sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0));
  if (q) leads = leads.filter(l =>
    [(l.businessName||''),(l.ownerName||''),(l.district||''),(l.mobile||'')]
      .some(v => v.toLowerCase().includes(q)));
  if (fs) leads = leads.filter(l => (l.status || 'New') === fs);

  const tbody = document.getElementById('leads-body');
  if (!leads.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Tiada rekod dijumpai.</td></tr>';
    return;
  }
  tbody.innerHTML = leads.map(l => {
    const sc  = l.leadScore || 0;
    const scC = sc >= 70 ? 'score-high' : sc >= 45 ? 'score-mid' : 'score-low';
    const st  = l.status || 'New';
    const stC = st === 'Paid' ? 'badge-paid' : st === 'Contacted' ? 'badge-contacted' : 'badge-new';
    const dt  = l.createdAt ? new Date(l.createdAt).toLocaleDateString('ms-MY') : '—';
    const pl  = BASE + '/pay.html?b=' + enc(l.businessName) + '&name=' + enc(l.ownerName) + '&id=' + enc(l.id);
    const wa  = 'https://wa.me/' + waNum(l.mobile) + '?text=' + encodeURIComponent(
      'Hi ' + (l.ownerName||'') + ', saya dari KDP Sarawak. Boleh saya berkongsi cadangan digital untuk ' + (l.businessName||'') + '?');
    return (
      '<tr class="lead-row" data-id="' + esc(l.id) + '">'
      + '<td><div class="lead-biz">' + esc(l.businessName||'—') + '</div>'
      + '<div class="lead-owner">' + esc(l.ownerName||'') + '</div>'
      + (l.email ? '<div class="lead-email">' + esc(l.email) + '</div>' : '') + '</td>'
      + '<td>' + esc(l.district||'—') + '</td>'
      + '<td><a href="tel:' + esc(l.mobile||'') + '" class="mobile-link">' + esc(l.mobile||'—') + '</a></td>'
      + '<td><span class="score-badge ' + scC + '">' + sc + '</span></td>'
      + '<td><span class="status-badge ' + stC + '">' + esc(st) + '</span></td>'
      + '<td class="date-cell">' + dt + '</td>'
      + '<td class="action-cell">'
      + '<button class="btn-action btn-copy" title="Salin link bayaran" onclick="copyLink(' + JSON.stringify(pl) + ')">💳</button>'
      + '<a class="btn-action btn-wa" href="' + wa + '" target="_blank" rel="noopener" title="WhatsApp">💬</a>'
      + (st !== 'Contacted' && st !== 'Paid'
          ? '<button class="btn-action btn-ok" title="Mark Contacted" onclick="markStatus(\'' + esc(l.id) + '\',\'Contacted\')">✓</button>'
          : '')
      + '<button class="btn-action btn-del" title="Padam" onclick="deleteLead(\'' + esc(l.id) + '\')">🗑</button>'
      + '</td></tr>'
      + '<tr class="detail-row hidden" id="detail-' + esc(l.id) + '">'
      + '<td colspan="7" class="detail-cell"><div class="detail-grid">'
      + '<div><strong>Jenis Perniagaan:</strong> ' + esc(l.bizType||'—') + '</div>'
      + '<div><strong>Kehadiran Web:</strong> ' + esc(l.webStatus||'—') + '</div>'
      + '<div><strong>Jualan Bulanan:</strong> ' + esc(l.revenue||'—') + '</div>'
      + '<div><strong>Jumpa Via:</strong> ' + esc(l.discover||'—') + '</div>'
      + '<div><strong>Cabaran:</strong> ' + esc(l.challenge||'—') + '</div>'
      + '<div><strong>Link Bayaran:</strong> <a href="' + pl + '" target="_blank" class="pay-link-a">' + pl + '</a></div>'
      + '</div></td></tr>'
    );
  }).join('');

  tbody.querySelectorAll('.lead-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('button,a')) return;
      const d = document.getElementById('detail-' + row.dataset.id);
      if (d) d.classList.toggle('hidden');
    });
  });
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function enc(s) { return encodeURIComponent(s||''); }
function waNum(m) { let d = String(m||'').replace(/\D/g,''); if (d.startsWith('0')) d = '60'+d.slice(1); return d; }

function copyLink(link) {
  navigator.clipboard.writeText(link)
    .then(() => toast('Link bayaran disalin! ✓'))
    .catch(() => prompt('Salin link ini:', link));
}

function toast(msg) {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function markStatus(id, status) {
  const lead = allLeads.find(l => l.id === id);
  if (!lead) return;
  lead.status = status;
  if (window.SDC_SYNC) SDC_SYNC.push(lead).catch(() => {});
  const local = JSON.parse(localStorage.getItem('kdp-cecilia-leads')||'[]');
  const i = local.findIndex(l => l.id === id);
  if (i >= 0) { local[i].status = status; localStorage.setItem('kdp-cecilia-leads', JSON.stringify(local)); }
  renderTable(); renderStats();
}

async function deleteLead(id) {
  if (!confirm('Padam rekod ini?')) return;
  allLeads = allLeads.filter(l => l.id !== id);
  if (window.SDC_SYNC) SDC_SYNC.remove(id).catch(() => {});
  localStorage.setItem('kdp-cecilia-leads',
    JSON.stringify(JSON.parse(localStorage.getItem('kdp-cecilia-leads')||'[]').filter(l => l.id !== id)));
  renderTable(); renderStats();
}

setInterval(refreshData, 30000);

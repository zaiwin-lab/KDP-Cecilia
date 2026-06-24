const _p   = new URLSearchParams(location.search);
const biz   = (_p.get('b')    || 'Perniagaan Anda').trim();
const owner = (_p.get('name') || '').trim();
const recId = (_p.get('id')   || '').trim();

const D = {
  BASE: 500,
  WA_NUMBER: '60XXXXXXXXXX',  // TODO: replace with Cecilia's WhatsApp number
  ADDONS: [
    { k: 'Domain .com.my',            price: 50,  desc: 'Nama domain .com.my selama 1 tahun' },
    { k: 'Google Business Profile',   price: 80,  desc: 'Setup profil Google — pelanggan jumpa anda lebih mudah' },
    { k: 'Widget WhatsApp',           price: 80,  desc: 'Butang WhatsApp terus di website anda' },
    { k: 'Reka Logo',                 price: 200, desc: 'Logo profesional (3 konsep + 1 semakan)' },
    { k: 'SEO Asas',                  price: 150, desc: 'Optimasi Google untuk kata kunci utama perniagaan anda' },
    { k: 'Setup Media Sosial',        price: 100, desc: 'Link dan setup FB/Instagram ke website' },
    { k: 'Katalog Produk Online',     price: 300, desc: 'Galeri produk dengan harga (sehingga 30 item)' },
  ]
};

const selected = new Set();

// Update heading
const titleEl = document.getElementById('pay-title');
const subEl   = document.getElementById('pay-sub');
if (titleEl) titleEl.textContent = 'Aktifkan Website — ' + biz;
if (subEl)   subEl.textContent   = owner
  ? 'Untuk ' + owner + '. Pilih pakej dan tambah nilai yang anda perlukan.'
  : 'Pilih pakej dan tambah nilai yang anda perlukan.';

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderAddons() {
  document.getElementById('addons-list').innerHTML = D.ADDONS.map((a, i) =>
    '<label class="addon-item' + (selected.has(i) ? ' selected' : '') + '" onclick="toggleAddon(' + i + ', this)">'
    + '<div class="addon-check">' + (selected.has(i) ? '✓' : '+') + '</div>'
    + '<div class="addon-info"><div class="addon-name">' + esc(a.k) + '</div>'
    + '<div class="addon-desc">' + esc(a.desc) + '</div></div>'
    + '<div class="addon-price">+RM ' + a.price + '</div></label>'
  ).join('');
}

function toggleAddon(i) {
  selected.has(i) ? selected.delete(i) : selected.add(i);
  render();
}

function render() {
  let total = D.BASE;
  selected.forEach(i => total += D.ADDONS[i].price);
  document.getElementById('total-amount').textContent = 'RM ' + total.toLocaleString();
  renderAddons();
  updateWaLink(total);
  return total;
}

function updateWaLink(total) {
  const parts = ['Website Asas RM500'];
  selected.forEach(i => parts.push(D.ADDONS[i].k + ' RM' + D.ADDONS[i].price));
  const msg = encodeURIComponent(
    'Salam Cecilia, saya berminat aktifkan website untuk ' + biz + '.\n\n'
    + 'Pakej: ' + parts.join(' + ') + '\nJumlah: RM' + total + '\n\nBoleh bantu?');
  const btn = document.getElementById('payBtn');
  if (btn) btn.href = 'https://wa.me/' + D.WA_NUMBER + '?text=' + msg;
}

function orderDescription() {
  const parts = ['Website Activation'];
  selected.forEach(i => parts.push(D.ADDONS[i].k));
  return parts.join(' + ');
}

// Auto-fill customer from API
let cust = { name: owner, email: '', phone: '' };
async function loadCustomer() {
  if (!recId) return;
  try {
    const res = await fetch('/.netlify/functions/submissions?id=' + encodeURIComponent(recId));
    if (!res.ok) return;
    const r = await res.json();
    if (r) cust = { name: r.ownerName || owner, email: r.email || '', phone: r.mobile || '' };
  } catch (_) {}
}
const customerReady = loadCustomer();

// Pay button
const payBtn = document.getElementById('payOnlineBtn');
if (payBtn) payBtn.addEventListener('click', async () => {
  const total = render();
  const orig  = payBtn.textContent;
  payBtn.disabled = true;
  payBtn.textContent = 'Menyambung ke sistem bayaran…';
  try {
    await customerReady;
    const res = await fetch('/.netlify/functions/create-bill', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        amount: total, business: biz, id: recId,
        owner: cust.name, email: cust.email, phone: cust.phone,
        description: orderDescription()
      })
    });
    const data = await res.json().catch(() => null);
    if (data && data.url) { location.href = data.url; return; }
  } catch (_) {}
  payBtn.disabled = false;
  payBtn.textContent = orig;
  location.href = document.getElementById('payBtn').href; // WA fallback
});

// Return from ToyyibPay
const sid  = _p.get('status_id');
const paid = _p.get('paid');
if (paid === '1' || sid) {
  const state = sid === '3' ? 'fail' : sid === '2' ? 'pending' : 'success';
  const M = {
    success: { icon: '🎉', title: 'Bayaran Berjaya!',
      body: 'Terima kasih! Kami akan mula membina website anda dalam masa 3–5 hari bekerja. Kami akan menghubungi anda melalui WhatsApp.' },
    pending: { icon: '⏳', title: 'Bayaran Dalam Proses',
      body: 'Bayaran anda sedang disahkan. Kami akan maklumkan sebaik sahaja ia selesai.' },
    fail:    { icon: '❌', title: 'Bayaran Tidak Berjaya',
      body: 'Sila cuba semula atau hubungi kami melalui WhatsApp untuk bantuan.' }
  };
  const m = M[state];
  document.getElementById('pay-main').innerHTML =
    '<div class="result-card ' + state + '">'
    + '<div class="result-icon">' + m.icon + '</div>'
    + '<h2 class="result-title">' + m.title + '</h2>'
    + '<p class="result-body">' + m.body + '</p>'
    + (state === 'fail' ? '<a class="btn-primary" style="text-decoration:none;margin-top:8px" href="pay.html?b='
        + encodeURIComponent(biz) + '&name=' + encodeURIComponent(owner) + '&id=' + encodeURIComponent(recId)
        + '">Cuba Semula →</a>' : '')
    + '</div>';
}

render();

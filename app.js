const answers = {};
let currentStep = 0;
const TOTAL = 7;

function goStep(n) {
  const prev = document.getElementById('step-' + currentStep);
  const next = document.getElementById('step-' + n);
  if (!next) return;
  prev.classList.remove('active');
  next.style.animation = 'none';
  next.offsetHeight;
  next.style.animation = '';
  next.classList.add('active');
  currentStep = n;
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(n) {
  const shell = document.getElementById('progress-shell');
  const bar   = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  if (typeof n === 'number' && n >= 1 && n <= TOTAL) {
    shell.classList.add('visible');
    bar.style.width = ((n - 1) / TOTAL * 100) + '%';
    label.textContent = n + ' / ' + TOTAL;
  } else {
    shell.classList.remove('visible');
  }
}

function selectOption(el, key, value) {
  el.closest('.option-grid').querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  answers[key] = value;
}

function nextStep(stepNum, fieldId) {
  clearErrors();
  if (!answers[fieldId]) {
    const hint = document.getElementById('step-' + stepNum).querySelector('.q-hint');
    if (hint) {
      hint.dataset.orig = hint.dataset.orig || hint.innerHTML;
      hint.innerHTML = '<span class="error-msg">Sila buat pilihan dahulu.</span>';
    }
    return;
  }
  goStep(stepNum + 1);
}

function showError(el, msg) {
  el.classList.add('input-error');
  const e = document.createElement('p');
  e.className = 'error-msg';
  e.textContent = msg;
  el.insertAdjacentElement('afterend', e);
}

function clearErrors() {
  document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
  document.querySelectorAll('.error-msg').forEach(e => e.remove());
  document.querySelectorAll('.q-hint[data-orig]').forEach(h => { h.innerHTML = h.dataset.orig; });
}

async function submitForm() {
  clearErrors();
  const biz    = document.getElementById('f-biz').value.trim();
  const name   = document.getElementById('f-name').value.trim();
  const mobile = document.getElementById('f-mobile').value.trim();
  const email  = document.getElementById('f-email').value.trim();

  let hasErr = false;
  if (!biz)    { showError(document.getElementById('f-biz'),    'Sila masukkan nama perniagaan.'); hasErr = true; }
  if (!name)   { showError(document.getElementById('f-name'),   'Sila masukkan nama anda.'); hasErr = true; }
  if (!mobile) { showError(document.getElementById('f-mobile'), 'Sila masukkan nombor telefon.'); hasErr = true; }
  if (hasErr) return;

  const score = calcScore();
  const id    = 'C' + Date.now();
  const record = {
    id, businessName: biz, ownerName: name, email, mobile,
    district: answers.q1 || '', bizType: answers.q2 || '',
    webStatus: answers.q3 || '', revenue: answers.q4 || '',
    discover: answers.q5 || '', challenge: answers.q6 || '',
    leadScore: score, status: 'New',
    createdAt: new Date().toISOString(), source: 'form'
  };

  const local = JSON.parse(localStorage.getItem('kdp-cecilia-leads') || '[]');
  local.unshift(record);
  localStorage.setItem('kdp-cecilia-leads', JSON.stringify(local));

  goStep('loading');

  // Animate loading steps
  const items = ['li-1', 'li-2', 'li-3'];
  let i = 0;
  const tick = () => {
    if (i > 0) { const p = document.getElementById(items[i-1]); p.classList.remove('active'); p.classList.add('done'); }
    if (i < items.length) { document.getElementById(items[i]).classList.add('active'); i++; setTimeout(tick, 700 + Math.random()*300); }
  };
  tick();

  await new Promise(r => setTimeout(r, 2400));
  if (window.SDC_SYNC) SDC_SYNC.push(record).catch(() => {});
  goStep('thanks');
}

function calcScore() {
  let s = 0;
  // Web presence
  const ws = answers.q3 || '';
  if (ws === 'Tiada langsung') s += 30;
  else if (ws === 'Facebook sahaja' || ws === 'Instagram sahaja') s += 25;
  else if (ws === 'Facebook & Instagram') s += 20;
  else s += 5;
  // Revenue
  const rev = answers.q4 || '';
  if (rev.includes('RM5,000')) s += 20;
  else if (rev.includes('RM15,000') || rev.includes('RM50,000')) s += 25;
  else if (rev.includes('Lebih')) s += 20;
  else if (rev.includes('RM1,000')) s += 15;
  else s += 5;
  // Challenge
  const ch = answers.q6 || '';
  if (ch.includes('Google') || ch.includes('online')) s += 20;
  else if (ch.includes('pelanggan baru') || ch.includes('percaya')) s += 15;
  else s += 10;
  // District bonus
  if (['Kuching','Miri','Sibu','Bintulu','Kota Samarahan'].includes(answers.q1)) s += 10;
  else s += 5;
  // Discovery
  if (answers.q5 === 'Datang terus ke kedai') s += 5;
  return Math.min(100, Math.max(1, s));
}

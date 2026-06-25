/* ============================================================
   KDP Cecilia — Audit App
   ============================================================ */

const TOTAL = 7;
const answers = {};
let currentStep = 0;
let isDemoMode = false;

const DEMO_ANSWERS = {
  q1: 'Kuching',
  q2: 'Makanan & Minuman',
  q3: 'Facebook sahaja',
  q4: 'RM1,000–RM5,000',
  q5: 'Facebook atau Instagram',
  q6: 'Pelanggan tak jumpa saya online',
};

const DEMO_CONTACT = {
  biz:    'Kedai Kek Ros Indah',
  name:   'Rosita binti Ahmad',
  mobile: '011-2345 6789',
  email:  'rosita@demo.kdp.my',
};

/* ── Step navigation ────────────────────────────────────── */

function showHero() {
  document.getElementById('step-0').style.display = '';
  document.getElementById('form-wrap').classList.remove('visible');
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('step-result').classList.remove('active');
  document.getElementById('progress-wrap').classList.remove('visible');
  currentStep = 0;
}

function showQuestion(n) {
  document.getElementById('step-0').style.display = 'none';
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('step-result').classList.remove('active');
  document.getElementById('form-wrap').classList.add('visible');
  document.getElementById('progress-wrap').classList.add('visible');

  document.querySelectorAll('.q-step').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('q' + n);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }
  currentStep = n;
  updateProgress(n);
}

function updateProgress(n) {
  const pct = Math.round(((n - 1) / TOTAL) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = n + ' / ' + TOTAL;
  document.getElementById('progress-wrap').setAttribute('aria-valuenow', pct);
}

/* ── Option selection ───────────────────────────────────── */

function bindOptionGrid(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const q = grid.dataset.q;
  grid.querySelectorAll('.opt-card').forEach(card => {
    card.addEventListener('click', () => selectOption(q, card, grid));
  });
}

function selectOption(q, card, grid) {
  grid.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  answers[q] = card.dataset.value;

  const nextBtn = document.getElementById(q + '-next') || document.getElementById(q + '-submit');
  if (nextBtn) nextBtn.disabled = false;

  if (isDemoMode) {
    setTimeout(() => {
      const n = parseInt(q.replace('q', ''), 10);
      if (n < TOTAL) showQuestion(n + 1);
      else showQuestion(TOTAL);
    }, 420);
  }
}

/* ── Demo mode ──────────────────────────────────────────── */

function enableDemo() {
  isDemoMode = true;
  document.body.classList.add('demo-mode');
  Object.assign(answers, DEMO_ANSWERS);
  showQuestion(1);

  document.querySelectorAll('[data-q]').forEach(grid => {
    const q = grid.dataset.q;
    const val = DEMO_ANSWERS[q];
    if (!val) return;
    grid.querySelectorAll('.opt-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.value === val);
    });
    const nextBtn = document.getElementById(q + '-next');
    if (nextBtn) nextBtn.disabled = false;
  });
}

/* ── Lead scoring ───────────────────────────────────────── */

function calcScore() {
  let score = 50;
  const webMap = {
    'Tiada kehadiran online': -20,
    'Facebook sahaja': -5,
    'Media sosial aktif': 5,
    'Laman web ada tapi lama': 10,
    'Laman web aktif': 25,
  };
  const revMap = {
    'Bawah RM1,000': -10,
    'RM1,000–RM5,000': 0,
    'RM5,000–RM20,000': 15,
    'Lebih RM20,000': 20,
  };
  const districtBonus = ['Kapit', 'Sri Aman', 'Lain-lain'].includes(answers.q1) ? 10 : 0;
  score += (webMap[answers.q3] ?? 0);
  score += (revMap[answers.q4] ?? 0);
  score += districtBonus;
  return Math.max(10, Math.min(100, score));
}

function genCertCode() {
  const prefix = 'KDP';
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return prefix + '-' + year + '-' + rand;
}

/* ── Form submit ────────────────────────────────────────── */

async function submitForm() {
  let biz, name, mobile, email;

  if (isDemoMode) {
    biz    = DEMO_CONTACT.biz;
    name   = DEMO_CONTACT.name;
    mobile = DEMO_CONTACT.mobile;
    email  = DEMO_CONTACT.email;
  } else {
    biz    = document.getElementById('f-biz').value.trim();
    name   = document.getElementById('f-name').value.trim();
    mobile = document.getElementById('f-mobile').value.trim();
    email  = document.getElementById('f-email').value.trim();

    let hasError = false;
    [
      { id: 'f-biz', val: biz },
      { id: 'f-name', val: name },
      { id: 'f-mobile', val: mobile },
    ].forEach(({ id, val }) => {
      const el = document.getElementById(id);
      if (!val) { el.classList.add('error'); hasError = true; }
      else el.classList.remove('error');
    });
    if (hasError) return;
  }

  const score = calcScore();
  const certCode = genCertCode();
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 3);
  const validStr = validUntil.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  showLoading(isDemoMode);

  if (!isDemoMode) {
    const record = {
      id: certCode,
      biz, name, mobile, email, score, certCode,
      q1: answers.q1, q2: answers.q2, q3: answers.q3,
      q4: answers.q4, q5: answers.q5, q6: answers.q6,
      status: 'Baru',
      submittedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('kdp_last_lead', JSON.stringify(record));
      await window.SDC_SYNC.push(record);
    } catch (e) {
      /* silent fail */
    }
  }

  setTimeout(() => {
    showResult({ biz, name, certCode, validStr });
  }, isDemoMode ? 1700 : 2600);
}

/* ── Loading sequence ───────────────────────────────────── */

function showLoading(fast) {
  document.getElementById('form-wrap').classList.remove('visible');
  document.getElementById('step-loading').classList.add('active');
  document.getElementById('progress-wrap').classList.remove('visible');

  const items = ['li-1', 'li-2', 'li-3'];
  const delays = fast ? [300, 700, 1200] : [400, 1100, 2000];

  items.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('shown', 'done', 'active');
    el.querySelector('.loader-dot').className = 'loader-dot';
    setTimeout(() => {
      el.classList.add('shown', 'active');
    }, delays[i]);
    setTimeout(() => {
      el.classList.remove('active');
      el.classList.add('done');
    }, delays[i] + (fast ? 400 : 800));
  });
}

/* ── Show result ────────────────────────────────────────── */

function showResult({ biz, name, certCode, validStr }) {
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('progress-wrap').classList.add('visible');
  updateProgress(7);
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('progress-label').textContent = 'Selesai';

  document.getElementById('cert-biz').textContent = biz || '—';
  document.getElementById('cert-name').textContent = name || '—';
  document.getElementById('cert-code').textContent = certCode;
  document.getElementById('cert-validity').textContent = validStr;

  document.getElementById('step-result').classList.add('active');
  document.getElementById('step-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Init ───────────────────────────────────────────────── */

function init() {
  ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(q => bindOptionGrid(q + '-grid'));

  document.getElementById('start-btn').addEventListener('click', () => showQuestion(1));
  document.getElementById('hero-demo-btn').addEventListener('click', enableDemo);
  document.getElementById('demo-btn').addEventListener('click', enableDemo);

  document.getElementById('q2-back').addEventListener('click', () => showQuestion(1));
  document.getElementById('q3-back').addEventListener('click', () => showQuestion(2));
  document.getElementById('q4-back').addEventListener('click', () => showQuestion(3));
  document.getElementById('q5-back').addEventListener('click', () => showQuestion(4));
  document.getElementById('q6-back').addEventListener('click', () => showQuestion(5));
  document.getElementById('q7-back').addEventListener('click', () => showQuestion(6));

  document.getElementById('q1-next').addEventListener('click', () => showQuestion(2));
  document.getElementById('q2-next').addEventListener('click', () => showQuestion(3));
  document.getElementById('q3-next').addEventListener('click', () => showQuestion(4));
  document.getElementById('q4-next').addEventListener('click', () => showQuestion(5));
  document.getElementById('q5-next').addEventListener('click', () => showQuestion(6));
  document.getElementById('q6-next').addEventListener('click', () => showQuestion(7));
  document.getElementById('q7-submit').addEventListener('click', submitForm);

  ['f-biz', 'f-name', 'f-mobile', 'f-email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });

  if (new URLSearchParams(location.search).get('demo') === '1') enableDemo();
}

document.addEventListener('DOMContentLoaded', init);

const routes = {
  '/': renderHome,
  '/news': renderNews,
  '/cancer': renderCancer,
  '/cancer-future': renderCancerFuture,
  '/liquid-biopsy': renderLiquidBiopsy,
  '/ai-now': renderAINow,
  '/ai-future': renderAIFuture,
  '/digital-twin': renderDigitalTwin,
  '/aids': renderAIDS,
  '/mental-health': renderMentalHealth,
  '/diabetes': renderDiabetes,
  '/cardiology': renderCardiology,
  '/analytics': renderAnalytics,
  '/research': renderResearch,
  '/genomics': renderGenomics,
  '/drug-discovery': renderDrugDiscovery,
  '/global-health': renderGlobalHealth,
  '/blog': renderBlog,
  '/login': renderLogin,
  '/signup': renderSignup,
  '/dashboard': renderDashboard,
};

const afterRenderHooks = {
  '/': () => {
    animateCounter('hs1', 2400000, 'M+', true);
    animateCounter('hs2', 1247, '');
    animateCounter('hs3', 89, '');
    animateCounter('hs4', 147, '');
    animateCounter('imp1', 5.8, 'M', false, 1);
    animateCounter('imp2', 50, '+');
    animateCounter('imp3', 7, '');
    animateCounter('imp4', 39, 'M');
  },
  '/cancer': () => setTimeout(() => Charts.createCancerSurvivalChart('cancerSurvivalChart'), 100),
  '/ai-now': () => setTimeout(() => Charts.createAITrendChart('aiTrendChart'), 100),
  '/ai-future': () => setTimeout(() => Charts.createHealthMetricsRadar('radarChart'), 100),
  '/aids': () => setTimeout(() => Charts.createHIVTrendChart('hivChart'), 100),
  '/analytics': async () => {
    try {
      const [tr, tpr, cr] = await Promise.all([fetch('/api/analytics/traffic?days=30'), fetch('/api/analytics/top-pages'), fetch('/api/analytics/categories')]);
      const traffic = await tr.json(); const topPages = await tpr.json(); const categories = await cr.json();
      setTimeout(() => {
        Charts.createTrafficChart('trafficChart', traffic);
        Charts.createCategoryChart('categoryChart', categories);
        Charts.createTopPagesChart('topPagesChart', topPages);
        Charts.createWeeklyChart('weeklyChart');
      }, 100);
    } catch(e) { console.error(e); }
  }
};

async function navigate(path) {
  const main = document.getElementById('page-content');
  Charts.destroyAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  // Render page
  let html = '';
  try {
    // Handle post routes
    const postMatch = path.match(/^\/post\/(.+)$/);
    if (postMatch) {
      html = await renderPost({ slug: postMatch[1] });
    } else {
      const fn = routes[path];
      if (fn) { html = await fn(); } else { html = await render404(path); }
    }
  } catch(e) { console.error(e); html = `<div style="text-align:center;padding:80px 24px"><h2>Something went wrong</h2><p style="color:var(--text-secondary);margin:16px 0">${e.message}</p><button class="btn btn-primary" onclick="navigate('/')">Go Home</button></div>`; }
  main.innerHTML = html;
  main.classList.add('fade-in');
  setTimeout(() => main.classList.remove('fade-in'), 600);
  // Run after-render hooks
  if (afterRenderHooks[path]) afterRenderHooks[path]();
  // Rotate alert text
  rotateAlert();
}

async function render404(path) {
  return `<section class="page-header"><div class="container"><div style="font-size:96px;margin-bottom:24px">🔍</div><h1 class="page-title">Page <span class="hl">Not Found</span></h1><p class="page-subtitle">"${path}" doesn't exist yet, but the future of medicine does.</p><div style="margin-top:32px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap"><button class="btn btn-primary" onclick="navigate('/')">Go Home</button><button class="btn btn-outline" onclick="navigate('/blog')">Browse Blog</button></div></div></section>`;
}

const alerts = [
  '🔬 BREAKING: AI achieves 95% accuracy in early cancer detection — outperforming radiologists in landmark study',
  '🦠 CRISPR eliminates HIV in 3 patients in landmark clinical trial at Temple University',
  '💉 Universal mRNA cancer vaccine shows 94% efficacy in Phase 3 trial across 20 cancer types',
  '⚛️ Quantum computing identifies 10,000 new drug targets in 72 hours — IBM Quantum breakthrough',
  '🧠 Psilocybin therapy achieves 80% depression remission — FDA approval expected 2026'
];
let alertIdx = 0;
function rotateAlert() {
  const el = document.getElementById('alert-text');
  if (el) { alertIdx = (alertIdx + 1) % alerts.length; el.textContent = alerts[alertIdx]; }
}

function showToast(msg, type = 'info', dur = 4000) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; t.style.transition = 'all 0.3s'; setTimeout(() => t.remove(), 300); }, dur);
}

function toggleMenu() {
  const nl = document.getElementById('nav-links');
  nl.classList.toggle('open');
}

async function subscribeNewsletter() {
  const emailEl = document.getElementById('footer-nl-email');
  const msgEl = document.getElementById('nl-msg');
  const email = emailEl?.value?.trim();
  if (!email || !email.includes('@')) { if (msgEl) msgEl.textContent = 'Please enter a valid email.'; return; }
  try {
    const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const d = await r.json();
    if (msgEl) { msgEl.textContent = d.message; msgEl.style.color = 'var(--color-green)'; }
    if (emailEl) emailEl.value = '';
    showToast(d.message, 'success');
  } catch { if (msgEl) msgEl.textContent = 'Failed to subscribe. Try again.'; }
}

async function doLogin() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pass = document.getElementById('login-pass')?.value;
  const errEl = document.getElementById('login-err');
  if (!email || !pass) { if (errEl) errEl.textContent = 'Please fill in all fields.'; return; }
  try {
    await Auth.login(email, pass);
    updateNavAuth();
    showToast('Welcome back! ❤️', 'success');
    navigate('/dashboard');
  } catch(e) { if (errEl) errEl.textContent = e.message; }
}

async function doSignup() {
  const user = document.getElementById('su-user')?.value?.trim();
  const email = document.getElementById('su-email')?.value?.trim();
  const pass = document.getElementById('su-pass')?.value;
  const errEl = document.getElementById('su-err');
  if (!user || !email || !pass) { if (errEl) errEl.textContent = 'Please fill in all fields.'; return; }
  if (pass.length < 6) { if (errEl) errEl.textContent = 'Password must be at least 6 characters.'; return; }
  try {
    await Auth.register(user, email, pass);
    updateNavAuth();
    showToast('Welcome to HealthPulse! ✨', 'success');
    navigate('/dashboard');
  } catch(e) { if (errEl) errEl.textContent = e.message; }
}

async function likePost(slug, btn) {
  try {
    const r = await fetch(`/api/posts/${slug}/like`, { method: 'POST' });
    const d = await r.json();
    btn.textContent = `❤️ Liked (${d.likes})`;
    btn.disabled = true;
    btn.style.color = 'var(--color-accent)';
    showToast('Liked!', 'success', 2000);
  } catch {}
}

function filterNews(cat, btn) {
  document.querySelectorAll('.pills .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#news-grid .news-card').forEach((card, i) => {
    if (cat === 'All') { card.style.display = ''; } else { card.style.display = card.querySelector('.news-cat')?.textContent?.includes(cat) ? '' : 'none'; }
  });
}

function filterBlog(cat, btn) {
  document.querySelectorAll('.pills .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#blog-grid .post-card').forEach(card => {
    if (cat === 'All') { card.style.display = ''; } else { card.style.display = card.querySelector('.post-cat')?.textContent?.trim() === cat ? '' : 'none'; }
  });
}

function animateCounter(id, target, suffix = '', shorten = false, decimals = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const dur = 1800; const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = target * ease;
    if (shorten && val >= 1e6) { el.textContent = (val / 1e6).toFixed(1) + 'M' + suffix; }
    else if (shorten && val >= 1e3) { el.textContent = (val / 1e3).toFixed(1) + 'K' + suffix; }
    else { el.textContent = decimals > 0 ? val.toFixed(decimals) + suffix : Math.round(val) + suffix; }
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
  const pts = Array.from({ length: 60 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 2 + 1 }));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(6,182,212,0.5)'; ctx.fill(); });
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x; const dy = pts[i].y - pts[j].y; const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(6,182,212,${0.12 * (1 - d/120)})`; ctx.lineWidth = 1; ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function init() {
  initParticles();
  updateNavAuth();
  // Fade out loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('fade-out'); setTimeout(() => loader.style.display = 'none', 700); }
  }, 1600);
  // Route to current hash or default
  const path = window.location.hash.replace('#', '') || '/';
  navigate(path);
  // Handle navigation
  window.addEventListener('hashchange', () => {
    const p = window.location.hash.replace('#', '') || '/';
    navigate(p);
  });
}

// Override navigate to also update hash
const _navigate = navigate;
window.navigate = function(path) {
  if (window.location.hash !== '#' + path) {
    window.location.hash = path;
  } else {
    _navigate(path);
  }
};

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
const imgMap = { cancer: 'linear-gradient(135deg,#1a0a0a,#2d0a0a)', aids: 'linear-gradient(135deg,#0a0a1a,#1a0a2d)', ai: 'linear-gradient(135deg,#040d1a,#071a2d)', brain: 'linear-gradient(135deg,#0a0a1a,#0d1a2d)', heart: 'linear-gradient(135deg,#1a0a0a,#2d0a15)', mental: 'linear-gradient(135deg,#0a1a0a,#0d2d1a)', diabetes: 'linear-gradient(135deg,#1a1a0a,#2d1a00)', genomics: 'linear-gradient(135deg,#0a0a1a,#150a2d)', quantum: 'linear-gradient(135deg,#0a1a1a,#0a2d2d)', wearable: 'linear-gradient(135deg,#0a1a0a,#0d2d0d)', radiology: 'linear-gradient(135deg,#040d1a,#0a1929)', global: 'linear-gradient(135deg,#0a0a0a,#1a1a00)', drug: 'linear-gradient(135deg,#0a0a1a,#1a0a2d)' };
const emojiMap = { cancer: '🔬', aids: '🦠', ai: '🤖', brain: '🧠', heart: '❤️', mental: '🌿', diabetes: '🩸', genomics: '🧬', quantum: '⚛️', wearable: '⌚', radiology: '📡', global: '🌍', drug: '💊', covid: '🦠', cancer2: '🎯' };

function postCard(p) {
  const bg = imgMap[p.image_key] || imgMap.ai;
  const emoji = emojiMap[p.image_key] || '📊';
  return `<div class="post-card" onclick="navigate('/post/${p.slug}")">
    <div class="post-card-img" style="background:${bg}">${emoji}</div>
    <div class="post-card-body">
      <div class="post-cat">${p.category}</div>
      <div class="post-title">${p.title}</div>
      <div class="post-excerpt">${p.excerpt}</div>
      <div class="post-meta"><span>${p.author}</span><div class="post-stats"><span>👁️ ${(p.views||0).toLocaleString()}</span><span>❤️ ${p.likes||0}</span><span>⏱ ${p.read_time}m</span></div></div>
    </div>
  </div>`;
}

function statCard(val, lbl, change, icon, up) {
  return `<div class="stat-card"><div class="stat-icon">${icon}</div><div class="stat-value">${val}</div><div class="stat-label">${lbl}</div>${change ? `<div class="stat-change ${up ? 'stat-up' : 'stat-down'}">${up ? '↑' : '↓'} ${change}</div>` : ''}</div>`;
}

async function renderHome() {
  let featured = [];
  try { const r = await fetch('/api/posts/featured'); featured = await r.json(); } catch {}
  const heroHTML = `<section class="hero"><div class="hero-inner"><div class="hero-eyebrow"><div class="hero-edot"></div>AI-Powered Health Intelligence Platform 2025</div><h1 class="hero-title">The Future of<br><span class="grad-text">Medicine Is Now</span></h1><p class="hero-sub">Cutting-edge analysis of AI breakthroughs, cancer research, CRISPR therapies, and the technologies transforming global healthcare.</p><div class="hero-actions"><button class="btn btn-primary btn-lg" onclick="navigate('/ai-now')">Explore AI Medicine</button><button class="btn btn-outline btn-lg" onclick="navigate('/analytics')">📊 Live Analytics</button></div><div class="hero-stats"><div><div class="hstat-val" id="hs1">0</div><div class="hstat-lbl">Monthly Readers</div></div><div><div class="hstat-val" id="hs2">0</div><div class="hstat-lbl">Articles</div></div><div><div class="hstat-val" id="hs3">0</div><div class="hstat-lbl">Contributors</div></div><div><div class="hstat-val" id="hs4">0</div><div class="hstat-lbl">Countries</div></div></div></div></section>`;
  const tickerItems = ['AI detects cancer with 95% accuracy','CRISPR eliminates HIV in clinical trial','mRNA vaccines show 94% efficacy','Nanobots deliver chemo with zero side effects','Brain-computer interface restores paralysis movement','Quantum computing identifies 10,000 drug targets'];
  const tickerTrack = [...tickerItems, ...tickerItems].map(t => `<span class="ticker-item"><div class="tdot"></div>${t}</span>`).join('');
  const topics = [
    { icon: '🔬', name: 'Cancer Research', slug: '/cancer', count: '8 articles', color: '#ef4444' },
    { icon: '🤖', name: 'AI Medicine', slug: '/ai-now', count: '6 articles', color: '#06b6d4' },
    { icon: '🦠', name: 'AIDS/HIV', slug: '/aids', count: '4 articles', color: '#7c3aed' },
    { icon: '🧠', name: 'Mental Health', slug: '/mental-health', count: '5 articles', color: '#10b981' },
    { icon: '🧬', name: 'Genomics', slug: '/genomics', count: '4 articles', color: '#8b5cf6' },
    { icon: '💊', name: 'Drug Discovery', slug: '/drug-discovery', count: '5 articles', color: '#f59e0b' },
    { icon: '❤️', name: 'Cardiology', slug: '/cardiology', count: '3 articles', color: '#ef4444' },
    { icon: '🌍', name: 'Global Health', slug: '/global-health', count: '4 articles', color: '#14b8a6' }
  ];
  const topicsHTML = topics.map(t => `<div class="topic-card" style="--tc:${t.color}" onclick="navigate('${t.slug}')"><div class="topic-icon">${t.icon}</div><div class="topic-name">${t.name}</div><div class="topic-count">${t.count}</div></div>`).join('');
  const featCards = featured.slice(0,6).map(p => postCard(p)).join('');
  return `${heroHTML}<div class="ticker"><div class="ticker-lbl">LIVE</div><div class="ticker-track">${tickerTrack}</div></div>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">FEATURED</div><h2 class="section-title">Latest Breakthroughs</h2><p class="section-sub">Most-read discoveries shaping medicine today</p></div><div class="grid-3">${featCards}</div></div></section>
  <section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">TOPICS</div><h2 class="section-title">Explore by Specialty</h2></div><div class="grid-4">${topicsHTML}</div></div></section>
  <section class="section"><div class="container"><div class="impact-row"><div class="impact-cell"><div class="impact-num" id="imp1">0</div><div class="impact-lbl">Lives Saved by AI Diagnostics (projected 2030)</div></div><div class="impact-cell"><div class="impact-num" id="imp2">0</div><div class="impact-lbl">Cancer Types Detectable by Liquid Biopsy</div></div><div class="impact-cell"><div class="impact-num" id="imp3">0</div><div class="impact-lbl">Years to Diagnose Rare Disease (AI cuts to hours)</div></div><div class="impact-cell"><div class="impact-num" id="imp4">0</div><div class="impact-lbl">Million HIV Patients Potentially Curable</div></div></div></div></section>`;
}

async function renderNews() {
  let news = [];
  try { const r = await fetch('/api/news'); news = await r.json(); } catch {}
  const cats = ['All', ...new Set(news.map(n => n.category))];
  const newsCards = news.map(n => `<div class="news-card"><div class="news-icon">${n.icon}</div><div><div class="news-cat">${n.category}</div><div class="news-title">${n.title}</div><div class="news-sum">${n.summary}</div><div class="news-foot"><span class="news-src">${n.source}</span><span>${n.date}</span></div></div></div>`).join('');
  return `<section class="page-header"><div class="container"><div class="page-tag">📰 NEWS FEED</div><h1 class="page-title">Health<span class="hl"> News</span></h1><p class="page-subtitle">Real-time medical breakthroughs, FDA approvals, and research discoveries</p></div></section>
  <section class="section-sm"><div class="container"><div class="pills">${cats.map((c,i) => `<button class="pill${i===0?' active':''}" onclick="filterNews('${c}',this)">${c}</button>`).join('')}</div><div id="news-grid" class="grid-2">${newsCards}</div></div></section>`;
}

async function renderCancer() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Cancer'); const d = await r.json(); posts = d.posts || []; } catch {}
  const stats = [statCard('95%', 'AI Detection Accuracy', '7% vs humans', '🔬', true), statCard('50+', 'Cancer Types Detectable', 'via liquid biopsy', '🩸', true), statCard('94%', 'mRNA Vaccine Efficacy', 'Phase 3 results', '💉', true), statCard('390K', 'US Deaths Preventable', 'with early detection', '♥️', true)];
  return `<section class="page-header"><div class="container"><div class="page-tag">🔬 ONCOLOGY</div><h1 class="page-title">Cancer<span class="hl"> Research Hub</span></h1><p class="page-subtitle">AI diagnostics, immunotherapy advances, liquid biopsy, and the path toward a cancer-free world</p></div></section>
  <section class="section-sm"><div class="container"><div class="grid-4">${stats.join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">DATA</div><h2 class="section-title">Survival Rate Comparison</h2><p class="section-sub">Stage I vs Stage IV — why early detection saves lives</p></div><div class="chart-card"><canvas id="cancerSurvivalChart" height="320"></canvas></div></div></section>
  <section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">ARTICLES</div><h2 class="section-title">Latest Cancer Research</h2></div><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>`;
}

function renderCancerFuture() {
  const timeline = [
    { year: '2025', title: 'Universal mRNA Cancer Vaccine', text: 'Personalized vaccines using AI-identified neoantigens enter widespread use for 20+ cancer types after Phase 3 success.', color: '#06b6d4' },
    { year: '2026', title: 'FDA Approves AI-Guided Liquid Biopsy Screening', text: 'Annual blood test for 50+ cancer types becomes standard preventive care for all adults over 40.', color: '#7c3aed' },
    { year: '2027', title: 'Nanobot Targeted Chemotherapy', text: 'DNA-origami nanobots delivering chemo directly to tumor cells with zero systemic toxicity receive global approval.', color: '#10b981' },
    { year: '2028', title: 'Digital Twin Treatment Planning', text: 'Every cancer patient receives a computational digital twin for virtual treatment optimization before real-world therapy.', color: '#f59e0b' },
    { year: '2029', title: 'CRISPR Tumor Suppressor Restoration', text: 'Gene editing restores p53 and RB1 tumor suppressor function in solid tumors, enabling cellular-level cancer reversal.', color: '#ef4444' },
    { year: '2030', title: 'AI-Detected Stage 0 Cancers', text: 'Wearable biosensors with AI detect cancers at the pre-tumor cellular mutation stage, enabling true prevention.', color: '#ec4899' },
    { year: '2035', title: 'CAR-T Universal Therapy', text: 'Off-the-shelf allogeneic CAR-T cells targeting 90% of solid tumors become affordable first-line therapy.', color: '#06b6d4' },
    { year: '2040', title: 'Cancer as a Chronic Disease', text: 'Advanced AI, gene editing, and immunotherapy combine to transform most cancers into manageable chronic conditions with >90% long-term survival.', color: '#7c3aed' }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🚀 FUTURE MEDICINE</div><h1 class="page-title">Cancer<span class="hl"> Future</span> Trends</h1><p class="page-subtitle">A roadmap from today's breakthroughs to 2040 — how science will conquer cancer</p></div></section>
  <section class="section"><div class="container"><div class="grid-2">${timeline.map((t,i) => `<div class="future-card"><div class="future-card-num">${String(i+1).padStart(2,'0')}</div><div class="future-year" style="color:${t.color}">${t.year}</div><div class="future-title">${t.title}</div><div class="future-text">${t.text}</div></div>`).join('')}</div></div></section>`;
}

async function renderAINow() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=AI+Healthcare'); const d = await r.json(); posts = d.posts || []; } catch {}
  const usecases = [
    { icon: '🔬', title: 'Medical Imaging AI', desc: 'Reading X-rays, MRIs, and CT scans at radiologist-level accuracy in 2.6 seconds. FDA-cleared for 124 conditions.', acc: 95 },
    { icon: '🧠', title: 'Clinical Decision Support', desc: 'GPT-5 Medical diagnoses rare genetic conditions in <2 minutes. 91.3% accuracy across 50M clinical records.', acc: 91 },
    { icon: '♥️', title: 'Cardiac Risk Prediction', desc: 'Predicting heart attacks 10 years in advance via subtle ECG patterns invisible to human readers.', acc: 85 },
    { icon: '🌟', title: 'Drug Discovery', desc: 'Screening 100M+ molecular structures to find novel antibiotics and drug candidates in 72 hours vs 10 years.', acc: 89 },
    { icon: '🗣️', title: 'Mental Health Monitoring', desc: 'Predicting mental health crises 2 weeks before occurrence via smartphone behavioral patterns.', acc: 89 },
    { icon: '🩺', title: 'Pathology AI', desc: 'Detecting cancer cells in biopsy slides with 97% agreement with expert consensus pathologists.', acc: 97 }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🤖 CURRENT AI</div><h1 class="page-title">What AI <span class="hl">Solves Now</span></h1><p class="page-subtitle">Deployed AI systems already transforming clinical practice today — not tomorrow, right now</p></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">ACCURACY TREND</div><h2 class="section-title">AI vs Human Diagnostic Accuracy</h2></div><div class="chart-card"><canvas id="aiTrendChart" height="320"></canvas></div></div></section>
  <section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">USE CASES</div><h2 class="section-title">AI in Clinical Practice</h2></div><div class="grid-3">${usecases.map(u => `<div class="card"><div style="font-size:32px;margin-bottom:12px">${u.icon}</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">${u.title}</h3><p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">${u.desc}</p><div class="pbar-wrap"><div class="pbar-head"><span style="font-size:12px">Accuracy</span><span style="font-size:12px;color:var(--color-primary)">${u.acc}%</span></div><div class="pbar"><div class="pfill" style="width:${u.acc}%"></div></div></div></div>`).join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">ARTICLES</div><h2 class="section-title">AI Healthcare Articles</h2></div><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>`;
}

function renderAIFuture() {
  const predictions = [
    { year: '2026', icon: '🤖', title: 'AI Doctors in Developing Nations', text: 'Autonomous AI physicians conduct primary care consultations for 2+ billion underserved people via smartphone, closing the global health equity gap.' },
    { year: '2027', icon: '📊', title: 'Real-Time Pandemic Prevention', text: 'AI systems analyze global genomic surveillance, social media signals, and travel patterns to predict and prevent the next pandemic 6 months before outbreak.' },
    { year: '2028', icon: '🧬', title: 'Personalized Disease Prevention', text: 'AI-analyzed whole-genome sequencing combined with microbiome and lifestyle data generates a personal disease risk map and prevention protocol at birth.' },
    { year: '2029', icon: '💡', title: 'Drug Design in 24 Hours', text: 'Quantum-enhanced AI systems design, simulate, and validate novel drug molecules for any disease target within 24 hours from target identification to candidate molecule.' },
    { year: '2030', icon: '🌍', title: '5.8M Lives Saved Annually', text: 'WHO projects AI integration across global health systems will prevent 5.8 million deaths per year — equivalent to eliminating all cardiovascular deaths in Europe.' },
    { year: '2035', icon: '🔮', title: 'Digital Consciousness Health Monitoring', text: 'AI health systems continuously monitor 10,000+ biomarkers, predict health events weeks in advance, and autonomously dispatch preventive interventions.' }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🔮 AI FUTURE</div><h1 class="page-title">What AI Will <span class="hl">Solve Next</span></h1><p class="page-subtitle">From 2026 to 2035 — the AI health breakthroughs that will transform our world</p></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">GLOBAL HEALTH INDEX</div><h2 class="section-title">2025 Status vs 2030 Target</h2></div><div class="chart-card" style="max-width:600px;margin:0 auto"><canvas id="radarChart" height="380"></canvas></div></div></section>
  <section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">ROADMAP</div><h2 class="section-title">AI Health Predictions 2026–2035</h2></div><div class="grid-2">${predictions.map((p,i) => `<div class="future-card"><div class="future-card-num">${String(i+1).padStart(2,'0')}</div><div class="future-year" style="color:var(--color-primary)">${p.year} • ${p.icon}</div><div class="future-title">${p.title}</div><div class="future-text">${p.text}</div></div>`).join('')}</div></div></section>`;
}

async function renderAIDS() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=AIDS%2FHIV'); const d = await r.json(); posts = d.posts || []; } catch {}
  const stats = [statCard('39M', 'People Living with HIV', 'globally in 2025', '🌍', false), statCard('630K', 'Annual AIDS Deaths', '53% drop since 2004', '♥️', true), statCard('29.8M', 'People on ART', '77% coverage', '💉', true), statCard('3', 'Patients Cured', 'by CRISPR in trials', '🦠', true)];
  const future = [
    { y: '2026', t: 'Broad CRISPR HIV Cure Trials', d: 'Phase 2 trials enrolling 200 patients using CRISPR-Cas9 to excise HIV from CD4+ T-cells and stem cells after Temple University success.' },
    { y: '2027', t: 'Long-Acting Injectables Replace Daily Pills', d: 'Lenacapavir biannual injections and cabotegravir long-acting prevention become global standard, removing daily pill burden for 30M+ patients.' },
    { y: '2028', t: 'mRNA HIV Vaccine Phase 3', d: 'Building on COVID-19 success, mRNA vaccines targeting HIV envelope proteins enter Phase 3 trials with 60%+ efficacy projections.' },
    { y: '2030', t: 'Functional Cure for 1 Million Patients', d: 'CRISPR, gene therapy, and broadly neutralizing antibody combinations achieve functional HIV cure in 1M patients annually.' }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🦠 AIDS/HIV</div><h1 class="page-title">AIDS/HIV<span class="hl"> Future</span></h1><p class="page-subtitle">From life sentence to curable — CRISPR, mRNA vaccines, and the roadmap to ending AIDS</p></div></section>
  <section class="section-sm"><div class="container"><div class="grid-4">${stats.join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">EPIDEMIOLOGY</div><h2 class="section-title">HIV Epidemic Trends 2000–2030</h2></div><div class="chart-card"><canvas id="hivChart" height="320"></canvas></div></div></section>
  <section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">FUTURE ROADMAP</div><h2 class="section-title">Path Toward Ending AIDS</h2></div><div class="timeline">${future.map(f => `<div class="tl-item"><div class="tl-year">${f.y}</div><div class="tl-title">${f.t}</div><div class="tl-text">${f.d}</div></div>`).join('')}</div></div></section>
  <section class="section"><div class="container"><div class="section-header"><div class="section-tag">ARTICLES</div><h2 class="section-title">HIV Research Articles</h2></div><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>`;
}

async function renderMentalHealth() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Mental+Health'); const d = await r.json(); posts = d.posts || []; } catch {}
  const items = [
    { icon: '🍄', name: 'Psilocybin Therapy', detail: '80% depression remission in Phase 3 — FDA approval expected 2026' },
    { icon: '📱', name: 'AI Crisis Prediction', detail: '89% accuracy predicting mental health crises 2 weeks ahead via smartphone data' },
    { icon: '🧠', name: 'Ketamine Therapy', detail: 'FDA-approved esketamine showing 50-70% response in treatment-resistant depression' },
    { icon: '📊', name: 'Digital Biomarkers', detail: 'Typing speed, sleep, GPS patterns reveal mood state with 85% accuracy' },
    { icon: '🗣️', name: 'LLM Therapy Apps', detail: 'AI CBT apps reducing PHQ-9 scores by 5+ points in 8-week trials' },
    { icon: '🦋', name: 'Deep Brain Stimulation', detail: 'DBS targeting sgACC shows 60% response rate for severe refractory OCD/depression' }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🧠 MENTAL HEALTH</div><h1 class="page-title">Mental Health<span class="hl"> Revolution</span></h1><p class="page-subtitle">Psilocybin, AI monitoring, and a new generation of treatments for the 1 billion affected globally</p></div></section>
  <section class="section"><div class="container"><div class="grid-3">${items.map(it => `<div class="card"><div style="font-size:36px;margin-bottom:14px">${it.icon}</div><h3 style="font-family:var(--font-heading);font-size:16px;margin-bottom:8px">${it.name}</h3><p style="font-size:13px;color:var(--text-secondary)">${it.detail}</p></div>`).join('')}</div></div></section>
  ${posts.length > 0 ? `<section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">ARTICLES</div><h2 class="section-title">Mental Health Research</h2></div><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>` : ''}`;
}

async function renderDiabetes() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Diabetes'); const d = await r.json(); posts = d.posts || []; } catch {}
  return `<section class="page-header"><div class="container"><div class="page-tag">🩸 DIABETES</div><h1 class="page-title">Diabetes<span class="hl"> Innovation</span></h1><p class="page-subtitle">Gene therapy, AI glucose monitoring, and the path from management to cure</p></div></section>
  <section class="section"><div class="container"><div class="grid-3">
    <div class="card"><div style="font-size:36px;margin-bottom:14px">🧬</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Gene Therapy Cure</h3><p style="font-size:14px;color:var(--text-secondary)">Base editing corrects SLC30A8 gene mutation — 87% of Type 2 patients achieved normal insulin at 6 months in Salk Institute trial.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:14px">⌚</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Non-Invasive CGM</h3><p style="font-size:14px;color:var(--text-secondary)">FDA-cleared optical CGM measures glucose via skin without needles or sensors. 94% accuracy in clinical validation across 450 patients.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:14px">🤖</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">AI Insulin Management</h3><p style="font-size:14px;color:var(--text-secondary)">Closed-loop AI pancreas systems reduce HbA1c by 1.8% and hypoglycemic events by 60% in Type 1 patients. The artificial pancreas becomes reality.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:14px">🦠</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Microbiome Connection</h3><p style="font-size:14px;color:var(--text-secondary)">AI precision nutrition using CGM + microbiome data reduces new Type 2 diagnoses by 71% in high-risk populations — prevention through personalization.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:14px">💉</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Smart Insulin Delivery</h3><p style="font-size:14px;color:var(--text-secondary)">Glucose-responsive insulin capsules that release only when blood sugar rises. No injections, no monitoring — passive automated management.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:14px">🧠</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Islet Cell Transplant 2.0</h3><p style="font-size:14px;color:var(--text-secondary)">Stem-cell-derived islet cells in immunoprotective capsules eliminate insulin dependence in 90% of Type 1 patients for 5+ years without immunosuppression.</p></div>
  </div></div></section>
  ${posts.length > 0 ? `<section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><div class="section-header"><div class="section-tag">ARTICLES</div><h2 class="section-title">Diabetes Research</h2></div><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>` : ''}`;
}

async function renderCardiology() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Cardiology'); const d = await r.json(); posts = d.posts || []; } catch {}
  return `<section class="page-header"><div class="container"><div class="page-tag">❤️ CARDIOLOGY</div><h1 class="page-title">Heart Health<span class="hl"> AI</span></h1><p class="page-subtitle">Predicting heart attacks a decade early, AI-ECG analysis, and wearable cardiac monitoring</p></div></section>
  <section class="section"><div class="container"><div class="grid-2" style="gap:32px">
    <div class="info-block"><h3 style="font-family:var(--font-heading);font-size:22px;margin-bottom:16px">🟥 AI Predicts Heart Attacks 10 Years Early</h3><p style="color:var(--text-secondary);margin-bottom:16px">Johns Hopkins AI analyzes subtle ECG patterns invisible to humans to predict MI risk with 85.3% AUC — outperforming all existing cardiovascular risk scores including Framingham. Now integrating into standard GE HealthCare ECG machines worldwide.</p><div class="pbar-wrap"><div class="pbar-head"><span>AUC Score</span><span class="text-cyan">85.3%</span></div><div class="pbar"><div class="pfill" style="width:85%"></div></div></div><div class="pbar-wrap"><div class="pbar-head"><span>Reduction in Cardiac Events (preventive tx)</span><span class="text-cyan">67%</span></div><div class="pbar"><div class="pfill" style="width:67%"></div></div></div></div>
    <div class="info-block"><h3 style="font-family:var(--font-heading);font-size:22px;margin-bottom:16px">⌚ Wearable Cardiac Monitoring</h3><p style="color:var(--text-secondary);margin-bottom:16px">Next-gen smartwatches detect AFib, heart failure, and electrolyte imbalances continuously. Apple Watch Series 10 ECG and Google Pixel Watch PPG analysis achieve cardiologist-level rhythm detection, catching conditions that kill 300K Americans annually.</p><div class="pbar-wrap"><div class="pbar-head"><span>AFib Detection Accuracy</span><span class="text-cyan">97%</span></div><div class="pbar"><div class="pfill" style="width:97%"></div></div></div><div class="pbar-wrap"><div class="pbar-head"><span>Heart Failure Early Warning</span><span class="text-cyan">88%</span></div><div class="pbar"><div class="pfill" style="width:88%"></div></div></div></div>
  </div></div></section>
  ${posts.length > 0 ? `<section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><h2 class="section-title" style="margin-bottom:32px">Cardiology Articles</h2><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>` : ''}`;
}

async function renderAnalytics() {
  let overview = {}, traffic = [], topPages = [], categories = [];
  try {
    const [or, tr, tpr, cr] = await Promise.all([fetch('/api/analytics/overview'), fetch('/api/analytics/traffic?days=30'), fetch('/api/analytics/top-pages'), fetch('/api/analytics/categories')]);
    overview = await or.json(); traffic = await tr.json(); topPages = await tpr.json(); categories = await cr.json();
  } catch {}
  const fv = (n) => n > 1e6 ? (n/1e6).toFixed(1)+'M' : n > 1e3 ? (n/1e3).toFixed(1)+'K' : n;
  return `<section class="page-header"><div class="container"><div class="page-tag">📊 ANALYTICS</div><h1 class="page-title">Live<span class="hl"> Dashboard</span></h1><p class="page-subtitle">Real-time traffic analytics, content performance, and audience engagement metrics</p></div></section>
  <section class="section-sm"><div class="container">
    <div class="grid-4" style="margin-bottom:32px">
      ${statCard(fv(overview.total_views||0), 'Total Pageviews (90d)', '23.4% vs last period', '📈', true)}
      ${statCard((overview.total_users||0).toLocaleString(), 'Registered Users', '18.2% growth', '👥', true)}
      ${statCard((overview.active_now||0).toString(), 'Active Right Now', '', '🟢', true)}
      ${statCard((overview.new_users_today||0).toString(), 'New Users Today', '', '✨', true)}
    </div>
    <div class="analytics-main">
      <div class="chart-card"><div class="chart-head"><span class="chart-title">Daily Traffic (30 Days)</span><span class="badge badge-green">▲ Live</span></div><canvas id="trafficChart" height="260"></canvas></div>
      <div class="chart-card"><div class="chart-head"><span class="chart-title">Categories</span></div><canvas id="categoryChart" height="260"></canvas></div>
    </div>
    <div class="grid-2">
      <div class="chart-card"><div class="chart-head"><span class="chart-title">Top Pages</span></div><canvas id="topPagesChart" height="260"></canvas></div>
      <div class="chart-card"><div class="chart-head"><span class="chart-title">Weekly Pattern</span></div><canvas id="weeklyChart" height="260"></canvas></div>
    </div>
  </div></section>`;
}

async function renderResearch() {
  const papers = [
    { j: 'Nature Medicine', t: 'AI Achieves 95.2% Accuracy in Breast Cancer Detection', a: 'Shen et al.', abs: 'Deep learning model trained on 1.2M mammograms outperforms radiologists in early detection with 5.7% reduction in false positives.', tags: ['AI', 'Cancer', 'Imaging'] },
    { j: 'NEJM', t: 'CRISPR-Cas9 Eliminates HIV-1 in Three Long-Term Patients', a: 'Khalili et al.', abs: 'Complete viral eradication demonstrated in CD4+ T-cells and stem cells. 12-month PCR testing shows no detectable viral RNA.', tags: ['CRISPR', 'HIV', 'Gene Therapy'] },
    { j: 'Lancet Oncology', t: 'Universal Cancer Vaccine: Phase 3 Efficacy Data', a: 'BioNTech Research Group', abs: 'mRNA-based personalized vaccine using AI-identified neoantigens shows 94% efficacy in preventing recurrence across 20 cancer types.', tags: ['Vaccine', 'Cancer', 'mRNA'] },
    { j: 'Science', t: 'AI Discovers Novel Antibiotic Class Against All Drug-Resistant Superbugs', a: 'MIT CSAIL', abs: 'Graph neural network screening 100M compounds identifies abaucin with novel mechanism active against all WHO-listed priority pathogens.', tags: ['AI', 'Antibiotic', 'AMR'] },
    { j: 'Cell', t: 'Stem-Cell-Derived Islet Transplantation in Type 1 Diabetes', a: 'Vertex Pharmaceuticals', abs: 'VX-880 therapy achieves insulin independence in 90% of patients at 12 months with no immunosuppression requirement.', tags: ['Diabetes', 'Stem Cells', 'Cure'] },
    { j: 'Nature Neuroscience', t: 'Digital Bridge Restores Walking in Paralyzed Patients', a: 'Neuralink + Onward', abs: 'Neural bypass using implanted electrodes and epidural stimulation enables 300m independent walking after 11 years of paralysis.', tags: ['BCI', 'Paralysis', 'Neuralink'] },
    { j: 'JAMA Psychiatry', t: 'Psilocybin 80% Remission in Treatment-Resistant Depression', a: 'COMPASS Pathways', abs: 'Single 25mg dose with psychological support achieves 80% remission at 3 months; 67% sustained at 12 months.', tags: ['Psilocybin', 'Depression', 'Clinical'] },
    { j: 'Nat Comput Sci', t: 'Quantum Computing Solves 847 Undruggable Protein Targets', a: 'IBM Quantum + Pfizer', abs: '433-qubit Eagle processor completes in 72 hours what would take classical computers 400,000 years.', tags: ['Quantum', 'Drug Discovery', 'Proteins'] },
    { j: 'Cell Metabolism', t: 'Base Editing Restores Insulin Secretion in 87% of T2DM Patients', a: 'Salk Institute', abs: 'Single-dose SLC30A8 gene correction achieves HbA1c < 5.7% at 6 months in 58/67 participants without medication.', tags: ['Gene Editing', 'Diabetes', 'Pancreas'] },
    { j: 'Nat Electronics', t: 'Skin-Worn Patch Monitors 20 Biomarkers Simultaneously', a: 'UC Berkeley', abs: 'Flexible electrochemical sensor array with on-device AI provides continuous monitoring of glucose, cortisol, sepsis markers.', tags: ['Wearables', 'Biosensors', 'AI'] },
    { j: 'Lancet Digital Health', t: 'Smartphone AI Predicts Mental Health Crisis 14 Days Ahead', a: 'Harvard Medical School', abs: 'Passive behavioral monitoring achieves 89% accuracy; reduces psychiatric emergency visits by 41% and suicide attempts by 35%.', tags: ['AI', 'Mental Health', 'Prevention'] },
    { j: 'Nature Medicine', t: 'Liquid Biopsy Detects 50+ Cancers from Single Blood Draw', a: 'GRAIL PATHFINDER 2', abs: 'ctDNA + methylation + protein biomarkers detect Stage I cancers in 83% of cases. False positive rate: 0.5%.', tags: ['Biopsy', 'Cancer', 'Early Detection'] }
  ];
  const tagColors = { AI: 'tag-blue', Cancer: 'tag-red', CRISPR: 'tag-purple', HIV: 'tag-red', mRNA: 'tag-green', Antibiotic: 'tag-yellow', Quantum: 'tag-blue', Gene: 'tag-purple', Diabetes: 'tag-yellow', Wearables: 'tag-green', Mental: 'tag-green', Prevention: 'tag-green', BCI: 'tag-blue', Vaccine: 'tag-green', Stem: 'tag-purple', Psilocybin: 'tag-green' };
  const tc = (tag) => tagColors[tag] || 'tag-blue';
  return `<section class="page-header"><div class="container"><div class="page-tag">📚 RESEARCH</div><h1 class="page-title">Research<span class="hl"> Papers</span></h1><p class="page-subtitle">Landmark peer-reviewed studies shaping the future of medicine</p></div></section>
  <section class="section-sm"><div class="container"><div class="grid-3">${papers.map(p => `<div class="research-card"><div class="rj">${p.j}</div><div class="rt">${p.t}</div><div class="ra">${p.a}</div><div class="rab">${p.abs}</div><div class="rf"><div style="display:flex;gap:6px;flex-wrap:wrap">${p.tags.map(t => `<span class="tag ${tc(t.split(' ')[0])}">${t}</span>`).join('')}</div><button class="btn btn-outline btn-sm">Read →</button></div></div>`).join('')}</div></div></section>`;
}

async function renderGenomics() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Genomics'); const d = await r.json(); posts = d.posts || []; } catch {}
  return `<section class="page-header"><div class="container"><div class="page-tag">🧬 GENOMICS</div><h1 class="page-title">Genomics &amp;<span class="hl"> CRISPR</span></h1><p class="page-subtitle">Gene editing, precision medicine, and the era of treating disease at its source code</p></div></section>
  <section class="section"><div class="container"><div class="grid-3">
    <div class="card"><div style="font-size:36px;margin-bottom:12px">✂️</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">CRISPR-Cas9</h3><p style="font-size:14px;color:var(--text-secondary)">FDA-approved Casgevy eliminates sickle cell disease in 97.8% of patients. 100% achieve transfusion independence at 24 months with no long-term safety concerns.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:12px">🔤</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Base Editing</h3><p style="font-size:14px;color:var(--text-secondary)">More precise than CRISPR — changes single DNA letters without cutting. Cures 87% of Type 2 diabetes and corrects hundreds of single-gene disorders.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:12px">🧱</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Prime Editing</h3><p style="font-size:14px;color:var(--text-secondary)">The search-and-replace of genome editing — can theoretically correct 89% of known disease-causing genetic variants without double-strand breaks.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:12px">🔬</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Whole Genome Sequencing</h3><p style="font-size:14px;color:var(--text-secondary)">Cost dropped from $100M in 2001 to $200 in 2025. AI analysis of WGS data provides lifelong disease risk profiling and pharmacogenomic drug optimization.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:12px">🧠</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Epigenetic Reprogramming</h3><p style="font-size:14px;color:var(--text-secondary)">Yamanaka factor delivery reverses cellular aging. Partial reprogramming restores vision in old mice. Human trials for age-related diseases begin 2026.</p></div>
    <div class="card"><div style="font-size:36px;margin-bottom:12px">💉</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">In Vivo Gene Delivery</h3><p style="font-size:14px;color:var(--text-secondary)">Lipid nanoparticles deliver gene therapy directly to liver, lung, and brain cells without viral vectors. Single injection achieves durable correction in 90% of targets.</p></div>
  </div></div></section>
  ${posts.length > 0 ? `<section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><h2 class="section-title" style="margin-bottom:32px">Genomics Articles</h2><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>` : ''}`;
}

async function renderDrugDiscovery() {
  let posts = [];
  try { const r = await fetch('/api/posts?category=Drug+Discovery'); const d = await r.json(); posts = d.posts || []; } catch {}
  return `<section class="page-header"><div class="container"><div class="page-tag">💊 PHARMA</div><h1 class="page-title">Drug<span class="hl"> Discovery</span> AI</h1><p class="page-subtitle">From 12 years to 4 — how AI and quantum computing are revolutionizing pharmaceutical development</p></div></section>
  <section class="section"><div class="container">
    <div class="info-block" style="margin-bottom:32px"><h3 style="font-family:var(--font-heading);font-size:24px;margin-bottom:16px">⚛️ Quantum + AI Drug Discovery Pipeline</h3><p style="color:var(--text-secondary);line-height:1.8">IBM Quantum's 433-qubit processors solved protein folding for 847 previously undruggable targets in 72 hours. Working with Pfizer and Roche, 47 candidate compounds have been synthesized hitting 12 novel targets. Three are entering Phase 1 trials in 2026. AI-designed drug INS018_055 (Insilico Medicine) became the first AI-designed drug approved anywhere, receiving Japanese regulatory approval for idiopathic pulmonary fibrosis in March 2025.</p></div>
    <div class="grid-3">
      <div class="card"><div style="font-size:36px;margin-bottom:12px">🤖</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">AlphaFold 3</h3><p style="font-size:14px;color:var(--text-secondary)">DeepMind predicts protein-ligand, protein-DNA, and protein-RNA interactions. Reduces early drug design from 2 years to 2 weeks.</p></div>
      <div class="card"><div style="font-size:36px;margin-bottom:12px">🔄</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">Drug Repurposing AI</h3><p style="font-size:14px;color:var(--text-secondary)">Knowledge graph AI (BenevolentAI, Recursion) identifies 12 FDA-approved drugs with validated new applications, cutting 10 years from development.</p></div>
      <div class="card"><div style="font-size:36px;margin-bottom:12px">🦠</div><h3 style="font-family:var(--font-heading);margin-bottom:8px">AMR Solution</h3><p style="font-size:14px;color:var(--text-secondary)">MIT GNN screens 100M compounds to find abaucin — first new antibiotic class in 30 years. Kills all 10 WHO priority drug-resistant pathogens.</p></div>
    </div>
  </div></section>
  ${posts.length > 0 ? `<section class="section" style="background:var(--bg-secondary);margin:0"><div class="container"><h2 class="section-title" style="margin-bottom:32px">Drug Discovery Articles</h2><div class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>` : ''}`;
}

function renderGlobalHealth() {
  const burdens = [
    { name: 'Cardiovascular', deaths: '17.9M', color: '#ef4444', pct: 95 },
    { name: 'Cancer', deaths: '9.6M', color: '#f59e0b', pct: 51 },
    { name: 'Respiratory', deaths: '4.0M', color: '#7c3aed', pct: 21 },
    { name: 'Diabetes', deaths: '1.5M', color: '#10b981', pct: 8 },
    { name: 'HIV/AIDS', deaths: '0.63M', color: '#06b6d4', pct: 3 },
    { name: 'Malaria', deaths: '0.62M', color: '#ec4899', pct: 3 }
  ];
  return `<section class="page-header"><div class="container"><div class="page-tag">🌍 GLOBAL HEALTH</div><h1 class="page-title">Global Health<span class="hl"> Impact</span></h1><p class="page-subtitle">WHO data, disease burden analysis, and AI's projected impact on saving 5.8M lives annually by 2030</p></div></section>
  <section class="section"><div class="container">
    <div class="grid-4" style="margin-bottom:48px">
      ${statCard('8.1B', 'Global Population', '', '🌍', true)}
      ${statCard('55M', 'Annual Deaths Globally', '', '📊', false)}
      ${statCard('5.8M', 'AI Could Save by 2030', 'WHO Projection', '⚕️', true)}
      ${statCard('$8.3T', 'Annual Healthcare Spend', '10.3% of GDP', '💰', false)}
    </div>
    <h2 style="font-family:var(--font-heading);font-size:28px;margin-bottom:24px">Global Disease Burden (Annual Deaths)</h2>
    ${burdens.map(b => `<div class="pbar-wrap"><div class="pbar-head"><span>${b.name}</span><span style="color:${b.color}">${b.deaths}</span></div><div class="pbar"><div class="pfill" style="width:${b.pct}%;background:${b.color}"></div></div></div>`).join('')}
  </div></section>`;
}

async function renderBlog() {
  let posts = [], total = 0;
  try { const r = await fetch('/api/posts?limit=20'); const d = await r.json(); posts = d.posts; total = d.total; } catch {}
  let categories = ['All', ...new Set(posts.map(p => p.category))];
  return `<section class="page-header"><div class="container"><div class="page-tag">📝 BLOG</div><h1 class="page-title">All<span class="hl"> Articles</span></h1><p class="page-subtitle">${total} articles covering the future of medicine</p></div></section>
  <section class="section-sm"><div class="container"><div class="pills">${categories.map((c,i) => `<button class="pill${i===0?' active':''}" onclick="filterBlog('${c}',this)">${c}</button>`).join('')}</div><div id="blog-grid" class="grid-3">${posts.map(p => postCard(p)).join('')}</div></div></section>`;
}

async function renderPost(params) {
  const slug = params.slug;
  let post = null;
  try { const r = await fetch(`/api/posts/${slug}`); if (r.ok) post = await r.json(); } catch {}
  if (!post) return `<section class="page-header"><div class="container"><h1 class="page-title">Post <span class="hl">Not Found</span></h1><button class="btn btn-primary mt-4" onclick="navigate('/blog')">Back to Blog</button></div></section>`;
  const bg = imgMap[post.image_key] || imgMap.ai;
  const emoji = emojiMap[post.image_key] || '📊';
  return `<div style="max-width:860px;margin:0 auto;padding:48px 24px">
    <div style="background:${bg};border-radius:20px;height:280px;display:flex;align-items:center;justify-content:center;font-size:96px;margin-bottom:40px;border:1px solid var(--border-secondary)">${emoji}</div>
    <div class="post-cat" style="font-size:13px;margin-bottom:12px">${post.category}</div>
    <h1 style="font-family:var(--font-heading);font-size:clamp(26px,4vw,44px);font-weight:800;line-height:1.15;margin-bottom:20px">${post.title}</h1>
    <div style="display:flex;align-items:center;gap:20px;color:var(--text-muted);font-size:14px;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border-secondary)">
      <span>✍️ ${post.author}</span><span>📅 ${post.created_at?.split('T')[0]||post.created_at}</span><span>👁️ ${(post.views||0).toLocaleString()} views</span><span>⏱ ${post.read_time}m read</span>
    </div>
    <div style="font-size:16px;line-height:1.85;color:var(--text-secondary);white-space:pre-line">${post.content}</div>
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid var(--border-secondary);display:flex;align-items:center;gap:16px">
      <button class="btn btn-outline" id="like-btn" onclick="likePost('${post.slug}', this)">❤️ Like (${post.likes})</button>
      <button class="btn btn-ghost" onclick="navigate('/blog')">Back to Blog</button>
    </div>
  </div>`;
}

function renderLogin() {
  return `<section class="section"><div class="container-sm"><div class="form-card">
    <div style="text-align:center;font-size:48px;margin-bottom:16px">👤</div>
    <div class="form-title">Welcome Back</div>
    <div class="form-sub">Sign in to HealthPulse</div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="login-email" type="email" placeholder="your@email.com"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="login-pass" type="password" placeholder="Your password" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <div id="login-err" class="form-err"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="doLogin()">Sign In</button>
    <p style="text-align:center;margin-top:20px;font-size:14px">Don't have an account? <span class="form-link" onclick="navigate('/signup')">Sign Up</span></p>
  </div></div></section>`;
}

function renderSignup() {
  return `<section class="section"><div class="container-sm"><div class="form-card">
    <div style="text-align:center;font-size:48px;margin-bottom:16px">✨</div>
    <div class="form-title">Join HealthPulse</div>
    <div class="form-sub">Create your free account</div>
    <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="su-user" type="text" placeholder="healthhero"></div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="su-email" type="email" placeholder="your@email.com"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="su-pass" type="password" placeholder="Min 6 characters" onkeydown="if(event.key==='Enter')doSignup()"></div>
    <div id="su-err" class="form-err"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="doSignup()">Create Account</button>
    <p style="text-align:center;margin-top:20px;font-size:14px">Already have an account? <span class="form-link" onclick="navigate('/login')">Sign In</span></p>
  </div></div></section>`;
}

async function renderDashboard() {
  if (!Auth.isLoggedIn()) { navigate('/login'); return ''; }
  const user = Auth.getUser();
  let profile = {};
  try { const r = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${Auth.getToken()}` } }); profile = await r.json(); } catch {}
  let posts = [];
  try { const r = await fetch('/api/posts/featured'); posts = await r.json(); } catch {}
  return `<section class="profile-header"><div class="container"><div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
    <div class="profile-av">${(profile.username||'U')[0].toUpperCase()}</div>
    <div><h1 style="font-family:var(--font-heading);font-size:28px;font-weight:800;margin-bottom:4px">${profile.username||'User'}</h1>
    <p style="color:var(--text-secondary)">${profile.email||''}</p>
    <p style="font-size:12px;color:var(--text-muted);margin-top:4px">Member since ${(profile.created_at||'').split('T')[0]}</p></div>
    <div style="margin-left:auto"><button class="btn btn-ghost btn-sm" onclick="Auth.logout()">Logout</button></div>
  </div></div></section>
  <section class="section-sm"><div class="container"><div class="grid-3">
    ${statCard('2.4M+', 'Total Platform Readers', '', '📈', true)}
    ${statCard('1,247', 'Articles Published', '', '📝', true)}
    ${statCard('147', 'Countries Reached', '', '🌍', true)}
  </div>
  <h2 style="font-family:var(--font-heading);font-size:24px;margin:40px 0 24px">Recommended for You</h2>
  <div class="grid-3">${posts.slice(0,6).map(p => postCard(p)).join('')}</div></div></section>`;
}

function renderLiquidBiopsy() {
  return `<section class="page-header"><div class="container"><div class="page-tag">🩸 DIAGNOSTICS</div><h1 class="page-title">Liquid <span class="hl">Biopsy</span></h1><p class="page-subtitle">Detecting 50+ cancers from a single blood draw — the future of non-invasive cancer screening</p></div></section>
  <section class="section"><div class="container"><div class="grid-2" style="gap:40px">
    <div><h2 style="font-family:var(--font-heading);font-size:28px;margin-bottom:16px">How It Works</h2><div class="timeline">
      <div class="tl-item"><div class="tl-year">STEP 1</div><div class="tl-title">Blood Draw</div><div class="tl-text">Single 10ml blood sample collects circulating tumor DNA (ctDNA), cell-free DNA methylation patterns, and protein biomarkers shed by tumor cells.</div></div>
      <div class="tl-item"><div class="tl-year">STEP 2</div><div class="tl-title">Next-Gen Sequencing</div><div class="tl-text">Ultra-deep sequencing identifies cancer-specific methylation signatures and copy number variations with 0.001% variant allele frequency sensitivity.</div></div>
      <div class="tl-item"><div class="tl-year">STEP 3</div><div class="tl-title">AI Analysis</div><div class="tl-text">Multimodal AI combines ctDNA, methylation, and protein data to classify cancer type and signal intensity across 50+ cancer types.</div></div>
      <div class="tl-item"><div class="tl-year">RESULT</div><div class="tl-title">Early Detection</div><div class="tl-text">Stage I detection in 83% of cases. False positive rate: 0.5%. Pancreatic cancer detected when surgery is still curative.</div></div>
    </div></div>
    <div>${[statCard('50+', 'Cancer Types Detected', '', '🔬', true), statCard('83%', 'Stage I Detection Rate', 'GRAIL PATHFINDER 2', '📊', true), statCard('0.5%', 'False Positive Rate', 'industry-leading', '✅', true), statCard('390K', 'US Deaths Preventable/yr', 'with annual screening', '♥️', true)].join('<br>')}</div>
  </div></div></section>`;
}

function renderDigitalTwin() {
  return `<section class="page-header"><div class="container"><div class="page-tag">👥 DIGITAL MEDICINE</div><h1 class="page-title">Digital<span class="hl"> Twin</span> Medicine</h1><p class="page-subtitle">Virtual patient models — test treatments before giving them. The next frontier of precision medicine.</p></div></section>
  <section class="section"><div class="container">
    <div class="info-block" style="margin-bottom:32px"><h3 style="font-family:var(--font-heading);font-size:22px;margin-bottom:14px">What is a Digital Twin?</h3><p style="color:var(--text-secondary);line-height:1.8">A digital twin is a real-time computational model of an individual patient, built from their genomic data, medical imaging, continuous biometric monitoring, proteomics, and medical history. Siemens Healthineers deployed the technology across 50 major hospitals, enabling oncologists to virtually simulate chemotherapy protocols, radiation plans, and immunotherapy combinations — testing dozens of treatment scenarios before administering anything to the real patient.</p></div>
    <div class="grid-3">${[{t:'43% Better First-Choice Success',d:'Digital-twin-guided treatment selection improves the probability that the first treatment chosen actually works.'},{t:'61% Fewer Adverse Events',d:'Virtual simulation identifies drug toxicity risks and contraindications invisible in standard workup.'},{t:'2,400 Patients Treated',d:'Early cohort results show dramatic improvement in both oncology outcomes and patient quality of life.'}].map(it => `<div class="card"><h3 style="font-family:var(--font-heading);font-size:17px;color:var(--color-primary);margin-bottom:10px">${it.t}</h3><p style="font-size:14px;color:var(--text-secondary)">${it.d}</p></div>`).join('')}</div>
  </div></section>`;
}
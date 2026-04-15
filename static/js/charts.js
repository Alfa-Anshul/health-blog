const Charts = {
  instances: {},
  destroy(id) { if (this.instances[id]) { this.instances[id].destroy(); delete this.instances[id]; } },
  destroyAll() { Object.keys(this.instances).forEach(k => { this.instances[k].destroy(); delete this.instances[k]; }); },
  defaults: {
    font: { family: "'DM Sans', sans-serif", size: 12 },
    color: '#94a3b8',
    plugins: { legend: { labels: { color: '#94a3b8', padding: 16, usePointStyle: true, pointStyleWidth: 8 } }, tooltip: { backgroundColor: '#071122', borderColor: 'rgba(6,182,212,0.3)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 8 } },
    scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } } }
  },
  create(id, config) {
    this.destroy(id);
    const ctx = document.getElementById(id);
    if (!ctx) return null;
    Chart.defaults.font = this.defaults.font;
    Chart.defaults.color = this.defaults.color;
    const chart = new Chart(ctx, config);
    this.instances[id] = chart;
    return chart;
  },
  createTrafficChart(id, data) {
    const labels = data.slice(0,30).reverse().map(d => { const dt = new Date(d.date); return dt.toLocaleDateString('en', { month: 'short', day: 'numeric' }); });
    const values = data.slice(0,30).reverse().map(d => d.total_views);
    return this.create(id, { type: 'line', data: { labels, datasets: [{ label: 'Daily Pageviews', data: values, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.08)', borderWidth: 2, fill: true, tension: 0.4, pointBackgroundColor: '#06b6d4', pointRadius: 3, pointHoverRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins }, scales: { ...this.defaults.scales } } });
  },
  createCategoryChart(id, data) {
    const colors = ['#06b6d4', '#7c3aed', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
    return this.create(id, { type: 'doughnut', data: { labels: data.map(d => d.category), datasets: [{ data: data.map(d => d.views), backgroundColor: colors.map(c => c + '33'), borderColor: colors, borderWidth: 2, hoverBorderWidth: 3 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12, usePointStyle: true } }, tooltip: this.defaults.plugins.tooltip } } });
  },
  createTopPagesChart(id, data) {
    const colors = ['#06b6d4', '#7c3aed', '#ef4444', '#10b981', '#f59e0b'];
    return this.create(id, { type: 'bar', data: { labels: data.slice(0,8).map(d => d.page.replace('/', 'Home').substring(0,14)), datasets: [{ label: 'Total Views', data: data.slice(0,8).map(d => d.total_views), backgroundColor: colors.map(c => c + '44'), borderColor: colors, borderWidth: 2, borderRadius: 6, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins, legend: { display: false } }, scales: { ...this.defaults.scales } } });
  },
  createWeeklyChart(id) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const vals = [12400, 14200, 11800, 15600, 16900, 18200, 13400];
    return this.create(id, { type: 'bar', data: { labels: days, datasets: [{ label: 'Views', data: vals, backgroundColor: 'rgba(6,182,212,0.2)', borderColor: '#06b6d4', borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins, legend: { display: false } }, scales: { ...this.defaults.scales } } });
  },
  createAITrendChart(id) {
    const labels = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    return this.create(id, { type: 'line', data: { labels, datasets: [{ label: 'AI Diagnostics Accuracy (%)', data: [71, 76, 81, 86, 90, 93, 95], borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#06b6d4', pointRadius: 5 }, { label: 'Human Baseline (%)', data: [85, 85, 86, 87, 87, 88, 88], borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.05)', borderWidth: 2, fill: false, tension: 0.2, borderDash: [6, 3], pointRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins }, scales: { ...this.defaults.scales, y: { ...this.defaults.scales.y, min: 65, max: 100 } } } });
  },
  createCancerSurvivalChart(id) {
    const types = ['Breast', 'Prostate', 'Colorectal', 'Lung', 'Pancreatic', 'Leukemia'];
    const early = [99, 99, 91, 60, 44, 89]; const late = [28, 31, 14, 6, 3, 26];
    return this.create(id, { type: 'bar', data: { labels: types, datasets: [{ label: 'Stage I 5-Year Survival (%)', data: early, backgroundColor: 'rgba(16,185,129,0.3)', borderColor: '#10b981', borderWidth: 2, borderRadius: 6 }, { label: 'Stage IV 5-Year Survival (%)', data: late, backgroundColor: 'rgba(239,68,68,0.3)', borderColor: '#ef4444', borderWidth: 2, borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins }, scales: { ...this.defaults.scales } } });
  },
  createHIVTrendChart(id) {
    const labels = ['2000','2005','2010','2015','2020','2023','2030*'];
    return this.create(id, { type: 'line', data: { labels, datasets: [{ label: 'New HIV Infections (millions)', data: [3.0, 2.7, 2.1, 1.9, 1.5, 1.3, 0.7], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#ef4444', pointRadius: 4 }, { label: 'AIDS Deaths (millions)', data: [1.5, 2.0, 1.5, 1.0, 0.68, 0.63, 0.25], borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.05)', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 4, borderDash: [5, 3] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { ...this.defaults.plugins }, scales: { ...this.defaults.scales } } });
  },
  createHealthMetricsRadar(id) {
    return this.create(id, { type: 'radar', data: { labels: ['AI Integration', 'Early Detection', 'Drug Discovery', 'Mental Health', 'Global Access', 'Genomics'], datasets: [{ label: '2025 Status', data: [78, 85, 65, 52, 43, 80], borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.15)', borderWidth: 2, pointBackgroundColor: '#06b6d4' }, { label: '2030 Target', data: [95, 94, 88, 78, 70, 95], borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.1)', borderWidth: 2, borderDash: [5, 3], pointBackgroundColor: '#7c3aed' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } }, plugins: { ...this.defaults.plugins } } });
  }
};
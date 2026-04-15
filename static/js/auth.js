const Auth = {
  getToken: () => localStorage.getItem('hp_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('hp_user') || 'null'); } catch { return null; } },
  setSession: (token, user) => { localStorage.setItem('hp_token', token); localStorage.setItem('hp_user', JSON.stringify(user)); },
  clearSession: () => { localStorage.removeItem('hp_token'); localStorage.removeItem('hp_user'); },
  isLoggedIn: () => !!localStorage.getItem('hp_token'),
  async register(username, email, password) {
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.detail || 'Registration failed');
    Auth.setSession(d.token, { username: d.username, email: d.email });
    return d;
  },
  async login(email, password) {
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.detail || 'Login failed');
    Auth.setSession(d.token, { username: d.username, email: d.email });
    return d;
  },
  logout: () => { Auth.clearSession(); updateNavAuth(); navigate('/'); showToast('Logged out successfully', 'info'); }
};

function updateNavAuth() {
  const el = document.getElementById('nav-auth');
  if (!el) return;
  const user = Auth.getUser();
  if (user) {
    el.innerHTML = `<div style="display:flex;align-items:center;gap:10px"><div class="profile-av" style="width:36px;height:36px;font-size:14px;cursor:pointer" onclick="navigate('/dashboard')">${user.username[0].toUpperCase()}</div><button class="btn btn-ghost btn-sm" onclick="Auth.logout()">Logout</button></div>`;
  } else {
    el.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="navigate('/login')">Login</button><button class="btn btn-primary btn-sm" onclick="navigate('/signup')">Sign Up</button>`;
  }
}
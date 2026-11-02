const API_URL = 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // localStorage.removeItem('ss_user');
}

// 401 vandha AuthProvider-ku theriya vekka
export const AUTH_EXPIRED = 'auth:expired';


export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
   // token irundhu 401 vandha mattum (login fail case-la illa)
  if (res.status === 401 && token) {
    logout();
    window.dispatchEvent(new Event(AUTH_EXPIRED));
  }

  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}
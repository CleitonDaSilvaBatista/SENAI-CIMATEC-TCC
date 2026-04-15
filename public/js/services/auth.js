function getToken() {
  return localStorage.getItem('token');
}

function saveToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

async function login(email, senha) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });

  if (data.token) saveToken(data.token);
  return data;
}

async function logout() {
  await apiFetch('/api/auth/logout', {
    method: 'POST'
  });

  removeToken();
}

window.authService = {
  getToken,
  saveToken,
  removeToken,
  login,
  logout
};
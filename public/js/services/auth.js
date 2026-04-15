function saveToken(token) {
  localStorage.setItem('token', token);
}

async function login(email, senha) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });

  if (data.token) saveToken(data.token);
  return data;
}

window.authService = { login };
function getAuthToken() {
  return localStorage.getItem('jobee_token')
}

async function apiFetch(url, options = {}) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  }

  const response = await fetch(url, config)
  const contentType = response.headers.get('content-type') || ''

  let data
  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      (data && data.error) ||
      (data && data.message) ||
      'Erro na requisição'

    throw new Error(message)
  }

  return data
}

async function authFetch(url, options = {}) {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Usuário não autenticado.')
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  }

  return apiFetch(url, {
    ...options,
    headers
  })
}
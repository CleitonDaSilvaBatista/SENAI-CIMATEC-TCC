async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erro na API');
  }

  return data;
}

window.apiFetch = apiFetch;
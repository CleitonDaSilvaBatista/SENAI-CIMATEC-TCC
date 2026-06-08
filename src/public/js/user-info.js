document.addEventListener('DOMContentLoaded', () => {
  console.log('user-info.js carregado sem controlar navbar');
});

async function carregarInfoUsuario() {
  const token = localStorage.getItem('jobee_token');
  const userBox = document.getElementById('user-status');

  if (!userBox) return;

  if (!token) {
    userBox.textContent = 'Você não entrou';
    return;
  }

  try {
    const resposta = await fetch('/api/user-info', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (resposta.status === 401) {
      localStorage.removeItem('jobee_token');
      localStorage.removeItem('jobee_user');
      userBox.textContent = 'Você não entrou';
      return;
    }

    const data = await resposta.json();

    if (data.logado) {
      userBox.textContent = `Você entrou, ${data.nome}`;
    } else {
      userBox.textContent = 'Você não entrou';
    }
  } catch (error) {
    console.error('Erro ao buscar usuário logado:', error);
    userBox.textContent = 'Você não entrou';
  }
}
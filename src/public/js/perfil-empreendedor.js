document.addEventListener('DOMContentLoaded', carregarLojasDoEmpreendedor);

function limparSessaoEIrLogin() {
  localStorage.removeItem('jobee_token');
  localStorage.removeItem('jobee_user');
  window.location.href = '/login';
}

function ehEmpreendedor() {
  try {
    const usuario = JSON.parse(localStorage.getItem('jobee_user') || 'null');
    return Number(usuario?.tipo || usuario?.tipoUsuario || usuario?.userType || 0) === 2;
  } catch {
    return false;
  }
}

async function carregarLojasDoEmpreendedor() {
  const lista = document.getElementById('minhas-lojas-lista');
  const contador = document.getElementById('minhas-lojas-contador');
  const vazio = document.getElementById('minhas-lojas-vazio');

  if (!lista) return;

  const token = localStorage.getItem('jobee_token');

  if (!token) {
    limparSessaoEIrLogin();
    return;
  }

  if (!ehEmpreendedor()) {
    window.location.href = '/perfil-cliente';
    return;
  }

  lista.innerHTML = '<p class="profile-loading">Carregando lojas cadastradas...</p>';

  try {
    const resposta = await fetch('/api/lojas/minhas', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await resposta.json().catch(() => []);

    if (resposta.status === 401) {
      limparSessaoEIrLogin();
      return;
    }

    if (!resposta.ok) {
      throw new Error(data.error || 'Erro ao buscar suas lojas.');
    }

    const lojas = Array.isArray(data) ? data : [];

    if (contador) {
      contador.textContent = `${lojas.length} loja${lojas.length === 1 ? '' : 's'} cadastrada${lojas.length === 1 ? '' : 's'}`;
    }

    if (!lojas.length) {
      lista.innerHTML = '';
      if (vazio) vazio.style.display = 'block';
      return;
    }

    if (vazio) vazio.style.display = 'none';

    lista.innerHTML = lojas.map(loja => {
      const link = loja.slug ? `/loja/${loja.slug}` : '#';
      const status = loja.ativo ? 'Ativa' : 'Inativa';
      return `
        <article class="minha-loja-card">
          <img src="${loja.imagem_url || '/img/logo-jobee.svg'}" alt="${loja.nome_fantasia || 'Loja'}" onerror="this.onerror=null;this.src='/img/logo-jobee.svg';">
          <div>
            <div class="minha-loja-topo">
              <h4>${loja.nome_fantasia || 'Loja sem nome'}</h4>
              <span class="loja-status">${status}</span>
            </div>
            <p>${loja.descricao || 'Sem descrição cadastrada.'}</p>
            <a href="${link}" class="btn-ver-loja">Ver loja</a>
          </div>
        </article>
      `;
    }).join('');
  } catch (error) {
    console.error('Erro ao carregar lojas do empreendedor:', error);
    lista.innerHTML = `<p class="profile-error">${error.message || 'Não foi possível carregar suas lojas.'}</p>`;
  }
}

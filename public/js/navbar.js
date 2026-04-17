document.addEventListener('DOMContentLoaded', function () {
  const navbarContainer = document.getElementById('navbar-container');

  if (!navbarContainer) {
    console.warn('navbar-container não encontrado');
    return;
  }

  navbarContainer.innerHTML = `
    <header class="navbar">
      <div class="navbar-left">
        <div class="logo" data-link="/">Jobee</div>

        <div class="location" id="location-box">
          <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="localização" width="16" height="16" />
          <span id="location-text">Informe seu CEP</span>
        </div>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="Buscar serviços, produtos ou lojas..." id="search-input" />
        <button id="search-btn" type="button">
          <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Buscar" width="18" height="18" />
        </button>
      </div>

      <div class="navbar-right">
        <div class="auth-buttons" id="auth-buttons">
          <a data-link="/login" id="entrar">Entrar</a>
          <a data-link="/cadastro" id="criar-conta">Criar Conta</a>
        </div>

        <div id="user-status" class="user-status" style="display: none;"></div>

        <a data-link="/carrinho" class="cart">
          <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Carrinho" width="22" height="22" />
          <span class="navbar-cart-count" id="navbar-cart-count">0</span>
        </a>
      </div>
    </header>

    <div class="cep-modal-overlay" id="cep-modal-overlay">
      <div class="cep-modal">
        <button class="cep-modal-close" id="cep-modal-close" aria-label="Fechar modal">&times;</button>

        <div class="cep-modal-icon">📍</div>
        <h3>Informe seu CEP</h3>
        <p>Digite seu CEP para encontrarmos sua cidade.</p>

        <input type="text" id="cep-input-modal" placeholder="00000-000" maxlength="9" />
        <small id="cep-feedback"></small>

        <div class="cep-modal-actions">
          <button type="button" class="cep-btn secundario" id="cep-cancelar">Cancelar</button>
          <button type="button" class="cep-btn primario" id="cep-confirmar">Confirmar</button>
        </div>
      </div>
    </div>
  `;

  bindNavbarLinks();
  bindSearch();
  iniciarCepNavbar();
  mostrarStatusLogin();
  atualizarBadgeCarrinho();
});

function bindNavbarLinks() {
  const links = document.querySelectorAll('[data-link]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-link');
      navegarPara(path);
    });
  });
}

function bindSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', () => {
    const termo = searchInput.value.trim();

    if (termo) {
      navegarPara(`/buscar?q=${encodeURIComponent(termo)}`);
    } else {
      alert('Digite o que você deseja buscar');
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

function navegarPara(path) {
  window.location.href = path;
}

function iniciarCepNavbar() {
  const locationBox = document.getElementById('location-box');
  const locationText = document.getElementById('location-text');
  const modal = document.getElementById('cep-modal-overlay');
  const fecharBtn = document.getElementById('cep-modal-close');
  const cancelarBtn = document.getElementById('cep-cancelar');
  const confirmarBtn = document.getElementById('cep-confirmar');
  const cepInput = document.getElementById('cep-input-modal');
  const feedback = document.getElementById('cep-feedback');

  if (!locationBox || !locationText || !modal) return;

  const cepSalvo = localStorage.getItem('jobee_cep');
  const cidadeSalva = localStorage.getItem('jobee_cidade');
  const ufSalva = localStorage.getItem('jobee_uf');

  if (cidadeSalva && ufSalva) {
    locationText.textContent = `${cidadeSalva} - ${ufSalva}`;
    locationBox.title = `CEP: ${cepSalvo || ''}`;
  }

  function abrirModalCep() {
    modal.classList.add('ativo');
    cepInput.focus();
    feedback.textContent = '';
    document.body.style.overflow = 'hidden';
  }

  function fecharModalCep() {
    modal.classList.remove('ativo');
    document.body.style.overflow = '';
  }

  function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);
    if (numeros.length > 5) {
      return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
    }
    return numeros;
  }

  async function buscarCep() {
    const cepLimpo = cepInput.value.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      feedback.textContent = 'Digite um CEP válido com 8 números.';
      feedback.style.color = '#dc2626';
      return;
    }

    feedback.textContent = 'Buscando cidade...';
    feedback.style.color = '#198754';

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await resposta.json();

      if (data.erro) {
        feedback.textContent = 'CEP não encontrado.';
        feedback.style.color = '#dc2626';
        return;
      }

      locationText.textContent = `${data.localidade} - ${data.uf}`;
      locationBox.title = `CEP: ${cepLimpo}`;

      localStorage.setItem('jobee_cep', cepLimpo);
      localStorage.setItem('jobee_cidade', data.localidade);
      localStorage.setItem('jobee_uf', data.uf);

      feedback.textContent = 'Localização atualizada com sucesso!';
      feedback.style.color = '#198754';

      setTimeout(fecharModalCep, 800);
    } catch (erro) {
      console.error('Erro ao buscar CEP:', erro);
      feedback.textContent = 'Não foi possível consultar o CEP agora.';
      feedback.style.color = '#dc2626';
    }
  }

  locationBox.addEventListener('click', abrirModalCep);
  fecharBtn?.addEventListener('click', fecharModalCep);
  cancelarBtn?.addEventListener('click', fecharModalCep);
  confirmarBtn?.addEventListener('click', buscarCep);

  cepInput?.addEventListener('input', (e) => {
    e.target.value = formatarCep(e.target.value);
  });

  cepInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarCep();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModalCep();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('ativo')) {
      fecharModalCep();
    }
  });
}

function mostrarStatusLogin() {
  const userBox = document.getElementById('user-status');
  const authButtons = document.getElementById('auth-buttons');

  if (!userBox || !authButtons) {
    console.warn('Elementos de autenticação não encontrados');
    return;
  }

  const token = localStorage.getItem('jobee_token');
  const usuarioSalvo = localStorage.getItem('jobee_user');

  if (!token) {
    authButtons.style.display = 'flex';
    userBox.style.display = 'none';
    userBox.innerHTML = '';
    return;
  }

  let nome = 'Usuário';

  try {
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    if (usuario && usuario.nome) {
      nome = usuario.nome;
    }
  } catch (error) {
    console.error('Erro ao ler usuário salvo:', error);
  }

  authButtons.style.display = 'none';
  userBox.style.display = 'flex';
  userBox.innerHTML = `
    <span>Olá, ${nome}</span>
    <button id="logout-btn" class="logout-btn" type="button">Sair</button>
  `;

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn?.addEventListener('click', logout);
}

function logout() {
  localStorage.removeItem('jobee_token');
  localStorage.removeItem('jobee_user');
  mostrarStatusLogin();
  window.location.href = '/';
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById('navbar-cart-count');
  if (!badge) return;

  try {
    const carrinho = JSON.parse(localStorage.getItem('jobee_cart')) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
    badge.textContent = totalItens;
  } catch (error) {
    console.error('Erro ao atualizar badge do carrinho:', error);
    badge.textContent = '0';
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const navbarContainer = document.getElementById('navbar-container');

  if (navbarContainer) {
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
          <button id="search-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Buscar" width="18" height="18" />
          </button>
        </div>

        <div class="navbar-right">
          <div class="auth-buttons">
            <a data-link="/login" id="entrar">Entrar</a>
            <div id="user-status" style="display: none;"></div>
            <a data-link="/cadastro" id="criar-conta">Criar Conta</a>
          </div>

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

    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-link');
        navegarPara(path);
      });
    });

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
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

    iniciarCepNavbar();
    mostrarStatusLogin();
  }
});

function navegarPara(path) {
  if (typeof window.reactRouterNavigate !== 'undefined') {
    window.reactRouterNavigate(path);
  } else if (typeof window.$router !== 'undefined') {
    window.$router.push(path);
  } else {
    window.location.href = path;
  }

  console.log(`Navegando para: ${path}`);
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

      const cidadeUf = `${data.localidade} - ${data.uf}`;
      locationText.textContent = cidadeUf;
      locationBox.title = `CEP: ${cepLimpo}`;

      localStorage.setItem('jobee_cep', cepLimpo);
      localStorage.setItem('jobee_cidade', data.localidade);
      localStorage.setItem('jobee_uf', data.uf);

      feedback.textContent = 'Localização atualizada com sucesso!';
      feedback.style.color = '#198754';

      setTimeout(() => {
        fecharModalCep();
      }, 800);
    } catch (erro) {
      console.error('Erro ao buscar CEP:', erro);
      feedback.textContent = 'Não foi possível consultar o CEP agora.';
      feedback.style.color = '#dc2626';
    }
  }

  locationBox.addEventListener('click', abrirModalCep);
  fecharBtn.addEventListener('click', fecharModalCep);
  cancelarBtn.addEventListener('click', fecharModalCep);
  confirmarBtn.addEventListener('click', buscarCep);

  cepInput.addEventListener('input', (e) => {
    e.target.value = formatarCep(e.target.value);
  });

  cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      buscarCep();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModalCep();
    }
  });

  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('ativo')) {
      fecharModalCep();
    }
  });
}

function mostrarStatusLogin() {
  const userBox = document.getElementById('user-status');
  const entrarBtn = document.getElementById('entrar');
  const criarContaBtn = document.getElementById('criar-conta');

  if (!userBox || !entrarBtn || !criarContaBtn) {
    console.warn('Elementos de autenticação não encontrados');
    return;
  }

  const token = localStorage.getItem('jobee_token');
  const usuarioSalvo = localStorage.getItem('jobee_user');

  if (!token) {
    userBox.style.display = 'none';
    userBox.textContent = '';
    entrarBtn.style.display = 'inline-block';
    criarContaBtn.style.display = 'inline-block';
    return;
  }

  entrarBtn.style.display = 'none';
  criarContaBtn.style.display = 'none';
  userBox.style.display = 'inline-block';
  userBox.textContent = 'Carregando...';

  setTimeout(() => {
    try {
      const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
      const nome = usuario && usuario.nome ? usuario.nome : 'Usuário';

      userBox.innerHTML = `
        <span>Você entrou, ${nome}</span>
        <button id="logout-btn" style="
          margin-left: 10px;
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-weight: bold;
        ">
          Sair
        </button>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    } catch (error) {
      console.error('Erro ao ler usuário salvo:', error);

      userBox.innerHTML = `
        <span>Você entrou</span>
        <button id="logout-btn" style="
          margin-left: 10px;
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-weight: bold;
        ">
          Sair
        </button>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    }
  }, 3000);
}

function logout() {
  localStorage.removeItem('jobee_token');
  localStorage.removeItem('jobee_user');
  location.reload();
}
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
            <a data-link="/cadastro" id="criar-conta">Criar Conta</a>
          </div>
          <a data-link="/carrinho" class="cart">
            <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Carrinho" width="22" height="22" />
          </a>
        </div>
      </header>
    `;

    // Sistema de rotas
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-link');
        navegarPara(path);
      });
    });

    // Busca
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

    // CEP
    iniciarCepNavbar();
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

  if (!locationBox || !locationText) return;

  // Se já houver CEP salvo, mostra ao carregar
  const cepSalvo = localStorage.getItem('jobee_cep');
  const cidadeSalva = localStorage.getItem('jobee_cidade');
  const ufSalva = localStorage.getItem('jobee_uf');

  if (cidadeSalva && ufSalva) {
    locationText.textContent = `${cidadeSalva} - ${ufSalva}`;
    locationBox.title = `CEP: ${cepSalvo || ''}`;
  }

  locationBox.style.cursor = 'pointer';

  locationBox.addEventListener('click', async () => {
    const cepDigitado = prompt('Digite seu CEP:');

    if (!cepDigitado) return;

    const cepLimpo = cepDigitado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      alert('Digite um CEP válido com 8 números.');
      return;
    }

    locationText.textContent = 'Buscando...';

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await resposta.json();

      if (data.erro) {
        locationText.textContent = 'Informe seu CEP';
        alert('CEP não encontrado.');
        return;
      }

      const cidadeUf = `${data.localidade} - ${data.uf}`;
      locationText.textContent = cidadeUf;

      localStorage.setItem('jobee_cep', cepLimpo);
      localStorage.setItem('jobee_cidade', data.localidade);
      localStorage.setItem('jobee_uf', data.uf);

      locationBox.title = `CEP: ${cepLimpo}`;
    } catch (erro) {
      console.error('Erro ao buscar CEP:', erro);
      locationText.textContent = 'Informe seu CEP';
      alert('Não foi possível consultar o CEP agora.');
    }
  });
}
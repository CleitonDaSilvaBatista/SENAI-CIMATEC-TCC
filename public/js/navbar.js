// navbar.js - Com rotas (sem .html)
document.addEventListener('DOMContentLoaded', function() {
  const navbarContainer = document.getElementById('navbar-container');
  
  if (navbarContainer) {
    navbarContainer.innerHTML = `
      <header class="navbar">
        <div class="navbar-left">
          <div class="logo" data-link="/">Jobee</div>
          <div class="location">
            <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="localização" width="16" height="16" />
            <span>Informe seu CEP</span>
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

    // Sistema de rotas - clica nos links com data-link
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-link');
        navegarPara(path);
      });
    });

    // Funcionalidade da busca
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
  }
});

// Função de navegação por rota
function navegarPara(path) {
  // Se estiver usando React Router ou similar
  if (typeof window.reactRouterNavigate !== 'undefined') {
    window.reactRouterNavigate(path);
  }
  // Se for Vue Router
  else if (typeof window.$router !== 'undefined') {
    window.$router.push(path);
  }
  // Fallback: mudar a URL e recarregar (não ideal, mas funciona)
  else {
    window.location.href = path;
  }
  
  console.log(`Navegando para: ${path}`);
}
(async () => {
  const res = await fetch('/api/user');
  const data = await res.json();

  const navbarRight = document.querySelector(".navbar-right");

  if (data.logado) {
      navbarRight.innerHTML = `
        <span class="user-name">Olá, ${data.nome}</span>
        <a href="/api/logout" class="btn conta">Sair</a>
      `;
  }
})();

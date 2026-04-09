(async () => {

  const token = localStorage.getItem("token")

  if (!token) return

  const res = await fetch('/api/user-info', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  const navbarRight = document.querySelector(".navbar-right")

  if (data.logado) {
      navbarRight.innerHTML = `
        <span class="user-name">Olá, ${data.nome}</span>
        <a href="#" id="logoutBtn" class="btn conta">Sair</a>
      `
  }

  document.addEventListener("click", (e) => {

  if (e.target.id === "logoutBtn") {
    localStorage.removeItem("token")
    location.reload()
  }

})

})();
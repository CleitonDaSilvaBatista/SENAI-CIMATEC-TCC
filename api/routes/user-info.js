(async () => {

  const token = localStorage.getItem("token")
  const navbarRight = document.querySelector(".navbar-right")

  if (!token) return

  try {

    const payload = JSON.parse(atob(token.split('.')[1]))

    navbarRight.innerHTML = `
      <span class="user-name">Olá, ${payload.email}</span>
      <a href="#" id="logoutBtn" class="btn conta">Sair</a>
    `

    document.getElementById("logoutBtn").onclick = () => {
      localStorage.removeItem("token")
      location.reload()
    }

  } catch (err) {
    console.error("Token inválido")
  }

})()
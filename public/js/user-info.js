document.addEventListener("DOMContentLoaded", () => {
  setTimeout(mostrarStatusLogin, 500);
});

function mostrarStatusLogin() {
  const userBox = document.getElementById("user-status");
  if (!userBox) {
    console.warn("Elemento #user-status não encontrado");
    return;
  }

  const token = localStorage.getItem("jobee_token");
  const usuarioSalvo = localStorage.getItem("jobee_user");

  console.log("Token na página:", token);
  console.log("Usuário salvo:", usuarioSalvo);

  if (!token) {
    userBox.textContent = "Você não entrou";
    return;
  }

  try {
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    if (usuario && usuario.nome) {
      userBox.textContent = `Você entrou, ${usuario.nome}`;
    } else {
      userBox.textContent = "Você entrou";
    }
  } catch (error) {
    console.error("Erro ao ler usuário salvo:", error);
    userBox.textContent = "Você entrou";
  }
}
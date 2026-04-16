document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  try {
    const resposta = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await resposta.json();
    console.log("Resposta completa do login:", data);

    if (!data.success) {
      alert(data.error || "Erro no login");
      return;
    }

    console.log("Token recebido do backend:", data.token);
    console.log("Usuário recebido do backend:", data.usuario);

    localStorage.setItem("jobee_token", data.token);
    localStorage.setItem("jobee_user", JSON.stringify(data.usuario));

    console.log("Token salvo no localStorage:", localStorage.getItem("jobee_token"));
    console.log("Usuário salvo no localStorage:", localStorage.getItem("jobee_user"));

    alert("Login realizado com sucesso! Verifique o console.");
    // window.location.href = "/";
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao tentar logar.");
  }
});
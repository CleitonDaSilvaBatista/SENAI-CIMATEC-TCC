document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await resposta.json();

    if (data.success) {
        alert("Login realizado com sucesso!");
        window.location.href = "/";
    } else {
        alert(data.error);
    }
});

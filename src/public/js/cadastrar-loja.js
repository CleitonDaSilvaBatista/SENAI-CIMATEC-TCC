document.addEventListener('DOMContentLoaded', () => {
  protegerPaginaEmpreendedor();
  prepararCadastroLoja();
});

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('jobee_user') || 'null');
  } catch {
    return null;
  }
}

function protegerPaginaEmpreendedor() {
  const token = localStorage.getItem('jobee_token');
  const usuario = getUsuarioLogado();
  const tipo = Number(usuario?.tipo || usuario?.tipoUsuario || usuario?.userType || 0);

  if (!token) {
    alert('Faça login para cadastrar uma loja.');
    window.location.href = '/login';
    return;
  }

  if (tipo !== 2) {
    alert('Apenas perfis empreendedores podem cadastrar lojas.');
    window.location.href = '/perfil-cliente';
  }
}

function prepararCadastroLoja() {
  const form = document.getElementById('form-cadastrar-loja');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('jobee_token');
    const botao = form.querySelector('button[type="submit"]');
    const checksObrigatorios = Array.from(form.querySelectorAll('input[type="checkbox"]'));

    if (checksObrigatorios.some(check => !check.checked)) {
      alert('Marque todos os campos de aceite antes de cadastrar a loja.');
      return;
    }

    const nomeFantasia = document.getElementById('fantasia')?.value.trim();
    const descricao = document.getElementById('descricao')?.value.trim();
    const cnpj = document.getElementById('cnpj')?.value.trim();

    if (!nomeFantasia || !descricao || !cnpj) {
      alert('Preencha pelo menos nome fantasia, CNPJ e descrição da loja.');
      return;
    }

    const payload = {
      nome_fantasia: nomeFantasia,
      cnpj,
      descricao,
      sobre_loja: descricao,
      imagem_url: '/img/logo-jobee.svg',
      banner_url: '/img/banercarrosel.webp'
    };

    try {
      if (botao) {
        botao.disabled = true;
        botao.textContent = 'Cadastrando...';
      }

      const resposta = await fetch('/api/lojas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        localStorage.removeItem('jobee_token');
        localStorage.removeItem('jobee_user');
        alert('Sua sessão expirou. Faça login novamente.');
        window.location.href = '/login';
        return;
      }

      if (!resposta.ok) {
        throw new Error(data.error || 'Erro ao cadastrar loja.');
      }

      alert('Loja cadastrada com sucesso! Ela agora aparecerá no seu perfil.');
      window.location.href = '/perfil-empreendedor';
    } catch (error) {
      console.error('Erro ao cadastrar loja:', error);
      alert(error.message || 'Não foi possível cadastrar a loja agora.');
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = 'Cadastrar empresa';
      }
    }
  });
}

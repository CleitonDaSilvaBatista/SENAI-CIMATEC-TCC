(function () {
  const DESTINO_CADASTRO_LOJA = '/cadastrar-loja';

  function getToken() {
    return localStorage.getItem('jobee_token') || localStorage.getItem('token');
  }

  function salvarDestinoEIrParaLogin() {
    sessionStorage.setItem('jobee_redirect_after_login', DESTINO_CADASTRO_LOJA);
    const loginUrl = `/login?redirect=${encodeURIComponent(DESTINO_CADASTRO_LOJA)}`;
    window.location.replace(loginUrl);
  }

  function limparValor(valor) {
    return valor?.trim?.() || '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    const token = getToken();

    if (!token) {
      alert('Você precisa fazer login para cadastrar uma loja. Depois do login, você voltará automaticamente para esta página.');
      salvarDestinoEIrParaLogin();
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const tokenAtual = getToken();
      if (!tokenAtual) {
        salvarDestinoEIrParaLogin();
        return;
      }

      const botao = form.querySelector('button[type="submit"]');
      const textoOriginal = botao?.textContent || 'Cadastrar loja';

      const dadosLoja = {
        nome_fantasia: limparValor(document.getElementById('fantasia')?.value),
        cnpj: limparValor(document.getElementById('cnpj')?.value),
        descricao: limparValor(document.getElementById('descricao')?.value),
        sobre_loja: limparValor(document.getElementById('descricao')?.value),
        imagem_url: limparValor(document.getElementById('imagem_url')?.value),
        segmento: limparValor(document.getElementById('segmento')?.value),
        categoria: limparValor(document.getElementById('segmento')?.value),
        cep: limparValor(document.getElementById('cep')?.value),
        cidade: limparValor(document.getElementById('cidade')?.value),
        estado: limparValor(document.getElementById('estado')?.value)
      };

      if (!dadosLoja.nome_fantasia || !dadosLoja.cnpj || !dadosLoja.descricao || !dadosLoja.segmento) {
        alert('Preencha nome fantasia, CNPJ, descrição e categoria da loja.');
        return;
      }

      try {
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Cadastrando...';
        }

        const resposta = await fetch('/api/lojas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenAtual}`
          },
          body: JSON.stringify(dadosLoja)
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          if (resposta.status === 401) {
            localStorage.removeItem('jobee_token');
            localStorage.removeItem('token');
            localStorage.removeItem('jobee_user');
            alert('Sua sessão expirou. Faça login novamente para cadastrar a loja.');
            salvarDestinoEIrParaLogin();
            return;
          }

          throw new Error(resultado.error || resultado.message || 'Erro ao cadastrar loja.');
        }

        alert('Loja cadastrada com sucesso!');
        window.location.href = resultado.loja?.slug ? `/loja/${resultado.loja.slug}` : '/dashboard';
      } catch (error) {
        alert(error.message || 'Erro ao cadastrar loja.');
      } finally {
        if (botao) {
          botao.disabled = false;
          botao.textContent = textoOriginal;
        }
      }
    });
  });
})();

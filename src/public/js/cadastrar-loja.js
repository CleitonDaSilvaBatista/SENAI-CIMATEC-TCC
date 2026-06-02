(function () {
  const DESTINO_CADASTRO_LOJA = '/cadastrar-loja';

  function getToken() {
    return localStorage.getItem('jobee_token') || localStorage.getItem('token');
  }

  function salvarDestinoEIrParaLogin() {
    sessionStorage.setItem('jobee_redirect_after_login', DESTINO_CADASTRO_LOJA);

    const loginUrl = `/login?redirect=${encodeURIComponent(DESTINO_CADASTRO_LOJA)}`;

    // replace evita que o botão voltar fique preso em loop entre cadastro e login
    window.location.replace(loginUrl);
  }

  function limparValor(valor) {
    const texto = valor?.trim?.() || '';
    return texto === 'Selecione' ? '' : texto;
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
        razao_social: limparValor(document.getElementById('razao')?.value),
        nome_fantasia: limparValor(document.getElementById('fantasia')?.value),
        cnpj: limparValor(document.getElementById('cnpj')?.value),
        porte: limparValor(document.getElementById('porte')?.value),
        data_fundacao: limparValor(document.getElementById('fundacao')?.value),
        segmento: limparValor(document.getElementById('segmento')?.value),
        cnae: limparValor(document.getElementById('cnae')?.value),
        site: limparValor(document.getElementById('site')?.value),
        descricao: limparValor(document.getElementById('descricao')?.value),
        sobre_loja: limparValor(document.getElementById('descricao')?.value),
        responsavel_legal: limparValor(document.getElementById('responsavel')?.value),
        cargo_responsavel: limparValor(document.getElementById('cargo')?.value),
        cpf_responsavel: limparValor(document.getElementById('cpf')?.value),
        email_corporativo: limparValor(document.getElementById('emailcorp')?.value),
        telefone: limparValor(document.getElementById('telefone')?.value),
        whatsapp: limparValor(document.getElementById('whatsapp')?.value),
        gestor_operacional: limparValor(document.getElementById('gestor')?.value),
        email_gestor: limparValor(document.getElementById('emailgestor')?.value),
        cep: limparValor(document.getElementById('cep')?.value),
        logradouro: limparValor(document.getElementById('logradouro')?.value),
        numero: limparValor(document.getElementById('numero')?.value),
        complemento: limparValor(document.getElementById('complemento')?.value),
        bairro: limparValor(document.getElementById('bairro')?.value),
        cidade: limparValor(document.getElementById('cidade')?.value),
        area_atuacao: limparValor(document.getElementById('atuacao')?.value),
        modelo_operacao: limparValor(document.getElementById('operacao')?.value),
        quantidade_usuarios: limparValor(document.getElementById('usuarios')?.value),
        volume_mensal: limparValor(document.getElementById('volume')?.value),
        banco: limparValor(document.getElementById('banco')?.value),
        agencia: limparValor(document.getElementById('agencia')?.value),
        conta_bancaria: limparValor(document.getElementById('conta')?.value),
        titular_conta: limparValor(document.getElementById('titular')?.value),
        pix: limparValor(document.getElementById('pix')?.value)
      };

      if (!dadosLoja.nome_fantasia || !dadosLoja.cnpj) {
        alert('Preencha pelo menos o nome fantasia e o CNPJ da loja.');
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

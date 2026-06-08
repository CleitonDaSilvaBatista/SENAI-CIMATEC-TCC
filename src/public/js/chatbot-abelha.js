document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('beebot-button')) return;

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem('jobee_user') || 'null');
    } catch (error) {
      return null;
    }
  })();

  const tipoUsuario = String(usuario?.tipo || usuario?.tipo_usuario || usuario?.perfil || '').toLowerCase();
  const isEmpreendedor = tipoUsuario.includes('empreendedor');
  const isLogado = Boolean(localStorage.getItem('jobee_token'));

  const atalhosBase = [
    { label: 'Início', href: '/home', descricao: 'Ver produtos, serviços e negócios em destaque.' },
    { label: 'Buscar', href: '/buscar', descricao: 'Pesquisar produtos, serviços e lojas locais.' },
    { label: 'Carrinho', href: '/cart', descricao: 'Ver itens escolhidos antes de finalizar a compra.' },
    { label: 'Planos', href: '/planos', descricao: 'Conhecer opções e vantagens da Jobee.' },
    { label: 'Contato', href: '/contato', descricao: 'Falar com a equipe de suporte.' }
  ];

  const atalhosEmpreendedor = [
    { label: 'Cadastrar loja', href: '/cadastrar-loja', descricao: 'Criar sua loja para aparecer na Jobee.' },
    { label: 'Meu perfil', href: '/perfil-empreendedor', descricao: 'Ver seus dados e lojas cadastradas.' },
    { label: 'Dicas de vendas', href: '/dicas-vendas', descricao: 'Aprender formas simples de vender mais.' },
    { label: 'Dashboard', href: '/dashboard', descricao: 'Acompanhar informações do seu negócio.' }
  ];

  const atalhosCliente = [
    { label: 'Meu perfil', href: '/perfil-cliente', descricao: 'Ver seus dados e acompanhar sua conta.' },
    { label: 'Login', href: '/login', descricao: 'Entrar na sua conta Jobee.' },
    { label: 'Criar conta', href: '/criarcont', descricao: 'Criar uma conta para comprar ou vender.' }
  ];

  const atalhos = [
    ...atalhosBase,
    ...(isEmpreendedor ? atalhosEmpreendedor : []),
    ...(!isLogado ? atalhosCliente.slice(1) : (!isEmpreendedor ? atalhosCliente.slice(0, 1) : []))
  ];

  const respostas = [
    {
      termos: ['guia', 'navegar', 'navegação', 'navegacao', 'funcionalidade', 'funcionalidades', 'site', 'menu', 'atalho', 'atalhos'],
      texto: 'Claro! Abri o Guia do site para você. Ele mostra as principais áreas da Jobee e te leva direto para cada página.',
      guia: true
    },
    {
      termos: ['venda', 'vender', 'vendas', 'aumentar'],
      texto: 'Para vender mais, comece melhorando fotos, descrição, preço e tempo de resposta. Também recomendo visitar a página “Dicas para aumentar minhas vendas”.'
    },
    {
      termos: ['foto', 'imagem', 'produto'],
      texto: 'Use fotos nítidas, com boa luz e fundo limpo. Mostre detalhes, tamanho e uso real do produto.'
    },
    {
      termos: ['preço', 'preco', 'promoção', 'promocao', 'desconto'],
      texto: 'Promoções simples funcionam bem: combo, desconto por tempo limitado ou brinde em compras maiores.'
    },
    {
      termos: ['loja', 'cadastro', 'empreendedor', 'cadastrar loja'],
      texto: isEmpreendedor
        ? 'Você pode cadastrar sua loja pelo menu hambúrguer ou clicando no atalho “Cadastrar loja” aqui no Guia do site.'
        : 'A opção de cadastrar loja aparece para perfis empreendedores. Entre com uma conta empreendedora para acessar esse recurso.'
    },
    {
      termos: ['contato', 'suporte', 'ajuda'],
      texto: 'Você pode falar com a equipe pela página de Contato. A Jobee recebe suas informações e retorna assim que possível.'
    },
    {
      termos: ['buscar', 'busca', 'pesquisar', 'encontrar'],
      texto: 'Na página de busca você consegue procurar produtos, serviços e também negócios locais em destaque.'
    },
    {
      termos: ['perfil', 'minha conta', 'conta'],
      texto: isEmpreendedor
        ? 'No seu perfil empreendedor aparecem seus dados e a seção “Lojas cadastradas”.'
        : 'No seu perfil você consegue ver suas informações de conta. Entre no site para acessar essa área.'
    }
  ];

  const botao = document.createElement('button');
  botao.id = 'beebot-button';
  botao.className = 'beebot-button';
  botao.type = 'button';
  botao.setAttribute('aria-label', 'Abrir abelhinha ajudante');
  botao.textContent = '🐝';

  const janela = document.createElement('section');
  janela.className = 'beebot-window';
  janela.setAttribute('aria-label', 'Chatbot abelhinha ajudante');
  janela.innerHTML = `
    <div class="beebot-header">
      <div class="beebot-avatar">🐝</div>
      <div>
        <h3>Abelhinha ajudante</h3>
        <p>Dicas rápidas para usar a Jobee</p>
      </div>
      <button class="beebot-close" type="button" aria-label="Fechar chatbot">×</button>
    </div>
    <div class="beebot-messages" id="beebot-messages">
      <div class="bee-message bot">Oi! Sou a abelhinha ajudante da Jobee. Posso te ajudar com vendas, cadastro, produtos, contato e navegação pelo site.</div>
    </div>
    <div class="beebot-options">
      <button type="button" class="beebot-option beebot-guide-option" data-msg="Quero o guia do site">Guia do site</button>
      <button type="button" class="beebot-option" data-msg="Como aumentar minhas vendas?">Vender mais</button>
      <button type="button" class="beebot-option" data-msg="Como melhorar minhas fotos?">Fotos</button>
      <button type="button" class="beebot-option" data-msg="Como criar promoções?">Promoções</button>
    </div>
    <form class="beebot-form" id="beebot-form">
      <input id="beebot-input" type="text" placeholder="Digite sua dúvida..." autocomplete="off" />
      <button type="submit">Enviar</button>
    </form>
  `;

  document.body.appendChild(botao);
  document.body.appendChild(janela);

  const mensagens = janela.querySelector('#beebot-messages');
  const form = janela.querySelector('#beebot-form');
  const input = janela.querySelector('#beebot-input');
  const fechar = janela.querySelector('.beebot-close');

  function adicionarMensagem(texto, tipo) {
    const msg = document.createElement('div');
    msg.className = `bee-message ${tipo}`;
    msg.textContent = texto;
    mensagens.appendChild(msg);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  function adicionarGuiaDoSite() {
    const guiaExistente = mensagens.querySelector('.beebot-guide-card');
    if (guiaExistente) guiaExistente.remove();

    const card = document.createElement('div');
    card.className = 'bee-message bot beebot-guide-card';

    const titulo = document.createElement('strong');
    titulo.textContent = 'Guia rápido da Jobee';
    card.appendChild(titulo);

    const texto = document.createElement('p');
    texto.textContent = isEmpreendedor
      ? 'Como empreendedor, você pode cadastrar loja, ver suas lojas no perfil e acessar dicas para vender mais.'
      : 'Escolha uma área abaixo para navegar pelo site mais rápido.';
    card.appendChild(texto);

    const lista = document.createElement('div');
    lista.className = 'beebot-guide-list';

    atalhos.forEach((atalho) => {
      const link = document.createElement('a');
      link.href = atalho.href;
      link.className = 'beebot-guide-link';
      link.innerHTML = `<span>${atalho.label}</span><small>${atalho.descricao}</small>`;
      lista.appendChild(link);
    });

    card.appendChild(lista);
    mensagens.appendChild(card);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  function gerarResposta(texto) {
    const normalizado = texto.toLowerCase();
    const resposta = respostas.find(item => item.termos.some(termo => normalizado.includes(termo)));
    if (resposta?.guia) {
      setTimeout(adicionarGuiaDoSite, 260);
    }
    return resposta ? resposta.texto : 'Boa pergunta! Posso te ajudar com vendas, produtos, cadastro de loja, contato ou navegação. Clique em “Guia do site” para ver os atalhos principais.';
  }

  function enviarTexto(texto) {
    const valor = texto.trim();
    if (!valor) return;

    adicionarMensagem(valor, 'user');
    setTimeout(() => adicionarMensagem(gerarResposta(valor), 'bot'), 250);
  }

  botao.addEventListener('click', () => {
    janela.classList.toggle('ativo');
  });

  fechar.addEventListener('click', () => {
    janela.classList.remove('ativo');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    enviarTexto(input.value);
    input.value = '';
  });

  janela.querySelectorAll('.beebot-option').forEach(botaoOpcao => {
    botaoOpcao.addEventListener('click', () => {
      enviarTexto(botaoOpcao.dataset.msg || '');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('beebot-button')) return;

  const respostas = [
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
      termos: ['loja', 'cadastro', 'empreendedor'],
      texto: 'Para cadastrar sua loja, acesse a área de empreendedor e mantenha seus dados, fotos e contatos sempre atualizados.'
    },
    {
      termos: ['contato', 'suporte', 'ajuda'],
      texto: 'Você pode falar com a equipe pela página de Contato. A Jobee recebe suas informações e retorna assim que possível.'
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
      <div class="bee-message bot">Oi! Sou a abelhinha ajudante da Jobee. Posso te ajudar com vendas, cadastro, produtos e contato.</div>
    </div>
    <div class="beebot-options">
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

  function gerarResposta(texto) {
    const normalizado = texto.toLowerCase();
    const resposta = respostas.find(item => item.termos.some(termo => normalizado.includes(termo)));
    return resposta ? resposta.texto : 'Boa pergunta! Para começar, deixe sua página completa, responda rápido e use boas fotos. Se quiser algo mais detalhado, veja a aba “Dicas para aumentar minhas vendas”.';
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

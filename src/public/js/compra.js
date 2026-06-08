const PRODUTOS_CHECKOUT_JOBEE = {
  shorts: {
    id: 'produto-demo-bermuda', nome: 'Kit 4 Bermuda Masculina Short Moletom Leve Caminhada Atacado com Bolso Academia', preco: 67.85,
    imagem: '/img/shorts.webp', vendedor: 'Loja Demo', cor: 'Preto', tamanho: 'P', quantidade: 1, entrega: 'Entrega estimada entre 2 e 5 dias úteis', frete: 9.9
  },
  tv: {
    id: 'produto-demo-tv', nome: 'Smart TV TCL 65 Polegadas QLED 4K P7K WiFi Bluetooth Google TV HDR10+ Dolby Atmos Dolby Vision 65P7K', preco: 2867.90,
    imagem: '/img/tv.webp', vendedor: 'Tech Vision Store', cor: 'Preto', tamanho: '65 polegadas', quantidade: 1, entrega: 'Entrega estimada entre 3 e 7 dias úteis', frete: 0
  },
  ferramentas: {
    id: 'produto-demo-ferramentas', nome: 'Jogo de Ferramentas 200 Peças Maleta Resistente Completa uso profissional Titanium Platina', preco: 59.90,
    imagem: '/img/ferramenta.webp', vendedor: 'Titanium Platina', cor: 'Padrão', tamanho: 'Kit 200 peças', quantidade: 1, entrega: 'Entrega estimada entre 2 e 6 dias úteis', frete: 0
  },
  'painel-tv': {
    id: 'produto-demo-painel', nome: 'Painel para TV até 55 Polegadas Paris com Efeito Ripado — Design Moderno e Sofisticado em Promoção', preco: 349.00,
    imagem: '/img/painel.webp', vendedor: 'Casa Paris Móveis', cor: 'Madeira', tamanho: 'Até 55 polegadas', quantidade: 1, entrega: 'Entrega estimada entre 4 e 9 dias úteis', frete: 0
  },
  espelho: {
    id: 'produto-demo-espelho', nome: 'Espelho Vidrex Pisa 70x50cm Retangular Decorativo Elegante Contemporâneo Luxo & Sofisticação', preco: 58.10,
    imagem: '/img/espelho.webp', vendedor: 'Vidrex Decor', cor: 'Espelhado', tamanho: '70x50cm', quantidade: 1, entrega: 'Entrega estimada entre 3 e 8 dias úteis', frete: 0
  },
  'mesa-cadeiras': {
    id: 'produto-demo-mesa-cadeiras', nome: 'Conjunto Mesa com Cadeiras para Sala de Jantar — Festival de Inverno Jobee', preco: 1874.14,
    imagem: '/img/conjuntomesa.webp', vendedor: 'Lar Quentinho Móveis', cor: 'Madeira', tamanho: 'Conjunto completo', quantidade: 1, entrega: 'Entrega estimada entre 5 e 10 dias úteis', frete: 0
  },
  smartwatch: {
    id: 'produto-demo-smartwatch', nome: 'Smartwatch PEJE ZW04 com Recursos Inteligentes, Monitoramento e Conectividade', preco: 669.99,
    imagem: '/img/relogio.png', vendedor: 'Peje Oficial', cor: 'Preto', tamanho: 'Único', quantidade: 1, entrega: 'Entrega estimada entre 2 e 5 dias úteis', frete: 0
  },
  'placa-video': {
    id: 'produto-demo-rtx5070ti', nome: 'Placa de Vídeo NVIDIA RTX 5070 Ti 16GB GDDR6 para Alto Desempenho', preco: 6899.90,
    imagem: '/img/placa de video.png', vendedor: 'Hardware Pro', cor: 'Padrão', tamanho: '16GB', quantidade: 1, entrega: 'Entrega estimada entre 3 e 7 dias úteis', frete: 0
  }
};

function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function parametrosCheckout() {
  const params = new URLSearchParams(window.location.search);
  const valor = params.get('produto') || params.get('slug') || params.get('id');

  return {
    origem: params.get('origem') || params.get('source') || '',
    produto: valor ? decodeURIComponent(valor) : null
  };
}

function slugPelaUrl() {
  const { produto } = parametrosCheckout();
  if (!produto) return null;

  const mapaIds = {
    'produto-demo-bermuda': 'shorts',
    'produto-demo-tv': 'tv',
    'produto-demo-ferramentas': 'ferramentas',
    'produto-demo-painel': 'painel-tv',
    'produto-demo-espelho': 'espelho',
    'produto-demo-mesa-cadeiras': 'mesa-cadeiras',
    'produto-demo-smartwatch': 'smartwatch',
    'produto-demo-rtx5070ti': 'placa-video'
  };

  const normalizado = produto.replace(/^produto-/, '');
  return mapaIds[produto] || mapaIds[normalizado] || normalizado;
}

function obterCarrinhoCheckout() {
  try {
    const carrinho = JSON.parse(localStorage.getItem('jobee_cart') || '[]');
    return Array.isArray(carrinho) ? carrinho.map(normalizarItem) : [];
  } catch (error) {
    console.warn('Não foi possível ler carrinho.', error);
    return [];
  }
}

function normalizarItem(item) {
  return {
    id: item.id_item || item.id || item.slug || 'produto-jobee',
    nome: item.nome || item.titulo || item.title || 'Produto Jobee',
    preco: Number(item.preco || item.price || 0),
    imagem: item.imagem || item.imagem_url || item.image || '/img/shorts.webp',
    cor: item.cor || 'Padrão',
    tamanho: item.tamanho || item.size || 'Único',
    quantidade: Number(item.quantidade || item.quantity || 1),
    vendedor: item.vendedor || item.nome_loja || item.seller || 'Loja Jobee',
    entrega: item.entrega || 'Entrega estimada entre 2 e 5 dias úteis',
    frete: Number(item.frete ?? 9.9)
  };
}

function obterItensCompra() {
  const { origem } = parametrosCheckout();
  const slug = slugPelaUrl();
  const carrinho = obterCarrinhoCheckout();

  // Quando o usuário vem da página de carrinho, o checkout deve respeitar
  // exatamente os itens salvos no carrinho. Isso evita que um checkout direto
  // antigo, como painel de TV, apareça no lugar de short + TV.
  if (origem === 'carrinho' || (!slug && carrinho.length)) {
    return carrinho;
  }

  // Quando existe produto na URL, é compra direta de um item específico.
  if (slug && PRODUTOS_CHECKOUT_JOBEE[slug]) {
    return [normalizarItem(PRODUTOS_CHECKOUT_JOBEE[slug])];
  }

  try {
    const compraDireta = JSON.parse(localStorage.getItem('jobee_direct_checkout') || 'null');
    if (compraDireta) return [normalizarItem(compraDireta)];
  } catch (error) {
    console.warn('Não foi possível ler checkout direto.', error);
  }

  if (carrinho.length) return carrinho;

  return [];
}

function renderizarItensCompra(itens) {
  const primeiroCard = document.querySelector('.purchase-item');
  if (!primeiroCard) return;

  if (!itens.length) {
    primeiroCard.outerHTML = `
      <div class="purchase-item purchase-item--empty">
        <div class="purchase-item__meta">
          <h3>Nenhum produto no checkout</h3>
          <p>Seu carrinho está vazio. Volte para a loja e adicione produtos antes de finalizar a compra.</p>
          <a class="btn-secondary" href="/">Voltar para a home</a>
        </div>
      </div>
    `;
    return;
  }

  primeiroCard.outerHTML = itens.map((item) => `
    <div class="purchase-item">
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="purchase-item__meta">
        <h3>${item.nome}</h3>
        <p><strong>Vendido por:</strong> <span>${item.vendedor}</span></p>
        <ul>
          <li>Cor: ${item.cor} • Tamanho: ${item.tamanho} • Quantidade: ${item.quantidade}</li>
          <li>${item.entrega}</li>
          <li>Compra com proteção, suporte e acompanhamento da Jobee.</li>
        </ul>
      </div>
      <div class="purchase-item__price">
        <strong>${moeda(item.preco * item.quantidade)}</strong>
        <small>${item.quantidade} x ${moeda(item.preco)}</small>
      </div>
    </div>
  `).join('');
}

function preencherResumo() {
  const itens = obterItensCompra();
  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);
  const desconto = subtotal >= 150 ? 12 : 0;
  const frete = subtotal >= 150 ? 0 : Math.max(...itens.map((item) => Number(item.frete || 0)), 0);
  const total = subtotal + frete - desconto;

  renderizarItensCompra(itens);

  const tituloProdutos = document.querySelector('.checkout-card__header h2');
  const descricaoProdutos = document.querySelector('.checkout-card__header p');
  const tagCompra = document.querySelector('.checkout-card__header .tag-soft');

  if (tituloProdutos) tituloProdutos.textContent = itens.length > 1 ? 'Produtos selecionados' : 'Produto selecionado';
  if (descricaoProdutos) descricaoProdutos.textContent = itens.length > 1
    ? 'Resumo dos itens que vieram do seu carrinho.'
    : 'Resumo do item que você escolheu na página do produto.';
  if (tagCompra) tagCompra.textContent = itens.length > 1 ? 'Carrinho' : 'Compra imediata';

  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotal = document.getElementById('summaryTotal');
  const heroTotal = document.getElementById('heroTotal');
  const heroItems = document.getElementById('heroItems');

  if (summarySubtotal) summarySubtotal.textContent = moeda(subtotal);
  if (summaryShipping) summaryShipping.textContent = frete === 0 ? 'Grátis' : moeda(frete);
  if (summaryDiscount) summaryDiscount.textContent = desconto ? `- ${moeda(desconto)}` : moeda(0);
  if (summaryTotal) summaryTotal.textContent = moeda(total);
  if (heroTotal) heroTotal.textContent = moeda(total);
  if (heroItems) heroItems.textContent = `${quantidadeTotal} ${quantidadeTotal > 1 ? 'itens' : 'item'}`;
}

function preencherUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('jobee_user') || 'null');
    if (!usuario) return;
    const nomeInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    if (nomeInput && usuario.nome) nomeInput.value = usuario.nome;
    if (emailInput && usuario.email) emailInput.value = usuario.email;
  } catch (error) {
    console.warn('Não foi possível preencher dados do usuário.', error);
  }
}

function vincularFormulario() {
  const form = document.getElementById('checkoutForm');
  const backButton = document.getElementById('backToProduct');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const itens = obterItensCompra();

    if (!itens.length) {
      const mensagemErro = 'Adicione pelo menos um produto ao carrinho antes de finalizar a compra.';
      if (typeof window.showToast === 'function') window.showToast(mensagemErro, 'error');
      else alert(mensagemErro);
      return;
    }

    const mensagem = 'Pedido confirmado com sucesso! Próximo passo: salvar o pedido no backend.';

    if (typeof window.showToast === 'function') {
      window.showToast(mensagem, 'success');
    } else {
      alert(mensagem);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  preencherResumo();
  preencherUsuario();
  vincularFormulario();
});

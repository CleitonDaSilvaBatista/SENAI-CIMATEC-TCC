
const PRODUTOS_JOBEE = {
  shorts: {
    id: 'produto-demo-bermuda', categoria: 'Moda', subcategoria: 'Masculino', trilha: 'Bermudas',
    titulo: 'Kit 4 Bermuda Masculina Short Moletom Leve Caminhada Atacado com Bolso Academia',
    tituloCurto: 'Kit 4 Bermudas', imagem: '/img/shorts.webp', imagens: ['/img/shorts.webp','/img/bermuda1.webp','/img/bermuda2.webp','/img/bermuda3.webp','/img/bermuda4.webp'],
    preco: 67.85, precoAntigo: 'R$ 79,99', parcelas: '12x R$ 6,68', desconto: '25% OFF', vendidos: '100+ vendidos', avaliacao: '4.8', avaliacoes: '8.985 avaliações',
    frete: 'R$ 9,90 • Prazo: 2 a 5 dias úteis', estoque: '10 unidades', vendedor: 'Loja Demo', vendas: '15.4k vendas',
    descricao: 'Kit com bermudas masculinas em moletom leve, indicado para caminhada, academia, lazer e uso casual. Possui bolso, cós com elástico e acabamento confortável para o dia a dia.',
    bullets: ['Tecido leve e confortável', 'Bolso lateral funcional', 'Cós com elástico e cordão', 'Ideal para academia, caminhada e lazer', 'Garantia do fabricante: 30 dias contra defeitos'],
    specs: [['Peso','800g (kit)'], ['Marca','Loja Demo'], ['Garantia','30 dias'], ['Material','Moletom leve'], ['Tipo de Fecho','Elástico com cordão'], ['Origem','Nacional']],
    cores: ['Preto','Branco','Cinza'], tamanhos: ['P','M','G','GG']
  },
  tv: {
    id: 'produto-demo-tv', categoria: 'Tecnologia', subcategoria: 'TV e Vídeo', trilha: 'Smart TV',
    titulo: 'Smart TV TCL 65 Polegadas QLED 4K P7K WiFi Bluetooth Google TV HDR10+ Dolby Atmos Dolby Vision 65P7K',
    tituloCurto: 'Smart TV TCL 65” QLED 4K', imagem: '/img/tv.webp', imagens: ['/img/tv.webp'],
    preco: 2867.90, precoAntigo: 'R$ 3.299,90', parcelas: '10x R$ 286,79 sem juros', desconto: '15% OFF', vendidos: '80+ vendidos', avaliacao: '4.7', avaliacoes: '1.248 avaliações',
    frete: 'Frete grátis • Prazo: 3 a 7 dias úteis', estoque: '6 unidades', vendedor: 'Tech Vision Store', vendas: '8.2k vendas',
    descricao: 'Smart TV TCL de 65 polegadas com painel QLED 4K, Google TV, conexão Wi-Fi, Bluetooth, HDR10+, Dolby Vision e Dolby Atmos para uma experiência completa de imagem e som.',
    bullets: ['Tela QLED 65 polegadas com resolução 4K', 'Google TV com apps de streaming', 'Wi-Fi e Bluetooth integrados', 'HDR10+, Dolby Vision e Dolby Atmos', 'Ideal para filmes, séries, esportes e games'],
    specs: [['Tela','65 polegadas'], ['Resolução','4K UHD'], ['Sistema','Google TV'], ['Conectividade','Wi-Fi e Bluetooth'], ['Áudio','Dolby Atmos'], ['Garantia','12 meses']],
    cores: ['Preto'], tamanhos: ['65 polegadas']
  },
  ferramentas: {
    id: 'produto-demo-ferramentas', categoria: 'Ferramentas', subcategoria: 'Kits', trilha: 'Maleta de ferramentas',
    titulo: 'Jogo de Ferramentas 200 Peças Maleta Resistente Completa uso profissional Titanium Platina',
    tituloCurto: 'Jogo de Ferramentas 200 Peças', imagem: '/img/ferramenta.webp', imagens: ['/img/ferramenta.webp'],
    preco: 59.90, precoAntigo: 'R$ 89,90', parcelas: '12x R$ 5,90', desconto: '33% OFF', vendidos: '250+ vendidos', avaliacao: '4.6', avaliacoes: '2.031 avaliações',
    frete: 'Frete grátis • Prazo: 2 a 6 dias úteis', estoque: '18 unidades', vendedor: 'Titanium Platina', vendas: '12.7k vendas',
    descricao: 'Maleta completa com 200 peças para reparos, montagem e manutenção. Produto indicado para uso doméstico, profissional leve e organização de ferramentas em um único kit.',
    bullets: ['200 peças variadas', 'Maleta resistente para transporte', 'Ideal para casa, oficina e manutenção', 'Peças organizadas por compartimento', 'Ótimo custo-benefício'],
    specs: [['Quantidade','200 peças'], ['Maleta','Resistente'], ['Uso','Doméstico e profissional'], ['Material','Aço e plástico reforçado'], ['Garantia','90 dias'], ['Peso','Aprox. 2kg']],
    cores: ['Padrão'], tamanhos: ['Kit 200 peças']
  },
  'painel-tv': {
    id: 'produto-demo-painel', categoria: 'Casa e Móveis', subcategoria: 'Sala', trilha: 'Painel para TV',
    titulo: 'Painel para TV até 55 Polegadas Paris com Efeito Ripado — Design Moderno e Sofisticado em Promoção',
    tituloCurto: 'Painel Paris para TV até 55”', imagem: '/img/painel.webp', imagens: ['/img/painel.webp'],
    preco: 349.00, precoAntigo: 'R$ 429,00', parcelas: '6x R$ 58,17 sem juros', desconto: '19% OFF', vendidos: '60+ vendidos', avaliacao: '4.5', avaliacoes: '876 avaliações',
    frete: 'Frete grátis • Prazo: 4 a 9 dias úteis', estoque: '9 unidades', vendedor: 'Casa Paris Móveis', vendas: '4.5k vendas',
    descricao: 'Painel para TV de até 55 polegadas com efeito ripado, visual moderno e acabamento sofisticado para deixar a sala mais organizada e elegante.',
    bullets: ['Compatível com TVs até 55 polegadas', 'Efeito ripado decorativo', 'Design moderno para sala', 'Organiza cabos e equipamentos', 'Produto indicado para ambientes residenciais'],
    specs: [['Compatibilidade','TV até 55 polegadas'], ['Ambiente','Sala'], ['Acabamento','Efeito ripado'], ['Material','MDP/MDF'], ['Garantia','90 dias'], ['Montagem','Recomendada por profissional']],
    cores: ['Madeira'], tamanhos: ['Até 55 polegadas']
  },
  espelho: {
    id: 'produto-demo-espelho', categoria: 'Casa e Móveis', subcategoria: 'Decoração', trilha: 'Espelhos',
    titulo: 'Espelho Vidrex Pisa 70x50cm Retangular Decorativo Elegante Contemporâneo Luxo & Sofisticação',
    tituloCurto: 'Espelho Vidrex Pisa 70x50cm', imagem: '/img/espelho.webp', imagens: ['/img/espelho.webp'],
    preco: 58.10, precoAntigo: 'R$ 79,90', parcelas: '2x R$ 29,05 sem juros', desconto: '27% OFF', vendidos: '120+ vendidos', avaliacao: '4.7', avaliacoes: '943 avaliações',
    frete: 'Frete grátis • Prazo: 3 a 8 dias úteis', estoque: '14 unidades', vendedor: 'Vidrex Decor', vendas: '6.1k vendas',
    descricao: 'Espelho retangular decorativo 70x50cm, ideal para quartos, banheiros, corredores e ambientes modernos. Une praticidade com acabamento elegante.',
    bullets: ['Formato retangular 70x50cm', 'Design decorativo contemporâneo', 'Ideal para quarto, banheiro e sala', 'Instalação simples', 'Acabamento elegante'],
    specs: [['Dimensão','70x50cm'], ['Formato','Retangular'], ['Uso','Decorativo'], ['Ambientes','Quarto, sala e banheiro'], ['Garantia','30 dias'], ['Material','Vidro espelhado']],
    cores: ['Espelhado'], tamanhos: ['70x50cm']
  },
  'mesa-cadeiras': {
    id: 'produto-demo-mesa-cadeiras', categoria: 'Casa e Móveis', subcategoria: 'Sala de jantar', trilha: 'Conjunto mesa e cadeira',
    titulo: 'Conjunto Mesa com Cadeiras para Sala de Jantar — Festival de Inverno Jobee',
    tituloCurto: 'Conjunto Mesa e Cadeiras', imagem: '/img/conjuntomesa.webp', imagens: ['/img/conjuntomesa.webp'],
    preco: 1874.14, precoAntigo: 'R$ 2.019,90', parcelas: '18x sem juros', desconto: '7% OFF', vendidos: '35+ vendidos', avaliacao: '4.8', avaliacoes: '512 avaliações',
    frete: 'Envio rápido • Prazo: 5 a 10 dias úteis', estoque: '4 unidades', vendedor: 'Lar Quentinho Móveis', vendas: '3.4k vendas',
    descricao: 'Conjunto de mesa com cadeiras para deixar a sala de jantar mais completa, confortável e elegante. Ideal para famílias e ambientes modernos.',
    bullets: ['Conjunto completo para sala de jantar', 'Design moderno', 'Boa estrutura para uso diário', 'Acabamento sofisticado', 'Ideal para compor ambientes familiares'],
    specs: [['Produto','Mesa com cadeiras'], ['Ambiente','Sala de jantar'], ['Garantia','90 dias'], ['Entrega','Transportadora'], ['Montagem','Recomendada por profissional'], ['Condição','Novo']],
    cores: ['Madeira'], tamanhos: ['Conjunto completo']
  },
  smartwatch: {
    id: 'produto-demo-smartwatch', categoria: 'Tecnologia', subcategoria: 'Wearables', trilha: 'Smartwatch',
    titulo: 'Smartwatch PEJE ZW04 com Recursos Inteligentes, Monitoramento e Conectividade',
    tituloCurto: 'Smartwatch PEJE ZW04', imagem: '/img/relogio.png', imagens: ['/img/relogio.png'],
    preco: 669.99, precoAntigo: 'R$ 905,87', parcelas: '12x sem juros', desconto: '26% OFF', vendidos: '180+ vendidos', avaliacao: '4.6', avaliacoes: '1.732 avaliações',
    frete: 'Entrega expressa • Prazo: 2 a 5 dias úteis', estoque: '22 unidades', vendedor: 'Peje Oficial', vendas: '9.8k vendas',
    descricao: 'Smartwatch com recursos inteligentes para rotina, treino e notificações. Produto ideal para quem busca tecnologia, praticidade e acompanhamento no dia a dia.',
    bullets: ['Monitoramento de atividades', 'Notificações inteligentes', 'Design moderno', 'Boa autonomia de bateria', 'Compatível com uso diário e treinos'],
    specs: [['Modelo','PEJE ZW04'], ['Categoria','Smartwatch'], ['Conectividade','Bluetooth'], ['Uso','Rotina e treino'], ['Garantia','90 dias'], ['Condição','Novo']],
    cores: ['Preto'], tamanhos: ['Único']
  },
  'placa-video': {
    id: 'produto-demo-rtx5070ti', categoria: 'Tecnologia', subcategoria: 'Informática', trilha: 'Placa de vídeo',
    titulo: 'Placa de Vídeo NVIDIA RTX 5070 Ti 16GB GDDR6 para Alto Desempenho',
    tituloCurto: 'NVIDIA RTX 5070 Ti 16GB', imagem: '/img/placa de video.png', imagens: ['/img/placa de video.png'],
    preco: 6899.90, precoAntigo: 'R$ 7.149,90', parcelas: '10x sem juros', desconto: '3% OFF', vendidos: '25+ vendidos', avaliacao: '4.9', avaliacoes: '389 avaliações',
    frete: 'Frete grátis • Prazo: 3 a 7 dias úteis', estoque: '3 unidades', vendedor: 'Hardware Pro', vendas: '5.9k vendas',
    descricao: 'Placa de vídeo NVIDIA RTX 5070 Ti com 16GB GDDR6, indicada para jogos, edição, renderização e tarefas de alto desempenho gráfico.',
    bullets: ['16GB GDDR6', 'Alto desempenho para games e criação', 'Indicada para setup gamer e profissional', 'Boa opção para renderização', 'Produto novo com garantia'],
    specs: [['Chipset','NVIDIA RTX 5070 Ti'], ['Memória','16GB GDDR6'], ['Uso','Games, edição e renderização'], ['Condição','Novo'], ['Garantia','12 meses'], ['Categoria','Hardware']],
    cores: ['Padrão'], tamanhos: ['16GB']
  }
};

function formatarPrecoJobee(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function slugProdutoAtual() {
  const slugDaPagina = document.body?.dataset?.produtoSlug;
  if (slugDaPagina) return slugDaPagina;

  const partes = window.location.pathname.split('/').filter(Boolean);
  if (partes[0] === 'produto' && partes[1]) return decodeURIComponent(partes[1]);

  const arquivo = (partes[partes.length - 1] || '').replace('.html', '');
  const mapaArquivos = {
    'produto-shorts': 'shorts',
    'produto-tv': 'tv',
    'produto-ferramentas': 'ferramentas',
    'produto-painel-tv': 'painel-tv',
    'produto-espelho': 'espelho',
    'produto-mesa-cadeiras': 'mesa-cadeiras',
    'produto-smartwatch': 'smartwatch',
    'produto-placa-video': 'placa-video'
  };

  return mapaArquivos[arquivo] || 'shorts';
}

function aplicarProdutoPorRota() {
  const slug = slugProdutoAtual();
  const produto = PRODUTOS_JOBEE[slug] || PRODUTOS_JOBEE.shorts;
  window.produtoJobeeAtual = produto;

  document.title = `${produto.tituloCurto} | Jobee`;

  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `<a href="/">Home</a> &gt; <a href="#">${produto.categoria}</a> &gt; <a href="#">${produto.subcategoria}</a> &gt; <a href="#">${produto.trilha}</a> &gt; <span>${produto.tituloCurto}</span>`;
  }

  const imgPrincipal = document.getElementById('img-principal');
  if (imgPrincipal) {
    imgPrincipal.src = produto.imagem;
    imgPrincipal.alt = produto.tituloCurto;
  }

  const thumbs = document.querySelector('.thumbs');
  if (thumbs) {
    thumbs.innerHTML = produto.imagens.map((img, index) => `<img src="${img}" alt="${produto.tituloCurto}" class="${index === 0 ? 'active' : ''}" onclick="trocarImagem(this.src, this)" />`).join('');
  }

  const titulo = document.querySelector('.product-title');
  if (titulo) titulo.textContent = produto.titulo;

  const rating = document.querySelector('.rating');
  if (rating) rating.innerHTML = `<i class="fas fa-star"></i> ${produto.avaliacao}`;

  const sold = document.querySelector('.sold');
  if (sold) sold.textContent = produto.vendidos;

  const big = document.querySelector('.price .big');
  if (big) big.textContent = formatarPrecoJobee(produto.preco);

  const installments = document.querySelector('.installments');
  if (installments) installments.textContent = `ou ${produto.parcelas}`;

  const oldPrice = document.querySelector('.price-row .old-price');
  if (oldPrice) oldPrice.textContent = `De ${produto.precoAntigo}`;

  const discount = document.querySelector('.discount-badge');
  if (discount) discount.textContent = produto.desconto;

  const shippingText = document.querySelector('.shipping-info p');
  if (shippingText) shippingText.innerHTML = `<strong>Frete</strong>: ${produto.frete}`;

  const desc = document.querySelector('#descricao p');
  if (desc) desc.textContent = produto.descricao;

  const lista = document.querySelector('#descricao ul');
  if (lista) lista.innerHTML = produto.bullets.map(item => `<li>${item}</li>`).join('');

  const detalhes = document.querySelector('#detalhes table');
  if (detalhes) detalhes.innerHTML = produto.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const ratingCount = document.querySelector('.rating-count');
  if (ratingCount) ratingCount.textContent = produto.avaliacoes;

  const ratingValue = document.querySelector('.rating-value');
  if (ratingValue) ratingValue.textContent = produto.avaliacao;

  const colorOptions = document.querySelector('.color-options');
  if (colorOptions) {
    colorOptions.innerHTML = produto.cores.map((cor, index) => `<button class="color ${index === 0 ? 'active' : ''}" data-color="${cor}" data-images='${JSON.stringify(produto.imagens.map(img => img.replace('/img/', '')))}'>${cor}</button>`).join('');
  }

  const sizeOptions = document.querySelector('.size-options');
  if (sizeOptions) {
    sizeOptions.innerHTML = produto.tamanhos.map((tam, index) => `<button class="size ${index === 0 ? 'active' : ''}" data-size="${tam}">${tam}</button>`).join('');
  }

  const stock = document.querySelector('.stock');
  if (stock) stock.innerHTML = `<i class="fas fa-box"></i> Estoque disponível: <strong>${produto.estoque}</strong>`;

  const sellerTitle = document.querySelector('.seller-box h4');
  if (sellerTitle) sellerTitle.innerHTML = `Vendido por <a href="#">${produto.vendedor}</a>`;

  const sellerVendas = document.querySelector('.seller-info p');
  if (sellerVendas) sellerVendas.textContent = produto.vendas;
}

function trocarImagem(src, element) {
  const img = document.getElementById('img-principal');
  if (img) img.src = src;

  const thumbs = document.querySelectorAll('.thumbs img');
  thumbs.forEach((thumb) => thumb.classList.remove('active'));
  if (element) element.classList.add('active');
}

function setupRelatedCarousel() {
  const carrossel = document.querySelector('.related-carousel');
  const setaEsquerda = document.querySelector('.related-carousel-seta.esquerda');
  const setaDireita = document.querySelector('.related-carousel-seta.direita');

  if (!carrossel || !setaEsquerda || !setaDireita) return;

  const cards = document.querySelectorAll('.related-card');
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth + 30;
  let scrollPosition = 0;
  let maxScroll = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);

  function updateArrowVisibility() {
    maxScroll = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);
    setaEsquerda.style.opacity = scrollPosition <= 0 ? '0.5' : '1';
    setaDireita.style.opacity = scrollPosition >= maxScroll ? '0.5' : '1';
    setaEsquerda.style.cursor = scrollPosition <= 0 ? 'not-allowed' : 'pointer';
    setaDireita.style.cursor = scrollPosition >= maxScroll ? 'not-allowed' : 'pointer';
  }

  setaDireita.addEventListener('click', function () {
    scrollPosition += cardWidth * 2;
    scrollPosition = Math.min(scrollPosition, maxScroll);
    carrossel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateArrowVisibility();
  });

  setaEsquerda.addEventListener('click', function () {
    scrollPosition -= cardWidth * 2;
    scrollPosition = Math.max(scrollPosition, 0);
    carrossel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateArrowVisibility();
  });

  carrossel.addEventListener('scroll', function () {
    scrollPosition = carrossel.scrollLeft;
    updateArrowVisibility();
  });

  let startX = null;
  carrossel.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  });

  carrossel.addEventListener('touchend', function (e) {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) setaDireita.click();
      else setaEsquerda.click();
    }

    startX = null;
  });

  updateArrowVisibility();

  window.addEventListener('resize', function () {
    const newMax = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);
    if (scrollPosition > newMax) {
      scrollPosition = newMax;
      carrossel.scrollLeft = scrollPosition;
    }
    updateArrowVisibility();
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      tabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });
}

function setupColorSelection() {
  const colorButtons = document.querySelectorAll('.color');
  if (!colorButtons.length) return;

  colorButtons.forEach((button) => {
    button.addEventListener('click', function () {
      colorButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');

      const imagesData = this.getAttribute('data-images');
      if (!imagesData) return;

      try {
        const imgs = JSON.parse(imagesData);
        if (Array.isArray(imgs) && imgs.length > 0) {
          const basePath = '/img/';
          trocarImagem(basePath + imgs[0], document.querySelector('.thumbs img.active') || null);
        }
      } catch (e) {
        console.warn('Não foi possível atualizar imagens da cor selecionada.', e);
      }
    });
  });
}

function setupSizeSelection() {
  const sizeButtons = document.querySelectorAll('.size');
  if (!sizeButtons.length) return;

  sizeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      sizeButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function setupQuantityControl() {
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  const quantityInput = document.getElementById('quantidade');
  if (!minusBtn || !plusBtn || !quantityInput) return;

  minusBtn.addEventListener('click', function () {
    const value = parseInt(quantityInput.value, 10) || 1;
    if (value > 1) quantityInput.value = value - 1;
  });

  plusBtn.addEventListener('click', function () {
    const value = parseInt(quantityInput.value, 10) || 1;
    if (value < parseInt(quantityInput.max || '10', 10)) quantityInput.value = value + 1;
  });
}
function obterDadosProdutoAtual() {
  const titulo = document.querySelector('.product-title')?.textContent?.trim() || 'Produto Jobee';
  const precoTexto = document.querySelector('.price .big')?.textContent?.trim() || '0,00';
  const preco = Number(precoTexto.replace(/\./g, '').replace(',', '.')) || 0;
  const imagem = document.getElementById('img-principal')?.getAttribute('src') || '/img/shorts.webp';
  const cor = document.querySelector('.color.active')?.getAttribute('data-color') || 'Padrão';
  const tamanho = document.querySelector('.size.active')?.getAttribute('data-size') || 'Único';
  const quantidade = Number(document.getElementById('quantidade')?.value || 1);
  const freteTexto = document.querySelector('.shipping-info strong + text');
  const vendedor = document.querySelector('.seller-box h4 a')?.textContent?.trim() || 'Loja Jobee';

  return {
    id: (window.produtoJobeeAtual && window.produtoJobeeAtual.id) || 'produto-demo-bermuda',
    nome: titulo,
    preco,
    imagem,
    cor,
    tamanho,
    quantidade,
    vendedor,
    entrega: 'Entrega estimada entre 2 e 5 dias úteis',
    frete: 9.9,
    slug: slugProdutoAtual()
  };
}

function criarModalRedirecionamento() {
  const modal = document.createElement('div');
  modal.className = 'redirect-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="redirect-modal__backdrop"></div>
    <div class="redirect-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="redirectTitle">
      <div class="redirect-modal__icon">
        <i class="fas fa-bag-shopping"></i>
      </div>
      <h3 id="redirectTitle">Redirecionando para a compra</h3>
      <p>Estamos preparando o seu checkout com as opções selecionadas para você finalizar em poucos segundos.</p>
      <div class="redirect-modal__progress">
        <span></span>
      </div>
      <small>Você será levado para a página de compra automaticamente.</small>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function exibirModalRedirecionamento(produto) {
  let modal = document.querySelector('.redirect-modal');
  if (!modal) modal = criarModalRedirecionamento();

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  localStorage.setItem(typeof window.obterChaveCheckoutDireto === 'function' ? window.obterChaveCheckoutDireto() : 'jobee_direct_checkout_visitante', JSON.stringify(produto));

  window.setTimeout(() => {
    window.location.href = '/compra';
  }, 1800);
}


function mostrarToastProduto(mensagem, tipo = 'success') {
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  Object.assign(container.style, {
    position: 'fixed',
    right: '22px',
    bottom: '22px',
    zIndex: '999999',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    pointerEvents: 'none'
  });

  const toast = document.createElement('div');
  toast.className = `toast ${tipo} produto-toast`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast-icon">${tipo === 'success' ? '✔️' : '❌'}</div>
    <div class="toast-content">
      <div class="toast-title">${tipo === 'success' ? 'Produto adicionado' : 'Atenção'}</div>
      <div class="toast-message">${mensagem}</div>
    </div>
    <button class="toast-close" type="button" aria-label="Fechar aviso">&times;</button>
    <div class="toast-progress"></div>
  `;

  Object.assign(toast.style, {
    minWidth: '300px',
    maxWidth: '380px',
    background: '#ffffff',
    color: '#173f32',
    borderLeft: tipo === 'success' ? '5px solid #308668' : '5px solid #ef4444',
    borderRadius: '14px',
    boxShadow: '0 16px 38px rgba(15, 23, 42, 0.18)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'auto',
    transform: 'translateX(115%)',
    opacity: '0',
    transition: 'transform .28s ease, opacity .28s ease'
  });

  const progress = toast.querySelector('.toast-progress');
  if (progress) {
    Object.assign(progress.style, {
      position: 'absolute',
      left: '0',
      bottom: '0',
      height: '3px',
      width: '100%',
      background: tipo === 'success' ? '#308668' : '#ef4444',
      transition: 'width 2.8s linear'
    });
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
    if (progress) progress.style.width = '0%';
  });

  const fecharToast = () => {
    toast.style.transform = 'translateX(115%)';
    toast.style.opacity = '0';
    window.setTimeout(() => toast.remove(), 280);
  };

  toast.querySelector('.toast-close')?.addEventListener('click', fecharToast);
  window.setTimeout(fecharToast, 3000);
}

function salvarProdutoAtualNoCarrinho() {
  const produto = obterDadosProdutoAtual();

  if (typeof window.adicionarItemCarrinho === 'function') {
    window.adicionarItemCarrinho(produto);
  } else {
    const chaveCarrinho = typeof window.obterChaveCarrinho === 'function' ? window.obterChaveCarrinho() : 'jobee_cart_visitante';
    const carrinhoAtual = JSON.parse(localStorage.getItem(chaveCarrinho) || '[]');
    const chave = `${produto.id}|${produto.cor}|${produto.tamanho}`;
    const itemExistente = carrinhoAtual.find((item) => `${item.id_item}|${item.cor || ''}|${item.tamanho || ''}` === chave);

    if (itemExistente) {
      itemExistente.quantidade = Number(itemExistente.quantidade || 1) + produto.quantidade;
    } else {
      carrinhoAtual.push({
        id_item: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        imagem_url: produto.imagem,
        nome_loja: produto.vendedor,
        cor: produto.cor,
        tamanho: produto.tamanho,
        tipo: 'produto'
      });
    }

    localStorage.setItem(chaveCarrinho, JSON.stringify(carrinhoAtual));
  }

  if (typeof updateCartBadge === 'function') updateCartBadge();
  return produto;
}

function adicionarAoCarrinho() {
  if (!exigirLoginParaCarrinho()) {
    return;
  }

  salvarProdutoAtualNoCarrinho();
  mostrarToastProduto('Produto adicionado ao carrinho!', 'success');
}

function comprarAgora() {
  if (!exigirLoginParaCarrinho()) {
    return;
  }

  const produto = salvarProdutoAtualNoCarrinho();
  localStorage.setItem(typeof window.obterChaveCheckoutDireto === 'function' ? window.obterChaveCheckoutDireto() : 'jobee_direct_checkout_visitante', JSON.stringify(produto));
  mostrarToastProduto('Produto adicionado ao carrinho!', 'success');

  window.setTimeout(() => {
    window.location.href = `/compra?produto=${encodeURIComponent(slugProdutoAtual())}`;
  }, 900);
}

function setupBuyButtons() {
  const btnComprar = document.getElementById('btn-comprar');
  const btnCarrinho = document.getElementById('btn-carrinho');

  if (btnComprar) {
    btnComprar.addEventListener('click', comprarAgora);
  }

  if (btnCarrinho) {
    btnCarrinho.addEventListener('click', adicionarAoCarrinho);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  aplicarProdutoPorRota();
  setupTabs();
  setupColorSelection();
  setupSizeSelection();
  setupQuantityControl();
  setupBuyButtons();
  setupRelatedCarousel();
});

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
          const basePath = 'img/';
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
  const imagem = document.getElementById('img-principal')?.getAttribute('src') || 'img/shorts.webp';
  const cor = document.querySelector('.color.active')?.getAttribute('data-color') || 'Padrão';
  const tamanho = document.querySelector('.size.active')?.getAttribute('data-size') || 'Único';
  const quantidade = Number(document.getElementById('quantidade')?.value || 1);
  const freteTexto = document.querySelector('.shipping-info strong + text');
  const vendedor = document.querySelector('.seller-box h4 a')?.textContent?.trim() || 'Loja Jobee';

  return {
    id: 'produto-demo-bermuda',
    nome: titulo,
    preco,
    imagem,
    cor,
    tamanho,
    quantidade,
    vendedor,
    entrega: 'Entrega estimada entre 2 e 5 dias úteis',
    frete: 9.9
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

  localStorage.setItem('jobee_direct_checkout', JSON.stringify(produto));

  window.setTimeout(() => {
    window.location.href = '/compra';
  }, 1800);
}

function adicionarAoCarrinho() {
  if (!exigirLoginParaCarrinho()) {
    return;
  }

  const produto = obterDadosProdutoAtual();
  const carrinhoAtual = JSON.parse(localStorage.getItem('jobee_cart') || '[]');
  const itemExistente = carrinhoAtual.find(
    (item) => item.id_item === produto.id && item.cor === produto.cor && item.tamanho === produto.tamanho
  );

  if (itemExistente) {
    itemExistente.quantidade += produto.quantidade;
  } else {
    carrinhoAtual.push({
      id_item: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem_url: produto.imagem,
      nome_loja: produto.vendedor,
      cor: produto.cor,
      tamanho: produto.tamanho
    });
  }

  localStorage.setItem('jobee_cart', JSON.stringify(carrinhoAtual));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  showToast('Produto adicionado ao carrinho!', 'success');
}

function setupBuyButtons() {
  const btnComprar = document.getElementById('btn-comprar');
  const btnCarrinho = document.getElementById('btn-carrinho');

  if (btnComprar) {
    btnComprar.addEventListener('click', function () {
      const produto = obterDadosProdutoAtual();
      exibirModalRedirecionamento(produto);
    });
  }

  if (btnCarrinho) {
    btnCarrinho.addEventListener('click', adicionarAoCarrinho);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupTabs();
  setupColorSelection();
  setupSizeSelection();
  setupQuantityControl();
  setupBuyButtons();
  setupRelatedCarousel();
});

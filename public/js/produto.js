// js/produto.js

// Trocar imagem principal
function trocarImagem(src, element) {
  const img = document.getElementById('img-principal');
  if (img) {
    img.src = src;
  }

  // Remover classe active de todas as miniaturas
  const thumbs = document.querySelectorAll('.thumbs img');
  thumbs.forEach(thumb => thumb.classList.remove('active'));

  // Adicionar classe active à miniatura clicada
  if (element) element.classList.add('active');
}

// Configurar carrossel de produtos relacionados
function setupRelatedCarousel() {
  const carrossel = document.querySelector('.related-carousel');
  const setaEsquerda = document.querySelector('.related-carousel-seta.esquerda');
  const setaDireita = document.querySelector('.related-carousel-seta.direita');

  if (!carrossel || !setaEsquerda || !setaDireita) {
    console.log('Elementos do carrossel não encontrados');
    return;
  }

  const cards = document.querySelectorAll('.related-card');
  if (cards.length === 0) {
    console.log('Nenhum card encontrado no carrossel');
    return;
  }

  const cardWidth = cards[0].offsetWidth + 30; // largura + gap (ajuste conforme CSS)
  let scrollPosition = 0;
  let maxScroll = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);

  console.log('Carrossel inicializado:', { cardWidth, maxScroll, cards: cards.length });

  function updateArrowVisibility() {
    maxScroll = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);
    setaEsquerda.style.opacity = scrollPosition <= 0 ? '0.5' : '1';
    setaDireita.style.opacity = scrollPosition >= maxScroll ? '0.5' : '1';

    setaEsquerda.style.cursor = scrollPosition <= 0 ? 'not-allowed' : 'pointer';
    setaDireita.style.cursor = scrollPosition >= maxScroll ? 'not-allowed' : 'pointer';
  }

  // Botão direita
  setaDireita.addEventListener('click', function() {
    scrollPosition += cardWidth * 2; // Avança 2 cards
    scrollPosition = Math.min(scrollPosition, maxScroll);
    carrossel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateArrowVisibility();
  });

  // Botão esquerda
  setaEsquerda.addEventListener('click', function() {
    scrollPosition -= cardWidth * 2; // Retrocede 2 cards
    scrollPosition = Math.max(scrollPosition, 0);
    carrossel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateArrowVisibility();
  });

  // Atualizar baseado no scroll
  carrossel.addEventListener('scroll', function() {
    scrollPosition = carrossel.scrollLeft;
    updateArrowVisibility();
  });

  // Swipe para mobile
  let startX = null;
  carrossel.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  });

  carrossel.addEventListener('touchend', function(e) {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) setaDireita.click();
      else setaEsquerda.click();
    }

    startX = null;
  });

  // Inicializar visibilidade das setas
  updateArrowVisibility();

  // Ajustar no resize da janela
  window.addEventListener('resize', function() {
    const newMax = Math.max(0, carrossel.scrollWidth - carrossel.clientWidth);
    if (scrollPosition > newMax) {
      scrollPosition = newMax;
      carrossel.scrollLeft = scrollPosition;
    }
    updateArrowVisibility();
  });
}

// Alternar entre abas
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabs.length === 0) {
    console.log('Abas não encontradas');
    return;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');

      // Remover classe active de todas as abas e conteúdos
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Adicionar classe active à aba e conteúdo clicados
      this.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });
}

// Seleção de cor
function setupColorSelection() {
  const colorButtons = document.querySelectorAll('.color');
  if (colorButtons.length === 0) {
    console.log('Botões de cor não encontrados');
    return;
  }

  colorButtons.forEach(button => {
    button.addEventListener('click', function() {
      colorButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // opcional: atualizar thumbs com imagens da cor (se quiser)
      const imagesData = this.getAttribute('data-images');
      if (imagesData) {
        try {
          const imgs = JSON.parse(imagesData);
          if (Array.isArray(imgs) && imgs.length > 0) {
            const basePath = 'img/'; // ajuste se suas imagens estiverem em outra pasta
            trocarImagem(basePath + imgs[0], document.querySelector('.thumbs img.active') || null);
            // você pode reconstruir as miniaturas aqui se quiser
          }
        } catch (e) {
          // data-images pode não estar JSON válido — ignore
        }
      }
    });
  });
}

// Seleção de tamanho
function setupSizeSelection() {
  const sizeButtons = document.querySelectorAll('.size');
  if (sizeButtons.length === 0) {
    console.log('Botões de tamanho não encontrados');
    return;
  }

  sizeButtons.forEach(button => {
    button.addEventListener('click', function() {
      sizeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Controle de quantidade
function setupQuantityControl() {
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  const quantityInput = document.getElementById('quantidade');

  if (!minusBtn || !plusBtn || !quantityInput) {
    console.log('Controles de quantidade não encontrados');
    return;
  }

  minusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) || 1;
    if (value > 1) quantityInput.value = value - 1;
  });

  plusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) || 1;
    if (value < parseInt(quantityInput.max || 10)) quantityInput.value = value + 1;
  });
}

// Botões de compra
function setupBuyButtons() {
  const btnComprar = document.getElementById('btn-comprar');
  const btnCarrinho = document.getElementById('btn-carrinho');

  if (!btnComprar && !btnCarrinho) {
    console.log('Botões de compra não encontrados');
    return;
  }

  if (btnComprar) {
    btnComprar.addEventListener('click', function() {
      alert('Redirecionando para finalização da compra...');
      // Aqui você adicionaria a lógica de finalização de compra
    });
  }

  if (btnCarrinho) {
    btnCarrinho.addEventListener('click', function() {
      const selectedColor = document.querySelector('.color.active')?.getAttribute('data-color') || 'Não selecionada';
      const selectedSize = document.querySelector('.size.active')?.getAttribute('data-size') || 'Não selecionado';
      const quantity = document.getElementById('quantidade')?.value || 1;

      alert(`Produto adicionado ao carrinho!\nCor: ${selectedColor}\nTamanho: ${selectedSize}\nQuantidade: ${quantity}`);
      // Aqui você adicionaria a lógica de adicionar ao carrinho
    });
  }
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado - Inicializando funcionalidades...');

  setupTabs();
  setupColorSelection();
  setupSizeSelection();
  setupQuantityControl();
  setupBuyButtons();
  setupRelatedCarousel();

  console.log('Todas as funcionalidades inicializadas');
});

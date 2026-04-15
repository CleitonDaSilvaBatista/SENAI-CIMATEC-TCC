document.addEventListener('DOMContentLoaded', function() {
  carregarLojas();

  const btnExplorar = document.getElementById('btn-explorar');
  if (btnExplorar) {
    btnExplorar.addEventListener('click', () => {
      const servicosSection = document.querySelector('.servicos-micro-section');
      if (servicosSection) {
        servicosSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  console.log('Jobee - Site carregado com sucesso!');
});

// ===============================
// CARREGAR LOJAS
// ===============================
async function carregarLojas() {
  const grid = document.getElementById('servicos-micro-grid');
  if (!grid) return;

  try {
    const resposta = await fetch('/api/lojas');
    const lojas = await resposta.json();

    if (!resposta.ok) {
      throw new Error(lojas.error || 'Erro ao buscar lojas');
    }

    if (!lojas.length) {
      grid.innerHTML = '<p>Nenhuma loja cadastrada no momento.</p>';
      return;
    }

    grid.innerHTML = lojas.map(loja => `
      <div class="servico-micro-card" data-categoria="${inferirCategoria(loja.nome_fantasia)}">
        <div class="card-badge">${gerarBadge(loja.nome_fantasia)}</div>
        <img src="${loja.imagem_url || 'img/placeholder-loja.png'}" alt="${loja.nome_fantasia}">
        <div class="servico-micro-info">
          <h3>${loja.nome_fantasia}</h3>
          <p class="descricao">${loja.descricao || 'Sem descrição disponível.'}</p>
          <div class="servico-meta">
            <span class="distancia">📍 Negócio local</span>
            <span class="tempo">⏱️ Atendimento sob consulta</span>
          </div>
          <div class="servico-precos">
            <span class="servico-preco">Ver produtos e serviços</span>
          </div>
          <button class="btn-agendar" data-slug="${loja.slug}">
            Ver loja →
          </button>
        </div>
      </div>
    `).join('');

    ativarBotoesLojas();
    reiniciarFiltroCategorias();
  } catch (error) {
    console.error('Erro ao carregar lojas:', error);
    grid.innerHTML = '<p>Erro ao carregar lojas.</p>';
  }
}

function ativarBotoesLojas() {
  const botoes = document.querySelectorAll('.btn-agendar[data-slug]');

  botoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation();
      const slug = botao.getAttribute('data-slug');
      window.location.href = `/loja/${slug}`;
    });
  });
}

function inferirCategoria(nome) {
  const texto = (nome || '').toLowerCase();

  if (texto.includes('barbearia')) return 'barbearia';
  if (texto.includes('restaurante')) return 'restaurante';
  if (texto.includes('beleza') || texto.includes('salão') || texto.includes('studio')) return 'beleza';
  if (texto.includes('yoga') || texto.includes('harmonia') || texto.includes('zen')) return 'autocuidado';

  return 'loja';
}

function gerarBadge(nome) {
  const categoria = inferirCategoria(nome);

  const badges = {
    barbearia: '✂️ Barbearia',
    restaurante: '🍽️ Restaurante',
    beleza: '💅 Beleza & Estética',
    autocuidado: '🧘 Autocuidado',
    loja: '🏪 Loja parceira'
  };

  return badges[categoria] || '🏪 Negócio local';
}

function reiniciarFiltroCategorias() {
  const filterButtons = document.querySelectorAll('.cat-btn');
  const serviceCards = document.querySelectorAll('.servico-micro-card');

  if (filterButtons.length && serviceCards.length) {
    filterButtons.forEach(button => {
      button.onclick = () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const categoria = button.getAttribute('data-categoria');

        serviceCards.forEach(card => {
          const cardCategoria = card.getAttribute('data-categoria');

          if (categoria === 'todos' || cardCategoria === categoria) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });
  }
}

// ===============================
// HERO CARROSSEL
// ===============================
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-seta-esquerda');
  const nextBtn = document.getElementById('hero-seta-direita');
  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    if (!slides.length) return;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');

    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoPlay();
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoPlay();
  }

  function resetAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  const container = document.querySelector('.hero-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    });

    container.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
  }

  resetAutoPlay();
})();
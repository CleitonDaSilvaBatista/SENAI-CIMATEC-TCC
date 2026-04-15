// main.js - Interações gerais da página
document.addEventListener('DOMContentLoaded', function() {
  
  // Botão explorar serviços
  const btnExplorar = document.getElementById('btn-explorar');
  if (btnExplorar) {
    btnExplorar.addEventListener('click', () => {
      const servicosSection = document.querySelector('.servicos');
      if (servicosSection) {
        servicosSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Cards de serviço - clique para ver detalhes
  const cards = document.querySelectorAll('.card-servico');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const titulo = card.querySelector('h3')?.innerText || 'Serviço';
      alert(`Redirecionando para detalhes do serviço: ${titulo}`);
      // window.location.href = `/servico/${id}`;
    });
  });

  // Botão "Ver Serviços" individual
  const botoesVer = document.querySelectorAll('.ver');
  botoesVer.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Ver serviços disponíveis');
    });
  });

  console.log('Jobee - Site carregado com sucesso!');
});

// Hero Carrossel
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-seta-esquerda');
  const nextBtn = document.getElementById('hero-seta-direita');
  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    // Loop infinito
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    // Remove active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Adiciona active ao slide e dot atual
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

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  // Pausar autoplay no hover
  const container = document.querySelector('.hero-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    });
    container.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
  }

  // Iniciar autoplay
  resetAutoPlay();
})();
// Filtro de serviços por categoria
(function() {
  const filterButtons = document.querySelectorAll('.cat-btn');
  const serviceCards = document.querySelectorAll('.servico-micro-card');
  
  if (filterButtons.length && serviceCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona active ao clicado
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
      });
    });
  }
})();
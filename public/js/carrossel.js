// carrossel.js - Controle do carrossel de produtos
document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.getElementById('carrossel');
  const btnEsquerda = document.getElementById('seta-esquerda');
  const btnDireita = document.getElementById('seta-direita');

  if (carrossel && btnEsquerda && btnDireita) {
    btnEsquerda.addEventListener('click', () => {
      carrossel.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    });

    btnDireita.addEventListener('click', () => {
      carrossel.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    });
  }
});
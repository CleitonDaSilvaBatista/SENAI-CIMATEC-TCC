const carrossel = document.querySelector('.carrossel');
const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');

direita.addEventListener('click', () => {
  carrossel.scrollBy({ left: 400, behavior: 'smooth' });
});

esquerda.addEventListener('click', () => {
  carrossel.scrollBy({ left: -400, behavior: 'smooth' });
});
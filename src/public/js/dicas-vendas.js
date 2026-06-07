document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.dica-card');

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.06}s`;
    card.classList.add('dica-card-entrada');
  });
});

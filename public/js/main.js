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
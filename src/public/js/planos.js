document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('plano-modal');
  const modalTexto = document.getElementById('modal-plano-texto');
  const fechar = document.getElementById('plano-modal-close');
  const ok = document.getElementById('plano-modal-ok');
  const botoes = document.querySelectorAll('.plano-btn[data-plano]');

  if (!modal) return;

  function abrirModal(plano) {
    modalTexto.textContent = `Recebemos seu interesse no plano ${plano}. Em breve a equipe Jobee entrará em contato para continuar.`;
    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  botoes.forEach(botao => {
    botao.addEventListener('click', () => abrirModal(botao.dataset.plano));
  });

  fechar?.addEventListener('click', fecharModal);
  ok?.addEventListener('click', fecharModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) fecharModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('ativo')) fecharModal();
  });
});

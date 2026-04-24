(function () {
  function abrirModalLogin() {
    const modal = document.getElementById('modal-login');

    if (!modal) {
      console.error('Modal de login não encontrado na página. Verifique se existe o elemento #modal-login no HTML.');
      return;
    }

    modal.classList.remove('modal-hidden');
    modal.classList.add('active');
    modal.style.display = 'flex';
  }

  function fecharModalLogin() {
    const modal = document.getElementById('modal-login');

    if (!modal) return;

    modal.classList.remove('active');
    modal.classList.add('modal-hidden');
    modal.style.display = 'none';
  }

  window.exigirLoginParaCarrinho = function exigirLoginParaCarrinho() {
    const token = localStorage.getItem('jobee_token');

    if (token) return true;

    abrirModalLogin();
    return false;
  };

  document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'btn-login-agora') {
      window.location.href = '/login';
    }

    if (event.target && event.target.id === 'btn-login-depois') {
      fecharModalLogin();
    }
  });
})();

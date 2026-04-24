(function () {
  function abrirModalLogin() {
    const modal = document.getElementById('modal-login');
    if (!modal) return;

    modal.classList.add('ativo');
  }

  function fecharModalLogin() {
    const modal = document.getElementById('modal-login');
    if (!modal) return;

    modal.classList.remove('ativo');
  }

  window.exigirLoginParaCarrinho = function exigirLoginParaCarrinho() {
    const token = localStorage.getItem('jobee_token');

    if (token) return true;

    abrirModalLogin();
    return false;
  };

  document.addEventListener('click', function (event) {
    if (
      event.target.id === 'btn-login-depois' ||
      event.target.id === 'btn-login-depois-modal' ||
      event.target.id === 'modal-login'
    ) {
      fecharModalLogin();
    }

    if (event.target.id === 'btn-login-agora') {
      window.location.href = '/login';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      fecharModalLogin();
    }
  });
})();
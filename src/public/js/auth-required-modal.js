function exigirLoginParaCarrinho() {
  const token = localStorage.getItem('jobee_token');

  if (token) return true;

  const modal = document.getElementById('modal-login');

  if (modal) {
    modal.classList.add('active');
  }

  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login-agora');
  const btnDepois = document.getElementById('btn-login-depois');
  const modal = document.getElementById('modal-login');

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  if (btnDepois && modal) {
    btnDepois.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
});

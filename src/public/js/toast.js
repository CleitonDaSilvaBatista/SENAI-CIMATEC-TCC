function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');

  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✔️' : '❌';
  const title = type === 'success' ? 'Sucesso' : 'Erro';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>

    <div class="toast-close">&times;</div>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  const progress = toast.querySelector('.toast-progress');
  progress.style.animation = 'progress 3s linear forwards';

  // fechar manual
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  // remover automático
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
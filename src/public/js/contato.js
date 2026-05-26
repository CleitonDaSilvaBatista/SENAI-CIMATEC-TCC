document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contato-form');
  const modal = document.getElementById('modal-contato');
  const fecharModalBtn = document.getElementById('modal-fechar');
  const modalOkBtn = document.getElementById('modal-ok');
  const telefoneInput = document.getElementById('telefone');

  if (!form || !modal) return;

  function mostrarErro(campo, mensagem) {
    const grupo = campo.closest('.form-group');
    const erro = grupo?.querySelector('.erro-msg');

    grupo?.classList.add('campo-erro');
    if (erro) erro.textContent = mensagem;
  }

  function limparErro(campo) {
    const grupo = campo.closest('.form-group');
    const erro = grupo?.querySelector('.erro-msg');

    grupo?.classList.remove('campo-erro');
    if (erro) erro.textContent = '';
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function abrirModal() {
    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  telefoneInput?.addEventListener('input', (event) => {
    event.target.value = formatarTelefone(event.target.value);
  });

  form.querySelectorAll('input, select, textarea').forEach((campo) => {
    campo.addEventListener('input', () => limparErro(campo));
    campo.addEventListener('change', () => limparErro(campo));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const assunto = document.getElementById('assunto');
    const mensagem = document.getElementById('mensagem');

    let valido = true;

    [nome, email, telefone, assunto, mensagem].forEach(limparErro);

    if (!nome.value.trim()) {
      mostrarErro(nome, 'Informe seu nome.');
      valido = false;
    }

    if (!validarEmail(email.value.trim())) {
      mostrarErro(email, 'Informe um e-mail válido.');
      valido = false;
    }

    if (telefone.value.replace(/\D/g, '').length < 10) {
      mostrarErro(telefone, 'Informe um telefone válido.');
      valido = false;
    }

    if (!assunto.value) {
      mostrarErro(assunto, 'Selecione um assunto.');
      valido = false;
    }

    if (mensagem.value.trim().length < 10) {
      mostrarErro(mensagem, 'Escreva uma mensagem com pelo menos 10 caracteres.');
      valido = false;
    }

    if (!valido) return;

    form.reset();
    abrirModal();
  });

  fecharModalBtn?.addEventListener('click', fecharModal);
  modalOkBtn?.addEventListener('click', fecharModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) fecharModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('ativo')) {
      fecharModal();
    }
  });
});

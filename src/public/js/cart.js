(function () {
  const CART_KEY_BASE = 'jobee_cart';

  function obterUsuarioCarrinho() {
    try {
      const usuario = JSON.parse(localStorage.getItem('jobee_user') || 'null');
      return usuario && typeof usuario === 'object' ? usuario : null;
    } catch (error) {
      console.error('Erro ao ler usuário do carrinho:', error);
      return null;
    }
  }

  function obterIdentificadorUsuarioCarrinho() {
    const usuario = obterUsuarioCarrinho();

    if (!usuario) return 'visitante';

    return String(
      usuario.id_usuario ??
      usuario.id ??
      usuario.user_id ??
      usuario.userId ??
      usuario.email ??
      'visitante'
    ).trim() || 'visitante';
  }

  function obterChaveCarrinho() {
    return `${CART_KEY_BASE}_${obterIdentificadorUsuarioCarrinho()}`;
  }

  function obterChaveCheckoutDireto() {
    return `jobee_direct_checkout_${obterIdentificadorUsuarioCarrinho()}`;
  }

  function lerCarrinhoDaChave(chave) {
    const carrinho = JSON.parse(localStorage.getItem(chave) || '[]');
    return Array.isArray(carrinho) ? carrinho : [];
  }

  function normalizarTexto(valor) {
    return String(valor ?? '').trim();
  }

  function itemKey(item) {
    return [
      normalizarTexto(item.id_item ?? item.id ?? item.slug ?? item.nome),
      normalizarTexto(item.cor),
      normalizarTexto(item.tamanho ?? item.size)
    ].join('|');
  }

  function obterCarrinho() {
    try {
      return lerCarrinhoDaChave(obterChaveCarrinho());
    } catch (error) {
      console.error('Erro ao ler carrinho:', error);
      return [];
    }
  }

  function salvarCarrinho(carrinho) {
    localStorage.setItem(obterChaveCarrinho(), JSON.stringify(carrinho));
    updateCartBadge();
  }

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function criarToastFallback(message, type = 'success') {
    let container = document.getElementById('toast-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✔️' : '❌'}</div>
      <div class="toast-content">
        <div class="toast-title">${type === 'success' ? 'Sucesso' : 'Erro'}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" type="button">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);
    toast.querySelector('.toast-close')?.addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 3000);
  }

  function notificar(message, type = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
      return;
    }
    criarToastFallback(message, type);
  }

  function updateCartBadge() {
    const badge = document.getElementById('navbar-cart-count') || document.getElementById('headerCartCount');
    if (!badge) return;

    const totalItens = obterCarrinho().reduce((acc, item) => acc + Number(item.quantidade || item.quantity || 1), 0);
    badge.textContent = totalItens;
  }

  function adicionarItemCarrinho(item) {
    const carrinho = obterCarrinho();
    const itemNormalizado = {
      id_item: item.id_item ?? item.id ?? item.slug ?? Date.now().toString(),
      id_loja: item.id_loja ?? null,
      nome_loja: item.nome_loja ?? item.vendedor ?? item.seller ?? 'Loja Jobee',
      slug_loja: item.slug_loja ?? '',
      nome: item.nome ?? item.title ?? 'Produto Jobee',
      preco: Number(item.preco ?? item.price ?? 0),
      imagem_url: item.imagem_url ?? item.imagem ?? item.image ?? '/img/placeholder-loja.png',
      quantidade: Number(item.quantidade ?? item.quantity ?? 1),
      cor: item.cor ?? '',
      tamanho: item.tamanho ?? item.size ?? '',
      tipo: item.tipo ?? 'produto'
    };

    const key = itemKey(itemNormalizado);
    const existente = carrinho.find((produto) => itemKey(produto) === key);

    if (existente) {
      existente.quantidade = Number(existente.quantidade || existente.quantity || 1) + itemNormalizado.quantidade;
      delete existente.quantity;
    } else {
      carrinho.push(itemNormalizado);
    }

    salvarCarrinho(carrinho);
    return itemNormalizado;
  }

  function alterarQuantidade(key, delta) {
    const carrinho = obterCarrinho();
    const item = carrinho.find((produto) => itemKey(produto) === key);

    if (!item) return;

    item.quantidade = Number(item.quantidade || item.quantity || 1) + delta;
    delete item.quantity;

    if (item.quantidade <= 0) {
      salvarCarrinho(carrinho.filter((produto) => itemKey(produto) !== key));
    } else {
      salvarCarrinho(carrinho);
    }

    renderizarCarrinho();
  }

  function removerItem(key) {
    salvarCarrinho(obterCarrinho().filter((produto) => itemKey(produto) !== key));
    renderizarCarrinho();
    notificar('Produto removido do carrinho.', 'success');
  }

  function finalizarPedido() {
    const carrinho = obterCarrinho();

    if (!carrinho.length) {
      notificar('Seu carrinho está vazio.', 'error');
      return;
    }

    window.location.href = '/compra';
  }

  function renderizarCarrinho() {
    const containerItens = document.getElementById('cart-items') || document.getElementById('cartItems');
    if (!containerItens) {
      updateCartBadge();
      return;
    }

    const emptyState = document.getElementById('emptyState');
    const cartSubtitle = document.getElementById('cartSubtitle');
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summaryTotal = document.getElementById('summaryTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.querySelector('.checkout-btn');

    const carrinho = obterCarrinho();
    const totalItens = carrinho.reduce((acc, item) => acc + Number(item.quantidade || item.quantity || 1), 0);
    const subtotal = carrinho.reduce((acc, item) => acc + (Number(item.preco || item.price || 0) * Number(item.quantidade || item.quantity || 1)), 0);
    const desconto = 0;
    const total = subtotal - desconto;

    if (cartSubtitle) cartSubtitle.textContent = `${totalItens} ${totalItens === 1 ? 'item adicionado' : 'itens adicionados'}`;
    if (summaryItems) summaryItems.textContent = totalItens;
    if (summarySubtotal) summarySubtotal.textContent = formatarPreco(subtotal);
    if (summaryDiscount) summaryDiscount.textContent = formatarPreco(desconto);
    if (summaryTotal) summaryTotal.textContent = formatarPreco(total);

    if (!carrinho.length) {
      containerItens.innerHTML = '';
      if (emptyState) emptyState.classList.add('show');
      updateCartBadge();
      return;
    }

    if (emptyState) emptyState.classList.remove('show');

    containerItens.innerHTML = carrinho.map((item) => {
      const key = itemKey(item);
      const quantidade = Number(item.quantidade || item.quantity || 1);
      const preco = Number(item.preco || item.price || 0);
      const nome = item.nome || item.title || 'Item sem nome';
      const detalhes = [item.cor, item.tamanho || item.size].filter(Boolean).join(' • ');

      return `
        <div class="cart-item">
          <div class="thumb">
            <img src="${item.imagem_url || item.image || '/img/placeholder-loja.png'}" alt="${nome}">
          </div>
          <div>
            <div class="item-title">${nome}</div>
            <div class="item-meta">Loja: ${item.nome_loja || 'Loja não informada'}${detalhes ? ` | ${detalhes}` : ''}</div>
            <div class="item-controls">
              <div class="qty">
                <button type="button" data-cart-action="qty" data-key="${key}" data-delta="-1">−</button>
                <span>${quantidade}</span>
                <button type="button" data-cart-action="qty" data-key="${key}" data-delta="1">+</button>
              </div>
              <button type="button" class="remove-btn" data-cart-action="remove" data-key="${key}">Remover</button>
            </div>
          </div>
          <div class="item-price">
            <strong>${formatarPreco(preco * quantidade)}</strong>
            <small>${quantidade} x ${formatarPreco(preco)}</small>
          </div>
        </div>
      `;
    }).join('');

    if (clearCartBtn && !clearCartBtn.dataset.bound) {
      clearCartBtn.addEventListener('click', () => {
        salvarCarrinho([]);
        renderizarCarrinho();
        notificar('Carrinho limpo com sucesso.', 'success');
      });
      clearCartBtn.dataset.bound = 'true';
    }

    if (checkoutBtn && !checkoutBtn.dataset.bound) {
      checkoutBtn.addEventListener('click', finalizarPedido);
      checkoutBtn.dataset.bound = 'true';
    }

    updateCartBadge();
  }

  document.addEventListener('click', (event) => {
    const botao = event.target.closest('[data-cart-action]');
    if (!botao) return;

    const action = botao.dataset.cartAction;
    const key = botao.dataset.key;

    if (action === 'remove') removerItem(key);
    if (action === 'qty') alterarQuantidade(key, Number(botao.dataset.delta || 0));
  });

  document.addEventListener('DOMContentLoaded', renderizarCarrinho);

  window.obterChaveCarrinho = obterChaveCarrinho;
  window.obterChaveCheckoutDireto = obterChaveCheckoutDireto;
  window.obterCarrinho = obterCarrinho;
  window.salvarCarrinho = salvarCarrinho;
  window.updateCartBadge = updateCartBadge;
  window.adicionarItemCarrinho = adicionarItemCarrinho;
  window.renderizarCarrinho = renderizarCarrinho;
  window.removerItemCarrinhoPorChave = removerItem;
})();

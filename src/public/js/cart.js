document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();
});

function obterCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem('jobee_cart') || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch (error) {
    console.error('Erro ao ler carrinho:', error);
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('jobee_cart', JSON.stringify(carrinho));
  updateCartBadge();
}

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function normalizarId(item) {
  return String(item.id_item ?? item.id ?? item.nome ?? 'item');
}

function chaveItem(item) {
  return [normalizarId(item), item.cor || '', item.tamanho || '', item.size || ''].join('|');
}

function updateCartBadge() {
  const badge = document.getElementById('navbar-cart-count');
  if (!badge) return;
  const totalItens = obterCarrinho().reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
  badge.textContent = totalItens;
}

function renderizarCarrinho() {
  const containerItens = document.getElementById('cart-items') || document.getElementById('cartItems');
  const resumo = document.getElementById('cart-summary');
  const emptyState = document.getElementById('emptyState');
  const cartSubtitle = document.getElementById('cartSubtitle');
  const summaryItems = document.getElementById('summaryItems');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotal = document.getElementById('summaryTotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.querySelector('.checkout-btn');

  if (!containerItens) return;

  const carrinho = obterCarrinho();
  const totalItens = carrinho.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
  const subtotal = carrinho.reduce((acc, item) => acc + Number(item.preco || item.price || 0) * Number(item.quantidade || 1), 0);
  const desconto = subtotal >= 300 ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - desconto);

  if (cartSubtitle) cartSubtitle.textContent = `${totalItens} ${totalItens === 1 ? 'item adicionado' : 'itens adicionados'}`;
  if (summaryItems) summaryItems.textContent = totalItens;
  if (summarySubtotal) summarySubtotal.textContent = formatarPreco(subtotal);
  if (summaryDiscount) summaryDiscount.textContent = desconto ? `- ${formatarPreco(desconto)}` : formatarPreco(0);
  if (summaryTotal) summaryTotal.textContent = formatarPreco(total);

  if (!carrinho.length) {
    containerItens.innerHTML = '';
    if (emptyState) emptyState.classList.add('show');
    if (resumo) resumo.innerHTML = '';
    updateCartBadge();
    return;
  }

  if (emptyState) emptyState.classList.remove('show');

  containerItens.innerHTML = carrinho.map(item => {
    const key = chaveItem(item);
    const nome = item.nome || item.title || 'Item Jobee';
    const preco = Number(item.preco || item.price || 0);
    const quantidade = Number(item.quantidade || 1);
    const variante = [item.cor, item.tamanho || item.size].filter(Boolean).join(' • ');
    return `
      <div class="cart-item" data-key="${key}">
        <div class="thumb">
          <img src="${item.imagem_url || item.imagem || item.image || '/img/placeholder-loja.png'}" alt="${nome}" onerror="this.onerror=null;this.src='/img/placeholder-loja.png';">
        </div>
        <div>
          <div class="item-title">${nome}</div>
          <div class="item-meta">${item.nome_loja || item.vendedor || 'Loja Jobee'}${variante ? ` • ${variante}` : ''}</div>
          <div class="item-controls">
            <div class="qty">
              <button type="button" data-action="decrease" data-key="${key}">−</button>
              <span>${quantidade}</span>
              <button type="button" data-action="increase" data-key="${key}">+</button>
            </div>
            <button type="button" class="remove-btn" data-action="remove" data-key="${key}">Remover</button>
          </div>
        </div>
        <div class="item-price">
          <strong>${formatarPreco(preco * quantidade)}</strong>
          <small>${quantidade} x ${formatarPreco(preco)}</small>
        </div>
      </div>`;
  }).join('');

  containerItens.querySelectorAll('[data-action]').forEach(botao => {
    botao.addEventListener('click', () => {
      const key = botao.dataset.key;
      const action = botao.dataset.action;
      if (action === 'increase') alterarQuantidade(key, 1);
      if (action === 'decrease') alterarQuantidade(key, -1);
      if (action === 'remove') removerItem(key);
    });
  });

  if (resumo) {
    resumo.innerHTML = `
      <div class="cart-total">
        <h2>Total</h2>
        <p><strong>${formatarPreco(total)}</strong></p>
        <button id="btn-finalizar" type="button">Finalizar pedido</button>
      </div>`;
    document.getElementById('btn-finalizar')?.addEventListener('click', finalizarPedido);
  }

  if (clearCartBtn && !clearCartBtn.dataset.bound) {
    clearCartBtn.addEventListener('click', () => {
      salvarCarrinho([]);
      renderizarCarrinho();
    });
    clearCartBtn.dataset.bound = 'true';
  }

  if (checkoutBtn && !checkoutBtn.dataset.bound) {
    checkoutBtn.addEventListener('click', finalizarPedido);
    checkoutBtn.dataset.bound = 'true';
  }

  updateCartBadge();
}

function alterarQuantidade(key, delta) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(prod => chaveItem(prod) === String(key));
  if (!item) return;
  item.quantidade = Number(item.quantidade || 1) + delta;
  const atualizado = item.quantidade <= 0 ? carrinho.filter(prod => chaveItem(prod) !== String(key)) : carrinho;
  salvarCarrinho(atualizado);
  renderizarCarrinho();
}

function removerItem(key) {
  salvarCarrinho(obterCarrinho().filter(prod => chaveItem(prod) !== String(key)));
  renderizarCarrinho();
}

function finalizarPedido() {
  const carrinho = obterCarrinho();
  if (!carrinho.length) {
    alert('Adicione pelo menos um item antes de finalizar.');
    return;
  }
  localStorage.removeItem('jobee_direct_checkout');
  window.location.href = '/compra';
}

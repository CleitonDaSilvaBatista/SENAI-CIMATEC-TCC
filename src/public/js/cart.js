document.addEventListener('DOMContentLoaded', () => {
  console.log('cart.js carregado');
  renderizarCarrinho();
});

function obterCarrinho() {
  try {
    return JSON.parse(localStorage.getItem('jobee_cart')) || [];
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
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
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

  if (!containerItens) {
    console.error('Container do carrinho não encontrado');
    return;
  }

  const carrinho = obterCarrinho();
  console.log('Carrinho atual:', carrinho);

  const totalItens = carrinho.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);
  const subtotal = carrinho.reduce((acc, item) => acc + (Number(item.preco || 0) * Number(item.quantidade || 1)), 0);
  const desconto = 0;
  const total = subtotal - desconto;

  if (cartSubtitle) {
    cartSubtitle.textContent = `${totalItens} ${totalItens === 1 ? 'item adicionado' : 'itens adicionados'}`;
  }

  if (summaryItems) summaryItems.textContent = totalItens;
  if (summarySubtotal) summarySubtotal.textContent = formatarPreco(subtotal);
  if (summaryDiscount) summaryDiscount.textContent = formatarPreco(desconto);
  if (summaryTotal) summaryTotal.textContent = formatarPreco(total);

  if (!carrinho.length) {
    containerItens.innerHTML = '';
    if (emptyState) emptyState.classList.add('show');
    if (resumo) resumo.innerHTML = '';
    updateCartBadge();
    return;
  }

  if (emptyState) emptyState.classList.remove('show');

  containerItens.innerHTML = carrinho.map(item => `
    <div class="cart-item">
      <div class="thumb">
        <img src="${item.imagem_url || '/img/placeholder-loja.png'}" alt="${item.nome || 'Produto'}">
      </div>
      <div>
        <div class="item-title">${item.nome || 'Item sem nome'}</div>
        <div class="item-meta">Loja: ${item.nome_loja || 'Loja não informada'}</div>
        <div class="item-controls">
          <div class="qty">
            <button onclick="alterarQuantidade(${item.id_item}, -1)">−</button>
            <span>${item.quantidade || 1}</span>
            <button onclick="alterarQuantidade(${item.id_item}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removerItem(${item.id_item})">Remover</button>
        </div>
      </div>
      <div class="item-price">
        <strong>${formatarPreco(Number(item.preco || 0) * Number(item.quantidade || 1))}</strong>
        <small>${item.quantidade || 1} x ${formatarPreco(item.preco || 0)}</small>
      </div>
    </div>
  `).join('');

  if (resumo) {
    resumo.innerHTML = `
      <div class="cart-total" style="padding:16px; border:1px solid #ddd; border-radius:12px;">
        <h2>Total</h2>
        <p><strong>${formatarPreco(total)}</strong></p>
        <button id="btn-finalizar">Finalizar pedido</button>
      </div>
    `;

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', finalizarPedido);
    }
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

function alterarQuantidade(idItem, delta) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(prod => Number(prod.id_item) === Number(idItem));

  if (!item) return;

  item.quantidade = Number(item.quantidade || 1) + delta;

  if (item.quantidade <= 0) {
    salvarCarrinho(carrinho.filter(prod => Number(prod.id_item) !== Number(idItem)));
  } else {
    salvarCarrinho(carrinho);
  }

  renderizarCarrinho();
}

function removerItem(idItem) {
  salvarCarrinho(obterCarrinho().filter(prod => Number(prod.id_item) !== Number(idItem)));
  renderizarCarrinho();
}

function finalizarPedido() {
  alert('Carrinho funcionando. Próximo passo: gravar pedido no banco.');
}

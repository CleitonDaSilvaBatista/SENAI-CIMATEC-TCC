document.addEventListener("DOMContentLoaded", () => {
  console.log("cart.js carregado");
  renderizarCarrinho();
  updateCartBadge();
});

function obterCarrinho() {
  try {
    return JSON.parse(localStorage.getItem("jobee_cart")) || [];
  } catch (error) {
    console.error("Erro ao ler carrinho:", error);
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("jobee_cart", JSON.stringify(carrinho));
  updateCartBadge();
}

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function updateCartBadge() {
  const badge =
    document.getElementById("navbar-cart-count") ||
    document.getElementById("headerCartCount");

  if (!badge) return;

  const totalItens = obterCarrinho().reduce((acc, item) => {
    return acc + Number(item.quantity || 1);
  }, 0);

  badge.textContent = totalItens;
}

function adicionarAoCarrinho(produto) {
  const carrinho = obterCarrinho();

  const existente = carrinho.find(item => {
    return Number(item.id) === Number(produto.id) && item.size === produto.size;
  });

  if (existente) {
    existente.quantity = Number(existente.quantity || 1) + 1;
  } else {
    carrinho.push({
      ...produto,
      quantity: 1
    });
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const containerItens =
    document.getElementById("cart-items") ||
    document.getElementById("cartItems");

  const resumo =
    document.getElementById("cart-summary") ||
    document.getElementById("cartSummary");

  const emptyState = document.getElementById("emptyState");
  const cartSubtitle = document.getElementById("cartSubtitle");
  const summaryItems = document.getElementById("summaryItems");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryDiscount = document.getElementById("summaryDiscount");
  const summaryTotal = document.getElementById("summaryTotal");

  const carrinho = obterCarrinho();

  if (!containerItens) {
    console.error("Container do carrinho não encontrado");
    return;
  }

  const totalItens = carrinho.reduce((acc, item) => {
    return acc + Number(item.quantity || 1);
  }, 0);

  const subtotal = carrinho.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  const desconto = carrinho.reduce((acc, item) => {
    const oldPrice = Number(item.oldPrice || item.price || 0);
    const price = Number(item.price || 0);
    return acc + (oldPrice - price) * Number(item.quantity || 1);
  }, 0);

  const total = subtotal;

  if (cartSubtitle) {
    cartSubtitle.textContent = `${totalItens} ${totalItens === 1 ? "item adicionado" : "itens adicionados"}`;
  }

  if (summaryItems) summaryItems.textContent = totalItens;
  if (summarySubtotal) summarySubtotal.textContent = formatarPreco(subtotal);
  if (summaryDiscount) summaryDiscount.textContent = formatarPreco(desconto);
  if (summaryTotal) summaryTotal.textContent = formatarPreco(total);

  if (!carrinho.length) {
    containerItens.innerHTML = "";
    if (emptyState) emptyState.classList.add("show");
    if (resumo) {
      resumo.innerHTML = `
        <div class="cart-total" style="padding:16px; border:1px solid #ddd; border-radius:12px;">
          <h2>Total</h2>
          <p><strong>${formatarPreco(0)}</strong></p>
        </div>
      `;
    }
    updateCartBadge();
    return;
  }

  if (emptyState) emptyState.classList.remove("show");

  containerItens.innerHTML = carrinho.map(item => `
    <div class="cart-item" style="display:flex; gap:16px; margin-bottom:20px; border:1px solid #ddd; padding:16px; border-radius:12px;">
      <img 
        src="${item.image || "/img/placeholder-loja.png"}" 
        alt="${item.title || "Produto"}" 
        width="120" 
        height="120" 
        style="object-fit:cover; border-radius:8px;"
      >

      <div class="cart-item-info" style="flex:1;">
        <h3>${item.title || "Item sem nome"}</h3>
        <p><strong>Tamanho:</strong> ${item.size || "Não informado"}</p>
        <p><strong>Preço unitário:</strong> ${formatarPreco(item.price || 0)}</p>

        <div class="cart-actions" style="display:flex; gap:8px; align-items:center; margin-top:10px; flex-wrap:wrap;">
          <button onclick="alterarQuantidade(${item.id}, '${item.size}', -1)">-</button>
          <span>${item.quantity || 1}</span>
          <button onclick="alterarQuantidade(${item.id}, '${item.size}', 1)">+</button>
          <button onclick="removerItem(${item.id}, '${item.size}')">Remover</button>
        </div>
      </div>

      <div class="cart-item-price" style="min-width:120px; text-align:right;">
        <strong>${formatarPreco(Number(item.price || 0) * Number(item.quantity || 1))}</strong><br>
        <small>${item.quantity || 1} x ${formatarPreco(item.price || 0)}</small>
      </div>
    </div>
  `).join("");

  if (resumo) {
    resumo.innerHTML = `
      <div class="cart-total" style="padding:16px; border:1px solid #ddd; border-radius:12px;">
        <h2>Total</h2>
        <p><strong>${formatarPreco(total)}</strong></p>
        <button id="btn-finalizar">Finalizar pedido</button>
      </div>
    `;

    const btnFinalizar = document.getElementById("btn-finalizar");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", finalizarPedido);
    }
  }

  updateCartBadge();
}

function alterarQuantidade(id, size, delta) {
  let carrinho = obterCarrinho();

  const item = carrinho.find(prod => {
    return Number(prod.id) === Number(id) && prod.size === size;
  });

  if (!item) return;

  item.quantity = Number(item.quantity || 1) + delta;

  if (item.quantity <= 0) {
    carrinho = carrinho.filter(prod => {
      return !(Number(prod.id) === Number(id) && prod.size === size);
    });
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerItem(id, size) {
  const carrinho = obterCarrinho().filter(prod => {
    return !(Number(prod.id) === Number(id) && prod.size === size);
  });

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function limparCarrinho() {
  salvarCarrinho([]);
  renderizarCarrinho();
}

function finalizarPedido() {
  alert("Carrinho funcionando. Próximo passo: gravar pedido no banco.");
}
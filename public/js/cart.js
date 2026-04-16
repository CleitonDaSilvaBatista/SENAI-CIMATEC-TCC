document.addEventListener("DOMContentLoaded", () => {
  console.log("cart.js carregado");
  renderizarCarrinho();
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
}

function renderizarCarrinho() {
  const containerItens = document.getElementById("cart-items");
  const resumo = document.getElementById("cart-summary");

  if (!containerItens || !resumo) {
    console.error("Elementos #cart-items ou #cart-summary não encontrados");
    return;
  }

  const carrinho = obterCarrinho();
  console.log("Carrinho atual:", carrinho);

  if (!carrinho.length) {
    containerItens.innerHTML = "<p>Seu carrinho está vazio.</p>";
    resumo.innerHTML = "";
    return;
  }

  containerItens.innerHTML = carrinho.map(item => `
    <div class="cart-item" style="display:flex; gap:16px; margin-bottom:20px; border:1px solid #ddd; padding:16px; border-radius:12px;">
      <img src="${item.imagem_url || '/img/placeholder-loja.png'}" alt="${item.nome}" width="120" height="120" style="object-fit:cover; border-radius:8px;">
      <div class="cart-item-info">
        <h3>${item.nome || 'Item sem nome'}</h3>
        <p><strong>Loja:</strong> ${item.nome_loja || 'Loja não informada'}</p>
        <p><strong>Preço:</strong> R$ ${Number(item.preco || 0).toFixed(2).replace('.', ',')}</p>

        <div class="cart-actions" style="display:flex; gap:8px; align-items:center; margin-top:10px;">
          <button onclick="alterarQuantidade(${item.id_item}, -1)">-</button>
          <span>${item.quantidade || 1}</span>
          <button onclick="alterarQuantidade(${item.id_item}, 1)">+</button>
          <button onclick="removerItem(${item.id_item})">Remover</button>
        </div>
      </div>
    </div>
  `).join("");

  const total = carrinho.reduce((acc, item) => {
    return acc + (Number(item.preco || 0) * Number(item.quantidade || 1));
  }, 0);

  resumo.innerHTML = `
    <div class="cart-total" style="padding:16px; border:1px solid #ddd; border-radius:12px;">
      <h2>Total</h2>
      <p><strong>R$ ${total.toFixed(2).replace('.', ',')}</strong></p>
      <button id="btn-finalizar">Finalizar pedido</button>
    </div>
  `;

  const btnFinalizar = document.getElementById("btn-finalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarPedido);
  }
}

function alterarQuantidade(idItem, delta) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(prod => Number(prod.id_item) === Number(idItem));

  if (!item) return;

  item.quantidade = Number(item.quantidade || 1) + delta;

  if (item.quantidade <= 0) {
    const novoCarrinho = carrinho.filter(prod => Number(prod.id_item) !== Number(idItem));
    salvarCarrinho(novoCarrinho);
  } else {
    salvarCarrinho(carrinho);
  }

  renderizarCarrinho();
}

function removerItem(idItem) {
  const carrinho = obterCarrinho().filter(prod => Number(prod.id_item) !== Number(idItem));
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function finalizarPedido() {
  alert("Carrinho funcionando. Próximo passo: gravar pedido no banco.");
}
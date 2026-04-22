function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function obterCompraAtual() {
  try {
    const compra = JSON.parse(localStorage.getItem('jobee_direct_checkout') || 'null');
    if (compra) return compra;
  } catch (error) {
    console.warn('Não foi possível ler checkout direto.', error);
  }

  const carrinho = JSON.parse(localStorage.getItem('jobee_cart') || '[]');
  if (carrinho.length) {
    const primeiro = carrinho[0];
    return {
      nome: primeiro.nome || 'Produto Jobee',
      preco: Number(primeiro.preco || 0),
      imagem: primeiro.imagem_url || 'img/shorts.webp',
      cor: primeiro.cor || 'Padrão',
      tamanho: primeiro.tamanho || 'Único',
      quantidade: Number(primeiro.quantidade || 1),
      vendedor: primeiro.nome_loja || 'Loja Jobee',
      entrega: 'Entrega estimada entre 2 e 5 dias úteis',
      frete: 9.9
    };
  }

  return {
    nome: 'Kit 3 Bermudas Flanelada De Chimpá Masculina Casual Premium',
    preco: 59.99,
    imagem: 'img/shorts.webp',
    cor: 'Preto',
    tamanho: 'P',
    quantidade: 1,
    vendedor: 'Loja Demo',
    entrega: 'Entrega estimada entre 2 e 5 dias úteis',
    frete: 9.9
  };
}

function preencherResumo() {
  const compra = obterCompraAtual();
  const subtotal = compra.preco * compra.quantidade;
  const desconto = subtotal >= 150 ? 12 : 0;
  const frete = subtotal >= 150 ? 0 : Number(compra.frete || 0);
  const total = subtotal + frete - desconto;

  const img = document.getElementById('purchaseImage');
  const nome = document.getElementById('purchaseName');
  const seller = document.getElementById('purchaseSeller');
  const variant = document.getElementById('purchaseVariant');
  const delivery = document.getElementById('purchaseDelivery');
  const itemPrice = document.getElementById('purchasePrice');
  const unitPrice = document.getElementById('purchaseUnitPrice');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotal = document.getElementById('summaryTotal');
  const heroTotal = document.getElementById('heroTotal');
  const heroItems = document.getElementById('heroItems');

  if (img) img.src = compra.imagem;
  if (nome) nome.textContent = compra.nome;
  if (seller) seller.textContent = compra.vendedor;
  if (variant) variant.textContent = `Cor: ${compra.cor} • Tamanho: ${compra.tamanho} • Quantidade: ${compra.quantidade}`;
  if (delivery) delivery.textContent = compra.entrega;
  if (itemPrice) itemPrice.textContent = moeda(total);
  if (unitPrice) unitPrice.textContent = `${compra.quantidade} x ${moeda(compra.preco)}`;
  if (summarySubtotal) summarySubtotal.textContent = moeda(subtotal);
  if (summaryShipping) summaryShipping.textContent = frete === 0 ? 'Grátis' : moeda(frete);
  if (summaryDiscount) summaryDiscount.textContent = desconto ? `- ${moeda(desconto)}` : moeda(0);
  if (summaryTotal) summaryTotal.textContent = moeda(total);
  if (heroTotal) heroTotal.textContent = moeda(total);
  if (heroItems) heroItems.textContent = `${compra.quantidade} ${compra.quantidade > 1 ? 'itens' : 'item'}`;
}

function preencherUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('jobee_user') || 'null');
    if (!usuario) return;
    const nomeInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    if (nomeInput && usuario.nome) nomeInput.value = usuario.nome;
    if (emailInput && usuario.email) emailInput.value = usuario.email;
  } catch (error) {
    console.warn('Não foi possível preencher dados do usuário.', error);
  }
}

function vincularFormulario() {
  const form = document.getElementById('checkoutForm');
  const backButton = document.getElementById('backToProduct');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.alert('Pedido confirmado com sucesso! Próximo passo: integrar esta etapa ao backend e salvar no banco.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  preencherResumo();
  preencherUsuario();
  vincularFormulario();
});

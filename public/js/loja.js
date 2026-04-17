document.addEventListener("DOMContentLoaded", carregarLoja);

async function carregarLoja() {
  const partes = window.location.pathname.split("/");
  const slug = partes[partes.length - 1];

  if (!slug) {
    document.body.innerHTML = "<p>Loja não informada.</p>";
    return;
  }

  try {
    const resposta = await fetch(`/api/lojas/${slug}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || "Erro ao carregar loja");
    }

    document.title = `${dados.loja.nome_fantasia} | Jobee`;

    const nomeLoja = document.getElementById("nome-loja");
    const descricaoLoja = document.getElementById("descricao-loja");
    const imagemLoja = document.getElementById("imagem-loja");
    const sobreLoja = document.getElementById("sobre_loja");

    nomeLoja.textContent = dados.loja.nome_fantasia;
    descricaoLoja.textContent = dados.loja.descricao || "Sem descrição disponível.";
    imagemLoja.src = dados.loja.imagem_url || "/img/placeholder-loja.png";
    imagemLoja.alt = dados.loja.nome_fantasia;
    sobreLoja.textContent = dados.loja.sobre || "Sem informações disponíveis.";

    const listaProdutos = document.getElementById("lista-produtos");
    listaProdutos.innerHTML = dados.produtos.length
      ? dados.produtos.map(produto => `
          <div class="item-card">
            <img src="${produto.imagem_url || '/img/placeholder-loja.png'}" alt="${produto.nome}">
            <div class="item-card-content">
              <h3>${produto.nome}</h3>
              <p>${produto.descricao || 'Sem descrição.'}</p>
              <div class="item-meta">
                <strong>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</strong>
                <span>Estoque: ${produto.estoque ?? 0}</span>
              </div>
              <button class="btn-add-cart" data-id="${produto.id_item}">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        `).join("")
      : "<p>Nenhum produto cadastrado.</p>";

    const listaServicos = document.getElementById("lista-servicos");
    listaServicos.innerHTML = dados.servicos.length
      ? dados.servicos.map(servico => `
          <div class="item-card">
            <img src="${servico.imagem_url || '/img/placeholder-loja.png'}" alt="${servico.nome}">
            <div class="item-card-content">
              <h3>${servico.nome}</h3>
              <p>${servico.descricao || 'Sem descrição.'}</p>
              <div class="item-meta">
                <strong>R$ ${Number(servico.preco).toFixed(2).replace('.', ',')}</strong>
                <span>Duração: ${servico.duracao_minutos ? `${servico.duracao_minutos} min` : 'Sob consulta'}</span>
              </div>
            </div>
          </div>
        `).join("")
      : "<p>Nenhum serviço cadastrado.</p>";

    ativarBotoesCarrinho();
  } catch (error) {
    console.error("Erro ao carregar loja:", error);
    document.body.innerHTML = "<p>Erro ao carregar a loja.</p>";
  }
}

function ativarBotoesCarrinho() {
  const botoes = document.querySelectorAll(".btn-add-cart");

  botoes.forEach(botao => {
    botao.addEventListener("click", async () => {
      const idItem = botao.getAttribute("data-id");
      await adicionarAoCarrinho(idItem);
    });
  });
}

async function adicionarAoCarrinho(idItem) {
  try {
    const resposta = await fetch(`/api/itens/${idItem}`);
    const item = await resposta.json();

    if (!resposta.ok) {
      throw new Error(item.error || "Erro ao buscar item");
    }

    const carrinhoAtual = JSON.parse(localStorage.getItem("jobee_cart")) || [];
    const existente = carrinhoAtual.find(prod => Number(prod.id_item) === Number(item.id_item));

    if (existente) {
      existente.quantidade += 1;
    } else {
      carrinhoAtual.push({
        id_item: item.id_item,
        id_loja: item.id_loja,
        nome_loja: item.loja?.nome_fantasia || "Loja não informada",
        slug_loja: item.loja?.slug || "",
        nome: item.nome,
        preco: Number(item.preco),
        imagem_url: item.imagem_url || "/img/placeholder-loja.png",
        quantidade: 1,
        tipo: "produto"
      });
    }

    localStorage.setItem("jobee_cart", JSON.stringify(carrinhoAtual));
    console.log("Carrinho salvo:", carrinhoAtual);
    alert("Produto adicionado ao carrinho!");
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    alert("Não foi possível adicionar o item ao carrinho.");
  }
}
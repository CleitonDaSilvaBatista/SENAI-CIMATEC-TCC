document.addEventListener("DOMContentLoaded", carregarLoja);

async function carregarLoja() {
  abrirLoadingModal("Estamos carregando os dados da loja...");

  const partes = window.location.pathname.split("/");
  const slug = partes[partes.length - 1];

  if (!slug) {
    fecharLoadingModal();
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
    sobreLoja.textContent = dados.loja.sobre_loja || "Sem informações disponíveis.";

    await carregarContadores(dados.loja.id_loja);

    const listaProdutos = document.getElementById("lista-produtos");
    listaProdutos.innerHTML = dados.produtos.length
      ? dados.produtos.map(produto => `
    <div class="card-item">
      <div class="card-img-wrap">
        <img 
          src="${produto.imagem_url || '/img/placeholder-loja.png'}" 
          alt="${produto.nome}"
        >
        <span class="selo green">Produto</span>
      </div>

      <div class="card-conteudo">
        <div class="card-categoria">Produto</div>
        <h3>${produto.nome}</h3>
        <p class="card-desc">${produto.descricao || 'Sem descrição.'}</p>

        <div class="card-preco">
          <strong>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</strong>
        </div>

        <div class="card-footer">
          <button class="btn btn-primary" data-id="${produto.id_item}">
            Comprar
          </button>
        </div>
      </div>
    </div>
  `).join("")
      : "<p>Nenhum produto cadastrado.</p>";

    const listaServicos = document.getElementById("lista-servicos");
    listaServicos.innerHTML = dados.servicos.length
      ? dados.servicos.map(servico => `
    <div class="card-servico">
      <div class="servico-topo">
        <h3>${servico.nome}</h3>
        <span class="tag-servico">Serviço</span>
      </div>

      <p>${servico.descricao || 'Sem descrição.'}</p>

      <div class="servico-meta">
        <span>R$ ${Number(servico.preco).toFixed(2).replace('.', ',')}</span>
        <span>
          ${servico.duracao_minutos
          ? `${servico.duracao_minutos} min`
          : 'Sob consulta'}
        </span>
      </div>

      <button class="btn">
        Solicitar serviço
      </button>
    </div>
  `).join("")
      : "<p>Nenhum serviço cadastrado.</p>";
  } catch (error) {
    console.error("Erro ao carregar loja:", error);
    fecharLoadingModal();
    document.body.innerHTML = "<p>Erro ao carregar a loja.</p>";
  }
}

async function carregarContadores(idLoja) {
  try {
    const response = await fetch(`/api/lojas/${idLoja}/contagem`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar contadores");
    }

    document.getElementById("contador-produtos").innerText =
      `${data.produtos} produto${data.produtos !== 1 ? "s" : ""}`;

    document.getElementById("contador-servicos").innerText =
      `${data.servicos} serviço${data.servicos !== 1 ? "s" : ""}`;
  } catch (error) {
    console.error("Erro ao carregar contadores:", error);
  }
}

function abrirLoadingModal(texto = "Estamos buscando as informações no banco de dados...") {
  const modal = document.getElementById("loading-modal");
  const textoModal = modal?.querySelector("p");

  if (textoModal) {
    textoModal.textContent = texto;
  }

  modal?.classList.add("active");
}

function fecharLoadingModal() {
  const modal = document.getElementById("loading-modal");
  modal?.classList.remove("active");
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
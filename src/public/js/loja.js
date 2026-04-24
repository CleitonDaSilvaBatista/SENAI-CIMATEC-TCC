document.addEventListener("DOMContentLoaded", carregarLoja);

async function carregarLoja() {
  abrirLoadingModal("Estamos carregando os dados da loja...");

  const partes = window.location.pathname.split("/");
  const slug = partes[partes.length - 1] || partes[partes.length - 2];

  if (!slug) {
    document.body.innerHTML = "<p>Loja não informada.</p>";
    fecharLoadingModal();
    return;
  }

  try {
    const resposta = await fetch(`/api/lojas/${slug}`);
    const dados = await resposta.json();

    console.log("Resposta da API:", dados);

    if (!resposta.ok) {
      throw new Error(dados.error || "Erro ao carregar loja");
    }

    document.title = `${dados.loja?.nome_fantasia || "Loja"} | Jobee`;

    const nomeLoja = document.getElementById("nome-loja");
    const descricaoLoja = document.getElementById("descricao-loja");
    const imagemLoja = document.getElementById("imagem-loja");
    const bannerLoja = document.querySelector(".loja-hero");
    const sobreLoja = document.getElementById("sobre_loja");

    if (nomeLoja) nomeLoja.textContent = dados.loja?.nome_fantasia || "Loja sem nome";
    if (descricaoLoja) {
      descricaoLoja.textContent = dados.loja?.descricao || "Sem descrição disponível.";
    }
    if (imagemLoja) {
      imagemLoja.src = dados.loja?.imagem_url || "/img/placeholder-loja.png";
      imagemLoja.alt = dados.loja?.nome_fantasia || "Logo da loja";
    }

    if (bannerLoja) {
      const bannerUrl = dados.loja?.banner_url || "/img/banercarrosel.webp";

      bannerLoja.style.backgroundImage = `
    linear-gradient(135deg, rgba(10, 20, 17, 0.75), rgba(14, 40, 31, 0.55)),
    url("${bannerUrl}")
  `;
    }
    if (sobreLoja) {
      sobreLoja.textContent = dados.loja?.sobre_loja || "Sem informações disponíveis.";
    }

    if (dados.loja?.id_loja) {
      await carregarContadores(dados.loja.id_loja);
    }

    const produtos = Array.isArray(dados.produtos) ? dados.produtos : [];
    const servicos = Array.isArray(dados.servicos) ? dados.servicos : [];
    
    const listaProdutos = document.getElementById("lista-produtos");
    if (listaProdutos) {
      listaProdutos.innerHTML = produtos.length
        ? produtos.map(produto => `
            <div class="card-item">
              <div class="card-img-wrap">
                <img 
                  src="${produto.imagem_url || '/img/placeholder-loja.png'}" 
                  alt="${produto.nome || 'Produto'}"
                  onerror="this.onerror=null;this.src='/img/placeholder-loja.png';"
                >
                <span class="selo green">Produto</span>
              </div>

              <div class="card-conteudo">
                <div class="card-categoria">Produto</div>
                <h3>${produto.nome || 'Sem nome'}</h3>
                <p class="card-desc">${produto.descricao || 'Sem descrição.'}</p>

                <div class="card-preco">
                  <strong>R$ ${Number(produto.preco || 0).toFixed(2).replace('.', ',')}</strong>
                </div>

                <div class="card-footer">
                  <button class="btn btn-primary btn-add-cart" data-id="${produto.id_item}">
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            </div>
          `).join("")
        : `<div class="empty-state">Nenhum produto cadastrado.</div>`;
    }

    const listaServicos = document.getElementById("lista-servicos");
    if (listaServicos) {
      listaServicos.innerHTML = servicos.length
        ? servicos.map(servico => `
        <div class="card-servico">
          <div class="card-img-wrap">
            <img 
              src="${servico.imagem_url || '/img/placeholder-loja.png'}" 
              alt="${servico.nome || 'Serviço'}"
              onerror="this.onerror=null;this.src='/img/placeholder-loja.png';"
            >
            <span class="selo green">Serviço</span>
          </div>

          <div class="servico-topo">
            <h3>${servico.nome || 'Serviço sem nome'}</h3>
            <span class="tag-servico">Serviço</span>
          </div>

          <p>${servico.descricao || 'Sem descrição.'}</p>

          <div class="servico-meta">
            <span>R$ ${Number(servico.preco || 0).toFixed(2).replace('.', ',')}</span>
            <span>${servico.duracao_minutos ? `${servico.duracao_minutos} min` : 'Sob consulta'}</span>
          </div>

          <button class="btn">Solicitar serviço</button>
        </div>
      `).join("")
        : `<div class="empty-state">Nenhum serviço cadastrado.</div>`;
    }

    ativarBotoesCarrinho();
  } catch (error) {
    console.error("Erro ao carregar loja:", error);

    const listaProdutos = document.getElementById("lista-produtos");
    const listaServicos = document.getElementById("lista-servicos");

    if (listaProdutos) {
      listaProdutos.innerHTML = `<div class="empty-state">Erro ao carregar os produtos.</div>`;
    }

    if (listaServicos) {
      listaServicos.innerHTML = `<div class="empty-state">Erro ao carregar os serviços.</div>`;
    }
  } finally {
    fecharLoadingModal();
  }
}

async function carregarContadores(idLoja) {
  try {
    const response = await fetch(`/api/lojas/${idLoja}/contagem`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar contadores");
    }

    const contadorProdutos = document.getElementById("contador-produtos");
    const contadorServicos = document.getElementById("contador-servicos");

    if (contadorProdutos) {
      contadorProdutos.innerText =
        `${data.produtos || 0} produto${data.produtos !== 1 ? "s" : ""}`;
    }

    if (contadorServicos) {
      contadorServicos.innerText =
        `${data.servicos || 0} serviço${data.servicos !== 1 ? "s" : ""}`;
    }
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
  if (!exigirLoginParaCarrinho()) {
    return;
  }

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
    showToast('Produto adicionado ao carrinho!', 'success');
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    showToast('Erro ao adicionar produto', 'error');
  }
}
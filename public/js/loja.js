document.addEventListener('DOMContentLoaded', carregarLoja);

async function carregarLoja() {
  const partes = window.location.pathname.split('/');
  const slug = partes[partes.length - 1];

  if (!slug) {
    document.body.innerHTML = '<p>Loja não informada.</p>';
    return;
  }

  try {
    const resposta = await fetch(`/api/lojas/${slug}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || 'Erro ao carregar loja');
    }

    document.title = `${dados.loja.nome_fantasia} | Jobee`;

    const nomeLoja = document.getElementById('nome-loja');
    const descricaoLoja = document.getElementById('descricao-loja');
    const imagemLoja = document.getElementById('imagem-loja');

    nomeLoja.textContent = dados.loja.nome_fantasia;
    descricaoLoja.textContent = dados.loja.descricao || 'Sem descrição disponível.';
    imagemLoja.src = dados.loja.imagem_url || '/img/placeholder-loja.png';
    imagemLoja.alt = dados.loja.nome_fantasia;

    const listaProdutos = document.getElementById('lista-produtos');
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
            </div>
          </div>
        `).join('')
      : '<p>Nenhum produto cadastrado.</p>';

    const listaServicos = document.getElementById('lista-servicos');
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
        `).join('')
      : '<p>Nenhum serviço cadastrado.</p>';

  } catch (error) {
    console.error('Erro ao carregar loja:', error);
    document.body.innerHTML = '<p>Erro ao carregar a loja.</p>';
  }
}
    const produtos = [
      {
        nome: "Tênis Performance Jobee",
        categoria: "Moda",
        preco: 189.90,
        precoAntigo: 249.90,
        rating: 4.8,
        selo: "Mais vendido",
        imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        descricao: "Conforto, leveza e design moderno para o dia a dia."
      },
      {
        nome: "Smartwatch Verde Fit",
        categoria: "Tecnologia",
        preco: 299.90,
        precoAntigo: 379.90,
        rating: 4.9,
        selo: "Novo",
        imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        descricao: "Monitoramento inteligente com visual premium."
      },
      {
        nome: "Fone Bluetooth Pro",
        categoria: "Tecnologia",
        preco: 159.90,
        precoAntigo: 199.90,
        rating: 4.7,
        selo: "Oferta",
        imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        descricao: "Áudio potente, bateria duradoura e encaixe confortável."
      },
      {
        nome: "Luminária Minimal Green",
        categoria: "Casa",
        preco: 89.90,
        precoAntigo: 119.90,
        rating: 4.6,
        selo: "Promoção",
        imagem: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        descricao: "Peça decorativa elegante para ambientes modernos."
      }
    ];

    const servicos = [
      {
        nome: "Consultoria de Estilo",
        categoria: "Serviço",
        preco: 120.00,
        rating: 4.9,
        duracao: "1h",
        tipo: "Agendamento",
        descricao: "Atendimento personalizado para ajudar na escolha de looks e combinações."
      },
      {
        nome: "Manutenção de Smartwatch",
        categoria: "Serviço",
        preco: 80.00,
        rating: 4.8,
        duracao: "2h",
        tipo: "Assistência",
        descricao: "Diagnóstico e manutenção especializada para dispositivos inteligentes."
      },
      {
        nome: "Montagem e Instalação",
        categoria: "Serviço",
        preco: 95.00,
        rating: 4.7,
        duracao: "1h30",
        tipo: "Casa",
        descricao: "Serviço rápido para instalação e ajustes de produtos residenciais."
      }
    ];

    const listaProdutos = document.getElementById("lista-produtos");
    const listaServicos = document.getElementById("lista-servicos");
    const contadorProdutos = document.getElementById("contador-produtos");
    const contadorServicos = document.getElementById("contador-servicos");

    const busca = document.getElementById("busca");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroTipo = document.getElementById("filtroTipo");
    const ordenacao = document.getElementById("ordenacao");

    function formatarPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    function criarCardProduto(item) {
      return `
        <article class="card-item">
          <div class="card-img-wrap">
            <img src="${item.imagem}" alt="${item.nome}">
            <span class="selo green">${item.selo}</span>
          </div>
          <div class="card-conteudo">
            <div class="card-categoria">${item.categoria}</div>
            <h3>${item.nome}</h3>
            <p class="card-desc">${item.descricao}</p>
            <div class="card-rating">⭐ ${item.rating}</div>
            <div class="card-preco">
              <strong>${formatarPreco(item.preco)}</strong>
              <span>${formatarPreco(item.precoAntigo)}</span>
            </div>
            <div class="card-footer">
              <button class="btn btn-secondary">Detalhes</button>
              <button class="btn btn-primary">Comprar</button>
            </div>
          </div>
        </article>
      `;
    }

    function criarCardServico(item) {
      return `
        <article class="card-servico">
          <div class="servico-topo">
            <h3>${item.nome}</h3>
            <span class="tag-servico">${item.tipo}</span>
          </div>
          <p>${item.descricao}</p>
          <div class="servico-meta">
            <span>⭐ ${item.rating}</span>
            <span>⏱ ${item.duracao}</span>
            <span>💰 A partir de ${formatarPreco(item.preco)}</span>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary">Ver detalhes</button>
            <button class="btn btn-primary">Agendar</button>
          </div>
        </article>
      `;
    }

    function aplicarFiltros() {
      const termo = busca.value.toLowerCase().trim();
      const categoria = filtroCategoria.value;
      const tipo = filtroTipo.value;
      const ordem = ordenacao.value;

      let produtosFiltrados = [...produtos];
      let servicosFiltrados = [...servicos];

      if (termo) {
        produtosFiltrados = produtosFiltrados.filter(item =>
          item.nome.toLowerCase().includes(termo) ||
          item.descricao.toLowerCase().includes(termo) ||
          item.categoria.toLowerCase().includes(termo)
        );

        servicosFiltrados = servicosFiltrados.filter(item =>
          item.nome.toLowerCase().includes(termo) ||
          item.descricao.toLowerCase().includes(termo) ||
          item.categoria.toLowerCase().includes(termo)
        );
      }

      if (categoria !== "todos") {
        produtosFiltrados = produtosFiltrados.filter(item => item.categoria === categoria);
        servicosFiltrados = servicosFiltrados.filter(item => item.categoria === categoria);
      }

      if (ordem === "menor-preco") {
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
        servicosFiltrados.sort((a, b) => a.preco - b.preco);
      }

      if (ordem === "maior-preco") {
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
        servicosFiltrados.sort((a, b) => b.preco - a.preco);
      }

      if (ordem === "melhor-avaliado") {
        produtosFiltrados.sort((a, b) => b.rating - a.rating);
        servicosFiltrados.sort((a, b) => b.rating - a.rating);
      }

      renderizar(produtosFiltrados, servicosFiltrados, tipo);
    }

    function renderizar(produtosData, servicosData, tipo) {
      if (tipo === "servico") {
        listaProdutos.innerHTML = `
          <div class="empty-state">
            Os produtos foram ocultados pelo filtro atual.
          </div>
        `;
      } else {
        listaProdutos.innerHTML = produtosData.length
          ? produtosData.map(criarCardProduto).join("")
          : `<div class="empty-state">Nenhum produto encontrado.</div>`;
      }

      if (tipo === "produto") {
        listaServicos.innerHTML = `
          <div class="empty-state">
            Os serviços foram ocultados pelo filtro atual.
          </div>
        `;
      } else {
        listaServicos.innerHTML = servicosData.length
          ? servicosData.map(criarCardServico).join("")
          : `<div class="empty-state">Nenhum serviço encontrado.</div>`;
      }

      contadorProdutos.textContent =
        tipo === "servico"
          ? "0 produtos"
          : `${produtosData.length} ${produtosData.length === 1 ? "produto" : "produtos"}`;

      contadorServicos.textContent =
        tipo === "produto"
          ? "0 serviços"
          : `${servicosData.length} ${servicosData.length === 1 ? "serviço" : "serviços"}`;
    }

    busca.addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
    filtroTipo.addEventListener("change", aplicarFiltros);
    ordenacao.addEventListener("change", aplicarFiltros);

    renderizar(produtos, servicos, "todos");
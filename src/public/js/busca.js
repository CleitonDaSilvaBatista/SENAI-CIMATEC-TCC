(function () {
  const state = {
    termo: '',
    categoria: 'todas',
    tipo: 'todos',
    precoMin: '',
    precoMax: '',
    ordenacao: 'relevancia',
    lojasApi: []
  };

  function normalizar(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function moeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function getCatalogoBase() {
    return Array.isArray(window.JOBEE_CATALOGO) ? window.JOBEE_CATALOGO : [];
  }

  function getCatalogo() {
    const base = getCatalogoBase();
    const idsBase = new Set(base.map((item) => item.id || item.href || item.nome));
    const lojasNovas = state.lojasApi.filter((loja) => !idsBase.has(loja.id || loja.href || loja.nome));
    return [...base, ...lojasNovas];
  }

  function inferirCategoriaLoja(loja) {
    const texto = normalizar(`${loja.nome_fantasia || loja.nome || ''} ${loja.categoria || ''} ${loja.descricao || ''}`);

    if (texto.includes('barbearia') || texto.includes('barba') || texto.includes('corte')) return 'Beleza';
    if (texto.includes('restaurante') || texto.includes('comida') || texto.includes('marmita') || texto.includes('delivery')) return 'Alimentos';
    if (texto.includes('salao') || texto.includes('beleza') || texto.includes('estetica') || texto.includes('maquiagem')) return 'Beleza';
    if (texto.includes('assistencia') || texto.includes('celular') || texto.includes('computador') || texto.includes('tecnologia')) return 'Serviços';

    return loja.categoria || 'Negócios Locais';
  }

  function normalizarLojaApi(loja) {
    const nome = loja.nome_fantasia || loja.nome || loja.razao_social || 'Negócio local';
    const slug = loja.slug || String(loja.id || nome)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const categoria = inferirCategoriaLoja(loja);
    const cidade = loja.cidade || loja.localidade || 'Salvador';
    const uf = loja.uf || loja.estado || 'BA';

    return {
      id: `loja-api-${loja.id || slug}`,
      tipo: 'loja',
      categoria,
      marca: nome,
      nome,
      preco: Number(loja.preco_medio || loja.preco || 0),
      precoAntigo: null,
      desconto: 'Negócio local',
      imagem: loja.imagem_url || loja.logo_url || '/img/placeholder-loja.png',
      href: `/loja/${slug}`,
      local: `${cidade} - ${uf}`,
      vendedor: nome,
      avaliacao: Number(loja.avaliacao || 4.8),
      descricao: loja.descricao || loja.bio || 'Negócio local em destaque na Jobee.',
      tags: [
        'negocio local', 'loja', 'microempresa', 'empreendedor', 'servico',
        categoria, nome, loja.cnpj, loja.endereco, cidade, uf
      ].filter(Boolean)
    };
  }

  async function carregarNegociosLocais() {
    try {
      const resposta = await fetch('/api/lojas');
      const lojas = await resposta.json();

      if (!resposta.ok) {
        throw new Error(lojas.error || 'Erro ao buscar negócios locais');
      }

      state.lojasApi = Array.isArray(lojas) ? lojas.map(normalizarLojaApi) : [];
    } catch (error) {
      console.warn('Não foi possível carregar negócios locais na busca:', error);
      state.lojasApi = [];
    }
  }

  function lerQueryInicial() {
    const params = new URLSearchParams(window.location.search);
    state.termo = params.get('q') || params.get('busca') || '';
    state.categoria = params.get('categoria') || 'todas';

    const buscaInterna = document.getElementById('busca-interna');
    const navbarInput = document.getElementById('search-input');

    if (buscaInterna) buscaInterna.value = state.termo;
    if (navbarInput) navbarInput.value = state.termo;
  }

  function preencherLocalizacao() {
    const el = document.getElementById('busca-localizacao');
    const cidade = localStorage.getItem('jobee_cidade');
    const uf = localStorage.getItem('jobee_uf');
    if (el && cidade && uf) el.textContent = `${cidade} - ${uf}`;
  }

  function criarFiltrosCategoria() {
    const categorias = [...new Set(getCatalogo().map((item) => item.categoria).filter(Boolean))].sort();
    const lista = document.getElementById('categorias-filtro');
    const mobile = document.getElementById('categoria-mobile');

    if (lista) {
      lista.innerHTML = `
        <label class="filter-option"><input type="radio" name="categoria" value="todas" ${state.categoria === 'todas' ? 'checked' : ''}> Todas</label>
        ${categorias.map((categoria) => `
          <label class="filter-option"><input type="radio" name="categoria" value="${categoria}" ${state.categoria === categoria ? 'checked' : ''}> ${categoria}</label>
        `).join('')}
      `;
    }

    if (mobile) {
      mobile.innerHTML = '<option value="todas">Todas as categorias</option>' + categorias.map((categoria) => `
        <option value="${categoria}" ${state.categoria === categoria ? 'selected' : ''}>${categoria}</option>
      `).join('');
    }
  }

  function calcularRelevancia(item, termoNormalizado) {
    if (!termoNormalizado) return 1;

    const nome = normalizar(item.nome);
    const categoria = normalizar(item.categoria);
    const descricao = normalizar(item.descricao);
    const marca = normalizar(item.marca);
    const vendedor = normalizar(item.vendedor);
    const local = normalizar(item.local);
    const tipo = normalizar(item.tipo);
    const tags = normalizar((item.tags || []).join(' '));

    let pontos = 0;
    if (nome.includes(termoNormalizado)) pontos += 8;
    if (categoria.includes(termoNormalizado)) pontos += 5;
    if (marca.includes(termoNormalizado)) pontos += 4;
    if (tags.includes(termoNormalizado)) pontos += 3;
    if (vendedor.includes(termoNormalizado)) pontos += 3;
    if (local.includes(termoNormalizado)) pontos += 2;
    if (tipo.includes(termoNormalizado)) pontos += 2;
    if (descricao.includes(termoNormalizado)) pontos += 2;

    const palavras = termoNormalizado.split(/\s+/).filter(Boolean);
    palavras.forEach((palavra) => {
      if (nome.includes(palavra)) pontos += 2;
      if (categoria.includes(palavra)) pontos += 1;
      if (vendedor.includes(palavra)) pontos += 1;
      if (local.includes(palavra)) pontos += 1;
      if (tags.includes(palavra)) pontos += 1;
    });

    return pontos;
  }

  function filtrarCatalogo() {
    const termoNormalizado = normalizar(state.termo);
    const min = state.precoMin === '' ? null : Number(state.precoMin);
    const max = state.precoMax === '' ? null : Number(state.precoMax);

    let resultados = getCatalogo()
      .map((item) => ({ ...item, relevancia: calcularRelevancia(item, termoNormalizado) }))
      .filter((item) => !termoNormalizado || item.relevancia > 0)
      .filter((item) => state.tipo === 'todos' || item.tipo === state.tipo)
      .filter((item) => state.categoria === 'todas' || item.categoria === state.categoria)
      .filter((item) => min === null || Number(item.preco || 0) >= min)
      .filter((item) => max === null || Number(item.preco || 0) <= max);

    if (state.ordenacao === 'menor-preco') resultados.sort((a, b) => Number(a.preco) - Number(b.preco));
    else if (state.ordenacao === 'maior-preco') resultados.sort((a, b) => Number(b.preco) - Number(a.preco));
    else if (state.ordenacao === 'melhor-avaliacao') resultados.sort((a, b) => Number(b.avaliacao || 0) - Number(a.avaliacao || 0));
    else resultados.sort((a, b) => Number(b.relevancia || 0) - Number(a.relevancia || 0));

    return resultados;
  }

  function renderizarTitulo(total) {
    const titulo = document.getElementById('titulo-busca');
    const contador = document.getElementById('contador-resultados');

    if (titulo) {
      titulo.textContent = state.termo
        ? `"${state.termo}" na Jobee`
        : 'Produtos, lojas e serviços perto de você';
    }

    if (contador) {
      contador.textContent = `${total} ${total === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;
    }
  }

  function cardResultado(item) {
    const precoAntigo = item.precoAntigo ? `<s>${moeda(item.precoAntigo)}</s>` : '';
    const acao = item.tipo === 'loja' ? 'Ver loja' : 'Ver produto';
    const badge = item.tipo === 'loja' ? 'Loja/serviço' : (item.desconto || 'Produto');

    return `
      <a class="result-card" href="${item.href}">
        <div class="result-thumb">
          <img src="${item.imagem}" alt="${item.nome}" loading="lazy" />
          <span class="result-badge">${badge}</span>
          <span class="favorite-dot">♡</span>
        </div>
        <div class="result-body">
          <h2 class="result-title">${item.nome}</h2>
          <p class="result-desc">${item.descricao || ''}</p>
          <div class="result-price">
            <strong>${moeda(item.preco)}</strong>
            ${precoAntigo}
          </div>
          <div class="result-meta">
            <span>⭐ ${Number(item.avaliacao || 0).toFixed(1)}</span>
            <span>•</span>
            <span>${item.vendedor || item.marca || 'Jobee'}</span>
          </div>
          <div class="result-location">📍 ${item.local || 'Salvador - BA'}</div>
          <div class="result-action">${acao}</div>
        </div>
      </a>
    `;
  }

  function renderizar() {
    const resultados = filtrarCatalogo();
    const grid = document.getElementById('resultado-grid');
    const empty = document.getElementById('sem-resultados');

    renderizarTitulo(resultados.length);

    if (!grid) return;

    if (!resultados.length) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    grid.innerHTML = resultados.map(cardResultado).join('');
  }

  function atualizarUrl() {
    const params = new URLSearchParams();
    if (state.termo) params.set('q', state.termo);
    if (state.categoria !== 'todas') params.set('categoria', state.categoria);
    const query = params.toString();
    const novaUrl = query ? `/buscar?${query}` : '/buscar';
    window.history.replaceState({}, '', novaUrl);
  }

  function bindEventos() {
    const buscaInterna = document.getElementById('busca-interna');
    const ordenacao = document.getElementById('ordenacao');
    const categoriaMobile = document.getElementById('categoria-mobile');
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const limpar = document.getElementById('limpar-filtros');

    buscaInterna?.addEventListener('input', (event) => {
      state.termo = event.target.value.trim();
      atualizarUrl();
      renderizar();
    });

    ordenacao?.addEventListener('change', (event) => {
      state.ordenacao = event.target.value;
      renderizar();
    });

    categoriaMobile?.addEventListener('change', (event) => {
      state.categoria = event.target.value;
      const radio = document.querySelector(`input[name="categoria"][value="${CSS.escape(state.categoria)}"]`);
      if (radio) radio.checked = true;
      atualizarUrl();
      renderizar();
    });

    document.addEventListener('change', (event) => {
      const alvo = event.target;
      if (!(alvo instanceof HTMLInputElement)) return;

      if (alvo.name === 'tipo') {
        state.tipo = alvo.value;
        renderizar();
      }

      if (alvo.name === 'categoria') {
        state.categoria = alvo.value;
        if (categoriaMobile) categoriaMobile.value = alvo.value;
        atualizarUrl();
        renderizar();
      }
    });

    [precoMin, precoMax].forEach((input) => {
      input?.addEventListener('input', () => {
        state.precoMin = precoMin?.value || '';
        state.precoMax = precoMax?.value || '';
        renderizar();
      });
    });

    limpar?.addEventListener('click', () => {
      state.termo = '';
      state.categoria = 'todas';
      state.tipo = 'todos';
      state.precoMin = '';
      state.precoMax = '';
      state.ordenacao = 'relevancia';

      if (buscaInterna) buscaInterna.value = '';
      if (precoMin) precoMin.value = '';
      if (precoMax) precoMax.value = '';
      if (ordenacao) ordenacao.value = 'relevancia';
      const tipoTodos = document.querySelector('input[name="tipo"][value="todos"]');
      if (tipoTodos) tipoTodos.checked = true;
      const catTodas = document.querySelector('input[name="categoria"][value="todas"]');
      if (catTodas) catTodas.checked = true;
      if (categoriaMobile) categoriaMobile.value = 'todas';

      atualizarUrl();
      renderizar();
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    lerQueryInicial();
    preencherLocalizacao();
    await carregarNegociosLocais();
    criarFiltrosCategoria();
    bindEventos();
    renderizar();
  });
})();

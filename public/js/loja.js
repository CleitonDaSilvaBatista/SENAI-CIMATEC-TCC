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
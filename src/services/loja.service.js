const supabase = require('../config/database')

async function getLojas() {
  const { data, error } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, descricao, imagem_url, slug, ativo')
    .eq('ativo', true)
    .order('id_loja', { ascending: false })

  if (error) {
    const err = new Error('Erro ao buscar lojas.')
    err.statusCode = 500
    throw err
  }

  return data || []
}

async function getLojaBySlug(slug) {
  const ID_TIPO_PRODUTO = 1
  const ID_TIPO_SERVICO = 2

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, descricao, imagem_url, slug, ativo, sobre_loja')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (lojaError || !loja) {
    const err = new Error('Loja não encontrada.')
    err.statusCode = 404
    throw err
  }

  const { data: produtos, error: produtosError } = await supabase
    .from('itens')
    .select('id_item, nome, descricao, preco, imagem_url, estoque, duracao_minutos, ativo')
    .eq('id_loja', loja.id_loja)
    .eq('id_tipo_item', ID_TIPO_PRODUTO)
    .eq('ativo', true)
    .order('id_item', { ascending: false })

  if (produtosError) {
    const err = new Error('Erro ao buscar produtos.')
    err.statusCode = 500
    throw err
  }

  const { data: servicos, error: servicosError } = await supabase
    .from('itens')
    .select('id_item, nome, descricao, preco, imagem_url, estoque, duracao_minutos, ativo')
    .eq('id_loja', loja.id_loja)
    .eq('id_tipo_item', ID_TIPO_SERVICO)
    .eq('ativo', true)
    .order('id_item', { ascending: false })

  if (servicosError) {
    const err = new Error('Erro ao buscar serviços.')
    err.statusCode = 500
    throw err
  }

  return {
    loja,
    produtos: produtos || [],
    servicos: servicos || []
  }
}

module.exports = {
  getLojas,
  getLojaBySlug
}
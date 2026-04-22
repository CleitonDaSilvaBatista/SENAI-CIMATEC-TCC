const supabase = require('../config/database')

async function getItemById(id) {
  const { data: item, error: itemError } = await supabase
    .from('itens')
    .select('id_item, id_loja, nome, descricao, preco, imagem_url, estoque, duracao_minutos, ativo')
    .eq('id_item', id)
    .eq('ativo', true)
    .single()

  if (itemError || !item) {
    const err = new Error('Item não encontrado.')
    err.statusCode = 404
    throw err
  }

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, slug')
    .eq('id_loja', item.id_loja)
    .single()

  if (lojaError || !loja) {
    const err = new Error('Loja do item não encontrada.')
    err.statusCode = 404
    throw err
  }

  return {
    ...item,
    loja
  }
}

module.exports = {
  getItemById
}
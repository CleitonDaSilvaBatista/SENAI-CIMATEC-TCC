const supabase = require('../config/database')

function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function gerarSlug(nome = '') {
  const base = normalizarTexto(nome)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || `loja-${Date.now()}`
}

function apenasNumeros(valor = '') {
  return String(valor).replace(/\D/g, '')
}

async function getLojas() {
  const { data, error } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, descricao, imagem_url, banner_url, slug, ativo')
    .eq('ativo', true)
    .order('id_loja', { ascending: false })

  if (error) {
    const err = new Error('Erro ao buscar lojas.')
    err.statusCode = 500
    throw err
  }

  return data || []
}

async function getCategoriasLoja() {
  const { data, error } = await supabase
    .from('categorias_loja')
    .select('id_categoria, nome, descricao')
    .order('nome', { ascending: true })

  if (error) {
    const err = new Error('Erro ao buscar categorias da loja.')
    err.statusCode = 500
    throw err
  }

  return data || []
}

async function createLoja(body, usuarioLogado) {
  const idUsuario = usuarioLogado?.id
  const nomeFantasia = String(body.nome_fantasia || '').trim()
  const descricao = String(body.descricao || '').trim()
  const cnpj = apenasNumeros(body.cnpj)
  const cpfResponsavel = apenasNumeros(body.cpf_responsavel)
  const cep = apenasNumeros(body.cep)
  const idCategoria = Number(body.id_categoria)

  if (!idUsuario) {
    const err = new Error('Usuário não autenticado.')
    err.statusCode = 401
    throw err
  }

  if (!nomeFantasia || !descricao || !idCategoria) {
    const err = new Error('Nome fantasia, descrição e categoria são obrigatórios.')
    err.statusCode = 400
    throw err
  }

  if (cnpj.length !== 14) {
    const err = new Error('CNPJ inválido. Informe exatamente 14 números.')
    err.statusCode = 400
    throw err
  }

  if (cpfResponsavel.length !== 11) {
    const err = new Error('CPF inválido. Informe exatamente 11 números.')
    err.statusCode = 400
    throw err
  }

  if (cep.length !== 8) {
    const err = new Error('CEP inválido. Informe exatamente 8 números.')
    err.statusCode = 400
    throw err
  }

  const { data: categoria, error: categoriaError } = await supabase
    .from('categorias_loja')
    .select('id_categoria')
    .eq('id_categoria', idCategoria)
    .single()

  if (categoriaError || !categoria) {
    const err = new Error('Categoria da loja não encontrada no banco.')
    err.statusCode = 400
    throw err
  }

  const { data: cnpjExistente } = await supabase
    .from('lojas')
    .select('id_loja')
    .eq('cnpj', cnpj)
    .maybeSingle()

  if (cnpjExistente) {
    const err = new Error('Já existe uma loja cadastrada com este CNPJ.')
    err.statusCode = 409
    throw err
  }

  const slugBase = gerarSlug(nomeFantasia)
  let slug = slugBase
  let contador = 1

  while (true) {
    const { data: slugExistente } = await supabase
      .from('lojas')
      .select('id_loja')
      .eq('slug', slug)
      .maybeSingle()

    if (!slugExistente) break
    contador += 1
    slug = `${slugBase}-${contador}`
  }

  const lojaPayload = {
    id_usuario: idUsuario,
    nome_fantasia: nomeFantasia,
    descricao: descricao.slice(0, 150),
    cnpj,
    slug,
    ativo: true
  }

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .insert(lojaPayload)
    .select('id_loja, nome_fantasia, descricao, cnpj, slug, ativo')
    .single()

  if (lojaError || !loja) {
    const err = new Error('Erro ao cadastrar loja.')
    err.statusCode = 500
    throw err
  }

  const { error: vinculoError } = await supabase
    .from('lojas_categorias')
    .insert({
      id_loja: loja.id_loja,
      id_categoria: idCategoria
    })

  if (vinculoError) {
    const err = new Error('Loja criada, mas houve erro ao vincular a categoria.')
    err.statusCode = 500
    throw err
  }

  return {
    success: true,
    message: 'Loja cadastrada com sucesso.',
    loja
  }
}

async function getLojaBySlug(slug) {
  const ID_TIPO_PRODUTO = 1
  const ID_TIPO_SERVICO = 2

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, descricao, imagem_url, banner_url, slug, ativo, sobre_loja')
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

async function getItensCountByLoja(id_loja) {
  const ID_TIPO_PRODUTO = 1
  const ID_TIPO_SERVICO = 2

  const { count: produtosCount, error: produtosError } = await supabase
    .from('itens')
    .select('*', { count: 'exact', head: true })
    .eq('id_loja', id_loja)
    .eq('id_tipo_item', ID_TIPO_PRODUTO)
    .eq('ativo', true)

  if (produtosError) {
    const err = new Error('Erro ao contar produtos.')
    err.statusCode = 500
    throw err
  }

  const { count: servicosCount, error: servicosError } = await supabase
    .from('itens')
    .select('*', { count: 'exact', head: true })
    .eq('id_loja', id_loja)
    .eq('id_tipo_item', ID_TIPO_SERVICO)
    .eq('ativo', true)

  if (servicosError) {
    const err = new Error('Erro ao contar serviços.')
    err.statusCode = 500
    throw err
  }

  return {
    produtos: produtosCount || 0,
    servicos: servicosCount || 0
  }
}

module.exports = {
  getLojas,
  getCategoriasLoja,
  createLoja,
  getLojaBySlug,
  getItensCountByLoja
}

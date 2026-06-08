const supabase = require('../config/database')


function gerarSlug(texto) {
  const base = String(texto || 'loja')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'loja'

  return `${base}-${Date.now().toString(36)}`
}

async function garantirEmpreendedor(idUsuario) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('id_usuario, id_tipo_usuario')
    .eq('id_usuario', idUsuario)
    .single()

  if (error || !usuario) {
    const err = new Error('Usuário não encontrado.')
    err.statusCode = 404
    throw err
  }

  if (Number(usuario.id_tipo_usuario) !== 2) {
    const err = new Error('Apenas perfis empreendedores podem cadastrar lojas.')
    err.statusCode = 403
    throw err
  }
}

async function createLoja(user, body = {}) {
  const idUsuario = user?.id

  if (!idUsuario) {
    const err = new Error('Usuário não autenticado.')
    err.statusCode = 401
    throw err
  }

  await garantirEmpreendedor(idUsuario)

  const nomeFantasia = String(body.nome_fantasia || body.fantasia || '').trim()
  const descricao = String(body.descricao || '').trim()
  const cnpj = String(body.cnpj || '').trim()

  if (!nomeFantasia || !descricao || !cnpj) {
    const err = new Error('Nome fantasia, descrição e CNPJ são obrigatórios.')
    err.statusCode = 400
    throw err
  }

  const novaLoja = {
    id_usuario: idUsuario,
    nome_fantasia: nomeFantasia,
    descricao: descricao.slice(0, 150),
    cnpj,
    imagem_url: body.imagem_url || '/img/logo-jobee.svg',
    banner_url: body.banner_url || '/img/banercarrosel.webp',
    slug: gerarSlug(nomeFantasia),
    ativo: true,
    sobre_loja: body.sobre_loja || descricao
  }

  const { data, error } = await supabase
    .from('lojas')
    .insert(novaLoja)
    .select('id_loja, id_usuario, nome_fantasia, descricao, imagem_url, banner_url, slug, ativo, sobre_loja, data_criacao')
    .single()

  if (error) {
    const err = new Error(`Erro ao cadastrar loja: ${error.message}`)
    err.statusCode = 500
    throw err
  }

  return {
    message: 'Loja cadastrada com sucesso!',
    loja: data
  }
}

async function getMinhasLojas(user) {
  const idUsuario = user?.id

  if (!idUsuario) {
    const err = new Error('Usuário não autenticado.')
    err.statusCode = 401
    throw err
  }

  await garantirEmpreendedor(idUsuario)

  const { data, error } = await supabase
    .from('lojas')
    .select('id_loja, nome_fantasia, descricao, imagem_url, banner_url, slug, ativo, data_criacao')
    .eq('id_usuario', idUsuario)
    .order('id_loja', { ascending: false })

  if (error) {
    const err = new Error('Erro ao buscar lojas cadastradas.')
    err.statusCode = 500
    throw err
  }

  return data || []
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
  createLoja,
  getMinhasLojas,
  getLojas,
  getLojaBySlug,
  getItensCountByLoja
}
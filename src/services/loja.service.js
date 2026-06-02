const supabase = require('../config/database')

function normalizarTexto(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function criarSlug(nome) {
  const slug = normalizarTexto(nome)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `loja-${Date.now()}`
}

function limparTexto(valor) {
  if (valor === undefined || valor === null) return null
  const texto = String(valor).trim()
  return texto || null
}

function limparObjeto(objeto) {
  const limpo = { ...objeto }

  Object.keys(limpo).forEach((chave) => {
    if (limpo[chave] === null || limpo[chave] === undefined || limpo[chave] === 'Selecione') {
      delete limpo[chave]
    }
  })

  return limpo
}

async function gerarSlugUnico(nomeFantasia) {
  const slugBase = criarSlug(nomeFantasia)
  let slug = slugBase
  let contador = 1

  while (true) {
    const { data, error } = await supabase
      .from('lojas')
      .select('id_loja')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      const err = new Error('Erro ao validar o endereço da loja.')
      err.statusCode = 500
      throw err
    }

    if (!data) return slug

    contador += 1
    slug = `${slugBase}-${contador}`
  }
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

async function criarLoja(dados, usuarioLogado) {
  const idUsuario = usuarioLogado?.id || usuarioLogado?.id_usuario || usuarioLogado?.userId

  if (!idUsuario) {
    const err = new Error('Usuário não autenticado.')
    err.statusCode = 401
    throw err
  }

  const nomeFantasia = limparTexto(dados.nome_fantasia || dados.fantasia || dados.nome_loja)
  const descricao = limparTexto(dados.descricao)
  const cnpj = limparTexto(dados.cnpj)

  if (!nomeFantasia) {
    const err = new Error('Nome fantasia da loja é obrigatório.')
    err.statusCode = 400
    throw err
  }

  if (!cnpj) {
    const err = new Error('CNPJ da loja é obrigatório.')
    err.statusCode = 400
    throw err
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('id_usuario, id_tipo_usuario, nome, email, ativo')
    .eq('id_usuario', idUsuario)
    .eq('ativo', true)
    .maybeSingle()

  if (usuarioError) {
    const err = new Error('Erro ao validar a conta do usuário.')
    err.statusCode = 500
    throw err
  }

  if (!usuario) {
    const err = new Error('Para cadastrar uma loja, é necessário ter uma conta ativa associada ao login.')
    err.statusCode = 403
    throw err
  }

  const { data: lojaDoUsuario, error: lojaUsuarioError } = await supabase
    .from('lojas')
    .select('id_loja')
    .eq('id_usuario', idUsuario)
    .maybeSingle()

  if (lojaUsuarioError) {
    const err = new Error('Erro ao verificar loja existente.')
    err.statusCode = 500
    throw err
  }

  if (lojaDoUsuario) {
    const err = new Error('Este usuário já possui uma loja cadastrada.')
    err.statusCode = 409
    throw err
  }

  const { data: lojaComCnpj, error: cnpjError } = await supabase
    .from('lojas')
    .select('id_loja')
    .eq('cnpj', cnpj)
    .maybeSingle()

  if (cnpjError) {
    const err = new Error('Erro ao validar CNPJ da loja.')
    err.statusCode = 500
    throw err
  }

  if (lojaComCnpj) {
    const err = new Error('Já existe uma loja cadastrada com este CNPJ.')
    err.statusCode = 409
    throw err
  }

  const slug = await gerarSlugUnico(nomeFantasia)

  const lojaCompleta = limparObjeto({
    id_usuario: idUsuario,
    nome_fantasia: nomeFantasia,
    razao_social: limparTexto(dados.razao_social),
    descricao: descricao || 'Loja cadastrada na Jobee.',
    cnpj,
    porte: limparTexto(dados.porte),
    data_fundacao: limparTexto(dados.data_fundacao),
    segmento: limparTexto(dados.segmento),
    cnae: limparTexto(dados.cnae),
    site: limparTexto(dados.site),
    telefone: limparTexto(dados.telefone),
    whatsapp: limparTexto(dados.whatsapp),
    responsavel_legal: limparTexto(dados.responsavel_legal),
    cargo_responsavel: limparTexto(dados.cargo_responsavel),
    cpf_responsavel: limparTexto(dados.cpf_responsavel),
    email_corporativo: limparTexto(dados.email_corporativo),
    gestor_operacional: limparTexto(dados.gestor_operacional),
    email_gestor: limparTexto(dados.email_gestor),
    cep: limparTexto(dados.cep),
    logradouro: limparTexto(dados.logradouro),
    numero: limparTexto(dados.numero),
    complemento: limparTexto(dados.complemento),
    bairro: limparTexto(dados.bairro),
    cidade: limparTexto(dados.cidade),
    area_atuacao: limparTexto(dados.area_atuacao),
    modelo_operacao: limparTexto(dados.modelo_operacao),
    quantidade_usuarios: limparTexto(dados.quantidade_usuarios),
    volume_mensal: limparTexto(dados.volume_mensal),
    banco: limparTexto(dados.banco),
    agencia: limparTexto(dados.agencia),
    conta_bancaria: limparTexto(dados.conta_bancaria),
    titular_conta: limparTexto(dados.titular_conta),
    pix: limparTexto(dados.pix),
    imagem_url: limparTexto(dados.imagem_url),
    banner_url: limparTexto(dados.banner_url),
    sobre_loja: limparTexto(dados.sobre_loja || dados.descricao_institucional || dados.descricao),
    slug,
    ativo: true
  })

  const lojaBasica = limparObjeto({
    id_usuario: idUsuario,
    nome_fantasia: nomeFantasia,
    descricao: descricao || 'Loja cadastrada na Jobee.',
    cnpj,
    imagem_url: limparTexto(dados.imagem_url),
    slug,
    ativo: true
  })

  let lojaCriada
  let insertError

  const insertCompleto = await supabase
    .from('lojas')
    .insert(lojaCompleta)
    .select('*')
    .single()

  lojaCriada = insertCompleto.data
  insertError = insertCompleto.error

  if (insertError && /column|schema cache|Could not find/i.test(insertError.message || '')) {
    const insertBasico = await supabase
      .from('lojas')
      .insert(lojaBasica)
      .select('*')
      .single()

    lojaCriada = insertBasico.data
    insertError = insertBasico.error
  }

  if (insertError) {
    const err = new Error('Erro ao cadastrar loja no Supabase.')
    err.statusCode = 500
    err.details = insertError.message
    throw err
  }

  return {
    success: true,
    message: 'Loja cadastrada com sucesso.',
    loja: lojaCriada
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
  criarLoja,
  getLojaBySlug,
  getItensCountByLoja
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form')

  if (!form) return

  const token = localStorage.getItem('jobee_token')

  if (!token) {
    const destino = '/cadastrar-loja'
    sessionStorage.setItem('jobee_redirect_after_login', destino)
    window.location.href = `/login?redirect=${encodeURIComponent(destino)}`
    return
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const botao = form.querySelector('button[type="submit"]')
    const textoOriginal = botao?.textContent

    const dadosLoja = {
      razao_social: document.getElementById('razao')?.value?.trim(),
      nome_fantasia: document.getElementById('fantasia')?.value?.trim(),
      cnpj: document.getElementById('cnpj')?.value?.trim(),
      porte: document.getElementById('porte')?.value,
      data_fundacao: document.getElementById('fundacao')?.value,
      segmento: document.getElementById('segmento')?.value,
      cnae: document.getElementById('cnae')?.value?.trim(),
      site: document.getElementById('site')?.value?.trim(),
      descricao: document.getElementById('descricao')?.value?.trim(),
      sobre_loja: document.getElementById('descricao')?.value?.trim(),
      responsavel_legal: document.getElementById('responsavel')?.value?.trim(),
      cargo_responsavel: document.getElementById('cargo')?.value?.trim(),
      cpf_responsavel: document.getElementById('cpf')?.value?.trim(),
      email_corporativo: document.getElementById('emailcorp')?.value?.trim(),
      telefone: document.getElementById('telefone')?.value?.trim(),
      whatsapp: document.getElementById('whatsapp')?.value?.trim(),
      gestor_operacional: document.getElementById('gestor')?.value?.trim(),
      email_gestor: document.getElementById('emailgestor')?.value?.trim(),
      cep: document.getElementById('cep')?.value?.trim(),
      logradouro: document.getElementById('logradouro')?.value?.trim(),
      numero: document.getElementById('numero')?.value?.trim(),
      complemento: document.getElementById('complemento')?.value?.trim(),
      bairro: document.getElementById('bairro')?.value?.trim(),
      cidade: document.getElementById('cidade')?.value?.trim(),
      area_atuacao: document.getElementById('atuacao')?.value,
      modelo_operacao: document.getElementById('operacao')?.value,
      quantidade_usuarios: document.getElementById('usuarios')?.value,
      volume_mensal: document.getElementById('volume')?.value,
      banco: document.getElementById('banco')?.value?.trim(),
      agencia: document.getElementById('agencia')?.value?.trim(),
      conta_bancaria: document.getElementById('conta')?.value?.trim(),
      titular_conta: document.getElementById('titular')?.value?.trim(),
      pix: document.getElementById('pix')?.value?.trim()
    }

    if (!dadosLoja.nome_fantasia || !dadosLoja.cnpj) {
      alert('Preencha pelo menos o nome fantasia e o CNPJ da loja.')
      return
    }

    try {
      if (botao) {
        botao.disabled = true
        botao.textContent = 'Cadastrando...'
      }

      const resposta = await fetch('/api/lojas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dadosLoja)
      })

      const resultado = await resposta.json()

      if (!resposta.ok) {
        if (resposta.status === 401) {
          localStorage.removeItem('jobee_token')
          localStorage.removeItem('jobee_user')
          sessionStorage.setItem('jobee_redirect_after_login', '/cadastrar-loja')
          window.location.href = '/login?redirect=/cadastrar-loja'
          return
        }

        throw new Error(resultado.error || 'Erro ao cadastrar loja.')
      }

      alert('Loja cadastrada com sucesso!')
      window.location.href = resultado.loja?.slug ? `/loja/${resultado.loja.slug}` : '/dashboard'
    } catch (error) {
      alert(error.message)
    } finally {
      if (botao) {
        botao.disabled = false
        botao.textContent = textoOriginal
      }
    }
  })
})

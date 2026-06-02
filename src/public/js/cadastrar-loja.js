document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form')

  if (!form) return

  const token = localStorage.getItem('jobee_token')

  if (!token) {
    alert('Você precisa estar logado para cadastrar uma loja.')
    window.location.href = '/login'
    return
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const botao = form.querySelector('button[type="submit"]')
    const textoOriginal = botao?.textContent

    const dadosLoja = {
      nome_fantasia: document.getElementById('fantasia')?.value?.trim(),
      cnpj: document.getElementById('cnpj')?.value?.trim(),
      descricao: document.getElementById('descricao')?.value?.trim(),
      sobre_loja: document.getElementById('descricao')?.value?.trim(),
      razao_social: document.getElementById('razao')?.value?.trim(),
      porte: document.getElementById('porte')?.value,
      segmento: document.getElementById('segmento')?.value,
      cnae: document.getElementById('cnae')?.value?.trim(),
      site: document.getElementById('site')?.value?.trim(),
      telefone: document.getElementById('telefone')?.value?.trim(),
      whatsapp: document.getElementById('whatsapp')?.value?.trim(),
      cep: document.getElementById('cep')?.value?.trim(),
      logradouro: document.getElementById('logradouro')?.value?.trim(),
      numero: document.getElementById('numero')?.value?.trim(),
      bairro: document.getElementById('bairro')?.value?.trim(),
      cidade: document.getElementById('cidade')?.value?.trim()
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

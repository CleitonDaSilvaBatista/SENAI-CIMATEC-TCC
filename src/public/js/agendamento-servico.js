document.addEventListener('DOMContentLoaded', iniciarAgendamento);

let servicoAtual = null;

async function iniciarAgendamento() {
  const params = new URLSearchParams(window.location.search);
  const idServico = params.get('id');

  const inputData = document.getElementById('data-agendamento');
  if (inputData) {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 1);
    inputData.min = hoje.toISOString().split('T')[0];
  }

  if (!idServico) {
    showToast('Serviço não informado.', 'error');
    return;
  }

  try {
    const resposta = await fetch(`/api/itens/${idServico}`);
    const servico = await resposta.json();

    if (!resposta.ok) {
      throw new Error(servico.error || 'Erro ao carregar serviço.');
    }

    servicoAtual = servico;
    preencherServico(servico);
  } catch (error) {
    console.error(error);
    showToast('Erro ao carregar serviço.', 'error');
  }

  const form = document.getElementById('form-agendamento');
  form?.addEventListener('submit', confirmarAgendamento);
}

function preencherServico(servico) {
  document.title = `${servico.nome || 'Serviço'} | Agendamento Jobee`;

  const imagem = document.getElementById('servico-imagem');
  const loja = document.getElementById('servico-loja');
  const nome = document.getElementById('servico-nome');
  const descricao = document.getElementById('servico-descricao');
  const preco = document.getElementById('servico-preco');
  const duracao = document.getElementById('servico-duracao');

  if (imagem) {
    imagem.src = servico.imagem_url || '/img/placeholder-loja.png';
    imagem.alt = servico.nome || 'Imagem do serviço';
  }

  if (loja) loja.textContent = servico.loja?.nome_fantasia || 'Loja Jobee';
  if (nome) nome.textContent = servico.nome || 'Serviço sem nome';
  if (descricao) descricao.textContent = servico.descricao || 'Sem descrição disponível.';
  if (preco) preco.textContent = `R$ ${Number(servico.preco || 0).toFixed(2).replace('.', ',')}`;
  if (duracao) duracao.textContent = servico.duracao_minutos ? `${servico.duracao_minutos} min` : 'Sob consulta';
}

function confirmarAgendamento(event) {
  event.preventDefault();

  if (!servicoAtual) {
    showToast('Serviço ainda não carregou.', 'error');
    return;
  }

  const agendamento = {
    id_item: servicoAtual.id_item,
    id_loja: servicoAtual.id_loja,
    servico: servicoAtual.nome,
    loja: servicoAtual.loja?.nome_fantasia || 'Loja Jobee',
    nome_cliente: document.getElementById('cliente-nome')?.value.trim(),
    telefone: document.getElementById('cliente-telefone')?.value.trim(),
    data: document.getElementById('data-agendamento')?.value,
    horario: document.getElementById('horario-agendamento')?.value,
    observacoes: document.getElementById('observacoes')?.value.trim(),
    criado_em: new Date().toISOString()
  };

  const agendamentos = JSON.parse(localStorage.getItem('jobee_agendamentos')) || [];
  agendamentos.push(agendamento);
  localStorage.setItem('jobee_agendamentos', JSON.stringify(agendamentos));

  showToast('Agendamento solicitado com sucesso!', 'success');
  event.target.reset();
}

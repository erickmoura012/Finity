// Arquivo principal: guarda o estado da página e liga os eventos

let tarefas = [];
let categorias = [];
let idParaExcluir = null;
let paginaAtual = 'dashboard';

const filtros = {
  busca: '',
  prioridade: '',
  categoria: ''
};

const paginas = {
  dashboard: {
    titulo: 'Dashboard',
    subtitulo: 'Acompanhe o andamento das suas tarefas'
  },
  projetos: {
    titulo: 'Meus projetos',
    subtitulo: 'Suas tarefas separadas por categoria'
  },
  tarefas: {
    titulo: 'Tarefas',
    subtitulo: 'Todas as tarefas cadastradas'
  },
  concluidas: {
    titulo: 'Concluídas',
    subtitulo: 'Tarefas que já foram finalizadas'
  }
};

document.addEventListener('DOMContentLoaded', iniciar);

function iniciar() {
  configurarMenu();
  configurarFiltros();
  configurarModais();
  configurarCliques();
  configurarDragAndDrop();
  carregarDados();
}

async function carregarDados() {
  try {
    categorias = await listarCategorias();
    tarefas = await listarTarefas();
    preencherCategorias(categorias);
    atualizarTela();
  } catch (erro) {
    console.error(erro);
    mostrarToast('Não foi possível carregar os dados', 'erro');
  }
}

// Redesenha tudo com base na lista de tarefas e nos filtros
function atualizarTela() {
  const filtradas = filtrarTarefas(tarefas, filtros);
  const concluidas = filtradas.filter(t => t.status === 'concluido');

  renderizarIndicadores(contarTarefas(tarefas));
  renderizarQuadro(filtradas);
  renderizarTabela(filtradas, 'listaTarefas', 'Nenhuma tarefa encontrada.');
  renderizarTabela(concluidas, 'listaConcluidas', 'Nenhuma tarefa concluída por enquanto.');
  renderizarProjetos(tarefas, categorias);
}

// ---------- Navegação ----------

function configurarMenu() {
  document.querySelectorAll('.menu-item').forEach(function (item) {
    item.addEventListener('click', function (evento) {
      evento.preventDefault();
      mudarPagina(item.dataset.pagina);
      fecharMenuCelular();
    });
  });

  document.getElementById('btnMenu').addEventListener('click', abrirMenuCelular);
  document.getElementById('overlay').addEventListener('click', fecharMenuCelular);
}

function mudarPagina(nome) {
  paginaAtual = nome;

  document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa'));
  document.getElementById('pagina-' + nome).classList.add('ativa');

  document.querySelectorAll('.menu-item').forEach(function (item) {
    item.classList.toggle('ativo', item.dataset.pagina === nome);
  });

  document.getElementById('tituloPagina').textContent = paginas[nome].titulo;
  document.getElementById('subtituloPagina').textContent = paginas[nome].subtitulo;

  // na página de projetos os filtros não fazem sentido
  document.getElementById('filtros').classList.toggle('escondido', nome === 'projetos');

  // o botão do topo cria projeto na página de projetos e tarefa nas outras
  document.querySelector('#btnAdicionar span').textContent =
    nome === 'projetos' ? 'Novo projeto' : 'Nova tarefa';
}

function abrirMenuCelular() {
  document.getElementById('sidebar').classList.add('aberta');
  document.getElementById('overlay').classList.add('visivel');
}

function fecharMenuCelular() {
  document.getElementById('sidebar').classList.remove('aberta');
  document.getElementById('overlay').classList.remove('visivel');
}

// ---------- Pesquisa e filtros ----------

function configurarFiltros() {
  const campoBusca = document.getElementById('busca');
  const selectPrioridade = document.getElementById('filtroPrioridade');
  const selectCategoria = document.getElementById('filtroCategoria');

  campoBusca.addEventListener('input', function () {
    filtros.busca = campoBusca.value;
    atualizarTela();
  });

  selectPrioridade.addEventListener('change', function () {
    filtros.prioridade = selectPrioridade.value;
    atualizarTela();
  });

  selectCategoria.addEventListener('change', function () {
    filtros.categoria = selectCategoria.value;
    atualizarTela();
  });

  document.getElementById('btnLimparFiltros').addEventListener('click', limparFiltros);
}

function limparFiltros() {
  filtros.busca = '';
  filtros.prioridade = '';
  filtros.categoria = '';

  document.getElementById('busca').value = '';
  document.getElementById('filtroPrioridade').value = '';
  document.getElementById('filtroCategoria').value = '';

  atualizarTela();
}

// Ao clicar em um projeto, mostra as tarefas daquela categoria
function abrirProjeto(categoria) {
  limparFiltros();
  filtros.categoria = categoria;
  document.getElementById('filtroCategoria').value = categoria;
  atualizarTela();
  mudarPagina('tarefas');
}

// ---------- Cliques nos cards, tabelas e projetos ----------
// Como os cards são recriados toda hora, uso um único evento no documento

function configurarCliques() {
  document.addEventListener('click', function (evento) {
    const botao = evento.target.closest('[data-acao]');

    if (botao) {
      const acao = botao.dataset.acao;

      if (acao === 'nova') abrirModalNovaTarefa(botao.dataset.status, botao.dataset.categoria);
      if (acao === 'editar') abrirModalEdicao(botao.dataset.id);
      if (acao === 'excluir') abrirModalExclusao(botao.dataset.id);
      return;
    }

    const card = evento.target.closest('.card');
    if (card) {
      abrirModalEdicao(card.dataset.id);
      return;
    }

    const projeto = evento.target.closest('.projeto');
    if (projeto) {
      abrirProjeto(projeto.dataset.categoria);
    }
  });

  document.getElementById('btnAdicionar').addEventListener('click', function () {
    if (paginaAtual === 'projetos') {
      abrirModalNovoProjeto();
    } else {
      abrirModalNovaTarefa('a_fazer');
    }
  });
}

// ---------- Modal de criar / editar ----------

function configurarModais() {
  document.getElementById('formTarefa').addEventListener('submit', salvarFormulario);
  document.getElementById('formProjeto').addEventListener('submit', salvarProjeto);
  document.getElementById('btnConfirmarExclusao').addEventListener('click', confirmarExclusao);

  // botões de fechar e cancelar
  document.querySelectorAll('[data-fechar]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      botao.closest('.modal-fundo').classList.remove('aberto');
    });
  });

  // fechar clicando fora do modal
  document.querySelectorAll('.modal-fundo').forEach(function (fundo) {
    fundo.addEventListener('mousedown', function (evento) {
      if (evento.target === fundo) fundo.classList.remove('aberto');
    });
  });

  // fechar com ESC
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharModal('modalTarefa');
      fecharModal('modalProjeto');
      fecharModal('modalExcluir');
    }
  });
}

function limparErroFormulario() {
  document.getElementById('formErro').classList.remove('visivel');
  document.querySelectorAll('#formTarefa .input').forEach(c => c.classList.remove('invalido'));
}

function abrirModalNovaTarefa(status, categoria) {
  document.getElementById('formTarefa').reset();
  limparErroFormulario();

  document.getElementById('modalTitulo').textContent = 'Nova tarefa';
  document.getElementById('btnSalvar').textContent = 'Criar tarefa';
  document.getElementById('infoCriacao').textContent = '';

  document.getElementById('campoId').value = '';
  document.getElementById('campoPrioridade').value = 'media';
  document.getElementById('campoStatus').value = status || 'a_fazer';
  document.getElementById('campoDataLimite').value = dataDeHoje();

  // se veio de um projeto ou tem filtro de categoria, já deixa ela selecionada
  if (categoria) {
    document.getElementById('campoCategoria').value = categoria;
  } else if (filtros.categoria) {
    document.getElementById('campoCategoria').value = filtros.categoria;
  }

  abrirModal('modalTarefa');
  document.getElementById('campoTitulo').focus();
}

function abrirModalEdicao(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  limparErroFormulario();

  document.getElementById('modalTitulo').textContent = 'Editar tarefa';
  document.getElementById('btnSalvar').textContent = 'Salvar alterações';
  document.getElementById('infoCriacao').textContent =
    'Criada em ' + formatarDataCriacao(tarefa.dataCriacao);

  document.getElementById('campoId').value = tarefa.id;
  document.getElementById('campoTitulo').value = tarefa.titulo;
  document.getElementById('campoDescricao').value = tarefa.descricao;
  document.getElementById('campoPrioridade').value = tarefa.prioridade;
  document.getElementById('campoCategoria').value = tarefa.categoria;
  document.getElementById('campoDataLimite').value = tarefa.dataLimite;
  document.getElementById('campoStatus').value = tarefa.status;

  abrirModal('modalTarefa');
}

function pegarDadosDoFormulario() {
  return {
    titulo: document.getElementById('campoTitulo').value.trim(),
    descricao: document.getElementById('campoDescricao').value.trim(),
    prioridade: document.getElementById('campoPrioridade').value,
    categoria: document.getElementById('campoCategoria').value,
    dataLimite: document.getElementById('campoDataLimite').value,
    status: document.getElementById('campoStatus').value
  };
}

async function salvarFormulario(evento) {
  evento.preventDefault();

  const id = document.getElementById('campoId').value;
  const dados = pegarDadosDoFormulario();
  const erro = validarTarefa(dados);

  if (erro) {
    const campoErro = document.getElementById('formErro');
    campoErro.textContent = erro;
    campoErro.classList.add('visivel');

    if (!dados.titulo || dados.titulo.length < 3) {
      document.getElementById('campoTitulo').classList.add('invalido');
    }
    if (!dados.dataLimite) {
      document.getElementById('campoDataLimite').classList.add('invalido');
    }
    return;
  }

  try {
    if (id) {
      await atualizarTarefa(id, dados);
      mostrarToast('Tarefa atualizada');
    } else {
      await criarTarefa(dados);
      mostrarToast('Tarefa criada com sucesso');
    }

    fecharModal('modalTarefa');
    await carregarDados();
  } catch (erro) {
    console.error(erro);
    mostrarToast('Erro ao salvar a tarefa', 'erro');
  }
}

// ---------- Exclusão ----------

function abrirModalExclusao(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  idParaExcluir = id;
  document.getElementById('nomeTarefaExcluir').textContent = '"' + tarefa.titulo + '"';
  abrirModal('modalExcluir');
}

async function confirmarExclusao() {
  if (!idParaExcluir) return;

  try {
    await excluirTarefa(idParaExcluir);
    idParaExcluir = null;
    fecharModal('modalExcluir');
    mostrarToast('Tarefa excluída');
    await carregarDados();
  } catch (erro) {
    console.error(erro);
    mostrarToast('Erro ao excluir a tarefa', 'erro');
  }
}

// ---------- Novo projeto ----------

function abrirModalNovoProjeto() {
  document.getElementById('formProjeto').reset();
  document.getElementById('formProjetoErro').classList.remove('visivel');
  document.getElementById('campoNomeProjeto').classList.remove('invalido');

  abrirModal('modalProjeto');
  document.getElementById('campoNomeProjeto').focus();
}

async function salvarProjeto(evento) {
  evento.preventDefault();

  const campoNome = document.getElementById('campoNomeProjeto');
  const nome = campoNome.value.trim();
  const erro = validarProjeto(nome, categorias);

  if (erro) {
    const campoErro = document.getElementById('formProjetoErro');
    campoErro.textContent = erro;
    campoErro.classList.add('visivel');
    campoNome.classList.add('invalido');
    return;
  }

  try {
    await criarCategoria(nome);
    fecharModal('modalProjeto');
    mostrarToast('Projeto criado com sucesso');
    await carregarDados();
  } catch (erro) {
    console.error(erro);
    mostrarToast('Erro ao criar o projeto', 'erro');
  }
}

// ---------- Drag and drop ----------

function configurarDragAndDrop() {
  const quadro = document.getElementById('quadro');
  const colunas = document.querySelectorAll('.coluna');

  quadro.addEventListener('dragstart', function (evento) {
    const card = evento.target.closest('.card');
    if (!card) return;

    card.classList.add('arrastando');
    evento.dataTransfer.effectAllowed = 'move';
    evento.dataTransfer.setData('text/plain', card.dataset.id);
  });

  quadro.addEventListener('dragend', function (evento) {
    const card = evento.target.closest('.card');
    if (card) card.classList.remove('arrastando');
    colunas.forEach(c => c.classList.remove('destaque'));
  });

  colunas.forEach(function (coluna) {
    coluna.addEventListener('dragover', function (evento) {
      evento.preventDefault(); // sem isso o drop não funciona
      coluna.classList.add('destaque');
    });

    coluna.addEventListener('dragleave', function (evento) {
      // só tira o destaque quando sai da coluna de verdade (e não de um card dentro dela)
      if (!coluna.contains(evento.relatedTarget)) {
        coluna.classList.remove('destaque');
      }
    });

    coluna.addEventListener('drop', function (evento) {
      evento.preventDefault();
      coluna.classList.remove('destaque');

      const id = evento.dataTransfer.getData('text/plain');
      moverTarefa(id, coluna.dataset.status);
    });
  });
}

async function moverTarefa(id, novoStatus) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa || tarefa.status === novoStatus) return;

  try {
    await atualizarTarefa(id, { status: novoStatus });
    await carregarDados();
    mostrarToast('Tarefa movida para "' + STATUS[novoStatus] + '"');
  } catch (erro) {
    console.error(erro);
    mostrarToast('Não foi possível mover a tarefa', 'erro');
  }
}

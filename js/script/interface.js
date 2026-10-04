// Funções que montam o HTML na tela

function preencherCategorias() {
  const opcoes = CATEGORIAS.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');

  document.getElementById('filtroCategoria').innerHTML += opcoes;
  document.getElementById('campoCategoria').innerHTML = opcoes;
}

function renderizarIndicadores(contagem) {
  document.getElementById('totalTarefas').textContent = contagem.total;
  document.getElementById('totalPendentes').textContent = contagem.pendentes;
  document.getElementById('totalAndamento').textContent = contagem.andamento;
  document.getElementById('totalConcluidas').textContent = contagem.concluidas;

  document.getElementById('porcentagemPendentes').textContent =
    calcularPorcentagem(contagem.pendentes, contagem.total) + '% do total';
  document.getElementById('porcentagemAndamento').textContent =
    calcularPorcentagem(contagem.andamento, contagem.total) + '% do total';
  document.getElementById('porcentagemConcluidas').textContent =
    calcularPorcentagem(contagem.concluidas, contagem.total) + '% do total';
}

// ---------- Quadro Kanban ----------

function criarCardTarefa(tarefa) {
  const atrasada = estaAtrasada(tarefa);
  const descricao = tarefa.descricao
    ? `<p class="card-descricao">${escaparHTML(tarefa.descricao)}</p>`
    : '';

  return `
    <article class="card" draggable="true" data-id="${tarefa.id}">
      <div class="card-topo">
        <span class="tag prioridade-${tarefa.prioridade}">${PRIORIDADES[tarefa.prioridade]}</span>
        <div class="card-acoes">
          <button class="btn-icone" data-acao="editar" data-id="${tarefa.id}" title="Editar">
            <i class='bx bx-edit-alt'></i>
          </button>
          <button class="btn-icone perigo" data-acao="excluir" data-id="${tarefa.id}" title="Excluir">
            <i class='bx bx-trash'></i>
          </button>
        </div>
      </div>

      <h4 class="card-titulo">${escaparHTML(tarefa.titulo)}</h4>
      ${descricao}

      <div class="card-rodape">
        <span class="tag tag-categoria">${escaparHTML(tarefa.categoria)}</span>
        <span class="card-data ${atrasada ? 'atrasada' : ''}" title="${atrasada ? 'Atrasada' : 'Data limite'}">
          <i class='bx bx-calendar'></i> ${formatarData(tarefa.dataLimite)}
        </span>
      </div>

      <p class="card-criacao">Criada em ${formatarDataCriacao(tarefa.dataCriacao)}</p>
    </article>
  `;
}

function renderizarQuadro(tarefas) {
  Object.keys(STATUS).forEach(function (status) {
    const lista = document.getElementById('lista-' + status);
    const tarefasDaColuna = tarefas.filter(t => t.status === status);

    document.getElementById('contador-' + status).textContent = tarefasDaColuna.length;

    if (tarefasDaColuna.length === 0) {
      lista.innerHTML = '<div class="coluna-vazia">Nenhuma tarefa por aqui</div>';
    } else {
      lista.innerHTML = tarefasDaColuna.map(criarCardTarefa).join('');
    }
  });
}

// ---------- Tabelas (Tarefas e Concluídas) ----------

function criarLinhaTabela(tarefa) {
  const atrasada = estaAtrasada(tarefa);

  return `
    <tr>
      <td>
        <div class="tabela-titulo">${escaparHTML(tarefa.titulo)}</div>
        <div class="tabela-descricao">${escaparHTML(tarefa.descricao) || '-'}</div>
      </td>
      <td><span class="tag tag-categoria">${escaparHTML(tarefa.categoria)}</span></td>
      <td><span class="tag prioridade-${tarefa.prioridade}">${PRIORIDADES[tarefa.prioridade]}</span></td>
      <td><span class="status status-${tarefa.status}">${STATUS[tarefa.status]}</span></td>
      <td class="${atrasada ? 'texto-atrasado' : ''}">${formatarData(tarefa.dataLimite)}</td>
      <td>${formatarDataCriacao(tarefa.dataCriacao)}</td>
      <td class="tabela-acoes">
        <button class="btn-icone" data-acao="editar" data-id="${tarefa.id}" title="Editar">
          <i class='bx bx-edit-alt'></i>
        </button>
        <button class="btn-icone perigo" data-acao="excluir" data-id="${tarefa.id}" title="Excluir">
          <i class='bx bx-trash'></i>
        </button>
      </td>
    </tr>
  `;
}

function renderizarTabela(tarefas, idCorpo, mensagemVazia) {
  const corpo = document.getElementById(idCorpo);

  if (tarefas.length === 0) {
    corpo.innerHTML = `<tr><td colspan="7" class="tabela-vazia">${mensagemVazia}</td></tr>`;
    return;
  }

  corpo.innerHTML = tarefas.map(criarLinhaTabela).join('');
}

// ---------- Meus projetos ----------

function renderizarProjetos(tarefas) {
  const grade = document.getElementById('gradeProjetos');

  grade.innerHTML = CATEGORIAS.map(function (categoria) {
    const tarefasDoProjeto = tarefas.filter(t => t.categoria === categoria.nome);
    const contagem = contarTarefas(tarefasDoProjeto);
    const progresso = calcularPorcentagem(contagem.concluidas, contagem.total);
    const textoTotal = contagem.total === 1 ? '1 tarefa' : contagem.total + ' tarefas';

    return `
      <div class="projeto" data-categoria="${categoria.nome}">
        <div class="projeto-topo">
          <div class="projeto-icone"><i class='bx ${categoria.icone}'></i></div>
          <span class="projeto-total">${textoTotal}</span>
        </div>

        <h3>${categoria.nome}</h3>

        <div class="projeto-numeros">
          <span>${contagem.pendentes} a fazer</span>
          <span>${contagem.andamento} em andamento</span>
          <span>${contagem.concluidas} ${contagem.concluidas === 1 ? 'concluída' : 'concluídas'}</span>
        </div>

        <div class="barra">
          <div class="barra-preenchida" style="width: ${progresso}%"></div>
        </div>
        <p class="projeto-progresso">${progresso}% concluído</p>
      </div>
    `;
  }).join('');
}

// ---------- Modais e avisos ----------

function abrirModal(id) {
  document.getElementById(id).classList.add('aberto');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('aberto');
}

let tempoDoToast;

function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast');
  const icone = tipo === 'erro' ? 'bx-error-circle' : 'bx-check-circle';

  toast.innerHTML = `<i class='bx ${icone}'></i> ${mensagem}`;
  toast.className = 'toast visivel ' + tipo;

  clearTimeout(tempoDoToast);
  tempoDoToast = setTimeout(function () {
    toast.classList.remove('visivel');
  }, 3000);
}

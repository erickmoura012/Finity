import { useState } from 'react';
import { PRIORIDADES, estaAtrasada, textoPrazo, type Tarefa } from '../../js/script/tarefas';
import { formatarDataCriacao } from '../../js/script/utils';
import { useAcoesTarefa } from '../contexts/AcoesTarefaContext';

interface CardProps {
  tarefa: Tarefa;
}

function Card({ tarefa }: CardProps) {
  // as ações vêm do contexto, não precisam mais descer pelo Quadro e pela Coluna
  const acoes = useAcoesTarefa();
  const atrasada = estaAtrasada(tarefa);
  const prazo = textoPrazo(tarefa.dataLimite);
  const [arrastando, setArrastando] = useState(false);

  // vermelho se já passou, laranja se vence hoje
  let classeData = 'card-data';
  if (atrasada) {
    classeData += ' atrasada';
  } else if (prazo === 'Hoje' && tarefa.status !== 'concluido') {
    classeData += ' vence-hoje';
  }

  // no React não precisa do escaparHTML: o texto entre {} já é escapado
  return (
    <article
      className={arrastando ? 'card arrastando' : 'card'}
      draggable
      onDragStart={evento => {
        // guarda o id da tarefa pra coluna saber qual card foi solto nela
        evento.dataTransfer.setData('text/plain', tarefa.id);
        evento.dataTransfer.effectAllowed = 'move';
        setArrastando(true);
      }}
      onDragEnd={() => setArrastando(false)}
      onClick={() => acoes.editar(tarefa)}
    >
      <div className="card-topo">
        <span className={'tag prioridade-' + tarefa.prioridade}>{PRIORIDADES[tarefa.prioridade]}</span>

        <div className="card-acoes">
          <button
            className="btn-icone"
            title="Editar"
            aria-label={'Editar tarefa ' + tarefa.titulo}
            onClick={evento => {
              // sem isso o clique "sobe" pro card e abre a edição duas vezes
              evento.stopPropagation();
              acoes.editar(tarefa);
            }}
          >
            <i className="bx bx-edit-alt"></i>
          </button>

          <button
            className="btn-icone"
            title="Duplicar"
            aria-label={'Duplicar tarefa ' + tarefa.titulo}
            onClick={evento => {
              evento.stopPropagation();
              acoes.duplicar(tarefa);
            }}
          >
            <i className="bx bx-copy"></i>
          </button>

          <button
            className="btn-icone perigo"
            title="Excluir"
            aria-label={'Excluir tarefa ' + tarefa.titulo}
            onClick={evento => {
              evento.stopPropagation();
              acoes.excluir(tarefa);
            }}
          >
            <i className="bx bx-trash"></i>
          </button>
        </div>
      </div>

      <h4 className="card-titulo">{tarefa.titulo}</h4>
      {tarefa.descricao && <p className="card-descricao">{tarefa.descricao}</p>}

      <div className="card-rodape">
        <span className="tag tag-categoria">{tarefa.categoria}</span>
        <span className={classeData} title={atrasada ? 'Atrasada' : 'Data limite'}>
          <i className="bx bx-calendar"></i> {prazo}
        </span>
      </div>

      <p className="card-criacao">Criada em {formatarDataCriacao(tarefa.dataCriacao)}</p>
    </article>
  );
}

export default Card;

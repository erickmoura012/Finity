import { useState } from 'react';
import { PRIORIDADES, estaAtrasada, type Tarefa } from '../../js/script/tarefas';
import { formatarData, formatarDataCriacao } from '../../js/script/utils';

interface CardProps {
  tarefa: Tarefa;
}

function Card({ tarefa }: CardProps) {
  const atrasada = estaAtrasada(tarefa);
  const [arrastando, setArrastando] = useState(false);

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
    >
      <div className="card-topo">
        <span className={'tag prioridade-' + tarefa.prioridade}>{PRIORIDADES[tarefa.prioridade]}</span>
      </div>

      <h4 className="card-titulo">{tarefa.titulo}</h4>
      {tarefa.descricao && <p className="card-descricao">{tarefa.descricao}</p>}

      <div className="card-rodape">
        <span className="tag tag-categoria">{tarefa.categoria}</span>
        <span className={atrasada ? 'card-data atrasada' : 'card-data'} title={atrasada ? 'Atrasada' : 'Data limite'}>
          <i className="bx bx-calendar"></i> {formatarData(tarefa.dataLimite)}
        </span>
      </div>

      <p className="card-criacao">Criada em {formatarDataCriacao(tarefa.dataCriacao)}</p>
    </article>
  );
}

export default Card;

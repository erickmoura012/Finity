import { useState } from 'react';
import Card from './Card';
import { useAcoesTarefa } from '../contexts/AcoesTarefaContext';
import { STATUS, type Status, type Tarefa } from '../../js/script/tarefas';

interface ColunaProps {
  status: Status;
  tarefas: Tarefa[];
}

function Coluna({ status, tarefas }: ColunaProps) {
  const acoes = useAcoesTarefa();
  // destaque = tem um card sendo arrastado em cima da coluna
  const [destaque, setDestaque] = useState(false);

  return (
    <div
      className={destaque ? 'coluna destaque' : 'coluna'}
      data-status={status}
      onDragOver={evento => {
        evento.preventDefault(); // sem isso o drop não funciona
        setDestaque(true);
      }}
      onDragLeave={evento => {
        // só tira o destaque quando sai da coluna de verdade (e não de um card dentro dela)
        if (!evento.currentTarget.contains(evento.relatedTarget as Node)) {
          setDestaque(false);
        }
      }}
      onDrop={evento => {
        evento.preventDefault();
        setDestaque(false);
        acoes.mover(evento.dataTransfer.getData('text/plain'), status);
      }}
    >
      <div className="coluna-topo">
        <span className="bolinha"></span>
        <h3>{STATUS[status]}</h3>
        <span className="contador">{tarefas.length}</span>
        <button className="btn-icone btn-adicionar" title="Adicionar tarefa" onClick={() => acoes.novaTarefa(status)}>
          <i className="bx bx-plus"></i>
        </button>
      </div>

      <div className="coluna-lista">
        {tarefas.length === 0 && <div className="coluna-vazia">Nenhuma tarefa por aqui</div>}

        {tarefas.map(tarefa => (
          <Card key={tarefa.id} tarefa={tarefa} />
        ))}
      </div>
    </div>
  );
}

export default Coluna;

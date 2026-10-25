import Card from './Card';
import { STATUS, type Status, type Tarefa } from '../../js/script/tarefas';

interface ColunaProps {
  status: Status;
  tarefas: Tarefa[];
}

function Coluna({ status, tarefas }: ColunaProps) {
  return (
    <div className="coluna" data-status={status}>
      <div className="coluna-topo">
        <span className="bolinha"></span>
        <h3>{STATUS[status]}</h3>
        <span className="contador">{tarefas.length}</span>
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

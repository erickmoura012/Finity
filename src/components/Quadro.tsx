import Coluna from './Coluna';
import { STATUS, type Status, type Tarefa } from '../../js/script/tarefas';

interface QuadroProps {
  tarefas: Tarefa[];
  aoMoverTarefa: (id: string, status: Status) => void;
  aoNovaTarefa: (status: Status) => void;
  aoEditarTarefa: (tarefa: Tarefa) => void;
  aoDuplicarTarefa: (tarefa: Tarefa) => void;
  aoExcluirTarefa: (tarefa: Tarefa) => void;
}

function Quadro({
  tarefas,
  aoMoverTarefa,
  aoNovaTarefa,
  aoEditarTarefa,
  aoDuplicarTarefa,
  aoExcluirTarefa
}: QuadroProps) {
  // uma coluna pra cada status, na mesma ordem do objeto STATUS
  const colunas = Object.keys(STATUS) as Status[];

  return (
    <>
      <div className="secao-titulo">
        <h2>Quadro de tarefas</h2>
        <p>Arraste os cards para mudar o status</p>
      </div>

      <div className="quadro">
        {colunas.map(status => (
          <Coluna
            key={status}
            status={status}
            tarefas={tarefas.filter(t => t.status === status)}
            aoSoltarTarefa={aoMoverTarefa}
            aoAdicionar={aoNovaTarefa}
            aoEditar={aoEditarTarefa}
            aoDuplicar={aoDuplicarTarefa}
            aoExcluir={aoExcluirTarefa}
          />
        ))}
      </div>
    </>
  );
}

export default Quadro;

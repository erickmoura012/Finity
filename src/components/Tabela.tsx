import { PRIORIDADES, STATUS, estaAtrasada, type CampoOrdem, type Tarefa } from '../../js/script/tarefas';
import { formatarData, formatarDataCriacao } from '../../js/script/utils';

export interface Ordem {
  campo: CampoOrdem;
  crescente: boolean;
}

// colunas que dá pra ordenar clicando no nome
const COLUNAS: { campo: CampoOrdem; nome: string }[] = [
  { campo: 'titulo', nome: 'Tarefa' },
  { campo: 'categoria', nome: 'Categoria' },
  { campo: 'prioridade', nome: 'Prioridade' },
  { campo: 'status', nome: 'Status' },
  { campo: 'dataLimite', nome: 'Data limite' },
  { campo: 'dataCriacao', nome: 'Criada em' }
];

interface TabelaProps {
  tarefas: Tarefa[];
  mensagemVazia: string;
  ordem: Ordem;
  aoOrdenar: (campo: CampoOrdem) => void;
  aoEditar: (tarefa: Tarefa) => void;
  aoDuplicar: (tarefa: Tarefa) => void;
  aoExcluir: (tarefa: Tarefa) => void;
}

// Usada nas páginas Tarefas e Concluídas
function Tabela({ tarefas, mensagemVazia, ordem, aoOrdenar, aoEditar, aoDuplicar, aoExcluir }: TabelaProps) {
  // a classe coloca a setinha (↑ ou ↓) na coluna que está ordenando
  function classeDaColuna(campo: CampoOrdem) {
    if (ordem.campo !== campo) return undefined;
    return ordem.crescente ? 'crescente' : 'decrescente';
  }

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {COLUNAS.map(coluna => (
              <th
                key={coluna.campo}
                data-ordem={coluna.campo}
                className={classeDaColuna(coluna.campo)}
                onClick={() => aoOrdenar(coluna.campo)}
              >
                {coluna.nome}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tarefas.length === 0 && (
            <tr>
              <td colSpan={7} className="tabela-vazia">{mensagemVazia}</td>
            </tr>
          )}

          {tarefas.map(tarefa => (
            <tr key={tarefa.id}>
              <td>
                <div className="tabela-titulo">{tarefa.titulo}</div>
                <div className="tabela-descricao">{tarefa.descricao || '-'}</div>
              </td>
              <td><span className="tag tag-categoria">{tarefa.categoria}</span></td>
              <td>
                <span className={'tag prioridade-' + tarefa.prioridade}>{PRIORIDADES[tarefa.prioridade]}</span>
              </td>
              <td><span className={'status status-' + tarefa.status}>{STATUS[tarefa.status]}</span></td>
              <td className={estaAtrasada(tarefa) ? 'texto-atrasado' : ''}>{formatarData(tarefa.dataLimite)}</td>
              <td>{formatarDataCriacao(tarefa.dataCriacao)}</td>
              <td className="tabela-acoes">
                <button className="btn-icone" title="Editar" onClick={() => aoEditar(tarefa)}>
                  <i className="bx bx-edit-alt"></i>
                </button>
                <button className="btn-icone" title="Duplicar" onClick={() => aoDuplicar(tarefa)}>
                  <i className="bx bx-copy"></i>
                </button>
                <button className="btn-icone perigo" title="Excluir" onClick={() => aoExcluir(tarefa)}>
                  <i className="bx bx-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabela;

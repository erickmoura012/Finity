import type { Categoria, Filtros as FiltrosTarefas } from '../../js/script/tarefas';

// os filtros das tarefas + o status, que só é usado na página Tarefas
export interface FiltrosTela extends FiltrosTarefas {
  status: string;
}

interface FiltrosProps {
  filtros: FiltrosTela;
  categorias: Categoria[];
  mostrarStatus: boolean;
  aoMudar: (filtros: FiltrosTela) => void;
  aoLimpar: () => void;
}

function Filtros({ filtros, categorias, mostrarStatus, aoMudar, aoLimpar }: FiltrosProps) {
  // troca só um campo e mantém os outros
  function mudar(campo: keyof FiltrosTela, valor: string) {
    aoMudar({ ...filtros, [campo]: valor });
  }

  return (
    <section className="filtros">
      <div className="campo-busca">
        <i className="bx bx-search"></i>
        <input
          type="text"
          className="input"
          placeholder="Pesquisar tarefas..."
          value={filtros.busca}
          onChange={evento => mudar('busca', evento.target.value)}
        />
      </div>

      <select
        className="input"
        value={filtros.prioridade}
        onChange={evento => mudar('prioridade', evento.target.value)}
      >
        <option value="">Todas as prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      <select
        className="input"
        value={filtros.categoria}
        onChange={evento => mudar('categoria', evento.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categorias.map(categoria => (
          <option key={categoria.nome} value={categoria.nome}>{categoria.nome}</option>
        ))}
      </select>

      {mostrarStatus && (
        <select
          className="input"
          value={filtros.status}
          onChange={evento => mudar('status', evento.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="a_fazer">A Fazer</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      )}

      <button className="btn btn-texto" onClick={aoLimpar}>
        <i className="bx bx-x"></i> Limpar
      </button>
    </section>
  );
}

export default Filtros;

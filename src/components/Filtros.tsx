import type { Categoria, Filtros as FiltrosTarefas } from '../../js/script/tarefas';

interface FiltrosProps {
  filtros: FiltrosTarefas;
  categorias: Categoria[];
  aoMudar: (filtros: FiltrosTarefas) => void;
  aoLimpar: () => void;
}

function Filtros({ filtros, categorias, aoMudar, aoLimpar }: FiltrosProps) {
  // troca só um campo e mantém os outros
  function mudar(campo: keyof FiltrosTarefas, valor: string) {
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

      <button className="btn btn-texto" onClick={aoLimpar}>
        <i className="bx bx-x"></i> Limpar
      </button>
    </section>
  );
}

export default Filtros;

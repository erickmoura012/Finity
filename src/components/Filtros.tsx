import { useCallback, useRef } from 'react';
import { useAtalho } from '../hooks/useAtalho';
import type { Categoria, Filtros as FiltrosTarefas } from '../../js/script/tarefas';

// os filtros das tarefas + o status, que só é usado na página Tarefas
export interface FiltrosTela extends FiltrosTarefas {
  status: string;
}

interface FiltrosProps {
  filtros: FiltrosTela;
  categorias: Categoria[];
  mostrarStatus: boolean;
  atalhoAtivo: boolean; // fica desligado quando tem algum modal aberto
  aoMudar: (filtros: FiltrosTela) => void;
  aoLimpar: () => void;
}

function Filtros({ filtros, categorias, mostrarStatus, atalhoAtivo, aoMudar, aoLimpar }: FiltrosProps) {
  // a tecla / leva direto pra busca, igual em vários sites (GitHub, YouTube...)
  const campoBusca = useRef<HTMLInputElement>(null);
  const focarBusca = useCallback(() => campoBusca.current?.focus(), []);
  useAtalho('/', focarBusca, atalhoAtivo);

  // troca só um campo e mantém os outros
  function mudar(campo: keyof FiltrosTela, valor: string) {
    aoMudar({ ...filtros, [campo]: valor });
  }

  // o status só conta quando o filtro dele aparece na tela
  const temFiltro = Boolean(
    filtros.busca || filtros.prioridade || filtros.categoria || (mostrarStatus && filtros.status)
  );

  return (
    <section className="filtros">
      <div className="campo-busca">
        <i className="bx bx-search"></i>
        <input
          ref={campoBusca}
          type="text"
          className="input"
          placeholder="Pesquisar tarefas (atalho /)"
          aria-label="Pesquisar tarefas"
          value={filtros.busca}
          onChange={evento => mudar('busca', evento.target.value)}
          onKeyDown={evento => {
            // Esc sai do campo, assim os atalhos (N e /) voltam a funcionar sem precisar clicar fora
            if (evento.key === 'Escape') evento.currentTarget.blur();
          }}
        />
      </div>

      {/* sem um label na tela, o aria-label diz pro leitor de tela o que é cada campo */}
      <select
        className="input"
        aria-label="Filtrar por prioridade"
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
        aria-label="Filtrar por categoria"
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
          aria-label="Filtrar por status"
          value={filtros.status}
          onChange={evento => mudar('status', evento.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="a_fazer">A Fazer</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
          <option value="atrasadas">Atrasadas</option>
        </select>
      )}

      <button className="btn btn-texto" disabled={!temFiltro} onClick={aoLimpar}>
        <i className="bx bx-x"></i> Limpar
      </button>
    </section>
  );
}

export default Filtros;

import { contarTarefas, type Categoria, type Tarefa } from '../../js/script/tarefas';
import { calcularPorcentagem } from '../../js/script/utils';
import { useAcoesTarefa } from '../contexts/AcoesTarefaContext';

interface ProjetosProps {
  tarefas: Tarefa[];
  categorias: Categoria[];
  aoAbrirProjeto: (categoria: string) => void;
  aoEditar: (categoria: Categoria) => void;
  aoExcluir: (categoria: Categoria) => void;
}

function Projetos({ tarefas, categorias, aoAbrirProjeto, aoEditar, aoExcluir }: ProjetosProps) {
  const acoes = useAcoesTarefa();

  return (
    <div className="grade-projetos">
      {categorias.map(categoria => {
        const contagem = contarTarefas(tarefas.filter(t => t.categoria === categoria.nome));
        const progresso = calcularPorcentagem(contagem.concluidas, contagem.total);

        return (
          <div className="projeto" key={categoria.nome} onClick={() => aoAbrirProjeto(categoria.nome)}>
            <div className="projeto-topo">
              <div className="projeto-icone"><i className={'bx ' + categoria.icone}></i></div>

              <div className="projeto-topo-direita">
                <span className="projeto-total">
                  {contagem.total === 1 ? '1 tarefa' : contagem.total + ' tarefas'}
                </span>
                <button
                  className="btn-icone"
                  title="Adicionar tarefa"
                  aria-label={'Adicionar tarefa no projeto ' + categoria.nome}
                  onClick={evento => {
                    // sem isso o clique também abriria o projeto
                    evento.stopPropagation();
                    acoes.novaTarefa('a_fazer', categoria.nome);
                  }}
                >
                  <i className="bx bx-plus"></i>
                </button>
                <button
                  className="btn-icone"
                  title="Editar"
                  aria-label={'Editar projeto ' + categoria.nome}
                  onClick={evento => {
                    evento.stopPropagation();
                    aoEditar(categoria);
                  }}
                >
                  <i className="bx bx-edit-alt"></i>
                </button>
                <button
                  className="btn-icone perigo"
                  title="Excluir"
                  aria-label={'Excluir projeto ' + categoria.nome}
                  onClick={evento => {
                    evento.stopPropagation();
                    aoExcluir(categoria);
                  }}
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            </div>

            <h3>{categoria.nome}</h3>

            <div className="projeto-numeros">
              <span>{contagem.pendentes} a fazer</span>
              <span>{contagem.andamento} em andamento</span>
              <span>{contagem.concluidas} {contagem.concluidas === 1 ? 'concluída' : 'concluídas'}</span>
            </div>

            {/* só aparece quando o projeto tem alguma tarefa atrasada */}
            {contagem.atrasadas > 0 && (
              <p className="projeto-atrasadas">
                <i className="bx bx-error-circle"></i>
                {contagem.atrasadas === 1 ? '1 tarefa atrasada' : contagem.atrasadas + ' tarefas atrasadas'}
              </p>
            )}

            <div className="barra">
              <div className="barra-preenchida" style={{ width: progresso + '%' }}></div>
            </div>
            <p className="projeto-progresso">{progresso}% concluído</p>
          </div>
        );
      })}
    </div>
  );
}

export default Projetos;

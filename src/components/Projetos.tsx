import { contarTarefas, type Categoria, type Tarefa } from '../../js/script/tarefas';
import { calcularPorcentagem } from '../../js/script/utils';

interface ProjetosProps {
  tarefas: Tarefa[];
  categorias: Categoria[];
  aoAbrirProjeto: (categoria: string) => void;
  aoNovaTarefa: (categoria: string) => void;
}

function Projetos({ tarefas, categorias, aoAbrirProjeto, aoNovaTarefa }: ProjetosProps) {
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
                  onClick={evento => {
                    // sem isso o clique também abriria o projeto
                    evento.stopPropagation();
                    aoNovaTarefa(categoria.nome);
                  }}
                >
                  <i className="bx bx-plus"></i>
                </button>
              </div>
            </div>

            <h3>{categoria.nome}</h3>

            <div className="projeto-numeros">
              <span>{contagem.pendentes} a fazer</span>
              <span>{contagem.andamento} em andamento</span>
              <span>{contagem.concluidas} {contagem.concluidas === 1 ? 'concluída' : 'concluídas'}</span>
            </div>

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

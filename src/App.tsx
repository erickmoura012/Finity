import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topo from './components/Topo';
import Indicadores from './components/Indicadores';
import { useTema } from './hooks/useTema';
import { useTarefas } from './hooks/useTarefas';
import { PAGINAS, type Pagina } from './paginas';

function App() {
  const [paginaAtual, setPaginaAtual] = useState<Pagina>('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  const { escuro, trocarTema } = useTema();
  const { tarefas, carregando, erro } = useTarefas();

  function mudarPagina(pagina: Pagina) {
    setPaginaAtual(pagina);
    setMenuAberto(false); // no celular, fecha o menu depois de escolher
  }

  const pagina = PAGINAS[paginaAtual];

  return (
    <div className="app">
      <Sidebar paginaAtual={paginaAtual} aberta={menuAberto} aoMudarPagina={mudarPagina} />

      {/* fundo escuro atrás do menu no celular */}
      <div className={menuAberto ? 'overlay visivel' : 'overlay'} onClick={() => setMenuAberto(false)}></div>

      <main className="conteudo">
        <Topo
          titulo={pagina.titulo}
          subtitulo={pagina.subtitulo}
          textoBotao={paginaAtual === 'projetos' ? 'Novo projeto' : 'Nova tarefa'}
          temaEscuro={escuro}
          aoAbrirMenu={() => setMenuAberto(true)}
          aoTrocarTema={trocarTema}
        />

        {/* a key faz a animação de entrada rodar de novo a cada troca de página */}
        <section className="pagina ativa" key={paginaAtual}>
          {carregando && <p className="resultado">Carregando tarefas...</p>}
          {erro && <p className="resultado">{erro}</p>}

          {!carregando && !erro && paginaAtual === 'dashboard' && (
            <Indicadores tarefas={tarefas} />
          )}

          {!carregando && !erro && paginaAtual !== 'dashboard' && (
            <p className="resultado">Página em construção ({tarefas.length} tarefas carregadas)</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

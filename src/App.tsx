import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topo from './components/Topo';
import { PAGINAS, type Pagina } from './paginas';

function App() {
  const [paginaAtual, setPaginaAtual] = useState<Pagina>('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);

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
          aoAbrirMenu={() => setMenuAberto(true)}
        />

        {/* a key faz a animação de entrada rodar de novo a cada troca de página */}
        <section className="pagina ativa" key={paginaAtual}>
          <p className="resultado">Página em construção</p>
        </section>
      </main>
    </div>
  );
}

export default App;

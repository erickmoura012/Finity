import { PAGINAS, type Pagina } from '../paginas';

interface SidebarProps {
  paginaAtual: Pagina;
  aberta: boolean;
  aoMudarPagina: (pagina: Pagina) => void;
  aoExportar: () => void;
}

function Sidebar({ paginaAtual, aberta, aoMudarPagina, aoExportar }: SidebarProps) {
  const paginas = Object.keys(PAGINAS) as Pagina[];

  return (
    <aside className={aberta ? 'sidebar aberta' : 'sidebar'}>
      <div className="sidebar-logo">
        <span className="logo-icone">F</span>
        <span className="logo-nome">Finity</span>
      </div>

      <nav className="menu">
        <p className="menu-titulo">Menu</p>

        {paginas.map(pagina => (
          <a
            key={pagina}
            href="#"
            className={pagina === paginaAtual ? 'menu-item ativo' : 'menu-item'}
            onClick={evento => {
              evento.preventDefault();
              aoMudarPagina(pagina);
            }}
          >
            <i className={'bx ' + PAGINAS[pagina].icone}></i> {PAGINAS[pagina].titulo}
          </a>
        ))}

        <p className="menu-titulo menu-titulo-dados">Dados</p>
        <button className="menu-item" onClick={aoExportar}>
          <i className="bx bx-download"></i> Exportar tarefas
        </button>
      </nav>

      <div className="sidebar-usuario">
        <div className="avatar"><i className="bx bx-user"></i></div>
        <div>
          <p className="usuario-nome">Usuário</p>
          <p className="usuario-info">Dados salvos no navegador</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

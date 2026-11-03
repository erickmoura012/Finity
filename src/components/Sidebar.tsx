import { useRef } from 'react';
import { NavLink } from 'react-router';
import { PAGINAS, type Pagina } from '../paginas';

interface SidebarProps {
  aberta: boolean;
  aoFecharMenu: () => void;
  aoExportar: () => void;
  aoImportar: (arquivo: File) => void;
}

function Sidebar({ aberta, aoFecharMenu, aoExportar, aoImportar }: SidebarProps) {
  const paginas = Object.keys(PAGINAS) as Pagina[];

  // o input de arquivo fica escondido, o botão Importar é que abre a janela dele
  const campoArquivo = useRef<HTMLInputElement>(null);

  return (
    <aside className={aberta ? 'sidebar aberta' : 'sidebar'}>
      <div className="sidebar-logo">
        <span className="logo-icone">F</span>
        <span className="logo-nome">Finity</span>
      </div>

      <nav className="menu">
        <p className="menu-titulo">Menu</p>

        {/* o NavLink já sabe se o link é o da página atual (isActive) */}
        {paginas.map(pagina => (
          <NavLink
            key={pagina}
            to={PAGINAS[pagina].caminho}
            end
            className={({ isActive }) => (isActive ? 'menu-item ativo' : 'menu-item')}
            onClick={aoFecharMenu} // no celular, fecha o menu depois de escolher
          >
            <i className={'bx ' + PAGINAS[pagina].icone}></i> {PAGINAS[pagina].titulo}
          </NavLink>
        ))}

        <p className="menu-titulo menu-titulo-dados">Dados</p>
        <button className="menu-item" onClick={aoExportar}>
          <i className="bx bx-download"></i> Exportar tarefas
        </button>
        <button className="menu-item" onClick={() => campoArquivo.current?.click()}>
          <i className="bx bx-upload"></i> Importar tarefas
        </button>
        <input
          ref={campoArquivo}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={evento => {
            const arquivo = evento.target.files?.[0];
            if (arquivo) aoImportar(arquivo);

            // limpa pra conseguir escolher o mesmo arquivo de novo depois
            evento.target.value = '';
          }}
        />
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

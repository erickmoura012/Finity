interface TopoProps {
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  temaEscuro: boolean;
  aoAbrirMenu: () => void;
  aoTrocarTema: () => void;
}

function Topo({ titulo, subtitulo, textoBotao, temaEscuro, aoAbrirMenu, aoTrocarTema }: TopoProps) {
  return (
    <header className="topo">
      <button className="btn-menu" title="Abrir menu" onClick={aoAbrirMenu}>
        <i className="bx bx-menu"></i>
      </button>

      <div className="topo-textos">
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      {/* no tema escuro mostra o sol (pra voltar ao claro) e no claro mostra a lua */}
      <button
        className="btn-tema"
        title={temaEscuro ? 'Usar tema claro' : 'Usar tema escuro'}
        onClick={aoTrocarTema}
      >
        <i className={temaEscuro ? 'bx bx-sun' : 'bx bx-moon'}></i>
      </button>

      {/* o id é usado no CSS do celular pra esconder o texto do botão */}
      <button className="btn btn-primario" id="btnAdicionar" title="Atalho: N">
        <i className="bx bx-plus"></i> <span>{textoBotao}</span>
      </button>
    </header>
  );
}

export default Topo;

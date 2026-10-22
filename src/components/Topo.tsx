interface TopoProps {
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  aoAbrirMenu: () => void;
}

function Topo({ titulo, subtitulo, textoBotao, aoAbrirMenu }: TopoProps) {
  return (
    <header className="topo">
      <button className="btn-menu" title="Abrir menu" onClick={aoAbrirMenu}>
        <i className="bx bx-menu"></i>
      </button>

      <div className="topo-textos">
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      {/* o id é usado no CSS do celular pra esconder o texto do botão */}
      <button className="btn btn-primario" id="btnAdicionar" title="Atalho: N">
        <i className="bx bx-plus"></i> <span>{textoBotao}</span>
      </button>
    </header>
  );
}

export default Topo;

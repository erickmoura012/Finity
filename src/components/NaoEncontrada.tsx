import { Link } from 'react-router';
import { PAGINAS } from '../paginas';

// Aparece quando a URL não é de nenhuma página (ex: /tarefa, /nada)
function NaoEncontrada() {
  return (
    <div className="nao-encontrada">
      <div className="nao-encontrada-icone"><i className="bx bx-error-circle"></i></div>
      <h2>Página não encontrada</h2>
      <p>O endereço que você abriu não existe. Confira se ele foi digitado certo.</p>
      <Link to={PAGINAS.dashboard.caminho} className="btn btn-primario">
        <i className="bx bx-grid-alt"></i> Voltar pro dashboard
      </Link>
    </div>
  );
}

export default NaoEncontrada;

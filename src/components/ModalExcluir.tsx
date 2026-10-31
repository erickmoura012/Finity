import type { ReactNode } from 'react';
import Modal from './Modal';

interface ModalExcluirProps {
  aberto: boolean;
  titulo: string;
  mensagem: ReactNode; // o texto pode ter uma parte em negrito, por isso não é só string
  aoCancelar: () => void;
  aoConfirmar: () => void;
}

// Confirmação de exclusão. Quem usa diz o título e a mensagem,
// assim o mesmo modal serve pra excluir tarefa e projeto.
function ModalExcluir({ aberto, titulo, mensagem, aoCancelar, aoConfirmar }: ModalExcluirProps) {
  return (
    <Modal aberto={aberto} pequeno idTitulo="tituloModalExcluir" aoFechar={aoCancelar}>
      <div className="modal-corpo modal-confirmacao">
        <div className="confirmacao-icone"><i className="bx bx-trash"></i></div>
        <h2 id="tituloModalExcluir">{titulo}</h2>
        <p>{mensagem}</p>
      </div>

      <div className="modal-rodape">
        <button type="button" className="btn btn-secundario" onClick={aoCancelar}>Cancelar</button>
        <button type="button" className="btn btn-perigo" onClick={aoConfirmar}>Excluir</button>
      </div>
    </Modal>
  );
}

export default ModalExcluir;

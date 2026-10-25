import type { ReactNode } from 'react';

interface ModalProps {
  aberto: boolean;
  pequeno?: boolean;
  children: ReactNode;
}

// Só a "casca" do modal: o fundo escuro e a caixa branca.
// O que vai dentro (formulário, confirmação...) vem pelo children.
function Modal({ aberto, pequeno = false, children }: ModalProps) {
  return (
    <div className={aberto ? 'modal-fundo aberto' : 'modal-fundo'}>
      <div className={pequeno ? 'modal modal-pequeno' : 'modal'}>
        {children}
      </div>
    </div>
  );
}

export default Modal;

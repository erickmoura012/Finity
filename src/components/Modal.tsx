import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  aberto: boolean;
  pequeno?: boolean;
  idTitulo: string; // id do <h2> de dentro, que o leitor de tela usa como nome do modal
  aoFechar: () => void;
  children: ReactNode;
}

// Só a "casca" do modal: o fundo escuro e a caixa branca.
// O que vai dentro (formulário, confirmação...) vem pelo children.
function Modal({ aberto, pequeno = false, idTitulo, aoFechar, children }: ModalProps) {
  // fecha com ESC, mas só escuta o teclado enquanto o modal está aberto
  useEffect(() => {
    if (!aberto) return;

    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar();
    }

    document.addEventListener('keydown', aoApertarTecla);

    // quando o modal fecha, o React roda essa função e remove o evento
    return () => document.removeEventListener('keydown', aoApertarTecla);
  }, [aberto, aoFechar]);

  return (
    <div
      className={aberto ? 'modal-fundo aberto' : 'modal-fundo'}
      onMouseDown={evento => {
        // fecha clicando no fundo escuro, mas não clicando dentro da caixa
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <div
        className={pequeno ? 'modal modal-pequeno' : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;

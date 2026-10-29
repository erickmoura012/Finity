import type { EstadoToast } from '../hooks/useToast';

interface ToastProps {
  toast: EstadoToast;
}

function Toast({ toast }: ToastProps) {
  const icone = toast.tipo === 'erro' ? 'bx-error-circle' : 'bx-check-circle';

  // fica sempre na tela, a classe visivel é que faz aparecer com animação
  return (
    // role="status" faz o leitor de tela ler a mensagem quando ela muda
    <div className={'toast ' + toast.tipo + (toast.visivel ? ' visivel' : '')} role="status">
      <i className={'bx ' + icone}></i> {toast.mensagem}
    </div>
  );
}

export default Toast;

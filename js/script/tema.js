// Tema claro e escuro (a escolha fica salva no LocalStorage)

const CHAVE_TEMA = 'finity_tema';

export function configurarTema() {
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  let escuro;

  if (temaSalvo) {
    escuro = temaSalvo === 'escuro';
  } else {
    // se a pessoa ainda não escolheu, segue o tema do computador dela
    escuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  document.body.classList.toggle('tema-escuro', escuro);
  atualizarBotaoTema(escuro);

  document.getElementById('btnTema').addEventListener('click', trocarTema);
}

function trocarTema() {
  // toggle devolve true quando a classe foi adicionada
  const escuro = document.body.classList.toggle('tema-escuro');
  localStorage.setItem(CHAVE_TEMA, escuro ? 'escuro' : 'claro');
  atualizarBotaoTema(escuro);
}

// no tema escuro o botão mostra o sol (para voltar ao claro) e no claro mostra a lua
function atualizarBotaoTema(escuro) {
  const botao = document.getElementById('btnTema');
  botao.innerHTML = escuro ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
  botao.title = escuro ? 'Usar tema claro' : 'Usar tema escuro';
}

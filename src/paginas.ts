export type Pagina = 'dashboard' | 'projetos' | 'tarefas' | 'concluidas';

interface InfoPagina {
  caminho: string; // o que aparece na URL
  titulo: string;
  subtitulo: string;
  icone: string;
}

// A ordem aqui é a mesma ordem do menu
export const PAGINAS: Record<Pagina, InfoPagina> = {
  dashboard: {
    caminho: '/',
    titulo: 'Dashboard',
    subtitulo: 'Acompanhe o andamento das suas tarefas',
    icone: 'bx-grid-alt'
  },
  projetos: {
    caminho: '/projetos',
    titulo: 'Meus projetos',
    subtitulo: 'Suas tarefas separadas por categoria',
    icone: 'bx-folder'
  },
  tarefas: {
    caminho: '/tarefas',
    titulo: 'Tarefas',
    subtitulo: 'Todas as tarefas cadastradas',
    icone: 'bx-task'
  },
  concluidas: {
    caminho: '/concluidas',
    titulo: 'Concluídas',
    subtitulo: 'Tarefas que já foram finalizadas',
    icone: 'bx-check-circle'
  }
};

// Descobre qual página é pelo caminho da URL (null se não for nenhuma)
export function paginaDoCaminho(caminho: string): Pagina | null {
  const paginas = Object.keys(PAGINAS) as Pagina[];
  return paginas.find(pagina => PAGINAS[pagina].caminho === caminho) ?? null;
}

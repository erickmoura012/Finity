export type Pagina = 'dashboard' | 'projetos' | 'tarefas' | 'concluidas';

interface InfoPagina {
  titulo: string;
  subtitulo: string;
  icone: string;
}

// A ordem aqui é a mesma ordem do menu
export const PAGINAS: Record<Pagina, InfoPagina> = {
  dashboard: {
    titulo: 'Dashboard',
    subtitulo: 'Acompanhe o andamento das suas tarefas',
    icone: 'bx-grid-alt'
  },
  projetos: {
    titulo: 'Meus projetos',
    subtitulo: 'Suas tarefas separadas por categoria',
    icone: 'bx-folder'
  },
  tarefas: {
    titulo: 'Tarefas',
    subtitulo: 'Todas as tarefas cadastradas',
    icone: 'bx-task'
  },
  concluidas: {
    titulo: 'Concluídas',
    subtitulo: 'Tarefas que já foram finalizadas',
    icone: 'bx-check-circle'
  }
};

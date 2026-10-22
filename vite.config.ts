import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Enquanto a versão em React não fica pronta, o projeto tem duas páginas:
// index.html (versão atual) e react.html (versão nova)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        principal: 'index.html',
        react: 'react.html'
      }
    }
  }
});

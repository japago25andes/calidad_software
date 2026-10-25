import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Permite abrir el servidor de desarrollo desde otros contenedores (pruebas automáticas).
    allowedHosts: true,
    // En Docker sobre Windows los cambios de archivos no llegan como eventos: se usa polling.
    watch: { usePolling: process.env.VITE_POLLING === 'true' },
  },
});

import path from 'path';
import { defineConfig } from 'vite';
import { servite } from 'servite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [servite()],
});

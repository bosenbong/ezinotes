import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        game: './game.html',
        rage: './rage.html',
        fever: './fever.html',
        fever3d: './fever3d.html'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
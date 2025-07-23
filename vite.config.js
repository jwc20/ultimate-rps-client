import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '94f71o.tunnel.pyjam.as',
      'localhost',
      '127.0.0.1',
      '85883865b40b.ngrok-free.app'
    ]
  }
})

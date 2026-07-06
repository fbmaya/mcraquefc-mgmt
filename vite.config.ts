import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The mgmt panel runs on 3001 to sit alongside the frontend (3000).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3001 },
  preview: { port: 3001 },
})

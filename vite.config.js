import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/merger/',  // Replace 'your-repo-name' with the actual name of your GitHub repository
  plugins: [react()],
})

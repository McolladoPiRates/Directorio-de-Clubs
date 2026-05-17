import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
      'process.env.LEAD_WEBHOOK_URL': JSON.stringify(env.LEAD_WEBHOOK_URL || ''),
      'process.env.COMPANY_NAME': JSON.stringify(env.COMPANY_NAME || 'Tasador IA'),
      'process.env.COMPANY_EMAIL': JSON.stringify(env.COMPANY_EMAIL || 'hola@tasador-ia.example'),
    },
  }
})

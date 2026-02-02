import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Função robusta que prioriza o padrão VITE_
  const findApiKey = () => {
    // Prioridade absoluta para VITE_GEMINI_API_KEY (padrão oficial)
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (env.VITE_GEMINI_API_KEY) return env.VITE_GEMINI_API_KEY;

    // Fallbacks
    return process.env.API_Key || process.env.API_KEY || env.GEMINI_API_KEY || '';
  };

  const apiKey = findApiKey();
  console.log("BUILD INFO: API Key detected:", !!apiKey); // Log para debug no Vercel

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(new URL(import.meta.url))), '.'),
      }
    }
  };
});

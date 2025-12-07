import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Загружаем все переменные окружения
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Исправляем ошибку с путями для Netlify
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    define: {
      // Это предотвращает ошибку "process is not defined"
      'process.env': env,
      // Дублируем ключи для надежности (чтобы работали и VITE_, и обычные)
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
    },
  };
});

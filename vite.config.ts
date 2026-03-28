import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Режим production определяется автоматически по команде build
  const isProduction = mode === 'production' || command === 'build'
  
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
    build: {
      // Оптимизации для продакшена
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
      // Генерировать source maps для продакшена (опционально)
      sourcemap: !isProduction,
      // Размер чанков
      chunkSizeWarningLimit: 1000,
    },
    // Определяем переменные окружения
    define: {
      // Если нужно явно передать NODE_ENV в приложение
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
  }
})
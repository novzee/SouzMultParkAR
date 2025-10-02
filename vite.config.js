import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    basicSsl() // Добавляем плагин для генерации self-signed SSL сертификата
  ],
  server: {
    https: true, // Включаем HTTPS
    host: '0.0.0.0', // Делаем сервер доступным извне
    port: 5173, // Порт по умолчанию
    // Дополнительные настройки для разработки
    open: false, // Не открывать браузер автоматически (из-за self-signed cert)
    cors: true, // Разрешаем CORS
    // Заголовки для поддержки медиа API
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

const isDev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/poxfield/',
    plugins: [vue()],
    server: {
        proxy: isDev
            ? {
                  '/api': {
                      target: 'https://www.poxnora.com',
                      changeOrigin: true,
                      secure: false,
                  },
              }
            : undefined,
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
    },
})

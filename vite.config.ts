import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/poxfield/',
    plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'https://www.poxnora.com',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
    },
})

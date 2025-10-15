import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { IsCustomElement } from './src/CustomElement';

export default defineConfig({
    plugins: [
        // Vue插件
        vue({
            template: {
                compilerOptions: {
                    // 禁用静态内容提升优化 禁用 hostInsertStaticContent
                    hoistStatic: false,
                    isCustomElement: tag => {
                        return IsCustomElement(tag);
                    }
                }
            }
        }),
        // 调试插件
        vueDevTools(),
    ]
});
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { IsCustomElement } from './src/CustomElement';
import { vueGuiStylePlugin } from './src/vite-plugin-vuegui-style';

export default defineConfig({
    plugins: [
        // VueGui 样式插件（必须在 vue 插件之前）
        vueGuiStylePlugin(),

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
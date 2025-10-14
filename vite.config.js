import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const CustomElements = [
    'view',
    'text',
];

export default defineConfig({
    plugins: [
        // Vue插件
        vue({
            template: {
                compilerOptions: {
                    // 禁用静态内容提升优化 禁用 hostInsertStaticContent
                    hoistStatic: false,
                    isCustomElement: tag => {
                        return CustomElements.includes(tag.toLowerCase());
                    }
                }
            }
        }),
        // 调试插件
        vueDevTools(),
    ]
});
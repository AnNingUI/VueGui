import type { Plugin } from "vite";

/**
 * VueGui 样式处理 Vite 插件
 * 自动提取 .vue 文件中的 <style> 标签并转换为 VueGui 样式注册代码
 */
export function vueGuiStylePlugin(): Plugin {
	return {
		name: "vuegui-style-plugin",
		enforce: "pre",

		transform(code: string, id: string) {
			// 只处理 .vue 文件，但排除 node_modules
			if (!id.endsWith(".vue") || id.includes("node_modules")) {
				return null;
			}

			// 提取 <style> 标签内容
			const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
			const styles: string[] = [];
			let match: RegExpExecArray | null;

			while ((match = styleRegex.exec(code)) !== null) {
				const styleContent = match[1].trim();
				if (styleContent) {
					styles.push(styleContent);
				}
			}

			// 如果没有样式，跳过
			if (styles.length === 0) {
				return null;
			}

			// 合并所有样式
			const combinedStyles = styles.join("\n\n");

			// 生成组件 ID（基于文件路径）
			const componentId = id
				.replace(/\\/g, "/")
				.split("/")
				.pop()
				?.replace(".vue", "") || "component";

			// 生成样式注册代码
			const styleInjectionCode = `
// VueGui 样式自动注入
import { onMounted as __onMounted__, getCurrentInstance as __getCurrentInstance__ } from 'vue';
import { IStyleManager as __IStyleManager__ } from '/src/IClass.ts';

const __vueGuiStyles__ = ${JSON.stringify(combinedStyles)};
const __componentId__ = ${JSON.stringify(componentId)};

// 注册样式（在模块加载时执行一次）
const __styleManager__ = __IStyleManager__.GetInstance();
if (!__styleManager__.GetStyleSheet(__componentId__)) {
  __styleManager__.RegisterStyleSheet(__componentId__, __vueGuiStyles__);
}

// 在组件挂载时应用样式（这会在组件 setup 时注册）
__onMounted__(() => {
  const instance = __getCurrentInstance__();
  if (instance && instance.vnode && instance.vnode.el) {
    const rootElement = instance.vnode.el;
    // 确保是 IElement 对象
    if (rootElement && typeof rootElement === 'object' && typeof rootElement.GetTagName === 'function') {
      __styleManager__.ApplyStylesToTree(rootElement);
    }
  }
});
`;

			// 查找 <script setup> 或 <script> 标签
			const scriptSetupRegex = /<script\s+setup[^>]*>([\s\S]*?)<\/script>/i;
			const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/i;

			let modifiedCode = code;

			if (scriptSetupRegex.test(code)) {
				// 有 <script setup>，在其内容开头注入
				modifiedCode = code.replace(scriptSetupRegex, (match, content) => {
					return match.replace(content, `\n${styleInjectionCode}\n${content}`);
				});
			} else if (scriptRegex.test(code)) {
				// 有普通 <script>，在其内容开头注入（export default 之前）
				modifiedCode = code.replace(scriptRegex, (match, content) => {
					return match.replace(
						content,
						`\n${styleInjectionCode}\n${content}`
					);
				});
			} else {
				// 没有 script 标签，在 </template> 后添加 <script setup>
				const templateEndIndex = code.indexOf("</template>");
				if (templateEndIndex !== -1) {
					const beforeTemplate = code.substring(0, templateEndIndex + 11);
					const afterTemplate = code.substring(templateEndIndex + 11);
					modifiedCode = `${beforeTemplate}\n\n<script setup lang="ts">\n${styleInjectionCode}\n</script>\n${afterTemplate}`;
				}
			}

			return {
				code: modifiedCode,
				map: null,
			};
		},
	};
}

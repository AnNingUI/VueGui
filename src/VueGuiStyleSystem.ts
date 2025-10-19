import type { App, ComponentInternalInstance } from "vue";
import { IStyleManager } from "./IClass.ts";
import type { IElement } from "./IElement.ts";

/**
 * 自动样式应用混入
 * 在组件挂载和更新时自动应用 CSS 样式
 */
export const VueGuiStyleMixin = {
	mounted(this: any) {
		const rootEl = this.$el as IElement;
		if (rootEl && typeof rootEl === "object" && typeof rootEl.GetTagName === "function") {
			const styleManager = IStyleManager.GetInstance();
			styleManager.ApplyStylesToTree(rootEl);
		}
	},

	updated(this: any) {
		const rootEl = this.$el as IElement;
		if (rootEl && typeof rootEl === "object" && typeof rootEl.GetTagName === "function") {
			const styleManager = IStyleManager.GetInstance();
			styleManager.ApplyStylesToTree(rootEl);
		}
	},
};

/**
 * 安装 VueGui 样式系统
 */
export function installVueGuiStyles(app: App) {
	// 全局混入
	app.mixin(VueGuiStyleMixin);

	// 提供样式管理器
	app.provide("vueGuiStyleManager", IStyleManager.GetInstance());

	// 全局属性
	app.config.globalProperties.$vueGuiStyleManager = IStyleManager.GetInstance();

	console.log("[VueGui] Style system installed");
}

/**
 * 手动注册组件样式
 * 在组件的 <script setup> 中调用
 */
export function registerComponentStyles(cssText: string, componentName?: string) {
	const styleManager = IStyleManager.GetInstance();
	const name = componentName || `component-${Date.now()}-${Math.random().toString(36).substring(7)}`;

	styleManager.RegisterStyleSheet(name, cssText);

	return () => {
		styleManager.RemoveStyleSheet(name);
	};
}

/**
 * 创建样式作用域
 * 类似于 Vue 的 scoped styles
 */
export function createStyleScope(cssText: string, scopeId: string) {
	const styleManager = IStyleManager.GetInstance();

	// 为所有选择器添加作用域
	const scopedCSS = cssText.replace(
		/([^{]+)\{/g,
		(match, selector) => {
			const trimmed = selector.trim();
			// 添加属性选择器作为作用域
			return `${trimmed}[data-v-${scopeId}] {`;
		}
	);

	styleManager.RegisterStyleSheet(`scoped-${scopeId}`, scopedCSS);

	return scopeId;
}

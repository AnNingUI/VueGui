import type { Plugin } from "vue";
import type { IElement } from "./IElement.ts";
import { IStyleSheet, IStyleManager } from "./IClass.ts";

/**
 * Vue 组件样式元数据
 */
interface ComponentStyleMeta {
	id: string;
	styles: string;
	scoped: boolean;
	scopeId?: string;
}

/**
 * VueGui 样式插件
 * 自动处理 Vue 组件的 <style> 标签
 */
export const VueGuiStylePlugin: Plugin = {
	install(app) {
		const styleManager = IStyleManager.GetInstance();
		const componentStyles = new Map<string, ComponentStyleMeta>();

		// 在组件挂载时注册样式
		app.mixin({
			beforeMount() {
				const instance = this as any;
				const type = instance.$options || instance.type;

				// 获取组件的样式
				if (type.__scopeId || type.styles) {
					const componentId = type.__scopeId || `component-${Math.random().toString(36).substring(7)}`;

					// 检查是否已注册
					if (!componentStyles.has(componentId)) {
						let cssText = "";
						const scoped = !!type.__scopeId;

						// 收集所有样式
						if (type.styles) {
							cssText = Array.isArray(type.styles)
								? type.styles.join("\n")
								: type.styles;
						}

						if (cssText) {
							// 保存样式元数据
							componentStyles.set(componentId, {
								id: componentId,
								styles: cssText,
								scoped,
								scopeId: type.__scopeId,
							});

							// 注册到样式管理器
							styleManager.RegisterStyleSheet(componentId, cssText);
						}
					}
				}
			},

			mounted() {
				// 组件挂载后应用样式
				const instance = this as any;
				const rootElement = instance.$el;

				if (rootElement && typeof rootElement === "object" && "GetTagName" in rootElement) {
					// 这是一个 VueGui 元素
					styleManager.ApplyStylesToTree(rootElement as IElement);
				}
			},

			updated() {
				// 组件更新后重新应用样式
				const instance = this as any;
				const rootElement = instance.$el;

				if (rootElement && typeof rootElement === "object" && "GetTagName" in rootElement) {
					styleManager.ApplyStylesToTree(rootElement as IElement);
				}
			},

			beforeUnmount() {
				// 组件卸载时可以选择清理样式（可选）
				// 注意：如果多个组件共享样式，不应该清理
			},
		});

		// 提供样式管理器给所有组件
		app.provide("vueGuiStyleManager", styleManager);
	},
};

/**
 * 组合式 API - 使用 VueGui 样式
 */
export function useVueGuiStyles() {
	const styleManager = IStyleManager.GetInstance();

	/**
	 * 手动注册样式
	 */
	const registerStyles = (name: string, cssText: string) => {
		styleManager.RegisterStyleSheet(name, cssText);
	};

	/**
	 * 应用样式到元素树
	 */
	const applyStyles = (root: IElement) => {
		styleManager.ApplyStylesToTree(root);
	};

	/**
	 * 获取元素的匹配样式
	 */
	const getMatchedStyles = (element: IElement) => {
		return styleManager.GetMatchedStyles(element);
	};

	/**
	 * 移除样式表
	 */
	const removeStyles = (name: string) => {
		styleManager.RemoveStyleSheet(name);
	};

	return {
		styleManager,
		registerStyles,
		applyStyles,
		getMatchedStyles,
		removeStyles,
	};
}

/**
 * 指令 - 应用样式到元素
 */
export const vStyle = {
	mounted(el: any, binding: any) {
		if (el && typeof el === "object" && "GetTagName" in el) {
			const element = el as IElement;
			const styleManager = IStyleManager.GetInstance();

			if (binding.value) {
				// 如果提供了样式对象，直接应用
				element.InsertAttribute("style", binding.value);
			}

			// 应用 CSS 类样式
			styleManager.ApplyStylesToTree(element);
		}
	},

	updated(el: any, binding: any) {
		if (el && typeof el === "object" && "GetTagName" in el) {
			const element = el as IElement;
			const styleManager = IStyleManager.GetInstance();

			if (binding.value) {
				element.InsertAttribute("style", binding.value);
			}

			styleManager.ApplyStylesToTree(element);
		}
	},
};

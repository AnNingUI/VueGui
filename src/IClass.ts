import type { IElement } from "./IElement.ts";
import { parseStringStyle } from "./CSSUtils.ts";

/**
 * CSS 选择器类型
 */
export enum SelectorType {
	TAG = "tag", // 标签选择器 button
	CLASS = "class", // 类选择器 .btn
	ID = "id", // ID选择器 #header
	ATTRIBUTE = "attribute", // 属性选择器 [type="text"]
	DESCENDANT = "descendant", // 后代选择器 div span
	CHILD = "child", // 子选择器 div > span
	ADJACENT_SIBLING = "adjacent_sibling", // 相邻兄弟选择器 h1 + p
	GENERAL_SIBLING = "general_sibling", // 通用兄弟选择器 h1 ~ p
	PSEUDO_CLASS = "pseudo_class", // 伪类选择器 :hover
	PSEUDO_ELEMENT = "pseudo_element", // 伪元素选择器 ::before
	UNIVERSAL = "universal", // 通配选择器 *
}

/**
 * CSS 规则
 */
export interface ICSSRule {
	selector: string; // 原始选择器字符串
	parsedSelector: IParsedSelector; // 解析后的选择器
	styles: Record<string, any>; // 样式对象
	specificity: number; // 优先级
}

/**
 * 解析后的选择器
 */
export interface IParsedSelector {
	type: SelectorType;
	value: string; // 标签名、类名、ID等
	attribute?: { name: string; value?: string; operator?: string }; // 属性选择器信息
	pseudoClass?: string; // 伪类名称
	combinator?: string; // 组合符 (空格, >, +, ~)
	next?: IParsedSelector; // 下一个选择器（用于组合选择器）
}

/**
 * CSS 样式表管理类
 */
export class IStyleSheet {
	private rules: ICSSRule[] = [];

	/**
	 * 解析 CSS 文本
	 */
	ParseCSS(cssText: string): void {
		// 移除注释
		cssText = this.RemoveComments(cssText);

		// 匹配所有 CSS 规则
		const ruleRegex = /([^{]+)\{([^}]+)\}/g;
		let match: RegExpExecArray | null;

		while ((match = ruleRegex.exec(cssText)) !== null) {
			const selector = match[1].trim();
			const declarations = match[2].trim();

			// 解析样式声明
			const styles = this.ParseDeclarations(declarations);

			// 解析选择器
			const parsedSelector = this.ParseSelector(selector);

			// 计算优先级
			const specificity = this.CalculateSpecificity(parsedSelector);

			this.rules.push({
				selector,
				parsedSelector,
				styles,
				specificity,
			});
		}

		// 按优先级排序（从低到高）
		this.rules.sort((a, b) => a.specificity - b.specificity);
	}

	/**
	 * 移除 CSS 注释
	 */
	private RemoveComments(cssText: string): string {
		return cssText.replace(/\/\*[\s\S]*?\*\//g, "");
	}

	/**
	 * 解析样式声明
	 */
	private ParseDeclarations(declarations: string): Record<string, any> {
		const styles: Record<string, any> = {};
		const lines = declarations.split(";");

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			const colonIndex = trimmed.indexOf(":");
			if (colonIndex === -1) continue;

			const property = trimmed.substring(0, colonIndex).trim();
			const value = trimmed.substring(colonIndex + 1).trim();

			// 使用 CSSUtils 解析单个样式声明
			const cssString = `${property}: ${value}`;
			const parsed = parseStringStyle(cssString);
			Object.assign(styles, parsed);
		}

		return styles;
	}

	/**
	 * 解析选择器
	 */
	private ParseSelector(selector: string): IParsedSelector {
		selector = selector.trim();

		// 处理组合选择器（后代、子、兄弟等）
		// 优先级：> + ~ 空格
		const combinators = [
			{ regex: /\s*>\s*/, type: ">" },
			{ regex: /\s*\+\s*/, type: "+" },
			{ regex: /\s*~\s*/, type: "~" },
			{ regex: /\s+/, type: " " },
		];

		for (const { regex, type } of combinators) {
			const parts = selector.split(regex);
			if (parts.length > 1) {
				// 递归解析左右两部分
				const left = this.ParseSimpleSelector(parts[0].trim());
				const right = this.ParseSelector(parts.slice(1).join(type));

				left.combinator = type;
				left.next = right;
				return left;
			}
		}

		// 简单选择器
		return this.ParseSimpleSelector(selector);
	}

	/**
	 * 解析简单选择器（不包含组合符）
	 */
	private ParseSimpleSelector(selector: string): IParsedSelector {
		selector = selector.trim();

		// 通配选择器 *
		if (selector === "*") {
			return { type: SelectorType.UNIVERSAL, value: "*" };
		}

		// ID 选择器 #id
		if (selector.startsWith("#")) {
			return { type: SelectorType.ID, value: selector.substring(1) };
		}

		// 类选择器 .class
		if (selector.startsWith(".")) {
			return { type: SelectorType.CLASS, value: selector.substring(1) };
		}

		// 属性选择器 [attr] [attr=value] [attr^=value] 等
		const attrMatch = selector.match(/\[([^\]]+)\]/);
		if (attrMatch) {
			const attrContent = attrMatch[1];
			const operatorMatch = attrContent.match(/([^=~|^$*]+)([=~|^$*]+)(.+)/);

			if (operatorMatch) {
				return {
					type: SelectorType.ATTRIBUTE,
					value: selector,
					attribute: {
						name: operatorMatch[1].trim(),
						operator: operatorMatch[2].trim(),
						value: operatorMatch[3].trim().replace(/["']/g, ""),
					},
				};
			} else {
				return {
					type: SelectorType.ATTRIBUTE,
					value: selector,
					attribute: { name: attrContent.trim() },
				};
			}
		}

		// 伪类选择器 :hover :active 等
		const pseudoClassMatch = selector.match(/^([^:]+):([^:]+)$/);
		if (pseudoClassMatch) {
			return {
				type: SelectorType.PSEUDO_CLASS,
				value: pseudoClassMatch[1],
				pseudoClass: pseudoClassMatch[2],
			};
		}

		// 伪元素选择器 ::before ::after
		const pseudoElementMatch = selector.match(/^([^:]+)::(.+)$/);
		if (pseudoElementMatch) {
			return {
				type: SelectorType.PSEUDO_ELEMENT,
				value: pseudoElementMatch[1],
				pseudoClass: pseudoElementMatch[2],
			};
		}

		// 标签选择器 button div 等
		return { type: SelectorType.TAG, value: selector.toLowerCase() };
	}

	/**
	 * 计算选择器优先级
	 * ID选择器: 100
	 * 类选择器/属性选择器/伪类: 10
	 * 标签选择器/伪元素: 1
	 */
	private CalculateSpecificity(selector: IParsedSelector): number {
		let specificity = 0;

		let current: IParsedSelector | undefined = selector;
		while (current) {
			switch (current.type) {
				case SelectorType.ID:
					specificity += 100;
					break;
				case SelectorType.CLASS:
				case SelectorType.ATTRIBUTE:
				case SelectorType.PSEUDO_CLASS:
					specificity += 10;
					break;
				case SelectorType.TAG:
				case SelectorType.PSEUDO_ELEMENT:
					specificity += 1;
					break;
				case SelectorType.UNIVERSAL:
					// 通配选择器优先级为 0
					break;
			}
			current = current.next;
		}

		return specificity;
	}

	/**
	 * 匹配元素
	 */
	MatchElement(element: IElement, selector: IParsedSelector): boolean {
		// 先匹配当前选择器
		if (!this.MatchSimpleSelector(element, selector)) {
			return false;
		}

		// 如果有组合符，需要匹配父元素/兄弟元素
		if (selector.next && selector.combinator) {
			return this.MatchCombinator(element, selector.combinator, selector.next);
		}

		return true;
	}

	/**
	 * 匹配简单选择器
	 */
	private MatchSimpleSelector(
		element: IElement,
		selector: IParsedSelector
	): boolean {
		switch (selector.type) {
			case SelectorType.UNIVERSAL:
				return true;

			case SelectorType.TAG:
				return element.GetTagName().toLowerCase() === selector.value;

			case SelectorType.CLASS: {
				const attrs = element.GetAttributes();
				const classes = attrs["class"];
				if (!classes) return false;
				const classList =
					typeof classes === "string" ? classes.split(/\s+/) : [];
				return classList.includes(selector.value);
			}

			case SelectorType.ID: {
				const attrs = element.GetAttributes();
				const id = attrs["id"];
				return id === selector.value;
			}

			case SelectorType.ATTRIBUTE: {
				if (!selector.attribute) return false;
				const attrs = element.GetAttributes();
				const attrValue = attrs[selector.attribute.name];
				if (attrValue === undefined) return false;

				// 如果没有指定值，只要属性存在就匹配
				if (!selector.attribute.value) return true;

				const value = String(attrValue);
				const targetValue = selector.attribute.value;

				// 根据操作符匹配
				switch (selector.attribute.operator) {
					case "=": // 精确匹配
						return value === targetValue;
					case "~=": // 包含单词
						return value.split(/\s+/).includes(targetValue);
					case "|=": // 以值开头或值-开头
						return value === targetValue || value.startsWith(targetValue + "-");
					case "^=": // 以值开头
						return value.startsWith(targetValue);
					case "$=": // 以值结尾
						return value.endsWith(targetValue);
					case "*=": // 包含值
						return value.includes(targetValue);
					default:
						return value === targetValue;
				}
			}

			case SelectorType.PSEUDO_CLASS: {
				// 伪类需要元素支持状态查询
				// 这里可以扩展支持 :hover :active :focus 等
				// 暂时简单实现
				const pseudoClass = selector.pseudoClass;
				const attrs = element.GetAttributes();
				if (pseudoClass === "hover") {
					return attrs["_hover"] === true;
				}
				if (pseudoClass === "active") {
					return attrs["_active"] === true;
				}
				if (pseudoClass === "focus") {
					return attrs["_focus"] === true;
				}
				return false;
			}

			case SelectorType.PSEUDO_ELEMENT:
				// 伪元素暂不支持
				return false;

			default:
				return false;
		}
	}

	/**
	 * 匹配组合符
	 */
	private MatchCombinator(
		element: IElement,
		combinator: string,
		nextSelector: IParsedSelector
	): boolean {
		switch (combinator) {
			case " ": // 后代选择器
				return this.MatchAncestor(element, nextSelector);

			case ">": // 子选择器
				return this.MatchParent(element, nextSelector);

			case "+": // 相邻兄弟选择器
				return this.MatchAdjacentSibling(element, nextSelector);

			case "~": // 通用兄弟选择器
				return this.MatchGeneralSibling(element, nextSelector);

			default:
				return false;
		}
	}

	/**
	 * 匹配祖先元素
	 */
	private MatchAncestor(
		element: IElement,
		selector: IParsedSelector
	): boolean {
		let parent = element.GetParent();
		while (parent) {
			if (this.MatchElement(parent, selector)) {
				return true;
			}
			parent = parent.GetParent();
		}
		return false;
	}

	/**
	 * 匹配父元素
	 */
	private MatchParent(element: IElement, selector: IParsedSelector): boolean {
		const parent = element.GetParent();
		if (!parent) return false;
		return this.MatchElement(parent, selector);
	}

	/**
	 * 匹配相邻兄弟元素
	 */
	private MatchAdjacentSibling(
		element: IElement,
		selector: IParsedSelector
	): boolean {
		const parent = element.GetParent();
		if (!parent) return false;

		const siblings = parent.GetChildrens();
		const index = siblings.indexOf(element);
		if (index <= 0) return false;

		const prevSibling = siblings[index - 1];
		return this.MatchElement(prevSibling, selector);
	}

	/**
	 * 匹配通用兄弟元素
	 */
	private MatchGeneralSibling(
		element: IElement,
		selector: IParsedSelector
	): boolean {
		const parent = element.GetParent();
		if (!parent) return false;

		const siblings = parent.GetChildrens();
		const index = siblings.indexOf(element);
		if (index <= 0) return false;

		// 检查前面的所有兄弟元素
		for (let i = 0; i < index; i++) {
			if (this.MatchElement(siblings[i], selector)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 获取元素的所有匹配样式
	 */
	GetMatchedStyles(element: IElement): Record<string, any> {
		const matchedStyles: Record<string, any> = {};

		// 按优先级顺序应用样式
		for (const rule of this.rules) {
			if (this.MatchElement(element, rule.parsedSelector)) {
				Object.assign(matchedStyles, rule.styles);
			}
		}

		return matchedStyles;
	}

	/**
	 * 应用样式到元素
	 */
	ApplyStylesToElement(element: IElement): void {
		const styles = this.GetMatchedStyles(element);
		element.InsertAttribute("style", styles);
	}

	/**
	 * 应用样式到元素树
	 */
	ApplyStylesToTree(root: IElement): void {
		// 应用到当前元素
		this.ApplyStylesToElement(root);

		// 递归应用到子元素
		const children = root.GetChildrens();
		for (const child of children) {
			this.ApplyStylesToTree(child);
		}
	}

	/**
	 * 获取所有规则
	 */
	GetRules(): ICSSRule[] {
		return this.rules;
	}

	/**
	 * 清空所有规则
	 */
	Clear(): void {
		this.rules = [];
	}

	/**
	 * 添加规则
	 */
	AddRule(rule: ICSSRule): void {
		this.rules.push(rule);
		// 重新排序
		this.rules.sort((a, b) => a.specificity - b.specificity);
	}

	/**
	 * 删除规则
	 */
	RemoveRule(selector: string): void {
		this.rules = this.rules.filter((rule) => rule.selector !== selector);
	}
}

/**
 * 全局样式表管理器
 */
export class IStyleManager {
	private static instance: IStyleManager;
	private styleSheets: Map<string, IStyleSheet> = new Map();

	private constructor() {}

	static GetInstance(): IStyleManager {
		if (!IStyleManager.instance) {
			IStyleManager.instance = new IStyleManager();
		}
		return IStyleManager.instance;
	}

	/**
	 * 注册样式表
	 */
	RegisterStyleSheet(name: string, cssText: string): IStyleSheet {
		const styleSheet = new IStyleSheet();
		styleSheet.ParseCSS(cssText);
		this.styleSheets.set(name, styleSheet);
		return styleSheet;
	}

	/**
	 * 获取样式表
	 */
	GetStyleSheet(name: string): IStyleSheet | undefined {
		return this.styleSheets.get(name);
	}

	/**
	 * 移除样式表
	 */
	RemoveStyleSheet(name: string): void {
		this.styleSheets.delete(name);
	}

	/**
	 * 获取元素的所有匹配样式（合并所有样式表）
	 */
	GetMatchedStyles(element: IElement): Record<string, any> {
		const matchedStyles: Record<string, any> = {};

		// 合并所有样式表的匹配样式
		for (const [name, styleSheet] of this.styleSheets) {
			const styles = styleSheet.GetMatchedStyles(element);
			Object.assign(matchedStyles, styles);
		}

		return matchedStyles;
	}

	/**
	 * 应用所有样式表到元素树
	 */
	ApplyStylesToTree(root: IElement): void {
		const applyToElement = (element: IElement) => {
			// 获取所有匹配样式
			const styles = this.GetMatchedStyles(element);

			// 合并到元素的内联样式
			const attrs = element.GetAttributes();
			const inlineStyle = attrs["style"] || {};
			const mergedStyles = { ...styles, ...inlineStyle };
			element.InsertAttribute("style", mergedStyles);

			// 递归处理子元素
			for (const child of element.GetChildrens()) {
				applyToElement(child);
			}
		};

		applyToElement(root);
	}

	/**
	 * 清空所有样式表
	 */
	Clear(): void {
		this.styleSheets.clear();
	}
}

// 导出便捷函数
export function CreateStyleSheet(cssText: string): IStyleSheet {
	const styleSheet = new IStyleSheet();
	styleSheet.ParseCSS(cssText);
	return styleSheet;
}

export function ParseCSSText(cssText: string): ICSSRule[] {
	const styleSheet = new IStyleSheet();
	styleSheet.ParseCSS(cssText);
	return styleSheet.GetRules();
}

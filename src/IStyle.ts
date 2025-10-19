/**
 * IStyle - 样式系统
 * 完整支持CSS属性和Vue风格的内联样式对象
 */

import type {
	DimensionValue,
	NormalizedStyle,
	StyleObject,
	StyleValue,
} from "./CSSUtils.ts";
import {
	camelize,
	convertVueStyleToCSS,
	hyphenate,
	isArray,
	isNumber,
	isObject,
	isString,
	mergeStyles,
	normalizeColorValue,
	normalizeCSSPropName,
	normalizeStyle,
	parseDimensionValue,
	parseStringStyle,
	stringifyStyle,
} from "./CSSUtils.ts";
import type { IElement } from "./IElement.ts";

// ==================== 样式值类型 ====================
export const IStyleTypeNone: unique symbol = Symbol("none");
export const IStyleTypeInteger: unique symbol = Symbol("integer");
export const IStyleTypeNumber: unique symbol = Symbol("number");
export const IStyleTypeString: unique symbol = Symbol("string");
export const IStyleTypeColor: unique symbol = Symbol("color");
export const IStyleTypePercentage: unique symbol = Symbol("percentage");
export const IStyleTypePixel: unique symbol = Symbol("pixel");
export const IStyleTypeLength: unique symbol = Symbol("length");
export const IStyleTypeAuto: unique symbol = Symbol("auto");

export type IStyleType =
	| typeof IStyleTypeNone
	| typeof IStyleTypeInteger
	| typeof IStyleTypeNumber
	| typeof IStyleTypeString
	| typeof IStyleTypeColor
	| typeof IStyleTypePercentage
	| typeof IStyleTypePixel
	| typeof IStyleTypeLength
	| typeof IStyleTypeAuto;

// ==================== CSS属性分类 ====================

// 颜色属性
const COLOR_PROPERTIES = new Set([
	"color",
	"background-color",
	"border-color",
	"border-top-color",
	"border-right-color",
	"border-bottom-color",
	"border-left-color",
	"outline-color",
	"text-decoration-color",
]);

// 整数属性
const INTEGER_PROPERTIES = new Set([
	"z-index",
	"order",
	"flex-grow",
	"flex-shrink",
	"column-count",
	"animation-iteration-count",
	"tab-size",
]);

// 尺寸和位置属性（支持px/%/auto等）
const DIMENSION_PROPERTIES = new Set([
	"width",
	"height",
	"min-width",
	"min-height",
	"max-width",
	"max-height",
	"top",
	"right",
	"bottom",
	"left",
	"margin",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"padding",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"border-width",
	"border-top-width",
	"border-right-width",
	"border-bottom-width",
	"border-left-width",
	"border-radius",
	"border-top-left-radius",
	"border-top-right-radius",
	"border-bottom-left-radius",
	"border-bottom-right-radius",
	"font-size",
	"line-height",
	"letter-spacing",
	"word-spacing",
	"text-indent",
	"gap",
	"row-gap",
	"column-gap",
	"outline-width",
	"outline-offset",
	"flex-basis",
	"grid-gap",
	"grid-row-gap",
	"grid-column-gap",
	"inset",
	"inset-block",
	"inset-inline",
]);

// ==================== 样式项 ====================
export class IStyleItem {
	public m_style_key: string;
	public m_important: boolean;
	public m_priority: number;
	public m_raw_value: StyleValue;
	public m_value_type: IStyleType;
	public m_style_value: string | number | null;

	constructor(
		style_key: string,
		style_value: StyleValue,
		important: boolean = false
	) {
		this.m_style_key = style_key;
		this.m_important = important;
		this.m_priority = 0;
		this.m_raw_value = style_value;
		this.m_value_type = IStyleTypeNone;
		this.m_style_value = null;

		// 解析样式值
		this._parseValue(style_key, style_value);
	}

	private _parseValue(style_key: string, style_value: StyleValue): void {
		// 处理null/undefined
		if (style_value === null || style_value === undefined) {
			this.m_value_type = IStyleTypeNone;
			this.m_style_value = null;
			return;
		}

		// 处理颜色属性
		if (COLOR_PROPERTIES.has(style_key)) {
			this.m_value_type = IStyleTypeColor;
			this.m_style_value = this._parseColorValue(style_value);
			return;
		}

		// 处理整数属性
		if (INTEGER_PROPERTIES.has(style_key)) {
			this.m_value_type = IStyleTypeInteger;
			this.m_style_value = this._parseIntegerValue(style_value);
			return;
		}

		// 处理尺寸属性
		if (DIMENSION_PROPERTIES.has(style_key)) {
			this._parseDimensionValue(style_value);
			return;
		}

		// 默认处理为字符串
		this.m_value_type = IStyleTypeString;
		this.m_style_value = String(style_value);
	}

	private _parseColorValue(value: StyleValue): string {
		if (isString(value)) {
			return normalizeColorValue(value);
		}
		return String(value);
	}

	private _parseIntegerValue(value: StyleValue): number {
		if (isNumber(value)) return Math.floor(value);
		if (isString(value)) {
			const num = parseInt(value, 10);
			return isNaN(num) ? 0 : num;
		}
		return 0;
	}

	private _parseDimensionValue(value: StyleValue): void {
		const parsed: DimensionValue = parseDimensionValue(value);

		switch (parsed.type) {
			case "pixel":
				this.m_value_type = IStyleTypePixel;
				this.m_style_value = parsed.value as number;
				break;
			case "percentage":
				this.m_value_type = IStyleTypePercentage;
				this.m_style_value = parsed.value as number;
				break;
			case "number":
				this.m_value_type = IStyleTypeNumber;
				this.m_style_value = parsed.value as number;
				break;
			case "length":
				this.m_value_type = IStyleTypeLength;
				this.m_style_value = value as string; // 保留原始值（如"2em", "50vh"）
				break;
			case "string":
				if (parsed.value === "auto") {
					this.m_value_type = IStyleTypeAuto;
					this.m_style_value = "auto";
				} else {
					this.m_value_type = IStyleTypeString;
					this.m_style_value = parsed.value as string;
				}
				break;
			default:
				this.m_value_type = IStyleTypeString;
				this.m_style_value = String(value);
		}
	}

	// 类型检查方法
	public IsPixelValue(): boolean {
		return this.m_value_type === IStyleTypePixel;
	}
	public IsColorValue(): boolean {
		return this.m_value_type === IStyleTypeColor;
	}
	public IsStringValue(): boolean {
		return this.m_value_type === IStyleTypeString;
	}
	public IsIntegerValue(): boolean {
		return this.m_value_type === IStyleTypeInteger;
	}
	public IsNumberValue(): boolean {
		return (
			this.m_value_type === IStyleTypeNumber ||
			this.m_value_type === IStyleTypeInteger
		);
	}
	public IsPercentageValue(): boolean {
		return this.m_value_type === IStyleTypePercentage;
	}
	public IsNoneValue(): boolean {
		return this.m_value_type === IStyleTypeNone;
	}
	public IsAutoValue(): boolean {
		return this.m_value_type === IStyleTypeAuto;
	}
	public IsLengthValue(): boolean {
		return this.m_value_type === IStyleTypeLength;
	}

	// 值获取方法
	public GetPixelValue(default_value: number = 0): number {
		return this.IsPixelValue() ? (this.m_style_value as number) : default_value;
	}

	public GetColorValue(default_value: string = "transparent"): string {
		return this.IsColorValue() ? (this.m_style_value as string) : default_value;
	}

	public GetStringValue(default_value: string = ""): string {
		return this.IsStringValue()
			? (this.m_style_value as string)
			: default_value;
	}

	public GetIntegerValue(default_value: number = 0): number {
		return this.IsNumberValue()
			? Math.floor(this.m_style_value as number)
			: default_value;
	}

	public GetNumberValue(default_value: number = 0): number {
		return this.IsNumberValue()
			? (this.m_style_value as number)
			: default_value;
	}

	public GetPercentageValue(default_value: number = 0): number {
		return this.IsPercentageValue()
			? (this.m_style_value as number)
			: default_value;
	}

	/**
	 * 获取尺寸值（处理px、%、auto等）
	 * @param base_value - 百分比计算的基准值
	 * @param default_value - 默认值
	 * @returns 计算后的数值
	 */
	public GetDimensionValue(
		base_value: number,
		default_value: number = -1
	): number {
		if (this.IsPixelValue()) {
			return this.m_style_value as number;
		} else if (this.IsPercentageValue()) {
			return (base_value * (this.m_style_value as number)) / 100;
		} else if (this.IsNumberValue()) {
			return this.m_style_value as number;
		} else if (this.IsAutoValue()) {
			return -1; // auto用-1表示
		} else {
			return default_value;
		}
	}

	/**
	 * 获取原始值（用于不需要解析的场景）
	 */
	public GetRawValue(): StyleValue {
		return this.m_raw_value;
	}

	/**
	 * 获取CSS字符串值
	 */
	public GetCSSValue(): string {
		if (this.IsPixelValue()) {
			return `${this.m_style_value}px`;
		} else if (this.IsPercentageValue()) {
			return `${this.m_style_value}%`;
		} else {
			return String(this.m_style_value);
		}
	}
}

// ==================== 选择器样式 ====================
export class ISelectorStyle {
	public m_styles: Record<string, IStyleItem>;

	constructor() {
		this.m_styles = {};
	}

	public GetStyle(): Record<string, IStyleItem> {
		return this.m_styles;
	}

	/**
	 * 设置样式文本（CSS字符串）
	 * 支持: "color: red; font-size: 14px"
	 */
	public SetStyleText(style_text: string): void {
		if (!style_text || !isString(style_text)) return;

		const parsed = parseStringStyle(style_text);
		for (const key in parsed) {
			this.SetStyleItem(key, parsed[key]);
		}
	}

	/**
	 * 设置样式对象
	 * 支持Vue风格的camelCase: { backgroundColor: 'red', fontSize: 14 }
	 * 也支持kebab-case: { 'background-color': 'red', 'font-size': '14px' }
	 */
	public SetStyleObject(style_obj: StyleObject | NormalizedStyle): void {
		if (!style_obj || !isObject(style_obj)) return;

		// 使用Vue3.6的normalizeStyle处理各种格式
		const normalized = normalizeStyle(style_obj);

		for (const key in normalized) {
			const value = normalized[key];
			if (value !== null && value !== undefined) {
				// 将camelCase转为kebab-case
				const kebabKey = normalizeCSSPropName(key);
				this.SetStyleItem(kebabKey, value);
			}
		}
	}

	/**
	 * 设置单个样式项
	 * @param style_key - 样式键（支持camelCase和kebab-case）
	 * @param style_value - 样式值
	 * @param important - 是否重要
	 */
	public SetStyleItem(
		style_key: string,
		style_value: StyleValue,
		important: boolean = false
	): void {
		// 标准化属性名
		const normalizedKey = normalizeCSSPropName(style_key);

		if (!normalizedKey) return;

		// 处理字符串值中的!important
		if (isString(style_value)) {
			const values = style_value.split(/\s+/).filter((v) => v);
			const hasImportant = values[values.length - 1] === "!important";

			if (hasImportant) {
				values.pop();
				important = true;
				style_value = values.join(" ");
			}

			// 处理简写属性
			if (values.length > 1 && !this._isComplexValue(style_value)) {
				this._processShorthandProperty(normalizedKey, values, important);
				return;
			}
		}

		// 创建样式项
		this.m_styles[normalizedKey] = new IStyleItem(
			normalizedKey,
			style_value,
			important
		);
	}

	/**
	 * 检查是否为复杂值（如calc(), rgba()等）
	 */
	private _isComplexValue(value: string): boolean {
		return (
			value.includes("(") ||
			value.includes("calc") ||
			value.includes("rgb") ||
			value.includes("hsl")
		);
	}

	/**
	 * 处理CSS简写属性
	 */
	private _processShorthandProperty(
		key: string,
		values: string[],
		important: boolean
	): void {
		switch (key) {
			case "margin":
			case "padding":
				this._processBoxShorthand(key, values, important);
				break;
			case "border-width":
			case "border-color":
			case "border-style":
				this._processBorderShorthand(key, values, important);
				break;
			case "border":
			case "border-left":
			case "border-right":
			case "border-top":
			case "border-bottom":
				this._processBorder(key, values, important);
				break;
			case "gap":
				this._processGap(values, important);
				break;
			case "overflow":
				this._processOverflow(values, important);
				break;
			case "flex":
				this._processFlex(values, important);
				break;
			default:
				// 单值属性
				this.m_styles[key] = new IStyleItem(key, values[0], important);
		}
	}

	private _processBoxShorthand(
		key: string,
		values: string[],
		important: boolean
	): void {
		const [top, right = top, bottom = top, left = right] = values;
		const prefix = key; // margin 或 padding

		this.m_styles[`${prefix}-top`] = new IStyleItem(
			`${prefix}-top`,
			top,
			important
		);
		this.m_styles[`${prefix}-right`] = new IStyleItem(
			`${prefix}-right`,
			right,
			important
		);
		this.m_styles[`${prefix}-bottom`] = new IStyleItem(
			`${prefix}-bottom`,
			bottom,
			important
		);
		this.m_styles[`${prefix}-left`] = new IStyleItem(
			`${prefix}-left`,
			left,
			important
		);
	}

	private _processBorderShorthand(
		key: string,
		values: string[],
		important: boolean
	): void {
		const [top, right = top, bottom = top, left = right] = values;
		const suffix = key.split("-")[1]; // width, color, style

		this.m_styles[`border-top-${suffix}`] = new IStyleItem(
			`border-top-${suffix}`,
			top,
			important
		);
		this.m_styles[`border-right-${suffix}`] = new IStyleItem(
			`border-right-${suffix}`,
			right,
			important
		);
		this.m_styles[`border-bottom-${suffix}`] = new IStyleItem(
			`border-bottom-${suffix}`,
			bottom,
			important
		);
		this.m_styles[`border-left-${suffix}`] = new IStyleItem(
			`border-left-${suffix}`,
			left,
			important
		);
	}

	private _processBorder(
		key: string,
		values: string[],
		important: boolean
	): void {
		const border_width = values[0] || "0px";
		const border_style = values[1] || "solid";
		const border_color = values[2] || "black";

		const directions =
			key === "border"
				? ["top", "right", "bottom", "left"]
				: [key.split("-")[1]];

		for (const direction of directions) {
			this.m_styles[`border-${direction}-width`] = new IStyleItem(
				`border-${direction}-width`,
				border_width,
				important
			);
			this.m_styles[`border-${direction}-style`] = new IStyleItem(
				`border-${direction}-style`,
				border_style,
				important
			);
			this.m_styles[`border-${direction}-color`] = new IStyleItem(
				`border-${direction}-color`,
				border_color,
				important
			);
		}
	}

	private _processGap(values: string[], important: boolean): void {
		this.m_styles["row-gap"] = new IStyleItem("row-gap", values[0], important);
		this.m_styles["column-gap"] = new IStyleItem(
			"column-gap",
			values.length > 1 ? values[1] : values[0],
			important
		);
	}

	private _processOverflow(values: string[], important: boolean): void {
		this.m_styles["overflow-x"] = new IStyleItem(
			"overflow-x",
			values[0] || "auto",
			important
		);
		this.m_styles["overflow-y"] = new IStyleItem(
			"overflow-y",
			values.length > 1 ? values[1] : values[0],
			important
		);
	}

	private _processFlex(values: string[], important: boolean): void {
		this.m_styles["flex-grow"] = new IStyleItem(
			"flex-grow",
			values[0] || "0",
			important
		);
		this.m_styles["flex-shrink"] = new IStyleItem(
			"flex-shrink",
			values.length > 1 ? values[1] : "1",
			important
		);
		this.m_styles["flex-basis"] = new IStyleItem(
			"flex-basis",
			values.length > 2 ? values[2] : "auto",
			important
		);
	}

	/**
	 * 合并其他样式
	 */
	public MergeStyles(
		otherStyle: ISelectorStyle | StyleObject | string | null | undefined
	): void {
		if (!otherStyle) return;

		if (otherStyle instanceof ISelectorStyle) {
			Object.assign(this.m_styles, otherStyle.m_styles);
		} else if (isObject(otherStyle)) {
			this.SetStyleObject(otherStyle);
		} else if (isString(otherStyle)) {
			this.SetStyleText(otherStyle);
		}
	}

	/**
	 * 移除样式
	 */
	public RemoveStyle(style_key: string): void {
		const normalizedKey = normalizeCSSPropName(style_key);
		delete this.m_styles[normalizedKey];
	}

	/**
	 * 获取样式值
	 */
	public GetStyleValue(style_key: string): string | number | null {
		const normalizedKey = normalizeCSSPropName(style_key);
		const item = this.m_styles[normalizedKey];
		return item ? item.m_style_value : null;
	}

	/**
	 * 检查样式是否存在
	 */
	public HasStyle(style_key: string): boolean {
		const normalizedKey = normalizeCSSPropName(style_key);
		return normalizedKey in this.m_styles;
	}

	/**
	 * 获取样式项
	 */
	public GetStyleItem(style_key: string): IStyleItem | null {
		const normalizedKey = normalizeCSSPropName(style_key);
		return this.m_styles[normalizedKey] || null;
	}

	/**
	 * 转换为CSS字符串
	 */
	public ToCSSString(): string {
		const styleObj: Record<string, string> = {};
		for (const key in this.m_styles) {
			const item = this.m_styles[key];
			if (item) {
				styleObj[key] = item.GetCSSValue();
			}
		}
		return stringifyStyle(styleObj);
	}

	/**
	 * 克隆
	 */
	public Clone(): ISelectorStyle {
		const cloned = new ISelectorStyle();
		cloned.m_styles = { ...this.m_styles };
		return cloned;
	}
}

// ==================== 内联样式 ====================
export class IInlineSelectorStyle extends ISelectorStyle {
	constructor(
		style_value:
			| string
			| number
			| StyleObject
			| Array<string | StyleObject>
			| null
			| undefined
	) {
		super();

		if (!style_value) return;

		if (isString(style_value)) {
			// CSS字符串: "color: red; font-size: 14px"
			this.SetStyleText(style_value);
		} else if (isArray(style_value)) {
			// 数组: [{ color: 'red' }, 'font-size: 14px']
			for (const item of style_value) {
				if (isString(item)) {
					this.SetStyleText(item);
				} else if (isObject(item)) {
					this.SetStyleObject(item as StyleObject);
				}
			}
		} else if (isObject(style_value)) {
			// Vue风格对象: { backgroundColor: 'red', fontSize: 14 }
			this.SetStyleObject(style_value as StyleObject);
		}
	}
}

// ==================== 样式管理器 ====================
export class IStyleManager {
	private styles: Map<string, ISelectorStyle>;
	private defaultStyles: Map<string, ISelectorStyle>;

	constructor() {
		this.styles = new Map();
		this.defaultStyles = new Map();
	}

	/**
	 * 添加样式规则
	 */
	public AddStyleRule(selector: string, styleObj: StyleObject): void {
		const selectorStyle = new ISelectorStyle();
		selectorStyle.SetStyleObject(styleObj);
		this.styles.set(selector, selectorStyle);
	}

	/**
	 * 设置默认样式
	 */
	public SetDefaultStyle(elementType: string, styleObj: StyleObject): void {
		const selectorStyle = new ISelectorStyle();
		selectorStyle.SetStyleObject(styleObj);
		this.defaultStyles.set(elementType, selectorStyle);
	}

	/**
	 * 获取元素样式
	 */
	public GetElementStyles(element: IElement): ISelectorStyle {
		const result = new ISelectorStyle();

		// 应用默认样式
		const defaultStyle = this.defaultStyles.get(element.GetTagName());
		if (defaultStyle) {
			result.MergeStyles(defaultStyle);
		}

		// 应用匹配的选择器样式
		this.styles.forEach((selectorStyle, selector) => {
			if (this.MatchesSelector(element, selector)) {
				result.MergeStyles(selectorStyle);
			}
		});

		// 应用内联样式
		const attributes = element.GetAttributes();
		const inlineStyle = attributes ? attributes.style : null;
		if (inlineStyle) {
			const inlineSelectorStyle = new IInlineSelectorStyle(inlineStyle);
			result.MergeStyles(inlineSelectorStyle);
		}

		return result;
	}

	/**
	 * 简单的选择器匹配
	 */
	public MatchesSelector(element: IElement, selector: string): boolean {
		// 标签选择器
		if (selector === element.GetTagName()) {
			return true;
		}

		// ID选择器
		if (selector.startsWith("#")) {
			const id = selector.substring(1);
			const attributes = element.GetAttributes();
			return attributes && attributes.id === id;
		}

		// 类选择器
		if (selector.startsWith(".")) {
			const className = selector.substring(1);
			const attributes = element.GetAttributes();
			const elementClass = attributes ? attributes.class : null;
			if (elementClass) {
				return (
					isString(elementClass) &&
					elementClass.split(/\s+/).includes(className)
				);
			}
		}

		return false;
	}
}

// 导出工具函数
export {
	camelize,
	convertVueStyleToCSS,
	hyphenate,
	mergeStyles,
	normalizeCSSPropName,
	normalizeStyle,
	parseStringStyle,
	stringifyStyle,
};

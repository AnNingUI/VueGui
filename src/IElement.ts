import type { StyleValue } from "./CSSUtils.ts";
import {
	EventListener,
	EventListenerOptions,
	EventListenerWrapper,
	IEvent,
} from "./IEvent.ts";
import {
	IBoxLayout,
	IBoxLayoutInputItem,
	IFixedLayout,
	IFixedLayoutInputItem,
	IFlexLayout,
	IFlexLayoutInputItem,
	IGridLayout,
	IGridLayoutInputItem,
} from "./ILayout.ts";
import type { IPainter } from "./IPainter.ts";
import type { IStyleItem } from "./IStyle.ts";
import { IInlineSelectorStyle, ISelectorStyle } from "./IStyle.ts";
import type { IWindow } from "./IWindow.ts";

class IElement {
	// Element identification
	protected m_tagname!: string;
	protected m_text?: string;

	// Viewport coordinates
	protected m_viewport_x!: number;
	protected m_viewport_y!: number;
	protected m_viewport_width!: number;
	protected m_viewport_height!: number;
	protected m_content_viewport_x!: number;
	protected m_content_viewport_y!: number;
	protected m_content_viewport_width!: number;
	protected m_content_viewport_height!: number;

	// Position and size
	protected m_x!: number;
	protected m_y!: number;
	protected m_width!: number;
	protected m_height!: number;
	protected m_scroll_x!: number;
	protected m_scroll_y!: number;

	// Local layout
	protected m_local_x!: number;
	protected m_local_y!: number;
	protected m_local_width!: number;
	protected m_local_height!: number;
	protected m_local_content_width!: number;
	protected m_local_content_height!: number;
	protected m_style_width!: number;
	protected m_style_height!: number;
	protected m_min_width!: number;
	protected m_max_width!: number;
	protected m_min_height!: number;
	protected m_max_height!: number;
	protected m_aspect_ratio!: number; // width / height ratio (0 = not set)

	// Spacing
	protected m_padding_left!: number;
	protected m_padding_top!: number;
	protected m_padding_right!: number;
	protected m_padding_bottom!: number;
	protected m_margin_left!: number;
	protected m_margin_top!: number;
	protected m_margin_right!: number;
	protected m_margin_bottom!: number;

	// Positioning
	protected m_zindex!: number;
	protected m_z_index?: number;
	protected m_top!: number | null;
	protected m_right!: number | null;
	protected m_bottom!: number | null;
	protected m_left!: number | null;

	// Border
	protected m_border_radius!: number;
	protected m_border_left_width!: number;
	protected m_border_top_width!: number;
	protected m_border_right_width!: number;
	protected m_border_bottom_width!: number;
	protected m_border_left_color!: string;
	protected m_border_top_color!: string;
	protected m_border_right_color!: string;
	protected m_border_bottom_color!: string;

	// Appearance
	protected m_background_color!: string;
	protected m_font_color!: string;
	protected m_font_size!: number;
	protected m_font_family!: string;
	protected m_line_height!: number;

	// Element tree
	protected m_window!: IWindow | null;
	protected m_root!: IElement | null;
	protected m_position_ancestor!: IElement | null;
	protected m_position_descendants!: IElement[];
	protected m_parent!: IElement | null;
	protected m_childrens!: IElement[];

	// Attributes and styles
	protected m_attributes!: Record<string, any>;
	protected m_styles!: Record<string, IStyleItem>;
	protected m_attribute_style?: StyleValue;
	protected m_attribute_class?: string;
	protected m_inline_selector_style?: IInlineSelectorStyle;
	protected m_selector_selector_style?: ISelectorStyle;

	// State flags
	protected m_children_changed!: boolean;
	protected m_attribute_changed!: boolean;
	protected m_style_changed!: boolean;
	protected m_layout_changed!: boolean;
	protected m_position_changed!: boolean;
	protected m_inline_style_changed?: boolean;
	protected m_selector_style_changed?: boolean;
	protected m_visible!: boolean;
	protected m_horizontal_scroll!: boolean;
	protected m_vertical_scroll!: boolean;
	protected m_fixed_posoition!: boolean;
	protected m_style_display!: string;
	protected m_dragging?: boolean;

	// Transform properties
	protected m_transform_translate_x!: number;
	protected m_transform_translate_y!: number;
	protected m_transform_scale_x!: number;
	protected m_transform_scale_y!: number;
	protected m_transform_rotate!: number; // degrees
	protected m_transform_origin_x!: number; // 0-1 (0 = left, 0.5 = center, 1 = right)
	protected m_transform_origin_y!: number; // 0-1 (0 = top, 0.5 = center, 1 = bottom)

	// Event system
	protected m_event_listeners!: Map<string, EventListenerWrapper[]>; // 事件监听器映射
	protected m_capture_listeners!: Map<string, EventListenerWrapper[]>; // 捕获阶段监听器

	/**
	 * 安全地向 Map 设置值，即使 Map 被 Vue Proxy 包装也能工作
	 */
	private SafeMapSet<K, V>(map: Map<K, V>, key: K, value: V): void {
		// 直接尝试访问原始 Map，绕过 Vue Proxy
		const rawMap = (map as any).__v_raw || map;
		rawMap.set(key, value);
	}

	/**
	 * 安全地从 Map 删除键，即使 Map 被 Vue Proxy 包装也能工作
	 */
	private SafeMapDelete<K>(map: Map<K, any>, key: K): void {
		const rawMap = (map as any).__v_raw || map;
		try {
			rawMap.delete(key);
		} catch (error) {
			console.warn("[IElement] Failed to delete Map key:", error);
		}
	}

	/**
	 * 安全地清空 Map，即使 Map 被 Vue Proxy 包装也能工作
	 */
	private SafeMapClear(map: Map<any, any>): void {
		const rawMap = (map as any).__v_raw || map;
		try {
			rawMap.clear();
		} catch (error) {
			console.warn("[IElement] Failed to clear Map:", error);
		}
	}

	constructor() {
		this.m_tagname = "Element";
		this.m_viewport_x = 0;
		this.m_viewport_y = 0;
		this.m_viewport_width = 0;
		this.m_viewport_height = 0;
		this.m_content_viewport_x = 0;
		this.m_content_viewport_y = 0;
		this.m_content_viewport_width = 0;
		this.m_content_viewport_height = 0;
		this.m_x = 0;
		this.m_y = 0;
		this.m_width = 0;
		this.m_height = 0;
		this.m_scroll_x = 0;
		this.m_scroll_y = 0;
		this.m_local_x = 0;
		this.m_local_y = 0;
		this.m_local_width = -1;
		this.m_local_height = -1;
		this.m_local_content_width = 0;
		this.m_local_content_height = 0;
		this.m_style_width = -1;
		this.m_style_height = -1;
		this.m_min_width = -1;
		this.m_max_width = -1;
		this.m_min_height = -1;
		this.m_max_height = -1;
		this.m_aspect_ratio = 0;
		this.m_padding_left = 0;
		this.m_padding_top = 0;
		this.m_padding_right = 0;
		this.m_padding_bottom = 0;
		this.m_margin_left = 0;
		this.m_margin_top = 0;
		this.m_margin_right = 0;
		this.m_margin_bottom = 0;
		this.m_zindex = 0;
		this.m_top = null;
		this.m_right = null;
		this.m_bottom = null;
		this.m_left = null;
		this.m_border_radius = 0;
		this.m_border_left_width = 0;
		this.m_border_top_width = 0;
		this.m_border_right_width = 0;
		this.m_border_bottom_width = 0;
		this.m_border_left_color = "black";
		this.m_border_top_color = "black";
		this.m_border_right_color = "black";
		this.m_border_bottom_color = "black";
		this.m_background_color = "transparent";
		this.m_font_color = "black";
		this.m_font_size = 16;
		this.m_font_family = "Arial";
		this.m_line_height = 20;
		this.m_position_ancestor = null;
		this.m_position_descendants = [];
		this.m_window = null;
		this.m_root = null;
		this.m_position_ancestor = null;
		this.m_parent = null;
		this.m_childrens = [];
		this.m_attributes = {};
		this.m_styles = {};
		this.m_children_changed = false;
		this.m_attribute_changed = false;
		this.m_style_changed = false;
		this.m_layout_changed = true;
		this.m_position_changed = true;
		this.m_visible = true;
		this.m_horizontal_scroll = false;
		this.m_vertical_scroll = false;
		this.m_fixed_posoition = false;
		this.m_style_display = "block";

		this.m_transform_translate_x = 0;
		this.m_transform_translate_y = 0;
		this.m_transform_scale_x = 1;
		this.m_transform_scale_y = 1;
		this.m_transform_rotate = 0;
		this.m_transform_origin_x = 0.5;
		this.m_transform_origin_y = 0.5;

		this.m_event_listeners = new Map();
		this.m_capture_listeners = new Map();

		this.SetAttributeSetterGetter(
			"style",
			(style_value: StyleValue) => {
				this.m_inline_style_changed = true;
				this.m_attribute_style = style_value; // 支持字符串、对象、数组
				this.SetStyleChanged(true);
			},
			() => {
				return this.m_attribute_style;
			}
		);

		this.SetAttributeSetterGetter(
			"class",
			(class_value: string) => {
				this.m_selector_style_changed = true;
				this.m_attribute_class = class_value;
				this.SetStyleChanged(true);
			},
			() => {
				return this.m_attribute_class;
			}
		);
	}

	SetWindow(window: IWindow): void {
		this.m_window = window;
	}
	GetWindow(): IWindow | null {
		return this.m_window;
	}
	SetRoot(root: IElement): void {
		this.m_root = root;
	}
	GetRoot(): IElement | null {
		return this.m_root;
	}
	GetWindowWidth(): number {
		return this.m_window!.GetWindowWidth();
	}
	GetWindowHeight(): number {
		return this.m_window!.GetWindowHeight();
	}
	SetChildrenChanged(changed: boolean): void {
		this.m_children_changed = changed;
	}
	SetAttributeChanged(changed: boolean): void {
		this.m_attribute_changed = changed;
	}
	SetStyleChanged(changed: boolean): void {
		this.m_style_changed = changed;
	}
	SetLayoutChanged(changed: boolean): void {
		this.m_layout_changed = changed;
	}
	SetPositionChanged(changed: boolean): void {
		this.m_position_changed = changed;
	}
	IsChildrenChanged(): boolean {
		return this.m_children_changed;
	}
	IsAttributeChanged(): boolean {
		return this.m_attribute_changed;
	}
	IsStyleChanged(): boolean {
		return this.m_style_changed;
	}
	IsLayoutChanged(): boolean {
		return this.m_layout_changed;
	}
	IsPositionChanged(): boolean {
		return this.m_position_changed;
	}
	GetPositionAncestor(): IElement | null {
		return this.m_position_ancestor;
	}
	GetPositionDescendants(): IElement[] {
		return this.m_position_descendants;
	}
	GetChildrens(): IElement[] {
		return this.m_childrens;
	}
	GetAttributes(): Record<string, any> {
		return this.m_attributes;
	}
	GetStyles(): Record<string, IStyleItem> {
		return this.m_styles;
	}
	SetParent(parent: IElement | null): void {
		this.m_parent = parent;
	}
	GetParent(): IElement | null {
		return this.m_parent;
	}
	SetTagName(tagname: string): void {
		this.m_tagname = tagname;
	}
	GetTagName(): string {
		return this.m_tagname;
	}
	SetVisible(visible: boolean): void {
		this.m_visible = visible;
	}
	IsVisible(): boolean {
		return this.m_visible;
	}
	SetDragging(dragging: boolean): void {
		this.m_dragging = dragging;
	}
	IsDragging(): boolean {
		return this.m_dragging || false;
	}
	SetHorizontalScroll(horizontal_scroll: boolean): void {
		this.m_horizontal_scroll = horizontal_scroll;
	}
	IsHorizontalScroll(): boolean {
		return this.m_horizontal_scroll;
	}
	SetVerticalScroll(vertical_scroll: boolean): void {
		this.m_vertical_scroll = vertical_scroll;
	}
	IsVerticalScroll(): boolean {
		return this.m_vertical_scroll;
	}
	SetFixedPosition(fixed_position: boolean): void {
		this.m_fixed_posoition = fixed_position;
	}
	IsFixedPosition(): boolean {
		return this.m_fixed_posoition;
	}
	SetStyleDisplay(style_display: string): void {
		this.m_style_display = style_display;
	}
	IsBlockDisplay(): boolean {
		return this.m_style_display === "block" || this.m_style_display === "flex";
	}
	IsInlineDisplay(): boolean {
		return (
			this.m_style_display === "inline" ||
			this.m_style_display === "inline-block" ||
			this.m_style_display === "inline-flex"
		);
	}
	IsFlexDisplay(): boolean {
		return (
			this.m_style_display === "flex" || this.m_style_display === "inline-flex"
		);
	}
	IsGridDisplay(): boolean {
		return (
			this.m_style_display === "grid" || this.m_style_display === "inline-grid"
		);
	}
	GetTransform(): {
		translateX: number;
		translateY: number;
		scaleX: number;
		scaleY: number;
		rotate: number;
		originX: number;
		originY: number;
	} {
		return {
			translateX: this.m_transform_translate_x,
			translateY: this.m_transform_translate_y,
			scaleX: this.m_transform_scale_x,
			scaleY: this.m_transform_scale_y,
			rotate: this.m_transform_rotate,
			originX: this.m_transform_origin_x,
			originY: this.m_transform_origin_y,
		};
	}

	// 布局
	SetX(x: number): void {
		this.m_x = x;
	}
	SetY(y: number): void {
		this.m_y = y;
	}
	SetWidth(width: number): void {
		this.m_width = width;
	}
	SetHeight(height: number): void {
		this.m_height = height;
	}
	GetX(): number {
		return this.m_x;
	}
	GetY(): number {
		return this.m_y;
	}
	GetWidth(): number {
		return this.m_width;
	}
	GetHeight(): number {
		return this.m_height;
	}
	GetContentX(): number {
		return this.m_x + this.m_padding_left + this.m_border_left_width;
	}
	GetContentY(): number {
		return this.m_y + this.m_padding_top + this.m_border_top_width;
	}
	SetLocalX(x: number): void {
		this.m_local_x = x;
	}
	SetLocalY(y: number): void {
		this.m_local_y = y;
	}
	SetLocalWidth(width: number): void {
		this.m_local_width = width;
	}
	SetLocalHeight(height: number): void {
		this.m_local_height = height;
	}
	GetLocalX(): number {
		return this.m_local_x;
	}
	GetLocalY(): number {
		return this.m_local_y;
	}
	GetLocalWidth(): number {
		return this.m_local_width;
	}
	GetLocalHeight(): number {
		return this.m_local_height;
	}
	SetLocalContentWidth(width: number): void {
		this.m_local_content_width = width;
	}
	SetLocalContentHeight(height: number): void {
		this.m_local_content_height = height;
	}
	GetLocalContentWidth(): number {
		return this.m_local_content_width;
	}
	GetLocalContentHeight(): number {
		return this.m_local_content_height;
	}
	GetStyleWidth(): number {
		return this.m_style_width;
	}
	GetStyleHeight(): number {
		return this.m_style_height;
	}
	SetStyleWidth(width: number): void {
		this.m_style_width = width;
	}
	SetStyleHeight(height: number): void {
		this.m_style_height = height;
	}
	GetMinWidth(): number {
		return this.m_min_width;
	}
	GetMaxWidth(): number {
		return this.m_max_width;
	}
	GetMinHeight(): number {
		return this.m_min_height;
	}
	GetMaxHeight(): number {
		return this.m_max_height;
	}
	SetMinWidth(width: number): void {
		this.m_min_width = width;
	}
	SetMaxWidth(width: number): void {
		this.m_max_width = width;
	}
	SetMinHeight(height: number): void {
		this.m_min_height = height;
	}
	SetMaxHeight(height: number): void {
		this.m_max_height = height;
	}
	GetAspectRatio(): number {
		return this.m_aspect_ratio;
	}
	SetAspectRatio(ratio: number): void {
		this.m_aspect_ratio = ratio;
	}
	ApplySizeConstraints(width: number, height: number): [number, number] {
		// Apply aspect ratio first if set
		if (this.m_aspect_ratio > 0) {
			if (width > 0 && height <= 0) {
				height = width / this.m_aspect_ratio;
			} else if (height > 0 && width <= 0) {
				width = height * this.m_aspect_ratio;
			} else if (width > 0 && height > 0) {
				// Both set, maintain aspect ratio by adjusting height
				height = width / this.m_aspect_ratio;
			}
		}

		// Apply min/max constraints
		if (this.m_min_width >= 0 && width < this.m_min_width) {
			width = this.m_min_width;
		}
		if (this.m_max_width >= 0 && width > this.m_max_width) {
			width = this.m_max_width;
		}
		if (this.m_min_height >= 0 && height < this.m_min_height) {
			height = this.m_min_height;
		}
		if (this.m_max_height >= 0 && height > this.m_max_height) {
			height = this.m_max_height;
		}

		// Re-apply aspect ratio after constraints if needed
		if (this.m_aspect_ratio > 0) {
			const constrained_height = width / this.m_aspect_ratio;
			if (
				(this.m_min_height < 0 || constrained_height >= this.m_min_height) &&
				(this.m_max_height < 0 || constrained_height <= this.m_max_height)
			) {
				height = constrained_height;
			} else {
				// Adjust width to maintain aspect ratio with constrained height
				width = height * this.m_aspect_ratio;
			}
		}

		return [width, height];
	}
	GetLocalMaxContentWidth(): number {
		return (
			this.m_local_width -
			this.m_padding_left -
			this.m_padding_right -
			this.m_border_left_width -
			this.m_border_right_width
		);
	}
	GetLocalMaxContentHeight(): number {
		return (
			this.m_local_height -
			this.m_padding_top -
			this.m_padding_bottom -
			this.m_border_top_width -
			this.m_border_bottom_width
		);
	}
	GetMaxContentWidth(): number {
		return (
			this.m_width -
			this.m_padding_left -
			this.m_padding_right -
			this.m_border_left_width -
			this.m_border_right_width
		);
	}
	GetMaxContentHeight(): number {
		return (
			this.m_height -
			this.m_padding_top -
			this.m_padding_bottom -
			this.m_border_top_width -
			this.m_border_bottom_width
		);
	}
	GetScrollX(): number {
		return this.m_scroll_x;
	}
	GetScrollY(): number {
		return this.m_scroll_y;
	}
	SetScrollX(x: number): void {
		this.m_scroll_x = x;
	}
	SetScrollY(y: number): void {
		this.m_scroll_y = y;
	}
	GetMaxScrollX(): number {
		return this.m_local_content_width - this.GetLocalMaxContentWidth();
	}
	GetMaxScrollY(): number {
		return this.m_local_content_height - this.GetLocalMaxContentHeight();
	}
	// 视口
	SetViewPortX(x: number): void {
		this.m_viewport_x = x;
	}
	SetViewPortY(y: number): void {
		this.m_viewport_y = y;
	}
	SetViewPortWidth(width: number): void {
		this.m_viewport_width = width;
	}
	SetViewPortHeight(height: number): void {
		this.m_viewport_height = height;
	}
	GetViewPortX(): number {
		return this.m_viewport_x;
	}
	GetViewPortY(): number {
		return this.m_viewport_y;
	}
	GetViewPortWidth(): number {
		return this.m_viewport_width;
	}
	GetViewPortHeight(): number {
		return this.m_viewport_height;
	}
	SetContentViewPortX(x: number): void {
		this.m_content_viewport_x = x;
	}
	SetContentViewPortY(y: number): void {
		this.m_content_viewport_y = y;
	}
	SetContentViewPortWidth(width: number): void {
		this.m_content_viewport_width = width;
	}
	SetContentViewPortHeight(height: number): void {
		this.m_content_viewport_height = height;
	}
	GetContentViewPortX(): number {
		return this.m_content_viewport_x;
	}
	GetContentViewPortY(): number {
		return this.m_content_viewport_y;
	}
	GetContentViewPortWidth(): number {
		return this.m_content_viewport_width;
	}
	GetContentViewPortHeight(): number {
		return this.m_content_viewport_height;
	}

	// 边框 填充 边距
	GetBorderLeftWidth(): number {
		return this.m_border_left_width;
	}
	GetBorderTopWidth(): number {
		return this.m_border_top_width;
	}
	GetBorderRightWidth(): number {
		return this.m_border_right_width;
	}
	GetBorderBottomWidth(): number {
		return this.m_border_bottom_width;
	}
	SetBorderLeftWidth(width: number): void {
		this.m_border_left_width = width;
	}
	SetBorderTopWidth(width: number): void {
		this.m_border_top_width = width;
	}
	SetBorderRightWidth(width: number): void {
		this.m_border_right_width = width;
	}
	SetBorderBottomWidth(width: number): void {
		this.m_border_bottom_width = width;
	}
	GetBorderLeftColor(): string {
		return this.m_border_left_color;
	}
	GetBorderTopColor(): string {
		return this.m_border_top_color;
	}
	GetBorderRightColor(): string {
		return this.m_border_right_color;
	}
	GetBorderBottomColor(): string {
		return this.m_border_bottom_color;
	}
	SetBorderLeftColor(color: string): void {
		this.m_border_left_color = color;
	}
	SetBorderTopColor(color: string): void {
		this.m_border_top_color = color;
	}
	SetBorderRightColor(color: string): void {
		this.m_border_right_color = color;
	}
	SetBorderBottomColor(color: string): void {
		this.m_border_bottom_color = color;
	}
	SetPaddingLeft(padding: number): void {
		this.m_padding_left = padding;
	}
	SetPaddingTop(padding: number): void {
		this.m_padding_top = padding;
	}
	SetPaddingRight(padding: number): void {
		this.m_padding_right = padding;
	}
	SetPaddingBottom(padding: number): void {
		this.m_padding_bottom = padding;
	}
	GetPaddingLeft(): number {
		return this.m_padding_left;
	}
	GetPaddingTop(): number {
		return this.m_padding_top;
	}
	GetPaddingRight(): number {
		return this.m_padding_right;
	}
	GetPaddingBottom(): number {
		return this.m_padding_bottom;
	}
	SetMarginLeft(margin: number): void {
		this.m_margin_left = margin;
	}
	SetMarginTop(margin: number): void {
		this.m_margin_top = margin;
	}
	SetMarginRight(margin: number): void {
		this.m_margin_right = margin;
	}
	SetMarginBottom(margin: number): void {
		this.m_margin_bottom = margin;
	}
	GetMarginLeft(): number {
		return this.m_margin_left;
	}
	GetMarginTop(): number {
		return this.m_margin_top;
	}
	GetMarginRight(): number {
		return this.m_margin_right;
	}
	GetMarginBottom(): number {
		return this.m_margin_bottom;
	}
	SetBorderRadius(radius: number): void {
		this.m_border_radius = radius;
	}
	GetBorderRadius(): number {
		return this.m_border_radius;
	}
	// 辅助布局
	GetSpaceWidth(): number {
		return this.m_local_width + this.m_margin_left + this.m_margin_right;
	}
	GetSpaceHeight(): number {
		return this.m_local_height + this.m_margin_top + this.m_margin_bottom;
	}
	GetPaddingBorderWidth(): number {
		return (
			this.m_padding_left +
			this.m_padding_right +
			this.m_border_left_width +
			this.m_border_right_width
		);
	}
	GetPaddingBorderHeight(): number {
		return (
			this.m_padding_top +
			this.m_padding_bottom +
			this.m_border_top_width +
			this.m_border_bottom_width
		);
	}
	GetLeftPaddingBorderSize(): number {
		return this.m_padding_left + this.m_border_left_width;
	}
	GetRightPaddingBorderSize(): number {
		return this.m_padding_right + this.m_border_right_width;
	}
	GetTopPaddingBorderSize(): number {
		return this.m_padding_top + this.m_border_top_width;
	}
	GetBottomPaddingBorderSize(): number {
		return this.m_padding_bottom + this.m_border_bottom_width;
	}
	// 定位
	SetZIndex(z_index: number): void {
		this.m_z_index = z_index;
	}
	GetZIndex(): number {
		return this.m_z_index || 0;
	}
	SetTop(top: number | null): void {
		this.m_top = top;
	}
	SetRight(right: number | null): void {
		this.m_right = right;
	}
	SetBottom(bottom: number | null): void {
		this.m_bottom = bottom;
	}
	SetLeft(left: number | null): void {
		this.m_left = left;
	}
	GetTop(): number | null {
		return this.m_top;
	}
	GetRight(): number | null {
		return this.m_right;
	}
	GetBottom(): number | null {
		return this.m_bottom;
	}
	GetLeft(): number | null {
		return this.m_left;
	}

	// 背景 字体
	SetBackgroundColor(color: string): void {
		if (this.m_background_color !== color) {
			this.m_background_color = color;
			this.Refresh();
		}
	}
	GetBackgroundColor(): string {
		return this.m_background_color;
	}
	SetFontColor(color: string): void {
		if (this.m_font_color !== color) {
			this.m_font_color = color;
			this.Refresh();
		}
	}
	GetFontColor(): string {
		return this.m_font_color;
	}
	SetFontSize(size: number): void {
		if (this.m_font_size !== size) {
			this.m_font_size = size;
			this.SetLayoutChanged(true);

			// 通知父元素需要重新布局（子元素大小变化）
			const parent = this.GetParent();
			if (parent) {
				parent.SetLayoutChanged(true);
			}

			this.Refresh();
		}
	}
	GetFontSize(): number {
		return this.m_font_size;
	}
	SetFontFamily(family: string): void {
		if (this.m_font_family !== family) {
			this.m_font_family = family;
			this.SetLayoutChanged(true);
			this.Refresh();
		}
	}
	GetFontFamily(): string {
		return this.m_font_family;
	}
	SetLineHeight(height: number): void {
		if (this.m_line_height !== height) {
			this.m_line_height = height;
			this.SetLayoutChanged(true);

			// 通知父元素需要重新布局（子元素大小变化）
			const parent = this.GetParent();
			if (parent) {
				parent.SetLayoutChanged(true);
			}

			this.Refresh();
		}
	}
	GetLineHeight(): number {
		return this.m_line_height;
	}

	// 文本
	SetText(text: string): void {
		this.m_text = text;
	}
	GetText(): string | undefined {
		return this.m_text;
	}

	// 插入子元素
	InsertChildren(
		target_children: IElement,
		anchor_children: IElement | null = null
	): boolean {
		if (
			this.m_childrens.includes(target_children) ||
			!target_children ||
			target_children === this
		) {
			return false;
		}
		if (anchor_children === null) {
			this.m_childrens.push(target_children);
		} else {
			const index = this.m_childrens.indexOf(anchor_children);
			if (index !== -1) {
				this.m_childrens.splice(index, 0, target_children);
			} else {
				this.m_childrens.push(target_children);
			}
		}
		target_children.m_parent = this;
		this.m_children_changed = true;
		this.Refresh();
		return true;
	}

	// 删除子元素
	DeleteChildren(target_children: IElement): boolean {
		const index = this.m_childrens.indexOf(target_children);
		if (index !== -1) {
			this.m_childrens.splice(index, 1);
			this.m_children_changed = true;
			this.Refresh();
			return true;
		}
		return false;
	}

	// 插入子属性
	InsertAttribute(key: string, value: any): boolean {
		if (this.m_attributes[key] === value) {
			return false;
		}
		this.m_attribute_changed = true;
		this.m_attributes[key] = value;

		// 如果设置的是样式属性，需要更新样式（支持字符串、对象、数组）
		if (key === "style") {
			this.m_attribute_style = value;
			this.m_inline_style_changed = true;
			this.SetStyleChanged(true);
		}

		this.Refresh();
		return true;
	}

	// 删除子属性
	DeleteAttribute(key: string): boolean {
		if (this.m_attributes[key] === undefined) {
			return false;
		}
		this.m_attributes[key] = undefined;
		this.m_attribute_changed = true;
		this.Refresh();
		return true;
	}

	// 设置属性的setter和getter
	SetAttributeSetterGetter(
		key: string,
		setter?: (value: any) => void,
		getter?: () => any
	): void {
		Object.defineProperty(this.GetAttributes(), key, {
			set: setter,
			get: getter,
		});
	}

	Refresh(): void {
		const window = this.GetWindow();
		if (window) {
			window.Refresh(
				this.m_viewport_x,
				this.m_viewport_y,
				this.m_viewport_width,
				this.m_viewport_height
			);
		}
	}

	Render(painter: IPainter): void {
		if (this.m_children_changed) this.UpdateChildren();
		if (this.m_attribute_changed) this.UpdateAttribute();
		if (this.m_style_changed) this.UpdateStyle();
		if (this.m_layout_changed) this.UpdateLayout();
		if (this.m_position_changed) this.UpdatePosition();

		if (
			this.m_viewport_width <= 0 ||
			this.m_viewport_height <= 0 ||
			!this.m_visible
		)
			return;
		painter.Save();
		painter.Clip(
			this.m_viewport_x,
			this.m_viewport_y,
			this.m_viewport_width,
			this.m_viewport_height
		);
		this.OnRenderBackground(painter);
		this.OnRenderBorder(painter);
		this.OnRenderContent(painter);
		this.OnRenderChildren(painter);
		painter.Restore();
	}

	OnRenderBackground(painter: IPainter): void {
		if (!this.m_background_color || this.m_background_color === "none") return;

		if (this.m_border_radius && this.m_border_radius > 0) {
			painter.FillRoundRectangle(
				this.m_x,
				this.m_y,
				this.m_width,
				this.m_height,
				this.m_border_radius,
				this.m_background_color
			);
		} else {
			painter.FillRectangle(
				this.m_x,
				this.m_y,
				this.m_width,
				this.m_height,
				this.m_background_color
			);
		}
	}

	OnRenderBorder(painter: IPainter): void {
		if (this.m_border_left_width && this.m_border_left_width > 0) {
			painter.FillRectangle(
				this.m_x,
				this.m_y,
				this.m_border_left_width,
				this.m_height,
				this.m_border_left_color
			);
		}
		if (this.m_border_top_width && this.m_border_top_width > 0) {
			painter.FillRectangle(
				this.m_x,
				this.m_y,
				this.m_width,
				this.m_border_top_width,
				this.m_border_top_color
			);
		}
		if (this.m_border_right_width && this.m_border_right_width > 0) {
			painter.FillRectangle(
				this.m_x + this.m_width - this.m_border_right_width,
				this.m_y,
				this.m_border_right_width,
				this.m_height,
				this.m_border_right_color
			);
		}
		if (this.m_border_bottom_width && this.m_border_bottom_width > 0) {
			painter.FillRectangle(
				this.m_x,
				this.m_y + this.m_height - this.m_border_bottom_width,
				this.m_width,
				this.m_border_bottom_width,
				this.m_border_bottom_color
			);
		}
	}

	OnRenderContent(painter: IPainter): void {
		// 渲染内容
	}

	OnRenderChildren(painter: IPainter): void {
		for (const children of this.m_childrens) {
			if (children) {
				children.Render(painter);
			}
		}
	}

	UpdateChildren(): void {
		this.m_children_changed = false;
	}

	UpdateAttribute(): void {
		this.m_attribute_changed = false;
	}

	UpdateStyle(): void {
		this.m_style_changed = false;

		if (this.m_selector_style_changed) {
			// 更新选择器样式（如果有样式管理器）
			this.m_selector_style_changed = false;
		}

		if (this.m_inline_style_changed) {
			// 更新内联样式 - 支持Vue风格的camelCase对象
			this.m_inline_selector_style = new IInlineSelectorStyle(
				this.m_attribute_style || null
			);
			this.m_inline_style_changed = false;
		}

		// 合并样式
		const finalStyle = new ISelectorStyle();

		// 应用选择器样式（如果有）
		if (this.m_selector_selector_style) {
			finalStyle.MergeStyles(this.m_selector_selector_style);
		}

		// 应用内联样式（优先级最高）
		if (this.m_inline_selector_style) {
			finalStyle.MergeStyles(this.m_inline_selector_style);
		}

		this.m_styles = finalStyle.GetStyle();

		// 生效元素样式
		this.ApplyElementStyle();
	}

	GetLayoutWidth(): number {
		const local_width = this.GetLocalWidth();
		if (local_width > 0) return local_width;
		// 元素样式宽高被设置, 则返回元素样式宽高
		const style_width = this.GetStyleWidth();
		if (style_width >= 0) return style_width;
		// 元素宽高没有被设置, 则返回父元素宽高
		const parent = this.GetParent();
		const layout_width =
			parent == null
				? 0
				: parent.GetLocalMaxContentWidth() -
				  this.GetMarginLeft() -
				  this.GetMarginRight();
		return layout_width < 0 ? 0 : layout_width;
	}

	GetLayoutHeight(): number {
		const local_height = this.GetLocalHeight();
		if (local_height > 0) return local_height;
		// 元素样式宽高被设置, 则返回元素样式宽高
		const style_height = this.GetStyleHeight();
		if (style_height >= 0) return style_height;
		// 元素宽高没有被设置, 则返回父元素宽高
		const parent = this.GetParent();
		const layout_height =
			parent == null
				? 0
				: parent.GetLocalMaxContentHeight() -
				  this.GetMarginTop() -
				  this.GetMarginBottom();
		return layout_height < 0 ? 0 : layout_height;
	}

	UpdateBoxLayout(): void {
		let layout_width = this.GetLayoutWidth();
		let layout_height = this.GetLayoutHeight();
		const is_auto_height =
			this.GetLocalHeight() < 0 && this.GetStyleHeight() < 0;

		// Apply size constraints
		[layout_width, layout_height] = this.ApplySizeConstraints(
			layout_width,
			layout_height
		);

		this.SetLocalWidth(layout_width);
		this.SetLocalHeight(layout_height);

		const layout = new IBoxLayout();
		let local_max_content_width = this.GetLocalMaxContentWidth();
		let local_max_content_height = this.GetLocalMaxContentHeight();
		local_max_content_width =
			local_max_content_width < 0 ? 0 : local_max_content_width;
		local_max_content_height =
			local_max_content_height < 0 ? 0 : local_max_content_height;
		layout.m_width = local_max_content_width;
		layout.m_height = local_max_content_height;

		const input_items: IBoxLayoutInputItem[] = [];
		const childrens = this.GetChildrens();
		for (let i = 0; i < childrens.length; i++) {
			const children = childrens[i];
			if (!children) continue;

			const children_styles = children.GetStyles();
			if (children.IsVisible()) {
				children.SetLocalX(-1);
				children.SetLocalY(-1);
				children.SetLocalWidth(-1);
				children.SetLocalHeight(-1);
			} else {
				children.SetLocalX(0);
				children.SetLocalY(0);
				children.SetLocalWidth(0);
				children.SetLocalHeight(0);
				continue;
			}
			if (children.IsFixedPosition()) {
				children.UpdateLayout();
				continue;
			}
			children.UpdateLayout();
			const input_item = new IBoxLayoutInputItem();
			const float_style = children_styles["float"];
			input_item.m_right_float =
				float_style?.GetStringValue("none") === "right";
			input_item.m_inline_block = children.IsInlineDisplay();
			input_item.m_width = children.GetLocalWidth();
			input_item.m_height = children.GetLocalHeight();
			input_item.m_margin_top = children.GetMarginTop();
			input_item.m_margin_bottom = children.GetMarginBottom();
			input_item.m_margin_left = children.GetMarginLeft();
			input_item.m_margin_right = children.GetMarginRight();
			input_item.m_userdata = children;
			input_items.push(input_item);
		}

		const content_local_x = this.GetLeftPaddingBorderSize();
		const content_local_y = this.GetTopPaddingBorderSize();
		const output_items = layout.Calculate(input_items);
		for (let i = 0; i < output_items.length; i++) {
			const output_item = output_items[i];
			if (!output_item) continue;
			const children = output_item.m_userdata;
			if (children) {
				children.SetLocalX(content_local_x + output_item.m_x);
				children.SetLocalY(content_local_y + output_item.m_y);
			}
		}

		this.SetLocalContentWidth(layout.GetContentWidth());
		this.SetLocalContentHeight(layout.GetContentHeight());

		if (is_auto_height) {
			this.SetLocalHeight(
				this.GetLocalContentHeight() + this.GetPaddingBorderHeight()
			);
		}
	}

	UpdateGridLayout(): void {
		let layout_width = this.GetLayoutWidth();
		let layout_height = this.GetLayoutHeight();
		const is_auto_height =
			this.GetLocalHeight() < 0 && this.GetStyleHeight() < 0;

		// Apply size constraints
		[layout_width, layout_height] = this.ApplySizeConstraints(
			layout_width,
			layout_height
		);

		this.SetLocalWidth(layout_width);
		this.SetLocalHeight(layout_height);

		const styles = this.GetStyles() || {};
		const grid_template_columns = styles["grid-template-columns"];
		const grid_template_rows = styles["grid-template-rows"];
		const grid_auto_flow = styles["grid-auto-flow"];
		const justify_items = styles["justify-items"];
		const align_items = styles["align-items"];
		const justify_content = styles["justify-content"];
		const align_content = styles["align-content"];
		const row_gap = styles["row-gap"];
		const column_gap = styles["column-gap"];

		const layout = new IGridLayout();
		let local_max_content_width = this.GetLocalMaxContentWidth();
		let local_max_content_height = this.GetLocalMaxContentHeight();
		local_max_content_width =
			local_max_content_width < 0 ? 0 : local_max_content_width;
		local_max_content_height =
			local_max_content_height < 0 ? 0 : local_max_content_height;
		layout.m_width = local_max_content_width;
		layout.m_height = local_max_content_height;

		// Parse grid template
		if (grid_template_columns) {
			const columns_str = grid_template_columns.GetStringValue("");
			layout.m_grid_template_columns = columns_str
				.split(/\s+/)
				.filter((s) => s);
		}
		if (grid_template_rows) {
			const rows_str = grid_template_rows.GetStringValue("");
			layout.m_grid_template_rows = rows_str.split(/\s+/).filter((s) => s);
		}

		layout.m_grid_auto_flow = grid_auto_flow
			? grid_auto_flow.GetStringValue("row")
			: "row";
		layout.m_justify_items = justify_items
			? justify_items.GetStringValue("stretch")
			: "stretch";
		layout.m_align_items = align_items
			? align_items.GetStringValue("stretch")
			: "stretch";
		layout.m_justify_content = justify_content
			? justify_content.GetStringValue("start")
			: "start";
		layout.m_align_content = align_content
			? align_content.GetStringValue("start")
			: "start";
		layout.m_row_gap = row_gap ? row_gap.GetPixelValue(0) : 0;
		layout.m_column_gap = column_gap ? column_gap.GetPixelValue(0) : 0;

		const input_items: IGridLayoutInputItem[] = [];
		const childrens = this.GetChildrens();
		for (let i = 0; i < childrens.length; i++) {
			const children = childrens[i];
			if (!children) continue;

			const children_styles = children.GetStyles() || {};
			if (children.IsVisible()) {
				children.SetLocalX(-1);
				children.SetLocalY(-1);
				children.SetLocalWidth(-1);
				children.SetLocalHeight(-1);
			} else {
				children.SetLocalX(0);
				children.SetLocalY(0);
				children.SetLocalWidth(0);
				children.SetLocalHeight(0);
				continue;
			}
			if (children.IsFixedPosition()) {
				children.UpdateLayout();
				continue;
			}

			children.UpdateLayout();
			const input_item = new IGridLayoutInputItem();
			input_item.m_width = children.GetLocalWidth();
			input_item.m_height = children.GetLocalHeight();
			input_item.m_margin_top = children.GetMarginTop();
			input_item.m_margin_bottom = children.GetMarginBottom();
			input_item.m_margin_left = children.GetMarginLeft();
			input_item.m_margin_right = children.GetMarginRight();

			// Parse grid position
			const grid_row_start = children_styles["grid-row-start"];
			const grid_row_end = children_styles["grid-row-end"];
			const grid_column_start = children_styles["grid-column-start"];
			const grid_column_end = children_styles["grid-column-end"];
			const justify_self = children_styles["justify-self"];
			const align_self = children_styles["align-self"];

			input_item.m_grid_row_start = grid_row_start
				? grid_row_start.GetIntegerValue(-1) - 1
				: -1;
			input_item.m_grid_row_end = grid_row_end
				? grid_row_end.GetIntegerValue(-1) - 1
				: -1;
			input_item.m_grid_column_start = grid_column_start
				? grid_column_start.GetIntegerValue(-1) - 1
				: -1;
			input_item.m_grid_column_end = grid_column_end
				? grid_column_end.GetIntegerValue(-1) - 1
				: -1;
			input_item.m_justify_self = justify_self
				? justify_self.GetStringValue("auto")
				: "auto";
			input_item.m_align_self = align_self
				? align_self.GetStringValue("auto")
				: "auto";
			input_item.m_userdata = children;
			input_items.push(input_item);
		}

		const content_local_x = this.GetLeftPaddingBorderSize();
		const content_local_y = this.GetTopPaddingBorderSize();
		const output_items = layout.Calculate(input_items);
		for (let i = 0; i < output_items.length; i++) {
			const output_item = output_items[i];
			if (!output_item) continue;
			const children = output_item.m_userdata;
			if (children) {
				children.SetLocalX(content_local_x + output_item.m_x);
				children.SetLocalY(content_local_y + output_item.m_y);
				children.SetLocalWidth(output_item.m_width);
				children.SetLocalHeight(output_item.m_height);
			}
		}

		this.SetLocalContentWidth(layout.GetContentWidth());
		this.SetLocalContentHeight(layout.GetContentHeight());

		if (is_auto_height) {
			this.SetLocalHeight(
				this.GetLocalContentHeight() + this.GetPaddingBorderHeight()
			);
		}
	}

	UpdateFlexLayout(): void {
		let layout_width = this.GetLayoutWidth();
		let layout_height = this.GetLayoutHeight();
		const is_auto_height =
			this.GetLocalHeight() < 0 && this.GetStyleHeight() < 0;

		// Apply size constraints
		[layout_width, layout_height] = this.ApplySizeConstraints(
			layout_width,
			layout_height
		);

		this.SetLocalWidth(layout_width);
		this.SetLocalHeight(layout_height);

		const styles = this.GetStyles() || {};
		const flex_direction = styles["flex-direction"];
		const flex_wrap = styles["flex-wrap"];
		const justify_content = styles["justify-content"];
		const align_items = styles["align-items"];
		const align_content = styles["align-content"];
		const layout = new IFlexLayout();
		let local_max_content_width = this.GetLocalMaxContentWidth();
		let local_max_content_height = this.GetLocalMaxContentHeight();
		local_max_content_width =
			local_max_content_width < 0 ? 0 : local_max_content_width;
		local_max_content_height =
			local_max_content_height < 0 ? 0 : local_max_content_height;
		layout.m_width = local_max_content_width;
		layout.m_height = local_max_content_height;
		layout.m_flex_direction = flex_direction
			? flex_direction.GetStringValue("row")
			: "row";
		layout.m_flex_wrap = flex_wrap
			? flex_wrap.GetStringValue("nowrap")
			: "nowrap";
		layout.m_justify_content = justify_content
			? justify_content.GetStringValue("flex-start")
			: "flex-start";
		layout.m_align_items = align_items
			? align_items.GetStringValue("flex-start")
			: "flex-start";
		layout.m_align_content = align_content
			? align_content.GetStringValue("flex-start")
			: "flex-start";

		const input_items: IFlexLayoutInputItem[] = [];
		const childrens = this.GetChildrens();
		for (let i = 0; i < childrens.length; i++) {
			const children = childrens[i];
			if (!children) continue;

			const children_styles = children.GetStyles() || {};
			const align_self = children_styles["align-self"];
			const flex_grow = children_styles["flex-grow"];
			const flex_shrink = children_styles["flex-shrink"];
			const order = children_styles["order"];
			if (children.IsVisible()) {
				children.SetLocalX(-1);
				children.SetLocalY(-1);
				children.SetLocalWidth(-1);
				children.SetLocalHeight(-1);
			} else {
				children.SetLocalX(0);
				children.SetLocalY(0);
				children.SetLocalWidth(0);
				children.SetLocalHeight(0);
				continue;
			}
			if (children.IsFixedPosition()) {
				children.UpdateLayout();
				continue;
			}
			// children.UpdateLayout();
			const input_item = new IFlexLayoutInputItem();
			input_item.m_margin_top = children.GetMarginTop();
			input_item.m_margin_bottom = children.GetMarginBottom();
			input_item.m_margin_left = children.GetMarginLeft();
			input_item.m_margin_right = children.GetMarginRight();
			input_item.m_align_self = align_self
				? align_self.GetStringValue("none")
				: "none";
			input_item.m_flex_grow = flex_grow ? flex_grow.GetIntegerValue(0) : 0;
			input_item.m_flex_shrink = flex_shrink
				? flex_shrink.GetIntegerValue(0)
				: 0;
			input_item.m_order = order ? order.GetIntegerValue(0) : 0;
			input_item.m_userdata = children;
			if (
				input_item.m_flex_grow == 0 &&
				input_item.m_flex_shrink == 0 &&
				input_item.m_align_self != "stretch"
			) {
				children.UpdateLayout();
				input_item.m_width = children.GetLocalWidth();
				input_item.m_height = children.GetLocalHeight();
			} else {
				children.ApplyLayoutStyle();
				input_item.m_width = children.GetStyleWidth();
				input_item.m_height = children.GetStyleHeight();
			}
			input_item.m_width = input_item.m_width < 0 ? 0 : input_item.m_width;
			input_item.m_height = input_item.m_height < 0 ? 0 : input_item.m_height;
			input_items.push(input_item);
		}

		const content_local_x = this.GetLeftPaddingBorderSize();
		const content_local_y = this.GetTopPaddingBorderSize();
		const output_items = layout.Calculate(input_items);
		for (let i = 0; i < output_items.length; i++) {
			const input_item = input_items[i];
			const output_item = output_items[i];
			if (!output_item || !input_item) continue;
			const children = output_item.m_userdata;
			if (children) {
				children.SetLocalX(content_local_x + output_item.m_x);
				children.SetLocalY(content_local_y + output_item.m_y);
				if (children.GetLocalWidth() < 0 || children.GetLocalHeight() < 0) {
					children.SetLocalWidth(output_item.m_width);
					children.SetLocalHeight(output_item.m_height);
					children.UpdateLayout();
				}
			}
		}

		this.SetLocalContentWidth(layout.GetContentWidth());
		this.SetLocalContentHeight(layout.GetContentHeight());

		if (is_auto_height) {
			this.SetLocalHeight(
				this.GetLocalContentHeight() + this.GetPaddingBorderHeight()
			);
		}
	}

	UpdateLayout(): void {
		this.ApplyLayoutStyle();
		this.SetLayoutChanged(false);
		this.SetPositionChanged(true);
		this.SetLocalContentWidth(0);
		this.SetLocalContentHeight(0);

		if (this.IsFixedPosition()) {
			// 获取定位元素
			let position_ancestor = this.GetPositionAncestor();
			position_ancestor =
				position_ancestor == null ? this.GetParent() : position_ancestor;
			position_ancestor =
				position_ancestor == null ? this.GetRoot() : position_ancestor;

			const layout = new IFixedLayout();
			layout.m_width = position_ancestor!.GetLocalMaxContentWidth();
			layout.m_height = position_ancestor!.GetLocalMaxContentHeight();

			const input_item = new IFixedLayoutInputItem();
			input_item.m_width = this.GetStyleWidth();
			input_item.m_height = this.GetStyleHeight();
			input_item.m_left = this.GetLeft();
			input_item.m_top = this.GetTop();
			input_item.m_right = this.GetRight();
			input_item.m_bottom = this.GetBottom();
			const [output_item] = layout.Calculate([input_item]);
			this.SetLocalX(output_item.m_x);
			this.SetLocalY(output_item.m_y);
			this.SetLocalWidth(output_item.m_width);
			this.SetLocalHeight(output_item.m_height);
		}
		if (this.IsVisible()) {
			if (this.IsGridDisplay()) {
				this.UpdateGridLayout();
			} else if (this.IsFlexDisplay()) {
				this.UpdateFlexLayout();
			} else {
				this.UpdateBoxLayout();
			}
		} else {
			this.SetLocalWidth(0);
			this.SetLocalHeight(0);
		}
		const parent = this.GetParent();
		if (this.GetLocalX() < 0 && parent) {
			this.SetLocalX(
				parent.GetPaddingLeft() +
					parent.GetBorderLeftWidth() +
					this.GetMarginLeft()
			);
		}
		if (this.GetLocalY() < 0 && parent) {
			this.SetLocalY(
				parent.GetPaddingTop() +
					parent.GetBorderTopWidth() +
					this.GetMarginTop()
			);
		}
		this.SetWidth(this.GetLocalWidth());
		this.SetHeight(this.GetLocalHeight());
	}

	UpdatePosition(): void {
		this.SetPositionChanged(false);
		let position_ancestor: IElement | null = this.GetPositionAncestor();
		position_ancestor =
			position_ancestor == null ? this.GetParent() : position_ancestor;
		position_ancestor =
			position_ancestor == null ? this.GetRoot() : position_ancestor;

		if (!position_ancestor) {
			return;
		}

		// 更新位置
		if (this.IsDragging()) {
			// SetX(IDragDrop:: GetInstance().GetDragEndX());
			// SetY(IDragDrop:: GetInstance().GetDragEndY());
		} else if (this.IsFixedPosition()) {
			this.SetX(position_ancestor.GetX() + this.GetLocalX());
			this.SetY(position_ancestor.GetY() + this.GetLocalY());
		} else {
			this.SetX(
				position_ancestor.GetX() +
					this.GetLocalX() -
					position_ancestor.GetScrollX()
			);
			this.SetY(
				position_ancestor.GetY() +
					this.GetLocalY() -
					position_ancestor.GetScrollY()
			);
		}
		// 更新宽高
		this.SetWidth(this.GetLocalWidth());
		this.SetHeight(this.GetLocalHeight());

		// 更新视口 方便获取鼠标事件元素
		if (this.IsFixedPosition()) {
			position_ancestor = this.GetRoot(); // 定位元素视口在根元素之内既可
			const view_port_x = position_ancestor!.GetContentViewPortX();
			const view_port_y = position_ancestor!.GetContentViewPortY();
			const view_port_width = position_ancestor!.GetContentViewPortWidth();
			const view_port_height = position_ancestor!.GetContentViewPortHeight();
			this.SetViewPortX(Math.max(view_port_x, this.GetX()));
			this.SetViewPortY(Math.max(view_port_y, this.GetY()));
			this.SetViewPortWidth(
				Math.min(view_port_x + view_port_width, this.GetX() + this.GetWidth()) -
					this.GetViewPortX()
			);
			this.SetViewPortHeight(
				Math.min(
					view_port_y + view_port_height,
					this.GetY() + this.GetHeight()
				) - this.GetViewPortY()
			);
		} else {
			this.SetViewPortX(
				Math.max(position_ancestor.GetContentViewPortX(), this.GetX())
			);
			this.SetViewPortY(
				Math.max(position_ancestor.GetContentViewPortY(), this.GetY())
			);
			this.SetViewPortWidth(
				Math.min(
					position_ancestor.GetContentViewPortX() +
						position_ancestor.GetContentViewPortWidth(),
					this.GetX() + this.GetWidth()
				) - this.GetViewPortX()
			);
			this.SetViewPortHeight(
				Math.min(
					position_ancestor.GetContentViewPortY() +
						position_ancestor.GetContentViewPortHeight(),
					this.GetY() + this.GetHeight()
				) - this.GetViewPortY()
			);
		}

		// 更新内容视口
		{
			const viewport_x = this.GetViewPortX();
			const viewport_y = this.GetViewPortY();
			const viewport_width = this.GetViewPortWidth();
			const viewport_height = this.GetViewPortHeight();
			const content_x = this.GetContentX();
			const content_y = this.GetContentY();
			const max_content_width = this.GetMaxContentWidth();
			const max_content_height = this.GetMaxContentHeight();
			const content_viewport_x =
				content_x < viewport_x ? viewport_x : content_x;
			const content_viewport_y =
				content_y < viewport_y ? viewport_y : content_y;
			const content_viewport_width =
				(content_x + max_content_width < viewport_x + viewport_width
					? content_x + max_content_width
					: viewport_x + viewport_width) - content_viewport_x;
			const content_viewport_height =
				(content_y + max_content_height < viewport_y + viewport_height
					? content_y + max_content_height
					: viewport_y + viewport_height) - content_viewport_y;
			this.SetContentViewPortX(content_viewport_x);
			this.SetContentViewPortY(content_viewport_y);
			this.SetContentViewPortWidth(content_viewport_width);
			this.SetContentViewPortHeight(content_viewport_height);
		}

		// 刷新视口窗口
		this.Refresh();

		// 更新子元素位置
		const childrens = this.GetChildrens();
		const childrens_size = childrens.length;
		for (let i = 0; i < childrens_size; i++) {
			const children = childrens[i];
			if (children) {
				children.UpdatePosition();
			}
		}
	}

	// 应用元素样式
	ApplyElementStyle(): void {
		const styles = this.GetStyles();
		const parent = this.GetParent();
		const is_support_inherit_style = false;

		// 保存旧的 fontSize 以检测变化
		const oldFontSize = this.GetFontSize();

		const font_size = styles["font-size"];
		if (font_size && font_size.IsPixelValue()) {
			this.SetFontSize(font_size.GetPixelValue(0));
		} else {
			this.SetFontSize(
				parent && is_support_inherit_style
					? parent.GetFontSize()
					: this.GetFontSize()
			);
		}

		const fontSize_changed = this.GetFontSize() !== oldFontSize;

		const font_color = styles["color"];
		if (font_color && font_color.IsColorValue()) {
			this.SetFontColor(font_color.GetColorValue("#00000000"));
		} else {
			this.SetFontColor(
				parent && is_support_inherit_style
					? parent.GetFontColor()
					: this.GetFontColor()
			);
		}

		const line_height = styles["line-height"];
		if (line_height) {
			if (line_height.IsPixelValue()) {
				this.SetLineHeight(line_height.GetPixelValue(this.GetFontSize() * 1.5));
			} else if (line_height.IsPercentageValue()) {
				this.SetLineHeight(
					(line_height.GetPercentageValue(150) / 100) * this.GetFontSize()
				);
			} else if (line_height.IsNumberValue()) {
				this.SetLineHeight(
					line_height.GetNumberValue(1.5) * this.GetFontSize()
				);
			}
		} else if (fontSize_changed) {
			// 🔥 关键修复：如果 fontSize 变了但没有明确设置 lineHeight，自动按比例更新
			this.SetLineHeight(this.GetFontSize() * 1.5);
		} else {
			this.SetLineHeight(
				parent && is_support_inherit_style
					? parent.GetLineHeight()
					: this.GetLineHeight()
			);
		}

		const border_top_width = styles["border-top-width"];
		if (border_top_width && border_top_width.IsPixelValue()) {
			this.SetBorderTopWidth(
				border_top_width.GetPixelValue(this.GetBorderTopWidth())
			);
		}
		const border_right_width = styles["border-right-width"];
		if (border_right_width && border_right_width.IsPixelValue()) {
			this.SetBorderRightWidth(
				border_right_width.GetPixelValue(this.GetBorderRightWidth())
			);
		}
		const border_bottom_width = styles["border-bottom-width"];
		if (border_bottom_width && border_bottom_width.IsPixelValue()) {
			this.SetBorderBottomWidth(
				border_bottom_width.GetPixelValue(this.GetBorderBottomWidth())
			);
		}
		const border_left_width = styles["border-left-width"];
		if (border_left_width && border_left_width.IsPixelValue()) {
			this.SetBorderLeftWidth(
				border_left_width.GetPixelValue(this.GetBorderLeftWidth())
			);
		}

		const border_top_color = styles["border-top-color"];
		if (border_top_color && border_top_color.IsColorValue()) {
			this.SetBorderTopColor(
				border_top_color.GetColorValue(this.GetBorderTopColor())
			);
		}
		const border_right_color = styles["border-right-color"];
		if (border_right_color && border_right_color.IsColorValue()) {
			this.SetBorderRightColor(
				border_right_color.GetColorValue(this.GetBorderRightColor())
			);
		}
		const border_bottom_color = styles["border-bottom-color"];
		if (border_bottom_color && border_bottom_color.IsColorValue()) {
			this.SetBorderBottomColor(
				border_bottom_color.GetColorValue(this.GetBorderBottomColor())
			);
		}
		const border_left_color = styles["border-left-color"];
		if (border_left_color && border_left_color.IsColorValue()) {
			this.SetBorderBottomColor(
				border_left_color.GetColorValue(this.GetBorderLeftColor())
			);
		}

		const background_color = styles["background-color"];
		if (background_color && background_color.IsColorValue()) {
			this.SetBackgroundColor(
				background_color.GetColorValue(this.GetBackgroundColor())
			);
		}

		const border_radius = styles["border-radius"];
		if (border_radius && border_radius.IsPixelValue()) {
			this.SetBorderRadius(border_radius.GetPixelValue(this.GetBorderRadius()));
		}

		const overflow_x = styles["overflow-x"];
		if (overflow_x) {
			const overflow_x_value = overflow_x.GetStringValue("auto");
			this.SetHorizontalScroll(
				overflow_x_value === "auto" || overflow_x_value === "scroll"
			);
		}

		const overflow_y = styles["overflow-y"];
		if (overflow_y) {
			const overflow_y_value = overflow_y.GetStringValue("auto");
			this.SetVerticalScroll(
				overflow_y_value === "auto" || overflow_y_value === "scroll"
			);
		}

		const posoition = styles["position"];
		if (posoition) {
			const position_value = posoition.GetStringValue("static");
			this.SetFixedPosition(
				position_value === "fixed" || position_value === "absolute"
			);
		}

		const display = styles["display"];
		if (display) {
			const display_value = display.GetStringValue("block");
			this.SetStyleDisplay(display_value);
		}

		// Parse transform property
		const transform = styles["transform"];
		if (transform) {
			const transform_str = transform.GetStringValue("");
			this.ParseTransform(transform_str);
		}

		// Parse transform-origin
		const transform_origin = styles["transform-origin"];
		if (transform_origin) {
			const origin_str = transform_origin.GetStringValue("50% 50%");
			const parts = origin_str.split(/\s+/);
			if (parts.length >= 1) {
				this.m_transform_origin_x = this.ParsePercentageOrKeyword(
					parts[0],
					true
				);
			}
			if (parts.length >= 2) {
				this.m_transform_origin_y = this.ParsePercentageOrKeyword(
					parts[1],
					false
				);
			}
		}
	}

	ParseTransform(transform_str: string): void {
		// Reset transform values
		this.m_transform_translate_x = 0;
		this.m_transform_translate_y = 0;
		this.m_transform_scale_x = 1;
		this.m_transform_scale_y = 1;
		this.m_transform_rotate = 0;

		if (!transform_str || transform_str === "none") return;

		// Match transform functions: translate(), scale(), rotate(), etc.
		const regex = /(\w+)\(([^)]+)\)/g;
		let match;

		while ((match = regex.exec(transform_str)) !== null) {
			const func = match[1];
			const args = match[2].split(/,\s*/);

			switch (func) {
				case "translate":
					if (args.length >= 1)
						this.m_transform_translate_x = this.ParsePixelValue(args[0]);
					if (args.length >= 2)
						this.m_transform_translate_y = this.ParsePixelValue(args[1]);
					break;
				case "translateX":
					this.m_transform_translate_x = this.ParsePixelValue(args[0]);
					break;
				case "translateY":
					this.m_transform_translate_y = this.ParsePixelValue(args[0]);
					break;
				case "scale":
					if (args.length >= 1) this.m_transform_scale_x = parseFloat(args[0]);
					if (args.length >= 2) {
						this.m_transform_scale_y = parseFloat(args[1]);
					} else {
						this.m_transform_scale_y = this.m_transform_scale_x;
					}
					break;
				case "scaleX":
					this.m_transform_scale_x = parseFloat(args[0]);
					break;
				case "scaleY":
					this.m_transform_scale_y = parseFloat(args[0]);
					break;
				case "rotate":
					this.m_transform_rotate = this.ParseAngle(args[0]);
					break;
			}
		}
	}

	ParsePixelValue(value: string): number {
		if (value.endsWith("px")) {
			return parseFloat(value);
		}
		return parseFloat(value) || 0;
	}

	ParseAngle(value: string): number {
		if (value.endsWith("deg")) {
			return parseFloat(value);
		} else if (value.endsWith("rad")) {
			return (parseFloat(value) * 180) / Math.PI;
		} else if (value.endsWith("turn")) {
			return parseFloat(value) * 360;
		}
		return parseFloat(value) || 0;
	}

	ParsePercentageOrKeyword(value: string, isX: boolean): number {
		if (value.endsWith("%")) {
			return parseFloat(value) / 100;
		}
		switch (value) {
			case "left":
				return 0;
			case "center":
				return 0.5;
			case "right":
				return 1;
			case "top":
				return 0;
			case "bottom":
				return 1;
			default:
				return isX ? 0.5 : 0.5;
		}
	}

	// 应用布局样式
	ApplyLayoutStyle(): void {
		// 布局可能被直接调用(如元素布局可能先依赖子元素布局完成), 而布局常用依赖子元素及其属性和样式, 因此需要先更新子元素, 属性, 样式.
		// 如果子元素发生更新则更新子元素
		if (this.IsChildrenChanged()) this.UpdateChildren();
		// 如果属性更新则刷新属性
		if (this.IsAttributeChanged()) this.UpdateAttribute();
		// 样式发生改变 去更新样式
		if (this.IsStyleChanged()) this.UpdateStyle();

		const styles = this.GetStyles();
		if (!styles) return;
		let parent = this.GetParent();
		let parent_local_width = 0;
		let parent_local_height = 0;

		if (parent) {
			const position = styles["position"];
			const posoition_value = position
				? position.GetStringValue("static")
				: "static";
			if (posoition_value == "fixed") {
				const root = this.GetRoot();
				if (root) {
					parent_local_width = root.GetLocalWidth();
					parent_local_height = root.GetLocalHeight();
				}
			} else if (posoition_value == "absolute") {
				parent_local_width = parent.GetLocalWidth();
				parent_local_height = parent.GetLocalHeight();
			} else {
				parent_local_width = parent.GetLocalMaxContentWidth();
				parent_local_height = parent.GetLocalMaxContentHeight();
			}
		} else {
			parent_local_width = this.GetWindowWidth();
			parent_local_height = this.GetWindowHeight();
		}

		const padding_top = styles["padding-top"];
		if (padding_top) {
			this.SetPaddingTop(padding_top.GetDimensionValue(parent_local_width, 0));
		}

		const padding_right = styles["padding-right"];
		if (padding_right) {
			this.SetPaddingRight(
				padding_right.GetDimensionValue(parent_local_width, 0)
			);
		}

		const padding_bottom = styles["padding-bottom"];
		if (padding_bottom) {
			this.SetPaddingBottom(
				padding_bottom.GetDimensionValue(parent_local_width, 0)
			);
		}

		const padding_left = styles["padding-left"];
		if (padding_left) {
			this.SetPaddingLeft(
				padding_left.GetDimensionValue(parent_local_width, 0)
			);
		}

		const margin_top = styles["margin-top"];
		if (margin_top) {
			this.SetMarginTop(margin_top.GetDimensionValue(parent_local_width, 0));
		}

		const margin_right = styles["margin-right"];
		if (margin_right) {
			this.SetMarginRight(
				margin_right.GetDimensionValue(parent_local_width, 0)
			);
		}

		const margin_bottom = styles["margin-bottom"];
		if (margin_bottom) {
			this.SetMarginBottom(
				margin_bottom.GetDimensionValue(parent_local_width, 0)
			);
		}

		const margin_left = styles["margin-left"];
		if (margin_left) {
			this.SetMarginLeft(margin_left.GetDimensionValue(parent_local_width, 0));
		}

		const top = styles["top"];
		if (top) {
			this.SetTop(top.GetDimensionValue(parent_local_width, 0));
		} else {
			this.SetTop(null);
		}

		const right = styles["right"];
		if (right) {
			this.SetRight(right.GetDimensionValue(parent_local_width, 0));
		} else {
			this.SetRight(null);
		}

		const bottom = styles["bottom"];
		if (bottom) {
			this.SetBottom(bottom.GetDimensionValue(parent_local_width, 0));
		} else {
			this.SetBottom(null);
		}

		const left = styles["left"];
		if (left) {
			this.SetLeft(left.GetDimensionValue(parent_local_width, 0));
		} else {
			this.SetLeft(null);
		}

		const width = styles["width"];
		const height = styles["height"];
		const box_sizing = styles["box-sizing"];
		const box_sizing_value = box_sizing
			? box_sizing.GetStringValue("border-box")
			: "border-box";
		let style_width = this.GetStyleWidth();
		let style_height = this.GetStyleHeight();
		style_width = width
			? width.GetDimensionValue(parent_local_width, style_width)
			: style_width;
		style_height = height
			? height.GetDimensionValue(parent_local_height, style_height)
			: style_height;

		if (box_sizing_value === "content-box") {
			if (style_width > 0 && width.IsPixelValue())
				style_width += this.GetPaddingBorderWidth();
			if (style_height > 0 && height.IsPixelValue())
				style_height += this.GetPaddingBorderHeight();
		}

		this.SetStyleWidth(style_width);
		this.SetStyleHeight(style_height);

		// Apply size constraints
		const min_width = styles["min-width"];
		if (min_width) {
			this.SetMinWidth(min_width.GetDimensionValue(parent_local_width, -1));
		}

		const max_width = styles["max-width"];
		if (max_width) {
			this.SetMaxWidth(max_width.GetDimensionValue(parent_local_width, -1));
		}

		const min_height = styles["min-height"];
		if (min_height) {
			this.SetMinHeight(min_height.GetDimensionValue(parent_local_height, -1));
		}

		const max_height = styles["max-height"];
		if (max_height) {
			this.SetMaxHeight(max_height.GetDimensionValue(parent_local_height, -1));
		}

		// Apply aspect-ratio
		const aspect_ratio = styles["aspect-ratio"];
		if (aspect_ratio && aspect_ratio.IsNumberValue()) {
			this.SetAspectRatio(aspect_ratio.GetNumberValue(0));
		}
	}

	// ========== 事件系统 ==========

	/**
	 * 添加事件监听器
	 * @param type 事件类型
	 * @param listener 监听器函数
	 * @param options 监听器选项
	 */
	AddEventListener(
		type: string,
		listener: EventListener,
		options?: EventListenerOptions
	): void {
		const wrapper = new EventListenerWrapper(listener, options);
		const map = wrapper.ShouldCapture()
			? this.m_capture_listeners
			: this.m_event_listeners;

		if (!map.has(type)) {
			this.SafeMapSet(map, type, []);
		}

		// 获取当前数组并创建新数组来避免 Vue Proxy 的只读限制
		const listeners = map.get(type)!;
		const newListeners = [...listeners, wrapper];
		this.SafeMapSet(map, type, newListeners);
	}

	/**
	 * 移除事件监听器
	 * @param type 事件类型
	 * @param listener 监听器函数
	 * @param options 监听器选项
	 */
	RemoveEventListener(
		type: string,
		listener: EventListener,
		options?: EventListenerOptions
	): void {
		const isCapture = options?.capture ?? false;
		const map = isCapture ? this.m_capture_listeners : this.m_event_listeners;
		const listeners = map.get(type);

		if (listeners) {
			const index = listeners.findIndex((w) => w.listener === listener);
			if (index !== -1) {
				// 创建新数组来避免 Vue Proxy 的只读限制
				const newListeners = listeners.filter((_, i) => i !== index);
				if (newListeners.length === 0) {
					this.SafeMapDelete(map, type);
				} else {
					this.SafeMapSet(map, type, newListeners);
				}
			}
		}
	}

	/**
	 * 移除所有事件监听器
	 * @param type 可选，指定事件类型。如果不指定则移除所有类型的监听器
	 */
	RemoveAllEventListeners(type?: string): void {
		if (type) {
			this.SafeMapDelete(this.m_event_listeners, type);
			this.SafeMapDelete(this.m_capture_listeners, type);
		} else {
			// 对于 clear，我们需要一个安全的清空方法
			this.SafeMapClear(this.m_event_listeners);
			this.SafeMapClear(this.m_capture_listeners);
		}
	}

	/**
	 * 检查是否有指定类型的监听器
	 * @param type 事件类型
	 * @returns 是否有监听器
	 */
	HasEventListener(type: string): boolean {
		return (
			this.m_event_listeners.has(type) || this.m_capture_listeners.has(type)
		);
	}

	/**
	 * 派发事件
	 * @param event 事件对象
	 * @returns 是否默认行为被阻止
	 */
	DispatchEvent(event: IEvent): boolean {
		// 设置目标
		if (!event.GetTarget()) {
			event.SetTarget(this);
		}

		// 构建事件路径（从根到目标）
		const path: IElement[] = [];
		let current: IElement | null = this;
		while (current) {
			path.unshift(current);
			current = current.GetParent();
		}

		// 1. 捕获阶段
		event.SetPhase(1); // CAPTURING_PHASE
		for (let i = 0; i < path.length - 1; i++) {
			if (event.IsPropagationStopped()) break;
			const element = path[i];
			event.SetCurrentTarget(element);
			element.TriggerEventListeners(event, true); // 捕获阶段
		}

		// 2. 目标阶段
		if (!event.IsPropagationStopped()) {
			event.SetPhase(2); // AT_TARGET
			event.SetCurrentTarget(this);
			this.TriggerEventListeners(event, true); // 捕获监听器
			if (!event.IsImmediatePropagationStopped()) {
				this.TriggerEventListeners(event, false); // 冒泡监听器
			}
		}

		// 3. 冒泡阶段
		if (event.IsBubbles() && !event.IsPropagationStopped()) {
			event.SetPhase(3); // BUBBLING_PHASE
			for (let i = path.length - 2; i >= 0; i--) {
				if (event.IsPropagationStopped()) break;
				const element = path[i];
				event.SetCurrentTarget(element);
				element.TriggerEventListeners(event, false); // 冒泡阶段
			}
		}

		event.SetPhase(0); // NONE
		event.SetCurrentTarget(null);

		return !event.IsDefaultPrevented();
	}

	/**
	 * 触发事件监听器
	 * @param event 事件对象
	 * @param isCapture 是否是捕获阶段
	 */
	protected TriggerEventListeners(event: IEvent, isCapture: boolean): void {
		const map = isCapture ? this.m_capture_listeners : this.m_event_listeners;
		const listeners = map.get(event.GetType());

		if (!listeners || listeners.length === 0) return;

		// 复制监听器数组，防止在执行过程中被修改
		const listenersCopy = [...listeners];
		const toRemove: EventListenerWrapper[] = [];

		for (const wrapper of listenersCopy) {
			if (event.IsImmediatePropagationStopped()) break;

			try {
				wrapper.listener.call(this, event);

				// 安全地设置 triggered 标志，避免 Vue Proxy 的只读保护
				// 直接使用 __v_raw 访问原始对象，避免触发 Vue 警告
				const rawWrapper = (wrapper as any).__v_raw || wrapper;
				rawWrapper.triggered = true;

				// 如果是 once 选项，标记为待移除
				if (wrapper.ShouldRemoveAfterTrigger()) {
					toRemove.push(wrapper);
				}
			} catch (error) {
				console.error("Error in event listener:", error);
			}
		}

		// 移除 once 监听器
		if (toRemove.length > 0) {
			// 创建新数组来避免 Vue Proxy 的只读限制
			const newListeners = listeners.filter((w) => !toRemove.includes(w));
			if (newListeners.length === 0) {
				this.SafeMapDelete(map, event.GetType());
			} else {
				this.SafeMapSet(map, event.GetType(), newListeners);
			}
		}
	}

	/**
	 * 点击测试 - 检查点是否在元素内
	 * @param x X 坐标
	 * @param y Y 坐标
	 * @returns 是否命中
	 */
	HitTest(x: number, y: number): boolean {
		return (
			x >= this.m_viewport_x &&
			x <= this.m_viewport_x + this.m_viewport_width &&
			y >= this.m_viewport_y &&
			y <= this.m_viewport_y + this.m_viewport_height
		);
	}

	/**
	 * 获取指定坐标处的元素（深度优先搜索）
	 * @param x X 坐标
	 * @param y Y 坐标
	 * @returns 命中的元素，如果没有则返回 null
	 */
	GetElementAtPoint(x: number, y: number): IElement | null {
		if (!this.IsVisible() || !this.HitTest(x, y)) {
			return null;
		}

		// 从后向前遍历子元素（后面的元素在上层）
		const childrens = this.GetChildrens();
		for (let i = childrens.length - 1; i >= 0; i--) {
			const child = childrens[i];
			if (child) {
				const hit = child.GetElementAtPoint(x, y);
				if (hit) {
					return hit;
				}
			}
		}

		// 如果没有子元素命中，返回自身
		return this;
	}
}

export { IElement };

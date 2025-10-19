import { IElement } from "./IElement.ts";
import type { IPainter } from "./IPainter.ts";

/**
 * 按钮元素
 */
class IButton extends IElement {
	protected m_label!: string;

	constructor() {
		super();
		this.SetTagName("Button");
		this.m_label = "";

		// 设置默认样式
		this.SetBackgroundColor("#2196f3");
		this.SetFontColor("white");
		this.SetFontSize(14);
		this.SetLineHeight(20);
		this.SetPaddingLeft(16);
		this.SetPaddingRight(16);
		this.SetPaddingTop(8);
		this.SetPaddingBottom(8);
		this.SetBorderRadius(4);

		// 设置属性访问器
		this.SetAttributeSetterGetter("label", (value: string) => {
			this.SetLabel(value);
		});
	}

	SetLabel(label: string): void {
		if (this.m_label !== label) {
			this.m_label = label;
			this.SetLayoutChanged(true);
			this.Refresh();
		}
	}

	GetLabel(): string {
		return this.m_label;
	}

	OnRenderContent(painter: IPainter): void {
		if (!this.m_label) return;

		const font = `${this.GetFontSize()}px ${this.GetFontFamily()}`;
		const measure = painter.MeasureText(this.m_label, font);
		if (!measure) return;

		const contentX = this.GetContentX();
		const contentY = this.GetContentY();
		const contentWidth = this.GetMaxContentWidth();
		const contentHeight = this.GetMaxContentHeight();

		// 居中文本
		// IPainter.FillText already adds fontBoundingBoxAscent to y
		const textX = contentX + (contentWidth - measure.width) / 2;
		const textY =
			contentY +
			(contentHeight - measure.fontBoundingBoxAscent - measure.fontBoundingBoxDescent) / 2;

		painter.FillText(this.m_label, textX, textY, font, this.GetFontColor());
	}
}

/**
 * 容器元素
 */
class IContainer extends IElement {
	constructor() {
		super();
		this.SetTagName("Container");
		this.SetBackgroundColor("transparent");
	}
}

/**
 * 面板元素（带背景色的容器）
 */
class IPanel extends IElement {
	constructor() {
		super();
		this.SetTagName("Panel");
		this.SetBackgroundColor("#f5f5f5");
		this.SetPaddingLeft(16);
		this.SetPaddingRight(16);
		this.SetPaddingTop(16);
		this.SetPaddingBottom(16);
	}
}

/**
 * 文本标签元素
 */
class ILabel extends IElement {
	protected m_label_text!: string;

	constructor() {
		super();
		this.SetTagName("Label");
		this.m_label_text = "";
		this.SetFontSize(14);
		this.SetLineHeight(20);
		this.SetFontColor("#333");

		// 设置默认高度，确保 label 可以渲染
		this.SetPaddingTop(2);
		this.SetPaddingBottom(2);

		this.SetAttributeSetterGetter(
			"text",
			(value: string) => {
				this.SetLabelText(value);
			},
			() => {
				return this.m_label_text;
			}
		);
	}

	SetLabelText(text: string): void {
		if (this.m_label_text !== text) {
			console.log('[ILabel SetLabelText]', text);
			this.m_label_text = text;
			this.SetLayoutChanged(true);
			this.Refresh();
		}
	}

	GetLabelText(): string {
		return this.m_label_text;
	}

	OnRenderContent(painter: IPainter): void {
		console.log('[ILabel OnRenderContent called]', {
			text: this.m_label_text,
			viewportWidth: this.GetViewPortWidth(),
			viewportHeight: this.GetViewPortHeight(),
			visible: this.IsVisible()
		});

		if (!this.m_label_text) return;

		const font = `${this.GetFontSize()}px ${this.GetFontFamily()}`;
		const contentX = this.GetContentX();
		const contentY = this.GetContentY();
		const measure = painter.MeasureText(this.m_label_text, font);

		if (!measure) {
			console.warn('[ILabel] MeasureText returned null for:', this.m_label_text);
			return;
		}

		// IPainter.FillText already adds fontBoundingBoxAscent to y,
		// so we need to calculate the baseline position without ascent
		const textY =
			contentY +
			(this.GetMaxContentHeight() -
				measure.fontBoundingBoxAscent -
				measure.fontBoundingBoxDescent) /
				2;

		console.log('[ILabel Rendering]', {
			text: this.m_label_text,
			font,
			contentX,
			contentY,
			textY,
			maxContentHeight: this.GetMaxContentHeight(),
			color: this.GetFontColor()
		});

		painter.FillText(
			this.m_label_text,
			contentX,
			textY,
			font,
			this.GetFontColor()
		);
	}
}

/**
 * 输入框元素
 */
class IInput extends IElement {
	protected m_input_text!: string;
	protected m_placeholder!: string;
	protected m_is_focused!: boolean;
	protected m_cursor_position!: number;
	protected m_cursor_visible!: boolean;
	protected m_cursor_blink_interval!: any;

	constructor() {
		super();
		this.SetTagName("Input");
		this.m_input_text = "";
		this.m_placeholder = "";
		this.m_is_focused = false;
		this.m_cursor_position = 0;
		this.m_cursor_visible = true;
		this.m_cursor_blink_interval = null;

		this.SetFontSize(14);
		this.SetLineHeight(20);
		this.SetFontColor("#333");
		this.SetBackgroundColor("white");
		this.SetBorderLeftWidth(1);
		this.SetBorderTopWidth(1);
		this.SetBorderRightWidth(1);
		this.SetBorderBottomWidth(1);
		this.SetBorderLeftColor("#ddd");
		this.SetBorderTopColor("#ddd");
		this.SetBorderRightColor("#ddd");
		this.SetBorderBottomColor("#ddd");
		this.SetPaddingLeft(8);
		this.SetPaddingRight(8);
		this.SetPaddingTop(6);
		this.SetPaddingBottom(6);

		this.SetAttributeSetterGetter(
			"value",
			(value: string) => {
				this.SetInputText(value);
			},
			() => {
				return this.m_input_text;
			}
		);

		this.SetAttributeSetterGetter(
			"placeholder",
			(value: string) => {
				this.SetPlaceholder(value);
			},
			() => {
				return this.m_placeholder;
			}
		);

		// 监听点击事件获得焦点
		this.AddEventListener("click", () => {
			this.Focus();
		});

		// 监听键盘事件
		this.AddEventListener("keydown", (e: any) => {
			if (!this.m_is_focused) return;

			const key = e.GetKey();
			const code = e.GetCode();

			console.log('[IInput KeyDown]', {
				key,
				code,
				focused: this.m_is_focused,
				currentText: this.m_input_text,
				cursorPos: this.m_cursor_position
			});

			// 阻止默认行为
			e.PreventDefault();

			if (key === "Backspace") {
				// 删除字符
				if (this.m_cursor_position > 0) {
					this.m_input_text =
						this.m_input_text.slice(0, this.m_cursor_position - 1) +
						this.m_input_text.slice(this.m_cursor_position);
					this.m_cursor_position--;
					console.log('[IInput] After Backspace:', this.m_input_text);
					this.Refresh();
				}
			} else if (key === "Delete") {
				// 删除后面的字符
				if (this.m_cursor_position < this.m_input_text.length) {
					this.m_input_text =
						this.m_input_text.slice(0, this.m_cursor_position) +
						this.m_input_text.slice(this.m_cursor_position + 1);
					console.log('[IInput] After Delete:', this.m_input_text);
					this.Refresh();
				}
			} else if (key === "ArrowLeft") {
				// 光标左移
				if (this.m_cursor_position > 0) {
					this.m_cursor_position--;
					this.Refresh();
				}
			} else if (key === "ArrowRight") {
				// 光标右移
				if (this.m_cursor_position < this.m_input_text.length) {
					this.m_cursor_position++;
					this.Refresh();
				}
			} else if (key === "Home") {
				// 光标移到开头
				this.m_cursor_position = 0;
				this.Refresh();
			} else if (key === "End") {
				// 光标移到末尾
				this.m_cursor_position = this.m_input_text.length;
				this.Refresh();
			} else if (key === "Enter") {
				// 触发提交事件
				this.Blur();
			} else if (key === "Escape") {
				// 失去焦点
				this.Blur();
			} else if (key.length === 1 && !e.IsCtrlKey() && !e.IsAltKey() && !e.IsMetaKey()) {
				// 输入字符
				this.m_input_text =
					this.m_input_text.slice(0, this.m_cursor_position) +
					key +
					this.m_input_text.slice(this.m_cursor_position);
				this.m_cursor_position++;
				console.log('[IInput] After input:', this.m_input_text, 'cursor:', this.m_cursor_position);
				this.Refresh();
			}
		});
	}

	SetInputText(text: string): void {
		if (this.m_input_text !== text) {
			this.m_input_text = text;
			this.m_cursor_position = text.length;
			this.Refresh();
		}
	}

	GetInputText(): string {
		return this.m_input_text;
	}

	SetPlaceholder(text: string): void {
		if (this.m_placeholder !== text) {
			this.m_placeholder = text;
			this.Refresh();
		}
	}

	GetPlaceholder(): string {
		return this.m_placeholder;
	}

	Focus(): void {
		if (this.m_is_focused) return;

		this.m_is_focused = true;
		this.m_cursor_visible = true;

		// 通知 root 设置焦点
		const root = this.GetRoot();
		if (root && typeof (root as any).SetFocusedElement === 'function') {
			(root as any).SetFocusedElement(this);
		}

		// 设置高亮边框
		this.SetBorderLeftColor("#4CAF50");
		this.SetBorderTopColor("#4CAF50");
		this.SetBorderRightColor("#4CAF50");
		this.SetBorderBottomColor("#4CAF50");

		// 开始光标闪烁
		this.StartCursorBlink();

		this.Refresh();
	}

	Blur(): void {
		if (!this.m_is_focused) return;

		this.m_is_focused = false;

		// 通知 root 清除焦点
		const root = this.GetRoot();
		if (root && typeof (root as any).GetFocusedElement === 'function') {
			if ((root as any).GetFocusedElement() === this) {
				(root as any).SetFocusedElement(null);
			}
		}

		// 恢复边框颜色
		this.SetBorderLeftColor("#ddd");
		this.SetBorderTopColor("#ddd");
		this.SetBorderRightColor("#ddd");
		this.SetBorderBottomColor("#ddd");

		// 停止光标闪烁
		this.StopCursorBlink();

		this.Refresh();
	}

	private StartCursorBlink(): void {
		this.StopCursorBlink();
		this.m_cursor_blink_interval = setInterval(() => {
			this.m_cursor_visible = !this.m_cursor_visible;
			this.Refresh();
		}, 500);
	}

	private StopCursorBlink(): void {
		if (this.m_cursor_blink_interval) {
			clearInterval(this.m_cursor_blink_interval);
			this.m_cursor_blink_interval = null;
		}
		this.m_cursor_visible = true;
	}

	OnRenderContent(painter: IPainter): void {
		const font = `${this.GetFontSize()}px ${this.GetFontFamily()}`;
		const contentX = this.GetContentX();
		const contentY = this.GetContentY();
		const maxContentHeight = this.GetMaxContentHeight();

		// 显示文本或占位符
		const displayText = this.m_input_text || this.m_placeholder;
		const textColor = this.m_input_text ? this.GetFontColor() : "#999";

		if (displayText) {
			const measure = painter.MeasureText(displayText, font);
			if (measure) {
				// IPainter.FillText already adds fontBoundingBoxAscent to y,
				// so we need to calculate the baseline position without ascent
				const textY =
					contentY +
					(maxContentHeight -
						measure.fontBoundingBoxAscent -
						measure.fontBoundingBoxDescent) /
						2;

				console.log('[IInput OnRenderContent]', {
					displayText,
					font,
					contentX,
					contentY,
					textY,
					maxContentHeight,
					textColor
				});

				painter.FillText(displayText, contentX, textY, font, textColor);
			} else {
				console.warn('[IInput] MeasureText returned null for:', displayText);
			}
		}

		// 绘制光标
		if (this.m_is_focused && this.m_cursor_visible) {
			const beforeCursor = this.m_input_text.slice(0, this.m_cursor_position);
			const beforeMeasure = painter.MeasureText(beforeCursor, font);
			const cursorX = contentX + (beforeMeasure?.width || 0);
			const cursorHeight = maxContentHeight;

			painter.FillRectangle(
				cursorX,
				contentY,
				2,
				cursorHeight,
				this.GetFontColor()
			);
		}
	}
}

/**
 * 复选框元素
 */
class ICheckbox extends IElement {
	protected m_checked!: boolean;

	constructor() {
		super();
		this.SetTagName("Checkbox");
		this.m_checked = false;

		this.SetBackgroundColor("white");
		this.SetBorderLeftWidth(2);
		this.SetBorderTopWidth(2);
		this.SetBorderRightWidth(2);
		this.SetBorderBottomWidth(2);
		this.SetBorderLeftColor("#ddd");
		this.SetBorderTopColor("#ddd");
		this.SetBorderRightColor("#ddd");
		this.SetBorderBottomColor("#ddd");
		this.SetBorderRadius(3);

		this.SetAttributeSetterGetter(
			"checked",
			(value: boolean) => {
				this.SetChecked(value);
			},
			() => {
				return this.m_checked;
			}
		);
	}

	SetChecked(checked: boolean): void {
		if (this.m_checked !== checked) {
			this.m_checked = checked;
			this.Refresh();
		}
	}

	GetChecked(): boolean {
		return this.m_checked;
	}

	OnRenderContent(painter: IPainter): void {
		if (!this.m_checked) return;

		const contentX = this.GetContentX();
		const contentY = this.GetContentY();
		const contentWidth = this.GetMaxContentWidth();
		const contentHeight = this.GetMaxContentHeight();

		// 绘制勾选标记
		const checkColor = "#4CAF50";
		const centerX = contentX + contentWidth / 2;
		const centerY = contentY + contentHeight / 2;

		// 简单的勾选标记（使用文本）
		const font = `${Math.min(contentWidth, contentHeight) * 0.8}px Arial`;
		const measure = painter.MeasureText("✓", font);
		if (measure) {
			const textX = centerX - measure.width / 2;
			const textY = centerY + measure.fontBoundingBoxAscent / 2;
			painter.FillText("✓", textX, textY, font, checkColor);
		}
	}
}

export { IButton, IContainer, IPanel, ILabel, IInput, ICheckbox };

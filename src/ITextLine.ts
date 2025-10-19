import { IElement } from "./IElement.ts";
import type { IWindow } from "./IWindow.ts";

class ITextLine extends IElement {
    protected m_layout_width!: number;

    constructor(window: IWindow) {
        super();
        this.SetWindow(window);
        this.SetTagName("TextLine");
        this.SetFontSize(16);
        this.SetFontFamily("Arial");
        this.SetLineHeight(20);
        this.m_layout_width = 0;
    }

    SetText(text: string): void {
        this.m_text = text;
        const window = this.GetWindow();
        if (window) {
            const window_painter = window.GetWindowPainter();
            const font = `${this.GetFontSize()}px ${this.GetFontFamily()}`;
            const text_metrics = window_painter.MeasureText(text, font);
            this.m_layout_width = text_metrics.width;
            this.SetLocalContentWidth(this.m_layout_width);
            this.SetLocalContentHeight(this.GetLineHeight());
        }
    }

    GetLayoutWidth(): number {
        return this.m_layout_width;
    }

    GetLayoutHeight(): number {
        return this.GetLineHeight();
    }
}

export { ITextLine };
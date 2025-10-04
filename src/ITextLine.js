import { IElement } from "./IElement.js";

class ITextLine extends IElement {
    constructor(window) {
        super(window);
        this.SetTagName("TextLine");
        this.SetFontSize(16);
        this.SetFontFamily("Arial");
        this.SetLineHeight(20);
    }

    SetText(text) {
        this.m_text = text;
        const window_painter = this.GetWindow().GetWindowPainter();
        window_painter.SetFont(this.GetFontSize(), this.GetFontFamily());
        const text_metrics = window_painter.MeasureText(text);
        this.m_layout_width = text_metrics.width;
        this.SetLocalContentWidth(this.m_layout_width);
        this.SetLocalContentHeight(this.GetLineHeight());
    }

    GetLayoutWidth() { 
        const window_painter = this.GetWindow().GetWindowPainter();
        return this.m_layout_width; 
    }
    
    GetLayoutHeight() { 
        return this.GetLineHeight(); 
    }
}

export { ITextLine };
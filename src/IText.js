import { IElement } from "./IElement.js";

class IText extends IElement {
    constructor(window) {
        super(window);
        this.SetTagName("Text");
        this.SetFontSize(16);
        this.SetFontFamily("Arial");
        this.SetLineHeight(20);
    }

    SetText(text) {
        this.m_text = text;
        this.SetLayoutChanged(true);
    }

    UpdateLayout() {
        this.ApplyLayoutStyle();
        this.SetLayoutChanged(false);
        this.SetPositionChanged(true);
        this.SetLocalContentWidth(0);
        this.SetLocalContentHeight(0);
    }
}

export { IText };
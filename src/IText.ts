import { IElement } from "./IElement.ts";
import type { IWindow } from "./IWindow.ts";

class IText extends IElement {
    constructor(window: IWindow) {
        super();
        this.SetWindow(window);
        this.SetTagName("Text");
        this.SetFontSize(16);
        this.SetFontFamily("Arial");
        this.SetLineHeight(20);
    }

    SetText(text: string): void {
        this.m_text = text;
        this.SetLayoutChanged(true);
    }

    UpdateLayout(): void {
        this.ApplyLayoutStyle();
        this.SetLayoutChanged(false);
        this.SetPositionChanged(true);
        this.SetLocalContentWidth(0);
        this.SetLocalContentHeight(0);
    }
}

export { IText };
import { IElement } from "./IElement.js";

class IText extends IElement {
    constructor(window) {
        super(window);
        this.SetTagName("Text");
        this.SetFontSize(16);
        this.SetFontFamily("Arial");
        this.SetLineHeight(20);
    }
}

export { IText };
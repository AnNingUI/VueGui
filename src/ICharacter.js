import { IElement } from "./IElement.js";
import IconFontJson from "./font/iconfont.json";

const glyphs = IconFontJson.glyphs;
const icon_names = new Map();
for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    icon_names.set(IconFontJson.css_prefix_text + glyph.name, glyph.unicode_decimal);
}

class ICharacter extends IElement {
    constructor(window) {
        super();
        this.m_character = 0;  // 字符Unicode值
        this.m_character_width = 0;
        this.m_character_height = 0;
        this.SetTagName("ICharacter");
        this.SetFontSize(16);
        this.SetLineHeight(24);
        this.SetFontFamily("Arial");
        this.SetFontColor("black");

        this.SetAttributeSetterGetter("character", (value) => { this.SetCharacter(value); });
    }

    SetCharacter(character) {
        if (character instanceof String || typeof character === "string") {
            character = character.codePointAt(0);
        }
        if (!(character instanceof Number) && typeof character !== "number") {
            return;
        }
        if (this.m_character === character) {
            return;
        }
        this.m_character = character;
        this.SetLayoutChanged(true);
        this.Refresh();
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
    // font: font-style font-variant font-weight font-size/line-height font-family
    GetFont() {
        return this.GetFontSize() + "px/" + this.GetLineHeight() + "px " + this.GetFontFamily();
    }

    GetLayoutWidth() {
        const local_width = this.GetLocalWidth();
        if (local_width > 0) return local_width;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_width = this.GetStyleWidth();
        if (style_width >= 0) return style_width;
        // 获取测量宽
        return this.m_character_width;
    }

    GetLayoutHeight() {
        const local_height = this.GetLocalHeight();
        if (local_height > 0) return local_height;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_height = this.GetStyleHeight();
        if (style_height >= 0) return style_height;
        // 获取行高
        const line_height = this.GetLineHeight();
        return line_height < 0 ? 0 : line_height;
    }

    UpdateLayout() {
        // 测量字符宽高
        const measure = this.GetWindow().GetWindowPainter().MeasureText(String.fromCodePoint(this.m_character), this.GetFont());
        this.m_character_width = measure ? measure.width : 0;
        this.m_character_height = measure ? (measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent) : 0;
        // 直接设置宽高
        this.SetLocalWidth(this.GetLayoutWidth());
        this.SetLocalHeight(this.GetLayoutHeight());
        // 调用基类更新布局
        super.UpdateLayout();
    }

    OnRenderContent(painter) {
        const character = String.fromCodePoint(this.m_character);
        const x = this.GetContentX();
        const y = this.GetContentY() + (this.GetMaxContentHeight() - this.m_character_height) / 2;
        painter.FillText(character, x, y, this.GetFont(), this.GetFontColor());
    }
}

class Character extends ICharacter {
    constructor() {
        super();
        this.SetTagName("Character");
    }
}

class Icon extends ICharacter {
    constructor() {
        super();
        this.SetTagName("Icon");
        this.SetFontFamily("iconfont");
        this.SetAttributeSetterGetter("value", (value) => { this.SetCharacter(icon_names.get(value)); });
    }
}

export { ICharacter, Character, Icon };
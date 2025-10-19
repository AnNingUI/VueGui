import { IElement } from "./IElement.ts";
import type { IWindow } from "./IWindow.ts";
import type { IPainter } from "./IPainter.ts";
import IconFontJson from "./font/iconfont.json";

interface Glyph {
    name: string;
    unicode_decimal: number;
}

interface IconFont {
    css_prefix_text: string;
    glyphs: Glyph[];
}

const glyphs = (IconFontJson as IconFont).glyphs;
const icon_names = new Map<string, number>();
for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    if (glyph) {
        icon_names.set((IconFontJson as IconFont).css_prefix_text + glyph.name, glyph.unicode_decimal);
    }
}

class ICharacter extends IElement {
    protected m_character!: number;
    protected m_character_width!: number;
    protected m_character_height!: number;

    constructor(window?: IWindow) {
        super();
        if (window) {
            this.SetWindow(window);
        }
        this.m_character = 0;  // 字符Unicode值
        this.m_character_width = 0;
        this.m_character_height = 0;
        this.SetTagName("ICharacter");
        this.SetFontSize(16);
        this.SetLineHeight(24);
        this.SetFontFamily("Arial");
        this.SetFontColor("black");

        this.SetAttributeSetterGetter("character", (value: string | number) => { this.SetCharacter(value); });
    }

    SetCharacter(character: string | number | undefined): void {
        let char_code: number | undefined;

        if (typeof character === "string") {
            char_code = character.codePointAt(0);
        } else if (typeof character === "number") {
            char_code = character;
        }

        if (char_code === undefined) {
            return;
        }

        if (this.m_character === char_code) {
            return;
        }

        this.m_character = char_code;
        this.SetLayoutChanged(true);
        this.Refresh();
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
    // font: font-style font-variant font-weight font-size/line-height font-family
    GetFont(): string {
        return this.GetFontSize() + "px/" + this.GetLineHeight() + "px " + this.GetFontFamily();
    }

    GetLayoutWidth(): number {
        const local_width = this.GetLocalWidth();
        if (local_width > 0) return local_width;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_width = this.GetStyleWidth();
        if (style_width >= 0) return style_width;
        // 获取测量宽
        return this.m_character_width;
    }

    GetLayoutHeight(): number {
        const local_height = this.GetLocalHeight();
        if (local_height > 0) return local_height;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_height = this.GetStyleHeight();
        if (style_height >= 0) return style_height;
        // 获取行高
        const line_height = this.GetLineHeight();
        return line_height < 0 ? 0 : line_height;
    }

    UpdateLayout(): void {
        // 测量字符宽高
        const window = this.GetWindow();
        if (window) {
            const measure = window.GetWindowPainter().MeasureText(String.fromCodePoint(this.m_character), this.GetFont());
            this.m_character_width = measure ? measure.width : 0;
            this.m_character_height = measure ? (measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent) : 0;
        }
        // 直接设置宽高
        this.SetLocalWidth(this.GetLayoutWidth());
        this.SetLocalHeight(this.GetLayoutHeight());
        // 调用基类更新布局
        super.UpdateLayout();
    }

    OnRenderContent(painter: IPainter): void {
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
        this.SetAttributeSetterGetter("value", (value: string) => {
            const unicode = icon_names.get(value);
            if (unicode !== undefined) {
                this.SetCharacter(unicode);
            }
        });
    }
}

export { ICharacter, Character, Icon };
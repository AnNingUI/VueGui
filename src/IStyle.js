export const IStyleTypeNone = Symbol("none");
export const IStyleTypeInteger = Symbol("integer");
export const IStyleTypeNumber = Symbol("number");
export const IStyleTypeString = Symbol("string");
export const IStyleTypeColor = Symbol("color");
export const IStyleTypePercentage = Symbol("percentage");
export const IStyleTypePixel = Symbol("pixel");

export class IStyleItem {
    constructor(style_key, style_value, important) {
        this.m_style_key = style_key;
        this.m_important = important;
        this.m_priority = 0;

        if (style_key === "background-color" ||
            style_key === "color" ||
            style_key === "border-top-color" ||
            style_key === "border-right-color" ||
            style_key === "border-bottom-color" ||
            style_key === "border-left-color" ||
            style_key === "outline-color") {
            this.m_value_type = IStyleTypeColor;
            this.m_style_value = style_value;
        } else if (style_key === "z-index" ||
            style_key === "order" ||
            style_key === "flex-grow" ||
            style_key === "flex-shrink") {
            this.m_value_type = IStyleTypeInteger;
            this.m_style_value = parseInt(style_value);
        } else if (style_key === "width" ||
            style_key === "height" ||
            style_key === "max-width" ||
            style_key === "max-height" ||
            style_key === "min-width" ||
            style_key === "min-height" ||
            style_key === "top" ||
            style_key === "bottom" ||
            style_key === "left" ||
            style_key === "right" ||
            style_key === "margin-top" ||
            style_key === "margin-right" ||
            style_key === "margin-bottom" ||
            style_key === "margin-left" ||
            style_key === "padding-top" ||
            style_key === "padding-right" ||
            style_key === "padding-bottom" ||
            style_key === "padding-left" ||
            style_key === "border-top-width" ||
            style_key === "border-right-width" ||
            style_key === "border-bottom-width" ||
            style_key === "border-left-width" ||
            style_key === "border-radius" ||
            style_key === "border-top-left-radius" ||
            style_key === "border-top-right-radius" ||
            style_key === "border-bottom-left-radius" ||
            style_key === "border-bottom-right-radius" ||
            style_key === "font-size" ||
            style_key === "line-height" ||
            style_key === "row-gap" ||
            style_key === "column-gap") {
            if (style_value.endsWith("px")) {
                this.m_value_type = IStyleTypePixel;
                this.m_style_value = parseFloat(style_value.substring(0, style_value.length - 2));
            } else if (style_value.endsWith("%")) {
                this.m_value_type = IStyleTypePercentage;
                this.m_style_value = parseFloat(style_value.substring(0, style_value.length - 1));
            } else if (style_value.charCodeAt(0) >= 48 && style_value.charCodeAt(0) <= 57) {
                if (style_value.indxexOf(".") >= 0) {
                    this.m_value_type = IStyleTypeNumber;
                    this.m_style_value = parseFloat(style_value);
                } else {
                    this.m_value_type = IStyleTypeInteger;
                    this.m_style_value = parseInt(style_value);
                }
            } else {
                this.m_value_type = IStyleTypeString;
                this.m_style_value = style_value;
            }
        } else {
            if (style_value instanceof String || typeof style_value === "string") {
                this.m_value_type = IStyleTypeString;
            } else if (style_value instanceof Number || typeof style_value === "number") {
                this.m_value_type = IStyleTypeNumber;
            } else {
                this.m_value_type = IStyleTypeNone;
            }
            this.m_style_value = style_value;
        }
    }

    IsPixelValue() { return this.m_value_type === IStyleTypePixel; }
    IsColorValue() { return this.m_value_type === IStyleTypeColor; }
    IsStringValue() { return this.m_value_type === IStyleTypeString; }
    IsIntegerValue() { return this.m_value_type === IStyleTypeInteger; }
    IsNumberValue() { return this.m_value_type === IStyleTypeNumber || this.m_value_type === IStyleTypeInteger; }
    IsPercentageValue() { return this.m_value_type === IStyleTypePercentage; }
    IsNoneValue() { return this.m_value_type === IStyleTypeNone; }
    GetPixelValue(default_value) { return this.m_value_type === IStyleTypePixel ? this.m_style_value : default_value; }
    GetColorValue(default_value) { return this.m_value_type === IStyleTypeColor ? this.m_style_value : default_value; }
    GetStringValue(default_value) { return this.m_value_type === IStyleTypeString ? this.m_style_value : default_value; }
    GetIntegerValue(default_value) { return this.m_value_type === IStyleTypeInteger ? this.m_style_value : default_value; }
    GetNumberValue(default_value) { return (this.m_value_type === IStyleTypeNumber || this.m_value_type == IStyleTypeInteger) ? this.m_style_value : default_value; }

    GetDimensionValue(base_value, default_value) {
        if (this.m_value_type === IStyleTypePixel) {
            return this.m_style_value;
        } else if (this.m_value_type === IStyleTypePercentage) {
            return base_value * this.m_style_value / 100;
        } else if (this.m_value_type === IStyleTypeInteger) {
            return this.m_style_value;
        } else if (this.m_value_type === IStyleTypeNumber) {
            return this.m_style_value;
        } else {
            return default_value;
        }
    }
};

export class ISelectorStyle {
    constructor() {
        this.m_styles = {};
        this.m_selector_selectors = {}; // 交集选择器 .class.class
        this.m_attribute_selectors = {}; // 属性选择器 .class[attr=value]
        this.m_pseudo_class_selectors = {}; // 伪类选择器 .class:hover
        this.m_descendant_selectors = {}; // 后代选择器 .class div
        this.m_children_selectors = {}; // 子代选择器 .class > div
        this.m_adjacent_sibling_selectors = {}; // 邻近节点选择器 .class+.class
        this.m_general_sibling_selectors = {};  // 一般后续节点选择器 .class~.class
    }

    GetStyle() { return this.m_styles; }

    SetStyleText(style_text) {
        for (const item of style_text.split(";")) {
            let [style_key, style_value] = item.split(":");
            style_key = style_key.trim();
            style_value = style_value && style_value.trim();
            if (style_key && style_value) {
                this.SetStyleItem(style_key, style_value);
            }
        }
    }
    SetStyleItem(style_key, style_value) {
        const values = style_value.split(" ");
        const important = values[values.length - 1] === "!important";
        if (important) values.pop();
        if (values.length === 0) return;
        if (style_key === "margin" || style_key === "padding" || style_key === "border-width" || style_key === "border-color" || style_key === "border-style") {
            if (values.length === 1) {
                values.push(values[0]);
            }
            if (values.length === 2) {
                values.push(values[0]);
                values.push(values[1]);
            }
            if (values.length === 3) {
                values.push(values[1]);
            }
            if (style_key === "margin") {
                this.m_styles["margin-top"] = new IStyleItem("margin-top", values[0], important);
                this.m_styles["margin-right"] = new IStyleItem("margin-right", values[1], important);
                this.m_styles["margin-bottom"] = new IStyleItem("margin-bottom", values[2], important);
                this.m_styles["margin-left"] = new IStyleItem("margin-left", values[3], important);
            } else if (style_key === "padding") {
                this.m_styles["padding-top"] = new IStyleItem("padding-top", values[0], important);
                this.m_styles["padding-right"] = new IStyleItem("padding-right", values[1], important);
                this.m_styles["padding-bottom"] = new IStyleItem("padding-bottom", values[2], important);
                this.m_styles["padding-left"] = new IStyleItem("padding-left", values[3], important);
            } else if (style_key === "border-width") {
                this.m_styles["border-top-width"] = new IStyleItem("border-top-width", values[0], important);
                this.m_styles["border-right-width"] = new IStyleItem("border-right-width", values[1], important);
                this.m_styles["border-bottom-width"] = new IStyleItem("border-bottom-width", values[2], important);
                this.m_styles["border-left-width"] = new IStyleItem("border-left-width", values[3], important);
            } else if (style_key === "border-color") {
                this.m_styles["border-top-color"] = new IStyleItem("border-top-color", values[0], important);
                this.m_styles["border-right-color"] = new IStyleItem("border-right-color", values[1], important);
                this.m_styles["border-bottom-color"] = new IStyleItem("border-bottom-color", values[2], important);
                this.m_styles["border-left-color"] = new IStyleItem("border-left-color", values[3], important);
            } else if (style_key === "border-style") {
                this.m_styles["border-top-style"] = new IStyleItem("border-top-style", values[0], important);
                this.m_styles["border-right-style"] = new IStyleItem("border-right-style", values[1], important);
                this.m_styles["border-bottom-style"] = new IStyleItem("border-bottom-style", values[2], important);
                this.m_styles["border-left-style"] = new IStyleItem("border-left-style", values[3], important);
            }
        } else if (style_key === "border" || style_key === "border-left" || style_key === "border-right" || style_key === "border-top" || style_key === "border-bottom") {
            const border_width = values.length > 0 ? values[0] : "0px";
            const border_style = values.length > 1 ? values[1] : "solid";
            const border_color = values.length > 2 ? values[2] : "black";
            if (style_key === "border") {
                this.m_styles["border-top-width"] = new IStyleItem("border-top-width", border_width, important);
                this.m_styles["border-right-width"] = new IStyleItem("border-right-width", border_width, important);
                this.m_styles["border-bottom-width"] = new IStyleItem("border-bottom-width", border_width, important);
                this.m_styles["border-left-width"] = new IStyleItem("border-left-width", border_width, important);
                this.m_styles["border-top-style"] = new IStyleItem("border-top-style", border_style, important);
                this.m_styles["border-right-style"] = new IStyleItem("border-right-style", border_style, important);
                this.m_styles["border-bottom-style"] = new IStyleItem("border-bottom-style", border_style, important);
                this.m_styles["border-left-style"] = new IStyleItem("border-left-style", border_style, important);
                this.m_styles["border-top-color"] = new IStyleItem("border-top-color", border_color, important);
                this.m_styles["border-right-color"] = new IStyleItem("border-right-color", border_color, important);
                this.m_styles["border-bottom-color"] = new IStyleItem("border-bottom-color", border_color, important);
                this.m_styles["border-left-color"] = new IStyleItem("border-left-color", border_color, important);
            } else if (style_key === "border-left") {
                this.m_styles["border-left-width"] = new IStyleItem("border-left-width", border_width, important);
                this.m_styles["border-left-style"] = new IStyleItem("border-left-style", border_style, important);
                this.m_styles["border-left-color"] = new IStyleItem("border-left-color", border_color, important);
            } else if (style_key === "border-right") {
                this.m_styles["border-right-width"] = new IStyleItem("border-right-width", border_width, important);
                this.m_styles["border-right-style"] = new IStyleItem("border-right-style", border_style, important);
                this.m_styles["border-right-color"] = new IStyleItem("border-right-color", border_color, important);
            } else if (style_key === "border-top") {
                this.m_styles["border-top-width"] = new IStyleItem("border-top-width", border_width, important);
                this.m_styles["border-top-style"] = new IStyleItem("border-top-style", border_style, important);
                this.m_styles["border-top-color"] = new IStyleItem("border-top-color", border_color, important);
            } else if (style_key === "border-bottom") {
                this.m_styles["border-bottom-width"] = new IStyleItem("border-bottom-width", border_width, important);
                this.m_styles["border-bottom-style"] = new IStyleItem("border-bottom-style", border_style, important);
                this.m_styles["border-bottom-color"] = new IStyleItem("border-bottom-color", border_color, important);
            }
        } else if (style_key === "gap") {
            this.m_styles["row-gap"] = new IStyleItem("row-gap", values[0], important);
            this.m_styles["column-gap"] = new IStyleItem("column-gap", values.length > 1 ? values[1] : values[0], important);
        } else if (style_key === "overflow") {
            this.m_styles["overflow-x"] = new IStyleItem("overflow-x", values.length > 0 ? values[0] : "auto", important);
            this.m_styles["overflow-y"] = new IStyleItem("overflow-y", values.length > 1 ? values[1] : "auto", important);
        } else if (style_key === "flex") {
            this.m_styles["flex-grow"] = new IStyleItem("flex-grow", values.length > 0 ? values[0] : "0", important);
            this.m_styles["flex-shrink"] = new IStyleItem("flex-shrink", values.length > 1 ? values[1] : "1", important);
            this.m_styles["flex-basis"] = new IStyleItem("flex-basis", values.length > 2 ? values[2] : "auto", important);
        } else {
            this.m_styles[style_key] = new IStyleItem(style_key, values[0], important);
        }
    }
};

// 内联选择器样式
export class IInlineSelectorStyle extends ISelectorStyle {
    constructor(style_text) {
        super();
        if (style_text instanceof String || typeof style_text === "string") {
            this.SetStyleText(style_text);
        } else if (style_text instanceof Object || typeof style_text === "object") {
            for (let key in style_text) {
                this.SetStyleItem(key, style_text[key]);
            }
        }
    }
};

// export const IStyleKeyMargin = Symbol("margin");
// export const IStyleKeyMarginTop = Symbol("margin-top");
// export const IStyleKeyMarginRight = Symbol("margin-right");
// export const IStyleKeyMarginBottom = Symbol("margin-bottom");
// export const IStyleKeyMarginLeft = Symbol("margin-left");
// export const IStyleKeyPadding = Symbol("padding");
// export const IStyleKeyPaddingTop = Symbol("padding-top");
// export const IStyleKeyPaddingRight = Symbol("padding-right");
// export const IStyleKeyPaddingBottom = Symbol("padding-bottom");
// export const IStyleKeyPaddingLeft = Symbol("padding-left");
// export const IStyleKeyBorder = Symbol("border");
// export const IStyleKeyBorderTop = Symbol("border-top");
// export const IStyleKeyBorderRight = Symbol("border-right");
// export const IStyleKeyBorderBottom = Symbol("border-bottom");
// export const IStyleKeyBorderLeft = Symbol("border-left");
// export const IStyleKeyBorderTopWidth = Symbol("border-top-width");
// export const IStyleKeyBorderRightWidth = Symbol("border-right-width");
// export const IStyleKeyBorderBottomWidth = Symbol("border-bottom-width");
// export const IStyleKeyBorderLeftWidth = Symbol("border-left-width");
// export const IStyleKeyBorderTopColor = Symbol("border-top-color");
// export const IStyleKeyBorderRightColor = Symbol("border-right-color");
// export const IStyleKeyBorderBottomColor = Symbol("border-bottom-color");
// export const IStyleKeyBorderLeftColor = Symbol("border-left-color");
// export const IStyleKeyBorderStyle = Symbol("border-style");
// export const IStyleKeyBorderTopStyle = Symbol("border-top-style");
// export const IStyleKeyBorderRightStyle = Symbol("border-right-style");
// export const IStyleKeyBorderBottomStyle = Symbol("border-bottom-style");
// export const IStyleKeyBorderLeftStyle = Symbol("border-left-style");



import { IElement } from "./IElement.js";

class IButton extends IElement {
    constructor() {
        super();
        this.m_tagname = "Button";
        this.m_text = "";
        this.m_background_color = "#f0f0f0";
        this.m_border_radius = 4;
        this.m_padding_left = 8;
        this.m_padding_top = 4;
        this.m_padding_right = 8;
        this.m_padding_bottom = 4;
        this.m_font_size = 14;
        this.m_font_color = "#333";
        this.m_cursor = "pointer";
        
        // 按钮事件监听器
        this.m_click_listeners = [];
        this.m_hover_listeners = [];
        this.m_mouse_down_listeners = [];
        this.m_mouse_up_listeners = [];
    }

    // 设置按钮文本
    SetText(text) {
        if (this.m_text !== text) {
            this.m_text = text;
            this.SetAttributeChanged(true);
            this.Refresh();
        }
    }

    // 获取按钮文本
    GetText() {
        return this.m_text;
    }

    // 设置按钮背景颜色
    SetBackgroundColor(color) {
        if (this.m_background_color !== color) {
            this.m_background_color = color;
            this.SetStyleChanged(true);
            this.Refresh();
        }
    }

    // 获取按钮背景颜色
    GetBackgroundColor() {
        return this.m_background_color;
    }

    // 设置边框圆角
    SetBorderRadius(radius) {
        if (this.m_border_radius !== radius) {
            this.m_border_radius = radius;
            this.SetStyleChanged(true);
            this.Refresh();
        }
    }

    // 获取边框圆角
    GetBorderRadius() {
        return this.m_border_radius;
    }

    // 设置内边距
    SetPadding(left, top, right, bottom) {
        this.SetPaddingLeft(left);
        this.SetPaddingTop(top);
        this.SetPaddingRight(right);
        this.SetPaddingBottom(bottom);
        this.SetStyleChanged(true);
        this.Refresh();
    }

    // 设置字体大小
    SetFontSize(size) {
        if (this.m_font_size !== size) {
            this.m_font_size = size;
            this.SetStyleChanged(true);
            this.Refresh();
        }
    }

    // 获取字体大小
    GetFontSize() {
        return this.m_font_size;
    }

    // 设置字体颜色
    SetFontColor(color) {
        if (this.m_font_color !== color) {
            this.m_font_color = color;
            this.SetStyleChanged(true);
            this.Refresh();
        }
    }

    // 获取字体颜色
    GetFontColor() {
        return this.m_font_color;
    }

    // 设置鼠标指针样式
    SetCursor(cursor) {
        if (this.m_cursor !== cursor) {
            this.m_cursor = cursor;
            this.SetStyleChanged(true);
            this.Refresh();
        }
    }

    // 获取鼠标指针样式
    GetCursor() {
        return this.m_cursor;
    }

    // 添加点击事件监听器
    AddClickListener(listener) {
        if (!this.m_click_listeners.includes(listener)) {
            this.m_click_listeners.push(listener);
        }
    }

    // 移除点击事件监听器
    RemoveClickListener(listener) {
        const index = this.m_click_listeners.indexOf(listener);
        if (index !== -1) {
            this.m_click_listeners.splice(index, 1);
        }
    }

    // 添加悬停事件监听器
    AddHoverListener(listener) {
        if (!this.m_hover_listeners.includes(listener)) {
            this.m_hover_listeners.push(listener);
        }
    }

    // 移除悬停事件监听器
    RemoveHoverListener(listener) {
        const index = this.m_hover_listeners.indexOf(listener);
        if (index !== -1) {
            this.m_hover_listeners.splice(index, 1);
        }
    }

    // 添加鼠标按下事件监听器
    AddMouseDownListener(listener) {
        if (!this.m_mouse_down_listeners.includes(listener)) {
            this.m_mouse_down_listeners.push(listener);
        }
    }

    // 移除鼠标按下事件监听器
    RemoveMouseDownListener(listener) {
        const index = this.m_mouse_down_listeners.indexOf(listener);
        if (index !== -1) {
            this.m_mouse_down_listeners.splice(index, 1);
        }
    }

    // 添加鼠标释放事件监听器
    AddMouseUpListener(listener) {
        if (!this.m_mouse_up_listeners.includes(listener)) {
            this.m_mouse_up_listeners.push(listener);
        }
    }

    // 移除鼠标释放事件监听器
    RemoveMouseUpListener(listener) {
        const index = this.m_mouse_up_listeners.indexOf(listener);
        if (index !== -1) {
            this.m_mouse_up_listeners.splice(index, 1);
        }
    }

    // 触发点击事件
    TriggerClick(event) {
        for (const listener of this.m_click_listeners) {
            listener(event, this);
        }
    }

    // 触发悬停事件
    TriggerHover(event) {
        for (const listener of this.m_hover_listeners) {
            listener(event, this);
        }
    }

    // 触发鼠标按下事件
    TriggerMouseDown(event) {
        for (const listener of this.m_mouse_down_listeners) {
            listener(event, this);
        }
    }

    // 触发鼠标释放事件
    TriggerMouseUp(event) {
        for (const listener of this.m_mouse_up_listeners) {
            listener(event, this);
        }
    }

    // 渲染按钮内容（文本）
    OnRenderContent(painter) {
        if (!this.m_text || this.m_text.length === 0) return;
        
        const content_x = this.GetContentX();
        const content_y = this.GetContentY();
        const content_width = this.GetMaxContentWidth();
        const content_height = this.GetMaxContentHeight();
        
        // 计算文本位置（居中显示）
        const text_width = painter.MeasureText(this.m_text, this.m_font_size, this.m_font_family);
        const text_x = content_x + (content_width - text_width) / 2;
        const text_y = content_y + (content_height + this.m_font_size) / 2;
        
        painter.DrawText(this.m_text, text_x, text_y, this.m_font_size, this.m_font_family, this.m_font_color);
    }

    // 应用按钮样式
    ApplyElementStyle() {
        super.ApplyElementStyle();
        
        const styles = this.GetStyles();
        
        // 应用按钮特定的样式
        const backgroundColor = styles["background-color"];
        if (backgroundColor && backgroundColor.IsColorValue()) {
            this.SetBackgroundColor(backgroundColor.GetColorValue(this.m_background_color));
        }
        
        const borderRadius = styles["border-radius"];
        if (borderRadius && borderRadius.IsPixelValue()) {
            this.SetBorderRadius(borderRadius.GetPixelValue(this.m_border_radius));
        }
        
        const fontSize = styles["font-size"];
        if (fontSize && fontSize.IsPixelValue()) {
            this.SetFontSize(fontSize.GetPixelValue(this.m_font_size));
        }
        
        const color = styles["color"];
        if (color && color.IsColorValue()) {
            this.SetFontColor(color.GetColorValue(this.m_font_color));
        }
        
        const cursor = styles["cursor"];
        if (cursor) {
            this.SetCursor(cursor.GetStringValue(this.m_cursor));
        }
    }
}

export { IButton };
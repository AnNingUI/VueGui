
class IElement {
    constructor(window) {
        this.m_window = window;
        this.m_tagname = "Element";
        this.m_viewport_x = 0;
        this.m_viewport_y = 0;
        this.m_viewport_width = 0;
        this.m_viewport_height = 0;
        this.m_content_viewport_x = 0;
        this.m_content_viewport_y = 0;
        this.m_content_viewport_width = 0;
        this.m_content_viewport_height = 0;
        this.m_x = 0;
        this.m_y = 0;
        this.m_width = 0;
        this.m_height = 0;
        this.m_local_x = 0;
        this.m_local_y = 0;
        this.m_local_width = 0;
        this.m_local_height = 0;
        this.m_local_content_width = 0;
        this.m_local_content_height = 0;
        this.m_style_width = 0;
        this.m_style_height = 0;
        this.m_padding_left = 0;
        this.m_padding_top = 0;
        this.m_padding_right = 0;
        this.m_padding_bottom = 0;
        this.m_margin_left = 0;
        this.m_margin_top = 0;
        this.m_margin_right = 0;
        this.m_margin_bottom = 0;
        this.m_border_left_width = 0;
        this.m_border_top_width = 0;
        this.m_border_right_width = 0;
        this.m_border_bottom_width = 0;
        this.m_border_left_color = 'black';
        this.m_border_top_color = 'black';
        this.m_border_right_color = 'black';
        this.m_border_bottom_color = 'black';
        this.m_background_color = 'transparent';
        this.m_font_color = 'black';
        this.m_font_size = 16;
        this.m_font_family = 'Arial';
        this.m_line_height = 20;
        this.m_visible = true;
        this.m_parent = null;
        this.m_childrens = [];
        this.m_attributes = {};
        this.m_attribute_getters = {};
        this.m_attribute_setters = {};
        this.m_children_changed = false;
        this.m_attribute_changed = false;
        this.m_layout_changed = true;
        this.m_position_changed = true;
    }

    GetWindow() { return this.m_window; }
    GetWindowWidth() { return this.m_window.GetWindowWidth(); }
    GetWindowHeight() { return this.m_window.GetWindowHeight(); }
    SetChildrenChanged(changed) { this.m_children_changed = changed; }
    SetAttributeChanged(changed) { this.m_attribute_changed = changed; }
    SetLayoutChanged(changed) { this.m_layout_changed = changed; }
    SetPositionChanged(changed) { this.m_position_changed = changed; }
    GetChildrens() { return this.m_childrens; }
    SetParent(parent) { this.m_parent = parent; }
    GetParent() { return this.m_parent; }
    SetTagName(tagname) { this.m_tagname = tagname; }
    GetTagName() { return this.m_tagname; }
    SetVisible(visible) { this.m_visible = visible; }
    IsVisible() { return this.m_visible; }
    
    // 布局
    SetX(x) { this.m_x = x; }
    SetY(y) { this.m_y = y; }
    SetWidth(width) { this.m_width = width; }
    SetHeight(height) { this.m_height = height; }
    GetX() { return this.m_x; }
    GetY() { return this.m_y; }
    GetWidth() { return this.m_width; }
    GetHeight() { return this.m_height; }
    SetLocalX(x) { this.m_local_x = x; }
    SetLocalY(y) { this.m_local_y = y; }
    SetLocalWidth(width) { this.m_local_width = width; }
    SetLocalHeight(height) { this.m_local_height = height; }
    GetLocalX() { return this.m_local_x; }
    GetLocalY() { return this.m_local_y; }
    GetLocalWidth() { return this.m_local_width; }
    GetLocalHeight() { return this.m_local_height; }
    SetLocalContentWidth(width) { this.m_local_content_width = width; }
    SetLocalContentHeight(height) { this.m_local_content_height = height; }
    GetLocalContentWidth() { return this.m_local_content_width; }
    GetLocalContentHeight() { return this.m_local_content_height; }
    GetStyleWidth() { return this.m_style_width; }
    GetStyleHeight() { return this.m_style_height; }
    SetStyleWidth(width) { this.m_style_width = width; }
    SetStyleHeight(height) { this.m_style_height = height; }
    GetLocalMaxContentWidth() { return this.m_local_width - this.m_padding_left - this.m_padding_right - this.m_border_left_width - this.m_border_right_width; }
    GetLocalMaxContentHeight() { return this.m_local_height - this.m_padding_top - this.m_padding_bottom - this.m_border_top_width - this.m_border_bottom_width; }

    // 视口
    SetViewPortX(x) { this.m_viewport_x = x; }
    SetViewPortY(y) { this.m_viewport_y = y; }
    SetViewPortWidth(width) { this.m_viewport_width = width; }
    SetViewPortHeight(height) { this.m_viewport_height = height; }
    GetViewPortX() { return this.m_viewport_x; }
    GetViewPortY() { return this.m_viewport_y; }
    GetViewPortWidth() { return this.m_viewport_width; }
    GetViewPortHeight() { return this.m_viewport_height; }
    SetContentViewPortX(x) { this.m_content_viewport_x = x; }
    SetContentViewPortY(y) { this.m_content_viewport_y = y; }
    SetContentViewPortWidth(width) { this.m_content_viewport_width = width; }
    SetContentViewPortHeight(height) { this.m_content_viewport_height = height; }
    GetContentViewPortX() { return this.m_content_viewport_x; }
    GetContentViewPortY() { return this.m_content_viewport_y; }
    GetContentViewPortWidth() { return this.m_content_viewport_width; }
    GetContentViewPortHeight() { return this.m_content_viewport_height; }

    // 边框 填充 边距
    GetBorderLeftWidth() { return this.m_border_left_width; }
    GetBorderTopWidth() { return this.m_border_top_width; }
    GetBorderRightWidth() { return this.m_border_right_width; }
    GetBorderBottomWidth() { return this.m_border_bottom_width; }
    SetBorderLeftWidth(width) { this.m_border_left_width = width; }
    SetBorderTopWidth(width) { this.m_border_top_width = width; }
    SetBorderRightWidth(width) { this.m_border_right_width = width; }
    SetBorderBottomWidth(width) { this.m_border_bottom_width = width; }
    GetBorderLeftColor() { return this.m_border_left_color; }
    GetBorderTopColor() { return this.m_border_top_color; }
    GetBorderRightColor() { return this.m_border_right_color; }
    GetBorderBottomColor() { return this.m_border_bottom_color; }
    SetBorderLeftColor(color) { this.m_border_left_color = color; }
    SetBorderTopColor(color) { this.m_border_top_color = color; }
    SetBorderRightColor(color) { this.m_border_right_color = color; }
    SetBorderBottomColor(color) { this.m_border_bottom_color = color; }
    SetPaddingLeft(padding) { this.m_padding_left = padding; }
    SetPaddingTop(padding) { this.m_padding_top = padding; }
    SetPaddingRight(padding) { this.m_padding_right = padding; }
    SetPaddingBottom(padding) { this.m_padding_bottom = padding; }
    GetPaddingLeft() { return this.m_padding_left; }
    GetPaddingTop() { return this.m_padding_top; }
    GetPaddingRight() { return this.m_padding_right; }
    GetPaddingBottom() { return this.m_padding_bottom; }
    SetMarginLeft(margin) { this.m_margin_left = margin; }
    SetMarginTop(margin) { this.m_margin_top = margin; }
    SetMarginRight(margin) { this.m_margin_right = margin; }
    SetMarginBottom(margin) { this.m_margin_bottom = margin; }
    GetMarginLeft() { return this.m_margin_left; }
    GetMarginTop() { return this.m_margin_top; }
    GetMarginRight() { return this.m_margin_right; }
    GetMarginBottom() { return this.m_margin_bottom; }

    // 背景 字体
    SetBackgroundColor(color) { this.m_background_color = color; }
    GetBackgroundColor() { return this.m_background_color; }
    SetFontColor(color) { this.m_font_color = color; }
    GetFontColor() { return this.m_font_color; }
    SetFontSize(size) { this.m_font_size = size; }
    GetFontSize() { return this.m_font_size; }
    SetFontFamily(family) { this.m_font_family = family; }
    GetFontFamily() { return this.m_font_family; }
    SetLineHeight(height) { this.m_line_height = height; }
    GetLineHeight() { return this.m_line_height; }

    InsertChildren(target_children, anchor_children = null) {
        if (this.m_childrens.includes(target_children) || !target_children || target_children === this) {
            return false;
        }
        if (anchor_children === null) {
            this.m_childrens.push(target_children);
        } else {
            const index = this.m_childrens.indexOf(anchor_children);
            if (index !== -1) {
                this.m_childrens.splice(index, 0, target_children);
            } else {
                this.m_childrens.push(target_children);
            }
        }
        target_children.m_parent = this;
        this.m_children_changed = true;
        this.Refresh();
        return true;
    }

    DeleteChildren(target_children) {
        const index = this.m_childrens.indexOf(target_children);
        if (index !== -1) {
            this.m_childrens.splice(index, 1);
            this.m_children_changed = true;
            this.Refresh();
            return true;
        }
        return false;
    }

    InsertAttribute(key, value) {
        const getter = this.m_attribute_getters[key];
        if (getter) {
            if (getter() === value) {
                return false;
            }
        } else {
            if (this.m_attributes[key] === value) {
                return false;
            }
        }
        const setter = this.m_attribute_setters[key];
        if (setter) {
            setter(value);
        }
        this.m_attribute_changed = true;
        this.m_attributes[key] = value;
        this.Refresh();
        return true;
    }

    DeleteAttribute(key) {
        if (this.m_attributes.hasOwnProperty(key)) {
            delete this.m_attributes[key];
            this.m_attribute_changed = true;
            const setter = this.m_attribute_setters[key];
            if (setter) {
                setter(null);
            }
            this.Refresh();
            return true;
        }
        return false;
    }

    Refresh() {
        this.m_window.Refresh(this.m_viewport_x, this.m_viewport_y, this.m_viewport_width, this.m_viewport_height);
    }

    Render(painter) {
        if (this.m_children_changed) this.UpdateChildren();
        if (this.m_attribute_changed) this.UpdateAttributes();
        if (this.m_layout_changed) this.UpdateLayout();
        if (this.m_position_changed) this.UpdatePosition();

        if (this.m_viewport_width <= 0 || this.m_viewport_height <= 0 || !this.m_visible) return;
        painter.Save();
        painter.Clip(this.m_viewport_x, this.m_viewport_y, this.m_viewport_width, this.m_viewport_height);
        OnRenderBackground(painter);
        OnRenderBorder(painter);
        OnRenderContent(painter);
        OnRenderChildren(painter);
        painter.Restore();
    }

    OnRenderBackground(painter) {
        if (!this.m_background_color || this.m_background_color === "none") return;

        if (this.m_border_radius && this.m_border_radius > 0) {
            painter.FillRoundedRectangle(this.m_x, this.m_y, this.m_width, this.m_height, this.m_border_radius, this.m_background_color);
        } else {
            painter.FillRectangle(this.m_x, this.m_y, this.m_width, this.m_height, this.m_background_color);
        }
    }

    OnRenderBorder(painter) {
        if (this.m_border_left_width && this.m_border_left_width > 0) {
            painter.FillRectangle(this.m_x, this.m_y, this.m_border_left_width, this.m_height, this.m_border_left_color);
        }
        if (this.m_border_top_width && this.m_border_top_width > 0) {
            painter.FillRectangle(this.m_x, this.m_y, this.m_width, this.m_border_top_width, this.m_border_top_color);
        }
        if (this.m_border_right_width && this.m_border_right_width > 0) {
            painter.FillRectangle(this.m_x + this.m_width - this.m_border_right_width, this.m_y, this.m_border_right_width, this.m_height, this.m_border_right_color);
        }
        if (this.m_border_bottom_width && this.m_border_bottom_width > 0) {
            painter.FillRectangle(this.m_x, this.m_y + this.m_height - this.m_border_bottom_width, this.m_width, this.m_border_bottom_width, this.m_border_bottom_color);
        }
    }

    OnRenderContent(painter) {
        // 渲染内容
    }

    OnRenderChildren(painter) {
        for (const child of this.m_childrens) {
            child.Render(painter);
        }
    }

    UpdateChildren() {
        this.m_children_changed = false;
    }

    UpdateAttributes() {
        this.m_attribute_changed = false;
    }

    GetLayoutWidth() {
        const local_width = this.GetLocalWidth();
        if (local_width > 0) return local_width;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_width = this.GetStyleWidth();
        if (style_width >= 0) return style_width;
        // 元素宽高没有被设置, 则返回父元素宽高
        const parent = this.GetParent();
        layout_width = parent == null ? 0 : (parent.GetLocalMaxContentWidth() - this.GetMarginLeft() - this.GetMarginRight());
        return layout_width < 0 ? 0 : layout_width;
    }

    GetLayoutHeight() {

    }

    UpdateLayout() {
        this.m_layout_changed = false;
    }

    UpdatePosition() {
        this.m_position_changed = false;
    }
}

export { IElement };
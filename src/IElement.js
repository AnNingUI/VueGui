
import { IInlineSelectorStyle } from "./IStyle.js";
import { IFixedLayout, IFixedLayoutInputItem, IBoxLayout, IBoxLayoutInputItem, IFlexLayout, IFlexLayoutInputItem } from "./ILayout.js";

class IElement {
    constructor() {
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
        this.m_scroll_x = 0;
        this.m_scroll_y = 0;
        this.m_local_x = 0;
        this.m_local_y = 0;
        this.m_local_width = -1;
        this.m_local_height = -1;
        this.m_local_content_width = 0;
        this.m_local_content_height = 0;
        this.m_style_width = -1;
        this.m_style_height = -1;
        this.m_padding_left = 0;
        this.m_padding_top = 0;
        this.m_padding_right = 0;
        this.m_padding_bottom = 0;
        this.m_margin_left = 0;
        this.m_margin_top = 0;
        this.m_margin_right = 0;
        this.m_margin_bottom = 0;
        this.m_zindex = 0;
        this.m_top = null;
        this.m_right = null;
        this.m_bottom = null;
        this.m_left = null;
        this.m_border_radius = 0;
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
        this.m_position_ancestor = null;
        this.m_position_descendants = [];
        this.m_window = null;
        this.m_root = null;
        this.m_position_ancestor = null;
        this.m_parent = null;
        this.m_childrens = [];
        this.m_attributes = {};
        this.m_styles = {};
        this.m_children_changed = false;
        this.m_attribute_changed = false;
        this.m_style_changed = false;
        this.m_layout_changed = true;
        this.m_position_changed = true;
        this.m_visible = true;
        this.m_horizontal_scroll = false;
        this.m_vertical_scroll = false;
        this.m_fixed_posoition = false;
        this.m_style_display = "block";

        this.SetAttributeSetterGetter("style", (style_value) => {
            this.m_inline_style_changed = true;
            this.m_attribute_style = style_value;
            this.SetStyleChanged(true);
        });

        this.SetAttributeSetterGetter("class", (class_value) => {
            this.m_selector_style_changed = true;
            this.m_attribute_class = class_value;
            this.SetStyleChanged(true);
        });
    }

    SetWindow(window) { this.m_window = window; }
    GetWindow() { return this.m_window; }
    SetRoot(root) { this.m_root = root; }
    GetRoot() { return this.m_root; }
    GetWindowWidth() { return this.m_window.GetWindowWidth(); }
    GetWindowHeight() { return this.m_window.GetWindowHeight(); }
    SetChildrenChanged(changed) { this.m_children_changed = changed; }
    SetAttributeChanged(changed) { this.m_attribute_changed = changed; }
    SetStyleChanged(changed) { this.m_style_changed = changed; }
    SetLayoutChanged(changed) { this.m_layout_changed = changed; }
    SetPositionChanged(changed) { this.m_position_changed = changed; }
    IsChildrenChanged() { return this.m_children_changed; }
    IsAttributeChanged() { return this.m_attribute_changed; }
    IsStyleChanged() { return this.m_style_changed; }
    IsLayoutChanged() { return this.m_layout_changed; }
    IsPositionChanged() { return this.m_position_changed; }
    GetPositionAncestor() { return this.m_position_ancestor; }
    GetPositionDescendants() { return this.m_position_descendants; }
    GetChildrens() { return this.m_childrens; }
    GetAttributes() { return this.m_attributes; }
    GetStyles() { return this.m_styles; }
    SetParent(parent) { this.m_parent = parent; }
    GetParent() { return this.m_parent; }
    SetTagName(tagname) { this.m_tagname = tagname; }
    GetTagName() { return this.m_tagname; }
    SetVisible(visible) { this.m_visible = visible; }
    IsVisible() { return this.m_visible; }
    SetDragging(dragging) { this.m_dragging = dragging; }
    IsDragging() { return this.m_dragging; }
    SetHorizontalScroll(horizontal_scroll) { this.m_horizontal_scroll = horizontal_scroll; }
    IsHorizontalScroll() { return this.m_horizontal_scroll; }
    SetVerticalScroll(vertical_scroll) { this.m_vertical_scroll = vertical_scroll; }
    IsVerticalScroll() { return this.m_vertical_scroll; }
    SetFixedPosition(fixed_position) { this.m_fixed_posoition = fixed_position; }
    IsFixedPosition() { return this.m_fixed_posoition; }
    SetStyleDisplay(style_display) { this.m_style_display = style_display; }
    IsBlockDisplay() { return this.m_style_display === "block" || this.m_style_display === "flex"; }
    IsInlineDisplay() { return this.m_style_display === "inline" || this.m_style_display === "inline-block" || this.m_style_display === "inline-flex"; }
    IsFlexDisplay() { return this.m_style_display === "flex" || this.m_style_display === "inline-flex"; }

    // 布局
    SetX(x) { this.m_x = x; }
    SetY(y) { this.m_y = y; }
    SetWidth(width) { this.m_width = width; }
    SetHeight(height) { this.m_height = height; }
    GetX() { return this.m_x; }
    GetY() { return this.m_y; }
    GetWidth() { return this.m_width; }
    GetHeight() { return this.m_height; }
    GetContentX() { return this.m_x + this.m_padding_left + this.m_border_left_width; }
    GetContentY() { return this.m_y + this.m_padding_top + this.m_border_top_width; }
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
    GetMaxContentWidth() { return this.m_width - this.m_padding_left - this.m_padding_right - this.m_border_left_width - this.m_border_right_width; }
    GetMaxContentHeight() { return this.m_height - this.m_padding_top - this.m_padding_bottom - this.m_border_top_width - this.m_border_bottom_width; }
    GetScrollX() { return this.m_scroll_x; }
    GetScrollY() { return this.m_scroll_y; }
    SetScrollX(x) { this.m_scroll_x = x; }
    SetScrollY(y) { this.m_scroll_y = y; }
    GetMaxScrollX() { return this.m_local_content_width - this.GetLocalMaxContentWidth(); }
    GetMaxScrollY() { return this.m_local_content_height - this.GetLocalMaxContentHeight(); }
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
    SetBorderRadius(radius) { this.m_border_radius = radius; }
    GetBorderRadius() { return this.m_border_radius; }
    // 辅助布局
    GetSpaceWidth() { return this.m_local_width + this.m_margin_left + this.m_margin_right; }
    GetSpaceHeight() { return this.m_local_height + this.m_margin_top + this.m_margin_bottom; }
    GetPaddingBorderWidth() { return this.m_padding_left + this.m_padding_right + this.m_border_left_width + this.m_border_right_width; }
    GetPaddingBorderHeight() { return this.m_padding_top + this.m_padding_bottom + this.m_border_top_width + this.m_border_bottom_width; }
    GetLeftPaddingBorderSize() { return this.m_padding_left + this.m_border_left_width; }
    GetRightPaddingBorderSize() { return this.m_padding_right + this.m_border_right_width; }
    GetTopPaddingBorderSize() { return this.m_padding_top + this.m_border_top_width; }
    GetBottomPaddingBorderSize() { return this.m_padding_bottom + this.m_border_bottom_width; }
    // 定位    
    SetZIndex(z_index) { this.m_z_index = z_index; }
    GetZIndex() { return this.m_z_index; }
    SetTop(top) { this.m_top = top; }
    SetRight(right) { this.m_right = right; }
    SetBottom(bottom) { this.m_bottom = bottom; }
    SetLeft(left) { this.m_left = left; }
    GetTop() { return this.m_top; }
    GetRight() { return this.m_right; }
    GetBottom() { return this.m_bottom; }
    GetLeft() { return this.m_left; }

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

    // 文本
    SetText(text) { this.m_text = text; }
    GetText() { return this.m_text; }

    // 插入子元素
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

    // 删除子元素
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

    // 插入子属性
    InsertAttribute(key, value) {
        if (this.m_attributes[key] === value) {
            return false;
        }
        this.m_attribute_changed = true;
        this.m_attributes[key] = value;
        this.Refresh();
        return true;
    }

    // 删除子属性
    DeleteAttribute(key) {
        if (this.m_attributes[key] === undefined) {
            return false;
        }
        this.m_attributes[key] = undefined;
        this.m_attribute_changed = true;
        this.Refresh();
        return true;
    }

    // 设置属性的setter和getter
    SetAttributeSetterGetter(key, setter, getter) {
        Object.defineProperty(this.GetAttributes(), key, {
            set: setter,
            get: getter,
        });
    }

    Refresh() {
        this.GetWindow().Refresh(this.m_viewport_x, this.m_viewport_y, this.m_viewport_width, this.m_viewport_height);
    }

    Render(painter) {
        if (this.m_children_changed) this.UpdateChildren();
        if (this.m_attribute_changed) this.UpdateAttribute();
        if (this.m_style_changed) this.UpdateStyle();
        if (this.m_layout_changed) this.UpdateLayout();
        if (this.m_position_changed) this.UpdatePosition();

        if (this.m_viewport_width <= 0 || this.m_viewport_height <= 0 || !this.m_visible) return;
        painter.Save();
        painter.Clip(this.m_viewport_x, this.m_viewport_y, this.m_viewport_width, this.m_viewport_height);
        this.OnRenderBackground(painter);
        this.OnRenderBorder(painter);
        this.OnRenderContent(painter);
        this.OnRenderChildren(painter);
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
        for (const children of this.m_childrens) {
            children.Render(painter);
        }
    }

    UpdateChildren() {
        this.m_children_changed = false;
    }

    UpdateAttribute() {
        this.m_attribute_changed = false;
    }

    UpdateStyle() {
        this.m_style_changed = false;

        if (this.m_selector_style_changed) {
            // 更新选择器样式
        }

        if (this.m_inline_style_changed) {
            // 更新内联样式
            this.m_inline_selector_style = new IInlineSelectorStyle(this.m_attribute_style);
            this.m_inline_style_changed = false;
        }

        // 合并样式
        if (this.m_inline_selector_style) {
            this.m_styles = this.m_inline_selector_style.GetStyle();
        }

        // 生效元素样式
        this.ApplyElementStyle();
    }

    GetLayoutWidth() {
        const local_width = this.GetLocalWidth();
        if (local_width > 0) return local_width;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_width = this.GetStyleWidth();
        if (style_width >= 0) return style_width;
        // 元素宽高没有被设置, 则返回父元素宽高
        const parent = this.GetParent();
        const layout_width = parent == null ? 0 : (parent.GetLocalMaxContentWidth() - this.GetMarginLeft() - this.GetMarginRight());
        return layout_width < 0 ? 0 : layout_width;
    }

    GetLayoutHeight() {
        const local_height = this.GetLocalHeight();
        if (local_height > 0) return local_height;
        // 元素样式宽高被设置, 则返回元素样式宽高
        const style_height = this.GetStyleHeight();
        if (style_height >= 0) return style_height;
        // 元素宽高没有被设置, 则返回父元素宽高
        const parent = this.GetParent();
        const layout_height = parent == null ? 0 : (parent.GetLocalMaxContentHeight() - this.GetMarginTop() - this.GetMarginBottom());
        return layout_height < 0 ? 0 : layout_height;

    }

    UpdateBoxLayout() {
        const layout_width = this.GetLayoutWidth();
        const layout_height = this.GetLayoutHeight();
        const is_auto_height = this.GetLocalHeight() < 0 && this.GetStyleHeight() < 0;

        this.SetLocalWidth(layout_width);
        this.SetLocalHeight(layout_height);

        const layout = new IBoxLayout();
        let local_max_content_width = this.GetLocalMaxContentWidth();
        let local_max_content_height = this.GetLocalMaxContentHeight();
        local_max_content_width = local_max_content_width < 0 ? 0 : local_max_content_width;
        local_max_content_height = local_max_content_height < 0 ? 0 : local_max_content_height;
        layout.m_width = local_max_content_width;
        layout.m_height = local_max_content_height;

        const input_items = [];
        const childrens = this.GetChildrens();
        for (let i = 0; i < childrens.length; i++) {
            const children = childrens[i];
            const children_styles = children.GetStyles();
            if (children.IsVisible()) {
                children.SetLocalX(-1);
                children.SetLocalY(-1);
                children.SetLocalWidth(-1);
                children.SetLocalHeight(-1);
            }
            else {
                children.SetLocalX(0);
                children.SetLocalY(0);
                children.SetLocalWidth(0);
                children.SetLocalHeight(0);
                continue;
            }
            if (children.IsFixedPosition()) {
                children.UpdateLayout();
                continue;
            }
            children.UpdateLayout();
            const input_item = new IBoxLayoutInputItem();
            input_item.m_right_float = children_styles && children_styles["float"] === "right";
            input_item.m_inline_block = children.IsInlineDisplay();
            input_item.m_width = children.GetLocalWidth();
            input_item.m_height = children.GetLocalHeight();
            input_item.m_margin_top = children.GetMarginTop();
            input_item.m_margin_bottom = children.GetMarginBottom();
            input_item.m_margin_left = children.GetMarginLeft();
            input_item.m_margin_right = children.GetMarginRight();
            input_item.m_userdata = children;
            input_items.push(input_item);
        }

        const content_local_x = this.GetLeftPaddingBorderSize();
        const content_local_y = this.GetTopPaddingBorderSize();
        const output_items = layout.Calculate(input_items);
        for (let i = 0; i < output_items.length; i++) {
            const output_item = output_items[i];
            const children = output_item.m_userdata;
            children.SetLocalX(content_local_x + output_item.m_x);
            children.SetLocalY(content_local_y + output_item.m_y);
        }

        this.SetLocalContentWidth(layout.GetContentWidth());
        this.SetLocalContentHeight(layout.GetContentHeight());

        if (is_auto_height) {
            this.SetLocalHeight(this.GetLocalContentHeight() + this.GetPaddingBorderHeight());
        }
    }

    UpdateFlexLayout() {
        const layout_width = this.GetLayoutWidth();
        const layout_height = this.GetLayoutHeight();
        const is_auto_height = this.GetLocalHeight() < 0 && this.GetStyleHeight() < 0;

        this.SetLocalWidth(layout_width);
        this.SetLocalHeight(layout_height);

        const styles = this.GetStyles() || {};
        const flex_direction = styles["flex-direction"];
        const flex_wrap = styles["flex-wrap"];
        const justify_content = styles["justify-content"];
        const align_items = styles["align-items"];
        const align_content = styles["align-content"];
        const layout = new IFlexLayout();
        let local_max_content_width = this.GetLocalMaxContentWidth();
        let local_max_content_height = this.GetLocalMaxContentHeight();
        local_max_content_width = local_max_content_width < 0 ? 0 : local_max_content_width;
        local_max_content_height = local_max_content_height < 0 ? 0 : local_max_content_height;
        layout.m_width = local_max_content_width;
        layout.m_height = local_max_content_height;
        layout.m_flex_direction = flex_direction ? flex_direction.GetStringValue("row") : "row";
        layout.m_flex_wrap = flex_wrap ? flex_wrap.GetStringValue("nowrap") : "nowrap";
        layout.m_justify_content = justify_content ? justify_content.GetStringValue("flex-start") : "flex-start";
        layout.m_align_items = align_items ? align_items.GetStringValue("flex-start") : "flex-start";
        layout.m_align_content = align_content ? align_content.GetStringValue("flex-start") : "flex-start";

        const input_items = [];
        const childrens = this.GetChildrens();
        for (let i = 0; i < childrens.length; i++) {
            const children = childrens[i];
            const children_styles = children.GetStyles() || {};
            const align_self = children_styles["align-self"];
            const flex_grow = children_styles["flex-grow"];
            const flex_shrink = children_styles["flex-shrink"];
            const order = children_styles["order"];
            if (children.IsVisible()) {
                children.SetLocalX(-1);
                children.SetLocalY(-1);
                children.SetLocalWidth(-1);
                children.SetLocalHeight(-1);
            }
            else {
                children.SetLocalX(0);
                children.SetLocalY(0);
                children.SetLocalWidth(0);
                children.SetLocalHeight(0);
                continue;
            }
            if (children.IsFixedPosition()) {
                children.UpdateLayout();
                continue;
            }
            children.UpdateLayout();
            const input_item = new IFlexLayoutInputItem();
            input_item.m_margin_top = children.GetMarginTop();
            input_item.m_margin_bottom = children.GetMarginBottom();
            input_item.m_margin_left = children.GetMarginLeft();
            input_item.m_margin_right = children.GetMarginRight();
            input_item.m_align_self = align_self ? align_self.GetStringValue("none") : "none";
            input_item.m_flex_grow = flex_grow ? flex_grow.GetIntegerValue(0) : 0;
            input_item.m_flex_shrink = flex_shrink ? flex_shrink.GetIntegerValue(0) : 0;
            input_item.m_order = order ? order.GetIntegerValue(0) : 0;
            input_item.m_userdata = children;
            if (input_item.m_flex_grow == 0 && input_item.m_flex_shrink == 0 && input_item.m_align_self != "stretch") {
                children.UpdateLayout();
                input_item.m_width = children.GetLocalWidth();
                input_item.m_height = children.GetLocalHeight();
            }
            else {
                children.ApplyLayoutStyle();
                input_item.m_width = children.GetStyleWidth();
                input_item.m_height = children.GetStyleHeight();
            }
            input_item.m_width = input_item.m_width < 0 ? 0 : input_item.m_width;
            input_item.m_height = input_item.m_height < 0 ? 0 : input_item.m_height;
            input_items.push(input_item);
        }

        const content_local_x = this.GetLeftPaddingBorderSize();
        const content_local_y = this.GetTopPaddingBorderSize();
        const output_items = layout.Calculate(input_items);
        for (let i = 0; i < output_items.length; i++) {
            const input_item = input_items[i];
            const output_item = output_items[i];
            const children = output_item.m_userdata;
            children.SetLocalX(content_local_x + output_item.m_x);
            children.SetLocalY(content_local_y + output_item.m_y);
            if (children.GetLocalWidth() < 0 || children.GetLocalHeight() < 0) {
                children.SetLocalWidth(output_item.m_width);
                children.SetLocalHeight(output_item.m_height);
                children.UpdateLayout();
            }
        }

        this.SetLocalContentWidth(layout.GetContentWidth());
        this.SetLocalContentHeight(layout.GetContentHeight());

        if (is_auto_height) {
            this.SetLocalHeight(this.GetLocalContentHeight() + this.GetPaddingBorderHeight());
        }
    }

    UpdateLayout() {
        this.ApplyLayoutStyle();
        this.SetLayoutChanged(false);
        this.SetPositionChanged(true);
        this.SetLocalContentWidth(0);
        this.SetLocalContentHeight(0);

        if (this.IsFixedPosition()) {
            // 获取定位元素
            let position_ancestor = this.GetPositionAncestor();
            position_ancestor = position_ancestor == null ? this.GetParent() : position_ancestor;
            position_ancestor = position_ancestor == null ? this.GetRoot() : position_ancestor;

            const layout = new IFixedLayout();
            layout.m_width = position_ancestor.GetLocalMaxContentWidth();
            layout.m_height = position_ancestor.GetLocalMaxContentHeight();

            const input_item = new IFixedLayoutInputItem();
            input_item.m_width = this.GetStyleWidth();
            input_item.m_height = this.GetStyleHeight();
            input_item.m_left = this.GetLeft();
            input_item.m_top = this.GetTop();
            input_item.m_right = this.GetRight();
            input_item.m_bottom = this.GetBottom();
            const [output_item] = layout.Calculate([input_item]);
            this.SetLocalX(output_item.m_x);
            this.SetLocalY(output_item.m_y);
            this.SetLocalWidth(output_item.m_width);
            this.SetLocalHeight(output_item.m_height);
        }
        if (this.IsVisible()) {
            if (this.IsFlexDisplay()) {
                this.UpdateFlexLayout();
            } else {
                this.UpdateBoxLayout();
            }

        } else {
            this.SetLocalWidth(0);
            this.SetLocalHeight(0);
        }
        const parent = this.GetParent();
        if (this.GetLocalX() < 0) {
            this.SetLocalX(parent.GetPaddingLeft() + parent.GetBorderLeftWidth() + this.GetMarginLeft());
        }
        if (this.GetLocalY() < 0) {
            this.SetLocalY(parent.GetPaddingTop() + parent.GetBorderTopWidth() + this.GetMarginTop());
        }
        this.SetWidth(this.GetLocalWidth());
        this.SetHeight(this.GetLocalHeight());
    }

    UpdatePosition() {
        this.SetPositionChanged(false);
        let position_ancestor = this.GetPositionAncestor();
        position_ancestor = position_ancestor == null ? this.GetParent() : position_ancestor;
        position_ancestor = position_ancestor == null ? this.GetRoot() : position_ancestor;

        // 更新位置
        if (this.IsDragging()) {
            // SetX(IDragDrop:: GetInstance().GetDragEndX());
            // SetY(IDragDrop:: GetInstance().GetDragEndY());
        }
        else if (this.IsFixedPosition()) {
            this.SetX(position_ancestor.GetX() + this.GetLocalX());
            this.SetY(position_ancestor.GetY() + this.GetLocalY());
        }
        else {
            this.SetX(position_ancestor.GetX() + this.GetLocalX() - position_ancestor.GetScrollX());
            this.SetY(position_ancestor.GetY() + this.GetLocalY() - position_ancestor.GetScrollY());
        }
        // 更新宽高
        this.SetWidth(this.GetLocalWidth());
        this.SetHeight(this.GetLocalHeight());

        // 更新视口 方便获取鼠标事件元素
        if (this.IsFixedPosition()) {
            position_ancestor = this.GetRoot(); // 定位元素视口在根元素之内既可
            this.SetViewPortX(Math.max(position_ancestor.GetViewPortX(), this.GetX()));
            this.SetViewPortY(Math.max(position_ancestor.GetViewPortY(), this.GetY()));
            this.SetViewPortWidth(Math.min(position_ancestor.GetViewPortX() + position_ancestor.GetViewPortWidth(), this.GetX() + this.GetWidth()) - this.GetViewPortX());
            this.SetViewPortHeight(Math.min(position_ancestor.GetViewPortY() + position_ancestor.GetViewPortHeight(), this.GetY() + this.GetHeight()) - this.GetViewPortY());
        }
        else {
            this.SetViewPortX(Math.max(position_ancestor.GetContentViewPortX(), this.GetX()));
            this.SetViewPortY(Math.max(position_ancestor.GetContentViewPortY(), this.GetY()));
            this.SetViewPortWidth(Math.min(position_ancestor.GetContentViewPortX() + position_ancestor.GetContentViewPortWidth(), this.GetX() + this.GetWidth()) - this.GetViewPortX());
            this.SetViewPortHeight(Math.min(position_ancestor.GetContentViewPortY() + position_ancestor.GetContentViewPortHeight(), this.GetY() + this.GetHeight()) - this.GetViewPortY());
        }

        // 更新内容视口
        {
            const viewport_x = this.GetViewPortX();
            const viewport_y = this.GetViewPortY();
            const viewport_width = this.GetViewPortWidth();
            const viewport_height = this.GetViewPortHeight();
            const content_x = this.GetContentX();
            const content_y = this.GetContentY();
            const max_content_width = this.GetMaxContentWidth();
            const max_content_height = this.GetMaxContentHeight();
            const content_viewport_x = content_x < viewport_x ? viewport_x : content_x;
            const content_viewport_y = content_y < viewport_y ? viewport_y : content_y;
            const content_viewport_width = ((content_x + max_content_width) < (viewport_x + viewport_width) ? (content_x + max_content_width) : (viewport_x + viewport_width)) - content_viewport_x;
            const content_viewport_height = ((content_y + max_content_height) < (viewport_y + viewport_height) ? (content_y + max_content_height) : (viewport_y + viewport_height)) - content_viewport_y;
            this.SetContentViewPortX(content_viewport_x);
            this.SetContentViewPortY(content_viewport_y);
            this.SetContentViewPortWidth(content_viewport_width);
            this.SetContentViewPortHeight(content_viewport_height);
        }

        // 刷新视口窗口
        this.Refresh(this.GetViewPortX(), this.GetViewPortY(), this.GetViewPortWidth(), this.GetViewPortHeight());

        // 更新子元素位置
        const childrens = this.GetChildrens();
        const childrens_size = childrens.length;
        for (let i = 0; i < childrens_size; i++) {
            const children = childrens[i];
            children.UpdatePosition();
        }
    }

    // 应用元素样式
    ApplyElementStyle() {
        const styles = this.GetStyles();
        const parent = this.GetParent();
        const is_support_inherit_style = false;

        const font_size = styles["font-size"];
        if (font_size && font_size.IsPixelValue()) {
            this.SetFontSize(font_size.GetPixelValue(0));
        } else {
            this.SetFontSize((parent && is_support_inherit_style) ? parent.GetFontSize() : this.GetFontSize());
        }

        const font_color = styles["color"];
        if (font_color && font_color.IsColorValue()) {
            this.SetFontColor(font_color.GetColorValue("#00000000"));
        } else {
            this.SetFontColor((parent && is_support_inherit_style) ? parent.GetFontColor() : this.GetFontColor());
        }

        const line_height = styles["line-height"];
        if (line_height) {
            if (line_height.IsPixelValue()) {
                line_height = line_height.GetPixelValue(this.GetFontSize() * 1.5);
            } else if (line_height.IsPercentage()) {
                line_height = line_height.GetPercentageValue(150) / 100 * this.GetFontSize();
            } else if (line_height.IsNumber()) {
                line_height = line_height.GetNumberValue(1.5) * this.GetFontSize();
            }
        } else {
            this.SetLineHeight((parent && is_support_inherit_style) ? parent.GetLineHeight() : this.GetLineHeight());
        }

        const border_top_width = styles["border-top-width"];
        if (border_top_width && border_top_width.IsPixelValue()) {
            this.SetBorderTopWidth(border_top_width.GetPixelValue(this.GetBorderTopWidth()));
        }
        const border_right_width = styles["border-right-width"];
        if (border_right_width && border_right_width.IsPixelValue()) {
            this.SetBorderRightWidth(border_right_width.GetPixelValue(this.GetBorderRightWidth()));
        }
        const border_bottom_width = styles["border-bottom-width"];
        if (border_bottom_width && border_bottom_width.IsPixelValue()) {
            this.SetBorderBottomWidth(border_bottom_width.GetPixelValue(this.GetBorderBottomWidth()));
        }
        const border_left_width = styles["border-left-width"];
        if (border_left_width && border_left_width.IsPixelValue()) {
            this.SetBorderLeftWidth(border_left_width.GetPixelValue(this.GetBorderLeftWidth()));
        }

        const border_top_color = styles["border-top-color"];
        if (border_top_color && border_top_color.IsColorValue()) {
            this.SetBorderTopColor(border_top_color.GetColorValue(this.GetBorderTopColor()));
        }
        const border_right_color = styles["border-right-color"];
        if (border_right_color && border_right_color.IsColorValue()) {
            this.SetBorderRightColor(border_right_color.GetColorValue(this.GetBorderRightColor()));
        }
        const border_bottom_color = styles["border-bottom-color"];
        if (border_bottom_color && border_bottom_color.IsColorValue()) {
            this.SetBorderBottomColor(border_bottom_color.GetColorValue(this.GetBorderBottomColor()));
        }
        const border_left_color = styles["border-left-color"];
        if (border_left_color && border_left_color.IsColorValue()) {
            this.SetBorderBottomColor(border_left_color.GetColorValue(this.GetBorderLeftColor()));
        }

        const background_color = styles["background-color"];
        if (background_color && background_color.IsColorValue()) {
            this.SetBackgroundColor(background_color.GetColorValue(this.GetBackgroundColor()));
        }

        const border_radius = styles["border-radius"];
        if (border_radius && border_radius.IsPixelValue()) {
            this.SetBorderRadius(border_radius.GetPixelValue(this.GetBorderRadius()));
        }

        const overflow_x = styles["overflow-x"];
        if (overflow_x) {
            const overflow_x_value = overflow_x.GetStringValue("auto");
            this.SetHorizontalScroll(overflow_x_value === "auto" || overflow_x_value === "scroll");
        }

        const overflow_y = styles["overflow-y"];
        if (overflow_y) {
            const overflow_y_value = overflow_y.GetStringValue("auto");
            this.SetVerticalScroll(overflow_y_value === "auto" || overflow_y_value === "scroll");
        }

        const posoition = styles["position"];
        if (posoition) {
            const position_value = posoition.GetStringValue("static");
            this.SetFixedPosition(position_value === "fixed" || position_value === "absolute");
        }

        const display = styles["display"];
        if (display) {
            const display_value = display.GetStringValue("block");
            this.SetStyleDisplay(display_value);
        }
    }

    // 应用布局样式
    ApplyLayoutStyle() {
        // 布局可能被直接调用(如元素布局可能先依赖子元素布局完成), 而布局常用依赖子元素及其属性和样式, 因此需要先更新子元素, 属性, 样式.
        // 如果子元素发生更新则更新子元素
        if (this.IsChildrenChanged()) this.UpdateChildren();
        // 如果属性更新则刷新属性
        if (this.IsAttributeChanged()) this.UpdateAttribute();
        // 样式发生改变 去更新样式
        if (this.IsStyleChanged()) this.UpdateStyle();

        const styles = this.GetStyles();
        if (!styles) return;
        let parent = this.GetParent();
        let parent_local_width = 0;
        let parent_local_height = 0;

        if (parent) {
            const position = styles["position"];
            const posoition_value = position ? position.GetStringValue("static") : "static";
            if (posoition_value == "fixed") {
                parent_local_width = this.GetRoot().GetLocalWidth();
                parent_local_height = this.GetRoot().GetLocalHeight();
            }
            else if (posoition_value == "absolute") {
                parent_local_width = parent.GetLocalWidth();
                parent_local_height = parent.GetLocalHeight();
            }
            else {
                parent_local_width = parent.GetLocalMaxContentWidth();
                parent_local_height = parent.GetLocalMaxContentHeight();
            }
        }
        else {
            parent_local_width = this.GetWindowWidth();
            parent_local_height = this.GetWindowHeight();
        }

        const padding_top = styles["padding-top"];
        if (padding_top) {
            this.SetPaddingTop(padding_top.GetDimensionValue(parent_local_width, 0));
        }

        const padding_right = styles["padding-right"];
        if (padding_right) {
            this.SetPaddingRight(padding_right.GetDimensionValue(parent_local_width, 0));
        }

        const padding_bottom = styles["padding-bottom"];
        if (padding_bottom) {
            this.SetPaddingBottom(padding_bottom.GetDimensionValue(parent_local_width, 0));
        }

        const padding_left = styles["padding-left"];
        if (padding_left) {
            this.SetPaddingLeft(padding_left.GetDimensionValue(parent_local_width, 0));
        }

        const margin_top = styles["margin-top"];
        if (margin_top) {
            this.SetMarginTop(margin_top.GetDimensionValue(parent_local_width, 0));
        }

        const margin_right = styles["margin-right"];
        if (margin_right) {
            this.SetMarginRight(margin_right.GetDimensionValue(parent_local_width, 0));
        }

        const margin_bottom = styles["margin-bottom"];
        if (margin_bottom) {
            this.SetMarginBottom(margin_bottom.GetDimensionValue(parent_local_width, 0));
        }

        const margin_left = styles["margin-left"];
        if (margin_left) {
            this.SetMarginLeft(margin_left.GetDimensionValue(parent_local_width, 0));
        }

        const top = styles["top"];
        if (top) {
            this.SetTop(top.GetDimensionValue(parent_local_width, 0));
        } else {
            this.SetTop(null);
        }

        const right = styles["right"];
        if (right) {
            this.SetRight(right.GetDimensionValue(parent_local_width, 0));
        } else {
            this.SetRight(null);
        }

        const bottom = styles["bottom"];
        if (bottom) {
            this.SetBottom(bottom.GetDimensionValue(parent_local_width, 0))
        } else {
            this.SetBottom(null);
        }

        const left = styles["left"];
        if (left) {
            this.SetLeft(left.GetDimensionValue(parent_local_width, 0));
        } else {
            this.SetLeft(null);
        }

        const width = styles["width"];
        const height = styles["height"];
        const box_sizing = styles["box-sizing"];
        const box_sizing_value = box_sizing ? box_sizing.GetStringValue("border-box") : "border-box";
        let style_width = this.GetStyleWidth();
        let style_height = this.GetStyleHeight();
        style_width = width ? width.GetDimensionValue(parent_local_width, style_width) : style_width;
        style_height = height ? height.GetDimensionValue(parent_local_height, style_height) : style_height;

        if (box_sizing_value === "content-box") {
            if (style_width > 0 && width.IsPixelValue()) style_width += GetPaddingBorderWidth();
            if (style_height > 0 && height.IsPixelValue()) style_height += GetPaddingBorderHeight();
        }

        this.SetStyleWidth(style_width);
        this.SetStyleHeight(style_height);
    }
}

export { IElement };
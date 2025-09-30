
class IElement {
    constructor(window) {
        this.m_window = window;
        this.m_viewport_x = 0;
        this.m_viewport_y = 0;
        this.m_viewport_width = 0;
        this.m_viewport_height = 0;
        this.m_x = 0;
        this.m_y = 0;
        this.m_width = 0;
        this.m_height = 0;
        this.m_local_x = 0;
        this.m_local_y = 0;
        this.m_local_width = 0;
        this.m_local_height = 0;
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
        this.m_layout_changed = false;
        this.m_position_changed = false;
    }

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

        if (this.m_viewport_width <=0 || this.m_viewport_height <= 0 || !this.m_visible) return;
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

    UpdateLayout() {
        this.m_layout_changed = false;
    }

    UpdatePosition() {
        this.m_position_changed = false;
    }
}

export { IElement };
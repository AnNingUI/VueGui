
export class ILayoutInputItem {
    constructor() {
        this.m_width = 0;// 宽度
        this.m_height = 0; // 高度
        this.m_margin_top = 0;// 上边距
        this.m_margin_right = 0;// 右边距
        this.m_margin_bottom = 0;// 下边距
        this.m_margin_left = 0;// 左边距
        this.m_userdata = null;// 用户数据
    }
}

export class ILayoutOutputItem {
    constructor() {
        this.m_x = 0;          // 输出位置X
        this.m_y = 0;          // 输出位置Y
        this.m_width = 0;      // 输出宽
        this.m_height = 0;     // 输出高
        this.m_userdata = 0;   // 用户数据
    }
}

export class ILayout {
    constructor() {
        this.m_width = 0;          // 宽度
        this.m_height = 0;         // 高度
        this.m_content_width = 0;  // 内容宽高
        this.m_content_height = 0; // 内容宽高
    }

    GetWidth() { return this.m_width; }
    GetHeight() { return this.m_height; }
    GetContentWidth() { return this.m_content_width; }
    GetContentHeight() { return this.m_content_height; }
    SetContentWidth(content_width) { this.m_content_width = content_width; }
    SetContentHeight(content_height) { this.m_content_height = content_height; }
}

export class IFixedLayoutInputItem extends ILayoutInputItem {
    constructor() {
        super();
        this.m_top = 0; // 上
        this.m_right = 0; //右
        this.m_bottom = 0; // 下
        this.m_left = 0; // 左
    }
}

export class IFixedLayoutOutputItem extends ILayoutOutputItem {
    constructor() {
        super();
    }
}

export class IFixedLayout extends ILayout {
    constructor() {
        super();
    }

    Calculate(input_items) {
        const output_items = [];
        if (!(input_items instanceof Array)) return output_items;

        const layout_width = this.GetWidth();
        const layout_height = this.GetHeight();
        for (let i = 0; i < input_items.length; i++) {
            const input_item = input_items[i];
            const output_item = new IFixedLayoutOutputItem();

            const left = input_item.m_left;
            const right = input_item.m_right;
            const top = input_item.m_top;
            const bottom = input_item.m_bottom;
            const exist_left = left instanceof Number || typeof left === "number";
            const exist_right = right instanceof Number || typeof right === "number";
            const exist_top = top instanceof Number || typeof top === "number";
            const exist_bottom = bottom instanceof Number || typeof bottom === "number";
            const width = input_item.m_width;
            const height = input_item.m_height;
            const exist_width = width >= 0;
            const exist_height = height >= 0;
            if (exist_left) {
                output_item.m_x = left;
                output_item.m_width = exist_width ? width : (layout_width - left - (exist_right ? right : 0));
            }
            else {
                if (exist_right) {
                    if (exist_width) {
                        output_item.m_x = layout_width - right - width;
                        output_item.m_width = width;
                    }
                    else {
                        output_item.m_x = 0;
                        output_item.m_width = layout_width - right;
                    }
                }
                else {
                    output_item.m_x = 0;
                    output_item.m_width = exist_width ? width : layout_width;
                }
            }

            if (exist_top) {
                output_item.m_y = top;
                output_item.m_height = exist_height ? height : (layout_height - top - (exist_bottom ? bottom : 0));
            }
            else {
                if (exist_bottom) {
                    if (exist_height) {
                        output_item.m_y = layout_height - height - bottom;
                        output_item.m_height = height;
                    }
                    else {
                        output_item.m_y = 0;
                        output_item.m_height = layout_height - bottom;
                    }
                }
                else {

                    output_item.m_y = 0;
                    output_item.m_height = exist_height ? height : layout_height;
                }
            }
            output_item.m_userdata = input_item.m_userdata;
            output_items.push(output_item);
        }
        return output_items;
    }
}
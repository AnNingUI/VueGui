const ConstantNone = Symbol("ConstantNone");
const ConstantStart = Symbol("ConstantStart");
const ConstantCenter = Symbol("ConstantCenter");
const ConstantEnd = Symbol("ConstantEnd");
const ConstantSpaceBetween = Symbol("ConstantSpaceBetween");
const ConstantSpaceAround = Symbol("ConstantSpaceAround");
const ConstantSpaceEvenly = Symbol("ConstantSpaceEvenly");
const ConstantStretch = Symbol("ConstantStretch");
const ConstantRow = Symbol("ConstantRow");
const ConstantColumn = Symbol("ConstantColumn");
const ConstantWrap = Symbol("ConstantWrap");
const ConstantNoWrap = Symbol("ConstantNoWrap");

const ConstantMap = {
    "none": ConstantNone,
    "start": ConstantStart,
    "flex-start": ConstantStart,
    "center": ConstantCenter,
    "end": ConstantEnd,
    "flex-end": ConstantEnd,
    "space-between": ConstantSpaceBetween,
    "space-around": ConstantSpaceAround,
    "space-evenly": ConstantSpaceEvenly,
    "stretch": ConstantStretch,
    "row": ConstantRow,
    "column": ConstantColumn,
    "wrap": ConstantWrap,
    "nowrap": ConstantNoWrap,
}

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
            const output_item = new ILayoutOutputItem();

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

export class IBoxLayoutInputItem extends ILayoutInputItem {
    constructor() {
        super();
        this.m_inline_block;
        this.m_right_float;
    }
}

export class IBoxLayout extends ILayout {
    constructor() {
        super();
    }

    Calculate(input_items) {
        const output_items = [];
        if (!(input_items instanceof Array)) return output_items;

        // 子元素永远相对父元素的内容宽高去布局
        let init_left_available_x = 0; // 左边框与填充
        let init_right_available_x = 0; // 右边框与填充
        let init_top_available_y = 0; // 上边框与填充
        let init_bottom_available_y = 0; // 下边框与填充
        let available_x = init_left_available_x;
        let right_available_x = init_right_available_x;
        let content_width = 0;
        let content_height = init_top_available_y;
        let line_width = 0;
        let line_height = 0;
        let max_width = this.GetWidth();

        // 宽度小于等于0，则忽略
        if ((max_width - init_left_available_x - init_right_available_x) <= 0) {
            for (let i = 0; i < input_items.length; i++) {
                const input_item = input_items[i];
                const output_item = new ILayoutOutputItem();
                output_item.m_userdata = input_item.m_userdata;
                output_items.push(output_item);
            }
            return output_items;
        }

        for (let i = 0; i < input_items.length; i++) {
            const input_item = input_items[i];
            const output_item = new ILayoutOutputItem();

            let input_item_left = 0;
            let input_item_top = 0;
            let input_item_width = input_item.m_width < 0 ? 0 : input_item.m_width;
            let input_item_height = input_item.m_height < 0 ? 0 : input_item.m_height;
            let input_item_space_width = input_item_width + input_item.m_margin_left + input_item.m_margin_right;
            let input_item_space_height = input_item_height + input_item.m_margin_top + input_item.m_margin_bottom;
            let is_right_float = input_item.m_right_float;
            let is_inline_block = input_item.m_inline_block;
            if (is_inline_block) {
                // 空间不够 新起一行
                if ((max_width - available_x - right_available_x) < input_item_space_width) {
                    available_x = init_left_available_x;
                    right_available_x = init_right_available_x;
                    content_height = content_height + line_height;
                    line_width = 0;
                    line_height = 0;
                }
                if (is_right_float) {
                    right_available_x = right_available_x + input_item_space_width;
                    input_item_left = max_width - right_available_x;
                    input_item_top = content_height;
                }
                else {
                    input_item_left = available_x;
                    input_item_top = content_height;
                    available_x = available_x + input_item_space_width;
                }
                line_height = line_height > input_item_space_height ? line_height : input_item_space_height;
                line_width = available_x + right_available_x;
                content_width = content_width > line_width ? content_width : line_width;
            }
            else {
                // 块元素独占一行
                available_x = init_left_available_x;
                right_available_x = init_right_available_x;
                content_height = content_height + line_height; // 上一行内联元素的高度

                input_item_left = init_left_available_x;
                input_item_top = content_height;

                content_height = content_height + input_item_space_height; // 当前行的高度
                line_width = input_item_space_width + init_left_available_x + init_right_available_x;
                content_width = content_width > line_width ? content_width : line_width;

                line_width = 0;
                line_height = 0;
            }
            output_item.m_x = input_item_left + input_item.m_margin_left;
            output_item.m_y = input_item_top + input_item.m_margin_top;
            output_item.m_width = input_item_width;
            output_item.m_height = input_item_height;
            output_item.m_userdata = input_item.m_userdata;
            output_items.push(output_item);
        }
        content_height = content_height + line_height; // 上一行内联元素的高度
        content_height += init_bottom_available_y;     // 边框与填充

        this.SetContentWidth(content_width - init_left_available_x - init_right_available_x);
        this.SetContentHeight(content_height - init_top_available_y - init_bottom_available_y);

        return output_items;
    }
}

export class IFlexLayoutInputItem extends ILayoutInputItem {
    constructor() {
        super();

        this.m_order = 0;
        this.m_flex_grow = 0;
        this.m_flex_shrink = 0;
        this.m_wrap = false;
        this.m_align_self = "none";
    }
}

export class IFlexLayout extends ILayout {
    constructor() {
        super();
        this.m_flex_direction = "row";
        this.m_flex_wrap = "nowrap";
        this.m_justify_content = "flex-start";
        this.m_align_items = "center";
        this.m_align_content = "flex-start";
        this.m_row_gap = 0;
        this.m_column_gap = 0;
    }

    Calculate(input_items) {
        const output_items = [];
        if (!(input_items instanceof Array)) return output_items;

        this.m_content_width = 0;
        this.m_content_height = 0;
        const axis_list = this.CalculateAxisList(input_items, output_items);

        // 获取轴数量 若为空则直接返回
        if (axis_list.length == 0) return output_items;

        // 布局多轴
        this.CalculateMultiAxis(axis_list);

        // 布局单轴元素
        if (this.IsRowLayout()) {
            this.CalculateXMainAsis(axis_list);
        }
        else {
            this.CalculateYMainAsis(axis_list);
        }

        return output_items;
    }

    CalculateXMainAsis(axis_list) {
        const justify_content = ConstantMap[this.m_justify_content] || ConstantStart;
        const align_items = ConstantMap[this.m_align_items] || ConstantStart;
        for (let i = 0; i < axis_list.length; i++) {
            const axis = axis_list[i];
            const input_items = axis.m_input_items;
            const output_items = axis.m_output_items;
            const input_items_size = input_items.length;
            if (input_items_size == 0) continue;

            // 更新行内元素布局 行布局 行最大宽使用容器宽 行最大高使用自身最大高 否则相反
            const axis_max_width = axis.m_max_width;
            const axis_max_height = axis.m_max_height;
            const axis_width = axis.m_width;
            const axis_x = axis.m_x;
            const axis_y = axis.m_y;

            if (axis_max_width > axis_width) {
                // 存在剩余空间, 调整扩展
                if (axis.m_total_flex_grow > 0) {
                    const grow_space_width = axis_max_width - axis_width;
                    for (let j = 0; j < input_items_size; j++) {
                        const input_item = input_items[j];
                        const output_item = output_items[j];
                        output_item.m_width += input_item.m_flex_grow * grow_space_width / axis.m_total_flex_grow;
                    }
                    axis_width = axis_max_width;
                }
            }
            else if (axis_max_width < axis_width) {
                // 调整收缩
                if (axis.m_total_flex_shrink > 0) {
                    const shrink_space_width = axis_max_width - axis_width;
                    const axis_shrink_width = 0; // 缩小后总宽度
                    for (let j = 0; j < input_items_size; j++) {
                        const input_item = input_items[j];
                        const output_item = output_items[j];
                        output_item.m_width += input_item.m_flex_shrink * shrink_space_width / axis.m_total_flex_shrink;
                        output_item.m_width = output_item.m_width < 0 ? 0 : output_item.m_width;
                        axis_shrink_width += output_item.m_width;
                    }
                    axis_width = axis_shrink_width;
                    axis_max_width = axis_shrink_width;
                }
                else {
                    axis_max_width = axis_width; // 避免坐标出现负值
                }
            }
            else {
                // 收缩和扩展都不变
            }

            // 计算首元素位置和元素间距
            let axis_remain_space_width = 0;
            const first_output_item = output_items[0];
            if (justify_content == ConstantCenter) {
                first_output_item.m_x = axis_x + (axis_max_width - axis_width) / 2;
            }
            else if (justify_content == ConstantSpaceBetween) {
                axis_remain_space_width = input_items_size > 1 ? ((axis_max_width - axis_width) / (input_items_size - 1)) : 0;
                first_output_item.m_x = axis_x;
            }
            else if (justify_content == ConstantSpaceAround) {
                axis_remain_space_width = (axis_max_width - axis_width) / input_items_size;
                first_output_item.m_x = axis_x + axis_remain_space_width / 2;
            }
            else if (justify_content == ConstantSpaceEvenly) {
                axis_remain_space_width = (axis_max_width - axis_width) / (input_items_size + 1);
                first_output_item.m_x = axis_x + axis_remain_space_width;
            }
            else if (justify_content == ConstantEnd) {
                first_output_item.m_x = axis_x + axis_max_width - axis_width;
            }
            else // m_justify_content == ConstantStart
            {
                first_output_item.m_x = axis_x;
            }

            let next_output_item_x = first_output_item.m_x;
            for (let j = 0; j < input_items_size; j++) {
                const input_item = input_items[j];
                const output_item = output_items[j];

                output_item.m_x = next_output_item_x;
                next_output_item_x = output_item.m_x + output_item.m_width + axis_remain_space_width + this.m_column_gap;

                let align_self = ConstantMap[input_item.m_align_self] || ConstantNone;
                align_self = align_self == ConstantNone ? align_items : align_self;
                if (align_self == ConstantCenter) {
                    output_item.m_y = axis_y + (axis_max_height - output_item.m_height) / 2;
                }
                else if (align_self == ConstantStretch) {
                    output_item.m_y = axis_y;
                    output_item.m_height = axis_max_height;
                }
                else if (align_self == ConstantEnd) {
                    output_item.m_y = axis_y + axis_max_height - output_item.m_height;
                }
                else // align_self == ConstantStart
                {
                    output_item.m_y = axis_y;
                }

                output_item.m_x = output_item.m_x + input_item.m_margin_left;
                output_item.m_y = output_item.m_y + input_item.m_margin_top;
                output_item.m_width = output_item.m_width - input_item.m_margin_left - input_item.m_margin_right;
                output_item.m_height = output_item.m_height - input_item.m_margin_top - input_item.m_margin_bottom;
            }
        }
    }

    CalculateYMainAsis(axis_list) {
        const justify_content = ConstantMap[this.m_justify_content] || ConstantStart;
        const align_items = ConstantMap[this.m_align_items] || ConstantStart;

        for (let i = 0; i < axis_list.length; i++) {
            const axis = axis_list[i];
            const input_items = axis.m_input_items;
            const output_items = axis.m_output_items;
            const input_items_size = input_items.length;
            if (input_items_size == 0) continue;

            // 更新行内元素布局 行布局 行最大宽使用容器宽 行最大高使用自身最大高 否则相反
            const axis_max_width = axis.m_max_width;
            const axis_max_height = axis.m_max_height;
            const axis_width = axis.m_width;
            const axis_height = axis.m_height;
            const axis_x = axis.m_x;
            const axis_y = axis.m_y;

            // 列轴
            if (axis_max_height > axis_height) {
                if (axis.m_total_flex_grow > 0) {
                    const grow_space_height = axis_max_height - axis_height;
                    for (let j = 0; j < input_items_size; j++) {
                        const input_item = input_items[j];
                        const output_item = output_items[j];
                        output_item.m_height += input_item.m_flex_grow * grow_space_height / axis.m_total_flex_grow;
                    }
                    axis_height = axis_max_height;
                }
            }
            else if (axis_max_height < axis_height) {
                if (axis.m_total_flex_shrink > 0) {
                    const shrink_space_height = axis_max_height - axis_height;
                    const axis_shrink_height = 0;
                    for (let j = 0; j < input_items_size; j++) {
                        const input_item = input_items[j];
                        const output_item = output_items[j];
                        output_item.m_height += input_item.m_flex_shrink * shrink_space_height / axis.m_total_flex_shrink;
                        output_item.m_height = output_item.m_height < 0 ? 0 : output_item.m_height;
                        axis_shrink_height += output_item.m_height;
                    }
                    axis_height = axis_shrink_height;
                    axis_max_height = axis_shrink_height;
                }
                else {
                    axis_max_height = axis_height;
                }
            }
            else {
                // 收缩和扩展都不变
            }

            // 调整位置
            let axis_remain_space_height = 0;
            const first_output_item = output_items[0];
            if (justify_content == ConstantCenter) {
                first_output_item.m_y = axis_y + (axis_max_height - axis_height) / 2;
            }
            else if (justify_content == ConstantSpaceBetween) {
                axis_remain_space_height = input_items_size > 1 ? ((axis_max_height - axis_height) / (input_items_size - 1)) : 0;
                first_output_item.m_y = axis_y;
            }
            else if (justify_content == ConstantSpaceAround) {
                axis_remain_space_height = (axis_max_height - axis_height) / input_items_size;
                first_output_item.m_y = axis_y + axis_remain_space_height / 2;
            }
            else if (justify_content == ConstantSpaceEvenly) {
                axis_remain_space_height = (axis_max_height - axis_height) / (input_items_size + 1);
                first_output_item.m_y = axis_y + axis_remain_space_height;
            }
            else if (justify_content == ConstantEnd) {
                first_output_item.m_y = axis_y + axis_max_height - axis_height;
            }
            else // m_justify_content == ConstantStart
            {
                first_output_item.m_y = axis_y;
            }

            let next_outout_item_y = first_output_item.m_y;
            for (let j = 0; j < input_items_size; j++) {
                const input_item = input_items[j];
                const output_item = output_items[j];

                output_item.m_y = next_outout_item_y;
                next_outout_item_y = output_item.m_y + output_item.m_height + axis_remain_space_height + this.m_row_gap;

                let align_self = ConstantMap[input_item.m_align_self] || ConstantNone;
                align_self = align_self == ConstantNone ? align_items : align_self;
                if (align_self == ConstantCenter) {
                    output_item.m_x = axis_x + (axis_max_width - output_item.m_width) / 2;
                }
                else if (align_self == ConstantStretch) {
                    output_item.m_x = axis_x;
                    output_item.m_width = axis_max_width;
                }
                else if (align_self == ConstantEnd) {
                    output_item.m_x = axis_x + axis_max_width - output_item.m_width;
                }
                else // align_self == ConstantStart
                {
                    output_item.m_x = axis_x;
                }

                output_item.m_x = output_item.m_x + input_item.m_margin_left;
                output_item.m_y = output_item.m_y + input_item.m_margin_top;
                output_item.m_width = output_item.m_width - input_item.m_margin_left - input_item.m_margin_right;
                output_item.m_height = output_item.m_height - input_item.m_margin_top - input_item.m_margin_bottom;
            }
        }
    }

    // 布局轴
    CalculateMultiAxis(axis_list) {
        // 获取轴数量 若为空则直接返回
        const axis_list_size = axis_list.length;
        const align_content = ConstantMap[this.m_align_content] || ConstantStart;
        const is_row_layout = this.IsRowLayout();
        let flex_layout_width = this.GetLayoutWidth();
        let flex_layout_height = this.GetLayoutHeight();

        // 轴信息计算完毕, 计算容器相关信息
        let total_axis_width = 0; // 所有轴的宽度
        let total_axis_height = 0; // 所有轴的高度
        for (let i = 0; i < axis_list_size; i++) {
            const axis = axis_list[i];
            axis.m_x = 0;
            axis.m_y = 0;
            if (is_row_layout) {
                axis.m_max_width = flex_layout_width;
                axis.m_max_height = axis.m_height;
                total_axis_width = flex_layout_width;
                total_axis_height += axis.m_max_height;
                this.m_content_width = this.m_content_width < axis.m_width ? axis.m_width : this.m_content_width;
                this.m_content_height += axis.m_height;
                this.m_content_height += i == 0 ? 0 : this.m_row_gap;
            }
            else {
                axis.m_max_width = axis.m_width;
                axis.m_max_height = flex_layout_height;
                total_axis_width += axis.m_max_width;
                total_axis_height = flex_layout_height;
                this.m_content_width += axis.m_width;
                this.m_content_height = this.m_content_height < axis.m_height ? axis.m_height : this.m_content_height;
                this.m_content_width += i == 0 ? 0 : this.m_column_gap;
            }
        }

        // 更新最大轴宽高, 避免后需坐标出现负值
        flex_layout_width = flex_layout_width < this.m_content_width ? this.m_content_width : flex_layout_width;
        flex_layout_height = flex_layout_height < this.m_content_height ? this.m_content_height : flex_layout_height;

        // 更新多轴布局
        let multi_axis_remain_space_width = 0; // 多轴扩展宽
        let multi_axis_remain_space_height = 0; // 多轴扩展高
        if (align_content == ConstantStretch || axis_list_size == 1) {
            // 多轴均分扩展空间 注意类型是否为 Int
            let local_remain_space_width = (flex_layout_width - total_axis_width) / axis_list_size;
            let local_remain_space_height = (flex_layout_height - total_axis_height) / axis_list_size;
            // 默认不缩小
            local_remain_space_width = local_remain_space_width < 0 ? 0 : local_remain_space_width;
            local_remain_space_height = local_remain_space_height < 0 ? 0 : local_remain_space_height;
            for (let i = 0; i < axis_list_size; i++) {
                const axis = axis_list[i];
                axis.m_max_width += local_remain_space_width;
                axis.m_max_height += local_remain_space_height;
            }
        }
        else if (align_content == ConstantCenter) {
            // 居中对齐
            axis_list[0].m_x = (flex_layout_width - total_axis_width) / 2;
            axis_list[0].m_y = (flex_layout_height - total_axis_height) / 2;
        }
        else if (align_content == ConstantSpaceBetween) {
            // 两端等间隔对齐
            multi_axis_remain_space_width = (flex_layout_width - total_axis_width) / (axis_list_size - 1);
            multi_axis_remain_space_height = (flex_layout_height - total_axis_height) / (axis_list_size - 1);
        }
        else if (align_content == ConstantSpaceAround) {
            // 居中等间隔对齐
            multi_axis_remain_space_width = (flex_layout_width - total_axis_width) / axis_list_size;
            multi_axis_remain_space_height = (flex_layout_height - total_axis_height) / axis_list_size;
            axis_list[0].m_x = multi_axis_remain_space_width / 2;
            axis_list[0].m_y = multi_axis_remain_space_height / 2;
        }
        else if (align_content == ConstantEnd) {
            // 尾端对齐
            axis_list[0].m_x = flex_layout_width - total_axis_width;
            axis_list[0].m_y = flex_layout_height - total_axis_height;
        }
        else // m_align_content == ConstantStart
        {
            // 首端对齐
        }

        // 更新轴坐标
        for (let i = 1; i < axis_list_size; i++) {
            const prev_axis = axis_list[i - 1];
            const axis = axis_list[i];
            if (is_row_layout) {
                axis.m_x = prev_axis.m_x + multi_axis_remain_space_width;
                axis.m_y = prev_axis.m_y + prev_axis.m_max_height + multi_axis_remain_space_height + m_row_gap;
            }
            else {
                axis.m_x = prev_axis.m_x + prev_axis.m_max_width + multi_axis_remain_space_width + m_column_gap;
                axis.m_y = prev_axis.m_y + multi_axis_remain_space_height;
            }
        }
    }

    // 轴信息
    NewAxis() {
        const axis = {};
        axis.m_x = 0;
        axis.m_y = 0;
        axis.m_width = 0;
        axis.m_height = 0;
        axis.m_max_width = 0;
        axis.m_max_height = 0;
        axis.m_total_flex_grow = 0;
        axis.m_total_flex_shrink = 0;
        axis.m_input_items = [];
        axis.m_output_items = [];
        return axis;
    }

    // 计算轴信息
    CalculateAxisList(input_items, output_items) {
        const is_wrap = this.IsWrap();
        const is_row_layout = this.IsRowLayout();
        const flex_layout_width = this.GetLayoutWidth();
        const flex_layout_height = this.GetLayoutHeight();

        const axis_list = [];
        let axis = this.NewAxis();

        for (let i = 0; i < input_items.length; ++i) {
            const input_item = input_items[i];
            const output_item = new ILayoutOutputItem();

            // 获取元素宽高
            const wrap_axis = input_item.m_wrap;
            const input_item_width = input_item.m_width < 0 ? 0 : input_item.m_width;
            const input_item_height = input_item.m_height < 0 ? 0 : input_item.m_height;
            let space_width = input_item_width + input_item.m_margin_left + input_item.m_margin_right;
            let space_height = input_item_height + input_item.m_margin_top + input_item.m_margin_bottom;

            // 初始化输出项
            output_item.m_x = 0;
            output_item.m_y = 0;
            output_item.m_width = space_width;
            output_item.m_height = space_height;
            output_item.m_userdata = input_item.m_userdata;
            output_items.push(output_item);

            if (is_row_layout) {
                space_width += axis.m_input_items.length === 0 ? 0 : this.m_column_gap;
            }
            else {
                space_height += axis.m_input_items.length === 0 ? 0 : this.m_row_gap;
            }

            // 计算是否换轴
            if (is_wrap) {
                if (is_row_layout) {
                    if ((axis.m_width + space_width) > flex_layout_width) {
                        wrap_axis = true;
                    }
                }
                else {
                    if ((axis.m_height + space_height) > flex_layout_height) {
                        wrap_axis = true;
                    }
                }
                // if (IsWrapAxis(axis, space_width, space_height))
                if (wrap_axis) {
                    axis_list.push_(axis);
                    axis = this.NewAxis();
                    // 坐标轴首个项没有间距
                    space_width = output_item.m_width;
                    space_height = output_item.m_height;
                }
            }

            // 更新行信息 行轴 宽累加高最大 行轴 宽最大高累加
            if (is_row_layout) {
                axis.m_width += space_width;
                axis.m_height = Math.max(axis.m_height, space_height);
            }
            else {
                axis.m_width = Math.max(axis.m_width, space_width);
                axis.m_height += space_height;
            }

            axis.m_total_flex_grow += input_item.m_flex_grow;
            axis.m_total_flex_shrink += input_item.m_flex_shrink;
            axis.m_input_items.push(input_item);
            axis.m_output_items.push(output_item);
        }

        // 添加最后一行
        if (axis.m_input_items.length > 0) axis_list.push(axis);

        return axis_list;
    }

    // 元素是否换轴
    IsWrapAxis(axis, space_width, space_height) {
        const is_wrap = this.IsWrap();
        const is_row_layout = this.IsRowLayout();
        const flex_layout_width = this.GetLayoutWidth();
        const flex_layout_height = this.GetLayoutHeight();

        if (is_wrap) {
            if (is_row_layout) {
                if ((axis.m_width + space_width) > flex_layout_width) {
                    return true;
                }
            }
            else {
                if ((axis.m_height + space_height) > flex_layout_height) {
                    return true;
                }
            }
        }

        return false;
    }

    // 是否换轴
    IsWrap() { return this.m_flex_wrap == "wrap"; }
    // 是否是行布局
    IsRowLayout() { return this.m_flex_direction == "row"; }
    // 是否是列布局
    IsColumnLayout() { return this.m_flex_direction == "column"; }
    // 获取布局宽
    GetLayoutWidth() { return this.m_width; }
    // 获取布局高
    GetLayoutHeight() { return this.m_height; }
}
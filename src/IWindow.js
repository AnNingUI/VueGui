import { IPainter } from "./IPainter.js";
import { IRoot } from "./IRoot.js";

class IWindow {
    constructor(window_painter) {
        // 窗口画刷
        this.m_window_painter = window_painter;

        // 窗口大小
        this.m_window_width = 0;
        this.m_window_height = 0;

        // 下一帧的刷新视口
        this.m_refresh_viewport_x = 0;
        this.m_refresh_viewport_y = 0;
        this.m_refresh_viewport_width = 0;
        this.m_refresh_viewport_height = 0;

        // 窗口根元素
        this.m_root = new IRoot(this);
    }

    // inline methods
    GetWindowWidth() { return this.m_window_width; }
    GetWindowHeight() { return this.m_window_height; }
    GetWindowPainter() { return this.m_window_painter; }
    GetRoot() { return this.m_root; }

    // virtual methods
    // 重绘需要刷新的区域
    Render() {
        const window_painter = this.GetWindowPainter();
        const root = this.GetRoot();
        if (this.m_refresh_viewport_width === 0 || this.m_refresh_viewport_height === 0) {

        } else {
            // 获取刷新视口
            const refresh_viewport_x = this.m_refresh_viewport_x;
            const refresh_viewport_y = this.m_refresh_viewport_y;
            const refresh_viewport_width = this.m_refresh_viewport_width;
            const refresh_viewport_height = this.m_refresh_viewport_height;
            // 重置刷新视口
            this.m_refresh_viewport_x = 0;
            this.m_refresh_viewport_y = 0;
            this.m_refresh_viewport_width = 0;
            this.m_refresh_viewport_height = 0;
            // 绘制元素
            window_painter.Save();
            window_painter.Clip(refresh_viewport_x, refresh_viewport_y, refresh_viewport_width, refresh_viewport_height);
            root.Render(window_painter);
            window_painter.Restore();
        }
    }

    // 刷新窗口的局部区域
    // 合并调用的所有局部区域获的刷新区域的最小包围盒， 也就是下一帧需要绘制的区域
    Refresh(x, y, width, height) {
        const window_width = this.m_window_width;
        const window_height = this.m_window_height;
        let min_x = x;
        let min_y = y;
        let max_x = x + width;
        let max_y = y + height;
        if (this.m_refresh_viewport_x === 0 && this.m_refresh_viewport_y === 0 && this.m_refresh_viewport_width === 0 && this.m_refresh_viewport_height === 0) {
            max_x = Math.min(max_x, window_width);
            max_y = Math.min(max_y, window_height);
            min_x = Math.max(min_x, 0);
            min_y = Math.max(min_y, 0);
        } else {
            const min_refresh_x = this.m_refresh_viewport_x;
            const min_refresh_y = this.m_refresh_viewport_y;
            const max_refresh_x = this.m_refresh_viewport_x + this.m_refresh_viewport_width;
            const max_refresh_y = this.m_refresh_viewport_y + this.m_refresh_viewport_height;
            max_x = Math.min(Math.max(max_x, max_refresh_x), window_width);
            max_y = Math.min(Math.max(max_y, max_refresh_y), window_height);
            min_x = Math.max(Math.min(min_x, min_refresh_x), 0);
            min_y = Math.max(Math.min(min_y, min_refresh_y), 0);
        }
        this.m_refresh_viewport_x = min_x;
        this.m_refresh_viewport_y = min_y;
        this.m_refresh_viewport_width = max_x - min_x;
        this.m_refresh_viewport_height = max_y - min_y;
    }

    // 窗口大小更新
    OnSize(width, height) {
        if (this.m_window_width == width || this.m_window_height == height) {
            return;
        }
        // 保存窗口大小
        this.m_window_width = width;
        this.m_window_height = height;
        // 设置刷新视口
        this.m_refresh_viewport_x = 0;
        this.m_refresh_viewport_y = 0;
        this.m_refresh_viewport_width = this.m_window_width;
        this.m_refresh_viewport_height = this.m_window_height;
        // 标记布局更新
        this.GetRoot().SetLayoutChanged(true);
    }

    OnMouseDown(x, y, button) {
        // button: 0 - left, 1 - middle, 2 - right
    }

    OnMouseMove(x, y) {
        // 处理鼠标移动事件
    }

    OnMouseUp(x, y, button) {
        // button: 0 - left, 1 - middle, 2 - right
    }

    OnMouseWheel(delta) {
        // delta: positive - scroll up, negative - scroll down
    }

    OnKeyDown(key) {
        // key: e.g., 'a', 'Enter', 'ArrowUp', etc.
    }

    OnKeyUp(key) {
        // key: e.g., 'a', 'Enter', 'ArrowUp', etc.
    }

    // 加载字体
    async LoadFont(font_name, font_url) {
       try {
            // 创建 FontFace 对象
            const font = new FontFace(font_name, `url(${font_url})`);
            
            // 将字体添加到文档字体集合中
            document.fonts.add(font);
            
            // 等待字体加载完成
            await font.load();
            
            console.log(`Font ${font_name} loaded successfully.`);
            return font; // 返回字体对象，便于后续使用
        } catch (error) {
            console.error(`Failed to load font ${font_name}:`, error);
            throw error; // 重新抛出错误，让调用者可以处理
        }
    }
}

class CanvasWindow extends IWindow {
    constructor(canvas) {
        super(new IPainter(canvas.getContext('2d')));
        this.m_canvas = canvas;

        this.OnSize(canvas.width, canvas.height);
        canvas.addEventListener('resize', (e) => {
            this.OnSize(canvas.width, canvas.height);
        });
        canvas.addEventListener('mousedown', (e) => {
            this.OnMouseDown(e.offsetX, e.offsetY, e.button);
        });
        canvas.addEventListener('mousemove', (e) => {
            this.OnMouseMove(e.offsetX, e.offsetY);
        });
        canvas.addEventListener('mouseup', (e) => {
            this.OnMouseUp(e.offsetX, e.offsetY, e.button);
        });
        canvas.addEventListener('wheel', (e) => {
            this.OnMouseWheel(e.deltaY);
        });
        canvas.addEventListener('keydown', (e) => {
            this.OnKeyDown(e.key);
        });
        canvas.addEventListener('keyup', (e) => {
            this.OnKeyUp(e.key);
        });
    }
}

export { IWindow, CanvasWindow };
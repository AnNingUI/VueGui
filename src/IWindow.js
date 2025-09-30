import IPainter from "./IPainter.js";

class IWindow {
    constructor(window_painter) {
        this.m_window_painter = window_painter;
        this.m_window_width = 0;
        this.m_window_height = 0;
        this.m_refresh_viewport_x = 0;
        this.m_refresh_viewport_y = 0;
        this.m_refresh_viewport_width = 0;
        this.m_refresh_viewport_height = 0;
    }

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
            max_x = Math.min(max_x, max_refresh_x, window_width);
            max_y = Math.min(max_y, max_refresh_y, window_height);
            min_x = Math.max(min_x, min_refresh_x, 0);
            min_y = Math.max(min_y, min_refresh_y, 0);
        }
        this.m_refresh_viewport_x = min_x;
        this.m_refresh_viewport_y = min_y;
        this.m_refresh_viewport_width = Math.max(0, max_x - min_x);
        this.m_refresh_viewport_height = Math.max(0, max_y - min_y);
    }

    OnResize(width, height) {
        this.m_window_width = width;
        this.m_window_height = height;
        this.m_refresh_viewport_x = 0;
        this.m_refresh_viewport_y = 0;
        this.m_refresh_viewport_width = this.m_window_width;
        this.m_refresh_viewport_height = this.m_window_height;
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
}

class CanvasWindow extends IWindow {
    constructor(canvas) {
        super(new IPainter(canvas.getContext('2d')));
        this.m_canvas = canvas;
        this.m_window_width = canvas.width;
        this.m_window_height = canvas.height;

        canvas.addEventListener('resize', (e) => {
            this.OnResize(canvas.width, canvas.height);
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
        window.addEventListener('keydown', (e) => {
            this.OnKeyDown(e.key);
        });
        window.addEventListener('keyup', (e) => {
            this.OnKeyUp(e.key);
        });
    }
}

export { IWindow, CanvasWindow };
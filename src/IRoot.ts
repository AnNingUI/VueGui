import { IElement } from "./IElement.ts";
import type { IWindow } from "./IWindow.ts";
import type { IEvent } from "./IEvent.ts";

class IRoot extends IElement {
    private m_focused_element: IElement | null = null;

    constructor(window: IWindow) {
        super();
        this.SetWindow(window);
        this.SetRoot(this);
        this.SetTagName("Root");
        this.SetBackgroundColor('white');
        // this.SetBackgroundColor('red');
        // this.SetBackgroundColor('green');
    }

    /**
     * 设置焦点元素
     */
    SetFocusedElement(element: IElement | null): void {
        if (this.m_focused_element === element) return;

        // 让旧元素失去焦点
        if (this.m_focused_element && typeof (this.m_focused_element as any).Blur === 'function') {
            (this.m_focused_element as any).Blur();
        }

        this.m_focused_element = element;
    }

    /**
     * 获取焦点元素
     */
    GetFocusedElement(): IElement | null {
        return this.m_focused_element;
    }

    /**
     * 重写 DispatchEvent 以支持键盘事件派发到焦点元素
     */
    DispatchEvent(event: IEvent): boolean {
        const type = event.GetType();

        // 键盘事件派发到焦点元素
        if (type === 'keydown' || type === 'keyup' || type === 'keypress') {
            if (this.m_focused_element) {
                return this.m_focused_element.DispatchEvent(event);
            }
        }

        // 其他事件使用父类的派发逻辑
        return super.DispatchEvent(event);
    }

    UpdateLayout(): void {
        const window_width = this.GetWindowWidth();
        const window_height = this.GetWindowHeight();

        this.SetLayoutChanged(false);
        this.SetLocalX(0);
        this.SetLocalY(0);
        this.SetLocalWidth(window_width);
        this.SetLocalHeight(window_height);

        const childrens = this.GetChildrens();
        for (let i = 0; i < childrens.length; i++) {
            const children = childrens[i];
            if (children && children.IsVisible()) {
                children.SetLocalX(-1);
                children.SetLocalY(-1);
                children.SetLocalWidth(-1);
                children.SetLocalHeight(-1);
                children.UpdateLayout();
            }
        }
    }

    UpdatePosition(): void {
        const window_width = this.GetWindowWidth();
        const window_height = this.GetWindowHeight();

        this.SetPositionChanged(false);
        this.SetX(0);
        this.SetY(0);
        this.SetWidth(window_width);
        this.SetHeight(window_height);

        const viewport_x = 0;
        const viewport_y = 0;
        const viewport_width = window_width;
        const viewport_height = window_height;
        this.SetViewPortX(viewport_x);
        this.SetViewPortY(viewport_y);
        this.SetViewPortWidth(viewport_width);
        this.SetViewPortHeight(viewport_height);
        this.SetContentViewPortX(viewport_x);
        this.SetContentViewPortY(viewport_y);
        this.SetContentViewPortWidth(viewport_width);
        this.SetContentViewPortHeight(viewport_height);

        if (viewport_width > 0 && viewport_height > 0) {
            const childrens = this.GetChildrens();
            const childrens_size = childrens.length;
            for (let i = 0; i < childrens_size; i++) {
                const children = childrens[i];
                if (children && children.IsVisible()) {
                    children.UpdatePosition();
                }
            }
        }
    }
}

export { IRoot };
import { IElement } from "./IElement.js";

class IRoot extends IElement {
    constructor(window) {
        super();
        this.SetWindow(window);
        this.SetRoot(this);
        this.SetTagName("Root");
        // this.SetBackgroundColor('white');
        this.SetBackgroundColor('red');
        // this.SetBackgroundColor('green');
    }

    UpdateLayout() {
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
            if (children.IsVisible()) {
                children.SetLocalX(-1);
                children.SetLocalY(-1);
                children.SetLocalWidth(-1);
                children.SetLocalHeight(-1);
                children.UpdateLayout();
            }
        }
    }

    UpdatePosition() {
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
                if (children.IsVisible()) {
                    children.UpdatePosition();
                }
            }
        }
    }
}

export { IRoot };
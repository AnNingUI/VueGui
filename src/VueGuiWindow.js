
import { createRenderer } from "vue"
import { CanvasWindow } from "./IWindow.js";
import { IElement } from "./IElement.js";

class TextNode {
    constructor(text) {
        this.m_text = text;
    }
}

class IComment extends IElement {
    constructor(text) {
        super();
        this.m_text = text;
        this.SetTagName("Comment");
    }
}

class VueGuiWindow extends CanvasWindow {
    constructor(canvas, vue_app_creator) {
        super(canvas);

        const { createApp } = createRenderer(this.GetVueRendererOptions()); // 创建自定义App
        this.m_vue_app = vue_app_creator(createApp);
        this.m_vue_app.config.compilerOptions.isCustomElement = (tag) => true; // 所有元素均为定制元素
        this.m_vue_app.mount(this.GetRoot());
    }

    GetVueRendererOptions() {
        const root = this.GetRoot();
        return {
            patchProp: (el, key, prevValue, nextValue, namespace, parentComponent) => {
                el.InsertAttribute(key, nextValue);
            },

            insert: (child, parent, anchor) => {
                if (child instanceof TextNode) {
                    parent.SetText(child.text);
                } else {
                    parent.InsertChildren(child, anchor || null);
                }
            },

            remove: child => {
                const parent = child.GetParent()
                if (parent) {
                    parent.RemoveChildren(child)
                }
            },

            createElement: (tag, namespace, is, props) => {
                let el = undefined;
                if (tag == "JsButton") {

                } else {
                    el = new IElement();
                }
                el.SetTagName(tag);
                el.SetWindow(this);
                el.SetRoot(root);
                return el;
            },

            createText: text => {
                return new TextNode(text);
            },

            createComment: text => {
                return new IComment(text);
            },

            setText: (node, text) => {
            },

            setElementText: (el, text) => {
            },

            parentNode: node => {
                return node.GetParent();
            },

            nextSibling: node => {
                const parent = node.GetParent();
                const childrens = parent.GetChildrens();
                const childrens_size = childrens.length - 1;
                for (let i = 0; i < childrens_size; i++) {
                    if (childrens[i] == node) {
                        return childrens[i + 1];
                    }
                }
            },
        }
    }
}

export { VueGuiWindow }
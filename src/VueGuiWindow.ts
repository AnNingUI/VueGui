import { createRenderer, App } from "vue";
import { CreateCustomElement } from "./CustomElement.ts";
import { IElement } from "./IElement.ts";
import { CanvasWindow } from "./IWindow.ts";
import { VueEventAdapter } from "./VueEventAdapter.ts";

import IconFontTTF from "./font/iconfont.ttf";

class TextNode {
    m_text: string;

    constructor(text: string) {
        this.m_text = text;
    }

    get text(): string {
        return this.m_text;
    }
}

class IComment extends IElement {
    constructor(text: string) {
        super();
        this.m_text = text;
        this.SetTagName("Comment");
    }
}

class VueGuiWindow extends CanvasWindow {
    private m_vue_app?: App;
    private m_event_adapter?: VueEventAdapter;

    constructor(canvas: HTMLCanvasElement, vue_app_creator: (createApp: any) => App) {
        super(canvas);

        this.LoadFont("iconfont", IconFontTTF).then(() => {
            const { createApp } = createRenderer(this.GetVueRendererOptions());
            this.m_vue_app = vue_app_creator(createApp);
            this.m_vue_app.config.compilerOptions.isCustomElement = (tag: string) => true;
            this.m_vue_app.mount(this.GetRoot()!);

            // 初始化事件适配器
            this.m_event_adapter = new VueEventAdapter(this.GetRoot());
            this.m_event_adapter.AttachToCanvas(canvas);
        });
    }

    // W
    get innerWidth(): number {
        return this.GetWindowWidth();
    }

    // H
    get innerHeight(): number {
        return this.GetWindowHeight();
    }

    GetVueRendererOptions(): any {
        const root = this.GetRoot();
        return {
            patchProp: (el: IElement, key: string, prevValue: any, nextValue: any, namespace?: any, parentComponent?: any) => {
                // 处理 Vue 事件监听器 (onClick, onInput, etc.)
                if (key.startsWith('on') && key.length > 2) {
                    const eventName = key.slice(2).toLowerCase(); // onClick -> click

                    // 移除旧的监听器
                    if (prevValue && typeof prevValue === 'function') {
                        el.RemoveEventListener(eventName, prevValue);
                    }

                    // 添加新的监听器
                    if (nextValue && typeof nextValue === 'function') {
                        el.AddEventListener(eventName, nextValue);
                    }
                } else {
                    // 普通属性处理
                    el.InsertAttribute(key, nextValue);
                }
            },

            insert: (child: TextNode | IElement, parent: IElement, anchor?: IElement | null) => {
                if (child instanceof TextNode) {
                    parent.SetText(child.text);
                } else {
                    parent.InsertChildren(child, anchor || null);
                }
            },

            remove: (child: IElement) => {
                const parent = child.GetParent();
                if (parent) {
                    parent.DeleteChildren(child);
                }
            },

            createElement: (tag: string, namespace?: any, is?: any, props?: any) => {
                tag = tag.toLowerCase();

                let el = CreateCustomElement(tag);
                if (!el) {
                    el = new IElement();
                }
                el.SetTagName(tag);
                el.SetWindow(this);
                if (root) {
                    el.SetRoot(root);
                }
                return el;
            },

            createText: (text: string) => {
                return new TextNode(text);
            },

            createComment: (text: string) => {
                return new IComment(text);
            },

            setText: (node: TextNode, text: string) => {
                node.m_text = text;
            },

            setElementText: (el: IElement, text: string) => {
                el.SetText(text);
            },

            parentNode: (node: IElement) => {
                return node.GetParent();
            },

            nextSibling: (node: IElement) => {
                const parent = node.GetParent();
                if (!parent) return null;

                const childrens = parent.GetChildrens();
                const childrens_size = childrens.length - 1;
                for (let i = 0; i < childrens_size; i++) {
                    if (childrens[i] === node) {
                        return childrens[i + 1] || null;
                    }
                }
                return null;
            },
        };
    }
}

export { VueGuiWindow };
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

export const VueRendererOptions = {
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

    setScopeId: (el, id) => {
    },
};


/*
Vue RendererOptions 接口详解
概述
RendererOptions 接口定义了 Vue 渲染器与宿主环境交互的核心方法，使 Vue 能够适配不同平台（DOM、Canvas、Native 等）。

方法详解:

1. patchProp()
作用：处理元素属性的创建、更新和删除

负责设置、更新或删除 DOM 属性、事件监听器、类、样式等

通过比较 prevValue 和 nextValue 决定如何更新属性

支持命名空间处理，对 SVG 等特殊元素很重要

2. insert()
作用：将节点插入到父节点的指定位置

控制节点的插入位置，可以通过 anchor 参数指定插入位置

用于初始挂载和动态插入新节点

3. remove()
作用：从父节点中移除指定节点

处理节点的卸载和删除操作

在组件销毁或 v-if/v-for 等指令导致节点移除时调用

4. createElement()
作用：创建指定类型的元素节点

根据类型创建对应的宿主环境元素（如 DOM 元素）

支持命名空间（如 SVG、MathML）

支持自定义内置元素（isCustomizedBuiltIn）

5. createText()
作用：创建文本节点

创建纯文本节点，用于插值表达式和文本内容

6. createComment()
作用：创建注释节点

用于 Vue 内部的占位符和调试信息

在模板编译和 SSR 中起重要作用

7. setText()
作用：设置文本节点的内容

更新已有文本节点的内容

比直接替换节点更高效

8. setElementText()
作用：设置元素节点的文本内容

直接设置元素的 textContent

用于 v-text 指令和文本插值

9. parentNode()
作用：获取指定节点的父节点

用于节点遍历和操作

在组件卸载和节点操作时很重要

10. nextSibling()
作用：获取指定节点的下一个兄弟节点

用于节点遍历和定位

在 diff 算法和节点操作中起关键作用

11. querySelector() [可选]
作用：根据选择器查询元素

用于查找特定元素（如 teleport 目标）

在某些渲染环境中可能不可用

12. setScopeId() [可选]
作用：为元素设置作用域 ID

用于 scoped CSS 功能

将唯一标识添加到元素属性中

13. cloneNode() [可选]
作用：克隆节点

用于优化静态内容渲染

在 SSR hydration 中很重要

14. insertStaticContent() [可选]
作用：插入静态内容

优化静态内容的渲染性能

避免对不变的内容进行不必要的 diff 操作

总结
RendererOptions 接口提供了 Vue 与宿主环境交互的完整契约，使 Vue 能够适配各种渲染目标。每个方法都承担着特定的职责，共同构成了 Vue 的渲染系统基础。

*/
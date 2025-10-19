
// 导入窗口类
import { VueGuiWindow } from "./src/VueGuiWindow.ts";
import App  from "./app/test/App.vue";

// 获取画布
const canvas = document.getElementById('window') as HTMLCanvasElement;
// 创建VueGuiWindow窗口
const vue_gui_window = new VueGuiWindow(canvas, (createApp) => createApp(App));

window.addEventListener('resize', () => {
    vue_gui_window.Refresh();
});

// 动画帧渲染
const frame_request_callback = () => {
    vue_gui_window.Render();
    requestAnimationFrame(frame_request_callback);
}
frame_request_callback();

(window as any).vue_gui_window = vue_gui_window;
console.log(vue_gui_window)

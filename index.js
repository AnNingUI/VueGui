
// 导入窗口类
import { VueGuiWindow } from "./src/VueGuiWindow.js";
// 导入App根组件
import App from "./app/test/App.js"
// 获取画布
const canvas = document.getElementById('window');
// 创建VueGuiWindow窗口
const vue_gui_window = new VueGuiWindow(canvas, (createApp) => createApp(App));

// 动画帧渲染
const frame_request_callback = () => {
    vue_gui_window.Render();
    requestAnimationFrame(frame_request_callback);
}
frame_request_callback();

window.vue_gui_window = vue_gui_window;
console.log(vue_gui_window)
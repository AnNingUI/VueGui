
import IWindowPainter from "./src/IPainter.js";
import { CanvasWindow } from "./src/IWindow.js";
const canvas = document.getElementById('window');
// const ctx = canvas.getContext('2d');
// const window_painter = new IWindowPainter(ctx);
// window_painter.Test();

const canvas_window = new CanvasWindow(canvas);


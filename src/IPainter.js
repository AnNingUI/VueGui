
// IPainter.js 
// canvas 是与窗口非常类似的一个元素
// 因为其具备交互与绘制能力， 交互主要是指鼠标与键盘事件
// 要实现GUI框架， 绘制类是不可或缺的
// 当前文件定义绘制类，实现常用的绘制接口，主要有：
// 绘制线条、三角形、矩形、圆角矩形、圆弧、扇形、多边形和文本等
// 填充三角形、矩形、圆角矩形、圆弧、扇形、多边形和文本等
// 裁剪，保存和恢复绘制状态
// 平移、旋转和缩放等变换操作
// 测量文本宽度

// 该类依赖于HTML5的CanvasRenderingContext2D对象
// 该对象提供了丰富的2D绘制功能
// 通过封装这些功能， 提供一个统一的绘制接口
// 方便在不同的窗口中使用

class IPainter {
    constructor(rendering_context_2d) {
        this.m_rendering_context_2d = rendering_context_2d; // CanvasRenderingContext2D 具体绘制上下文
    }

    // 获取2D绘制上下文
    GetRenderingContext2D() {
        return this.m_rendering_context_2d;
    }

    // 绘制线条
    StrokeLine(x1, y1, x2, y2, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // 绘制三角形
    StrokeTriangle(x1, y1, x2, y2, x3, y3, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制矩形
    StrokeRectangle(x, y, width, height, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.strokeRect(x, y, width, height);
    }

    // 绘制圆角矩形
    StrokeRoundRectangle(x, y, width, height, radius, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制圆弧
    StrokeArc(x, y, radius, start_angle, end_angle, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.stroke();
    }

    // 绘制扇形
    StrokeSector(x, y, radius, start_angle, end_angle, color, line_width) {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制多边形
    StrokePolygon(points, color, line_width) {
        if (points.length < 2) return;
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制文本
    StrokeText(text, x, y, font, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.strokeText(text, x, y);
    }

    // 填充三角形
    FillTriangle(x1, y1, x2, y2, x3, y3, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
    }

    // 填充矩形
    FillRectangle(x, y, width, height, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    // 填充圆角矩形
    FillRoundRectangle(x, y, width, height, radius, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    // 填充圆弧
    FillArc(x, y, radius, start_angle, end_angle, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.closePath();
        ctx.fill();
    }

    // 填充扇形
    FillSector(x, y, radius, start_angle, end_angle, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.closePath();
        ctx.fill();
    }

    // 填充多边形
    FillPolygon(points, color) {
        if (points.length < 2) return;
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }

    // 填充文本
    FillText(text, x, y, font, color) {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    // 测量文本宽度
    MeasureText(text, font) {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        return ctx.measureText(text);
    }

    // 保存当前状态
    Save() {
        const ctx = this.GetRenderingContext2D();
        ctx.save();
    }

    // 裁剪区域
    Clip(x, y, width, height) {
        const ctx = this.GetRenderingContext2D();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
    }

    // 恢复之前保存的状态
    Restore() {
        const ctx = this.GetRenderingContext2D();
        ctx.restore();
    }

    // 平移
    Translation(x, y) {
        const ctx = this.GetRenderingContext2D();
        ctx.translate(x, y);
    }

    // 旋转
    Rotate(angle) {
        const ctx = this.GetRenderingContext2D();
        ctx.rotate(angle * Math.PI / 180);
    }

    // 缩放
    Scale(sx, sy) {
        const ctx = this.GetRenderingContext2D();
        ctx.scale(sx, sy);
    }

    Test() {
        // 测试直线
        this.StrokeLine(10, 10, 200, 10, 'red', 2);
        // 测试矩形
        this.StrokeRectangle(10, 20, 100, 50, 'blue', 2);
        this.FillRectangle(120, 20, 100, 50, 'lightblue');
        // 测试圆角矩形
        this.StrokeRoundRectangle(10, 80, 100, 50, 10, 'green', 2);
        this.FillRoundRectangle(120, 80, 100, 50, 10, 'lightgreen');
        // 测试圆弧
        this.StrokeArc(60, 170, 30, 0, 150, 'purple', 2);
        this.FillArc(160, 170, 30, 0, 150, 'plum');
        // 测试扇形
        this.StrokeSector(60, 250, 30, 0, 150, 'orange', 2);
        this.FillSector(160, 250, 30, 0, 150, 'peachpuff');
        // 测试三角形
        this.StrokeTriangle(10, 300, 60, 350, 10, 350, 'brown', 2);
        this.FillTriangle(120, 300, 170, 350, 120, 350, 'burlywood');
        // 测试多边形
        this.StrokePolygon([{ x: 10, y: 400 }, { x: 60, y: 450 }, { x: 40, y: 500 }, { x: 20, y: 450 }], 'cyan', 2);
        this.FillPolygon([{ x: 120, y: 400 }, { x: 170, y: 450 }, { x: 150, y: 500 }, { x: 130, y: 450 }], 'lightcyan');
        // 测试文本
        this.StrokeText('Hello, Stroke Text!', 10, 550, '50px Arial', 'black');
        this.FillText('Hello, Fill Text!', 10, 600, '50px Arial', 'gray');

        console.log(this.MeasureText('Hello, Measure Text!', '20px Arial'));
    }
}

export { IPainter };// 该接口定义了各种绘制方法，如绘制线条、矩形、圆角矩形、圆弧、扇形、多边形和文本等
// 每个方法都接受相应的参数，如位置、尺寸、颜色和线宽等
// 这些方法使用CanvasRenderingContext2D对象进行实际的绘制操作
// 通过实现该接口，可以为不同的窗口提供自定义的绘制逻辑
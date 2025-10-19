import type { IElement } from "./IElement.ts";
import type { Point } from "./types.ts";

class IPainter {
    private m_rendering_context_2d: CanvasRenderingContext2D;

    constructor(rendering_context_2d: CanvasRenderingContext2D) {
        this.m_rendering_context_2d = rendering_context_2d;
    }

    // 获取2D绘制上下文
    GetRenderingContext2D(): CanvasRenderingContext2D {
        return this.m_rendering_context_2d;
    }

    // 绘制线条
    StrokeLine(x1: number, y1: number, x2: number, y2: number, color: string, line_width: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // 绘制三角形
    StrokeTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string, line_width: number): void {
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
    StrokeRectangle(x: number, y: number, width: number, height: number, color: string, line_width: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.strokeRect(x, y, width, height);
    }

    // 绘制圆角矩形
    StrokeRoundRectangle(x: number, y: number, width: number, height: number, radius: number, color: string, line_width: number): void {
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
    StrokeArc(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string, line_width: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.stroke();
    }

    // 绘制扇形
    StrokeSector(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string, line_width: number): void {
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
    StrokePolygon(points: Point[], color: string, line_width: number): void {
        if (points.length < 2) return;
        const ctx = this.GetRenderingContext2D();
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        const firstPoint = points[0];
        if (firstPoint) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                if (point) {
                    ctx.lineTo(point.x, point.y);
                }
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    // 绘制文本
    StrokeText(text: string, x: number, y: number, font: string, color: string): void {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.strokeText(text, x, y);
    }

    // 填充三角形
    FillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string): void {
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
    FillRectangle(x: number, y: number, width: number, height: number, color: string): void {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    // 填充圆角矩形
    FillRoundRectangle(x: number, y: number, width: number, height: number, radius: number, color: string): void {
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
    FillArc(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string): void {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.closePath();
        ctx.fill();
    }

    // 填充扇形
    FillSector(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string): void {
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, start_angle * Math.PI / 180, end_angle * Math.PI / 180);
        ctx.closePath();
        ctx.fill();
    }

    // 填充多边形
    FillPolygon(points: Point[], color: string): void {
        if (points.length < 2) return;
        const ctx = this.GetRenderingContext2D();
        ctx.fillStyle = color;
        ctx.beginPath();
        const firstPoint = points[0];
        if (firstPoint) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                if (point) {
                    ctx.lineTo(point.x, point.y);
                }
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    // 填充文本
    FillText(text: string, x: number, y: number, font: string, color: string): void {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        const measure = ctx.measureText(text);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y + measure.fontBoundingBoxAscent);
    }

    // 测量文本宽度
    MeasureText(text: string, font: string): TextMetrics {
        const ctx = this.GetRenderingContext2D();
        ctx.font = font;
        return ctx.measureText(text);
    }

    // 保存当前状态
    Save(): void {
        const ctx = this.GetRenderingContext2D();
        ctx.save();
    }

    // 裁剪区域
    Clip(x: number, y: number, width: number, height: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
    }

    // 恢复之前保存的状态
    Restore(): void {
        const ctx = this.GetRenderingContext2D();
        ctx.restore();
    }

    // 平移
    Translation(x: number, y: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.translate(x, y);
    }

    // 旋转
    Rotate(angle: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.rotate(angle * Math.PI / 180);
    }

    // 缩放
    Scale(sx: number, sy: number): void {
        const ctx = this.GetRenderingContext2D();
        ctx.scale(sx, sy);
    }

    Test(): void {
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

export { IPainter };

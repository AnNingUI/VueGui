// 核心类型定义文件

// ==================== 点类型 ====================
export interface Point {
  x: number;
  y: number;
}

// ==================== IPainter 类型 ====================
export interface IPainterInterface {
  GetRenderingContext2D(): CanvasRenderingContext2D;

  // 绘制方法
  StrokeLine(x1: number, y1: number, x2: number, y2: number, color: string, line_width: number): void;
  StrokeTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string, line_width: number): void;
  StrokeRectangle(x: number, y: number, width: number, height: number, color: string, line_width: number): void;
  StrokeRoundRectangle(x: number, y: number, width: number, height: number, radius: number, color: string, line_width: number): void;
  StrokeArc(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string, line_width: number): void;
  StrokeSector(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string, line_width: number): void;
  StrokePolygon(points: Point[], color: string, line_width: number): void;
  StrokeText(text: string, x: number, y: number, font: string, color: string): void;

  // 填充方法
  FillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string): void;
  FillRectangle(x: number, y: number, width: number, height: number, color: string): void;
  FillRoundRectangle(x: number, y: number, width: number, height: number, radius: number, color: string): void;
  FillArc(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string): void;
  FillSector(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string): void;
  FillPolygon(points: Point[], color: string): void;
  FillText(text: string, x: number, y: number, font: string, color: string): void;

  // 工具方法
  Clip(x: number, y: number, width: number, height: number): void;
  Save(): void;
  Restore(): void;
  Translate(x: number, y: number): void;
  Rotate(angle: number): void;
  Scale(x: number, y: number): void;
  MeasureText(text: string, font: string): number;
}

// ==================== IWindow 类型 ====================
export interface IWindowInterface {
  GetCanvas(): HTMLCanvasElement;
  GetWindowWidth(): number;
  GetWindowHeight(): number;
  GetWindowPainter(): IPainterInterface;
  Render(): void;
  Refresh(x?: number, y?: number, width?: number, height?: number): void;
}

// ==================== IElement 属性集合类型 ====================
export type AttributeValue = string | number | boolean | object | null | undefined;
export type Attributes = Record<string, AttributeValue>;

// ==================== IStyleItem 类型 ====================
export interface IStyleItemInterface {
  IsPixelValue(): boolean;
  IsColorValue(): boolean;
  IsStringValue(): boolean;
  IsIntegerValue(): boolean;
  IsNumberValue(): boolean;
  IsPercentageValue(): boolean;
  IsNoneValue(): boolean;
  IsAutoValue(): boolean;
  IsLengthValue(): boolean;

  GetPixelValue(default_value?: number): number;
  GetColorValue(default_value?: string): string;
  GetStringValue(default_value?: string): string;
  GetIntegerValue(default_value?: number): number;
  GetNumberValue(default_value?: number): number;
  GetPercentageValue(default_value?: number): number;
  GetDimensionValue(base_value: number, default_value?: number): number;
  GetRawValue(): any;
  GetCSSValue(): string;
}

// ==================== Setter/Getter 类型 ====================
export type AttributeSetter = (value: any) => void;
export type AttributeGetter = () => any;

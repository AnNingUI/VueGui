import type { IElement } from "./IElement.ts";

// ========== 事件类型定义 ==========

export enum EventType {
	// 鼠标事件
	MOUSE_MOVE = "mousemove",
	MOUSE_DOWN = "mousedown",
	MOUSE_UP = "mouseup",
	MOUSE_ENTER = "mouseenter",
	MOUSE_LEAVE = "mouseleave",
	MOUSE_OVER = "mouseover",
	MOUSE_OUT = "mouseout",
	CLICK = "click",
	DOUBLE_CLICK = "dblclick",
	CONTEXT_MENU = "contextmenu",
	WHEEL = "wheel",

	// 键盘事件
	KEY_DOWN = "keydown",
	KEY_UP = "keyup",
	KEY_PRESS = "keypress",

	// 触摸事件
	TOUCH_START = "touchstart",
	TOUCH_MOVE = "touchmove",
	TOUCH_END = "touchend",
	TOUCH_CANCEL = "touchcancel",

	// 焦点事件
	FOCUS = "focus",
	BLUR = "blur",
	FOCUS_IN = "focusin",
	FOCUS_OUT = "focusout",

	// 输入事件
	INPUT = "input",
	CHANGE = "change",
	SUBMIT = "submit",

	// 拖拽事件
	DRAG_START = "dragstart",
	DRAG = "drag",
	DRAG_END = "dragend",
	DRAG_ENTER = "dragenter",
	DRAG_OVER = "dragover",
	DRAG_LEAVE = "dragleave",
	DROP = "drop",

	// 滚动事件
	SCROLL = "scroll",

	// 自定义事件
	CUSTOM = "custom",
}

export enum EventPhase {
	NONE = 0,
	CAPTURING_PHASE = 1, // 捕获阶段
	AT_TARGET = 2, // 目标阶段
	BUBBLING_PHASE = 3, // 冒泡阶段
}

// ========== 基础事件类 ==========

export class IEvent {
	protected m_type!: string;
	protected m_target!: IElement | null;
	protected m_current_target!: IElement | null;
	protected m_timestamp!: number;
	protected m_phase!: EventPhase;
	protected m_bubbles!: boolean;
	protected m_cancelable!: boolean;
	protected m_default_prevented!: boolean;
	protected m_propagation_stopped!: boolean;
	protected m_immediate_propagation_stopped!: boolean;
	protected m_data?: any; // 自定义数据

	constructor(type: string, options?: EventOptions) {
		this.m_type = type;
		this.m_target = null;
		this.m_current_target = null;
		this.m_timestamp = Date.now();
		this.m_phase = EventPhase.NONE;
		this.m_bubbles = options?.bubbles ?? true;
		this.m_cancelable = options?.cancelable ?? true;
		this.m_default_prevented = false;
		this.m_propagation_stopped = false;
		this.m_immediate_propagation_stopped = false;
		this.m_data = options?.data;
	}

	GetType(): string {
		return this.m_type;
	}

	GetTarget(): IElement | null {
		return this.m_target;
	}

	SetTarget(target: IElement | null): void {
		this.m_target = target;
	}

	GetCurrentTarget(): IElement | null {
		return this.m_current_target;
	}

	SetCurrentTarget(target: IElement | null): void {
		this.m_current_target = target;
	}

	GetTimestamp(): number {
		return this.m_timestamp;
	}

	GetPhase(): EventPhase {
		return this.m_phase;
	}

	SetPhase(phase: EventPhase): void {
		this.m_phase = phase;
	}

	IsBubbles(): boolean {
		return this.m_bubbles;
	}

	IsCancelable(): boolean {
		return this.m_cancelable;
	}

	IsDefaultPrevented(): boolean {
		return this.m_default_prevented;
	}

	PreventDefault(): void {
		if (this.m_cancelable) {
			this.m_default_prevented = true;
		}
	}

	StopPropagation(): void {
		this.m_propagation_stopped = true;
	}

	StopImmediatePropagation(): void {
		this.m_propagation_stopped = true;
		this.m_immediate_propagation_stopped = true;
	}

	IsPropagationStopped(): boolean {
		return this.m_propagation_stopped;
	}

	IsImmediatePropagationStopped(): boolean {
		return this.m_immediate_propagation_stopped;
	}

	GetData(): any {
		return this.m_data;
	}

	SetData(data: any): void {
		this.m_data = data;
	}
}

// ========== 鼠标事件 ==========

export class IMouseEvent extends IEvent {
	protected m_x!: number; // 相对于视口的 X 坐标
	protected m_y!: number; // 相对于视口的 Y 坐标
	protected m_client_x!: number; // 相对于浏览器窗口的 X 坐标
	protected m_client_y!: number; // 相对于浏览器窗口的 Y 坐标
	protected m_screen_x!: number; // 相对于屏幕的 X 坐标
	protected m_screen_y!: number; // 相对于屏幕的 Y 坐标
	protected m_offset_x!: number; // 相对于目标元素的 X 坐标
	protected m_offset_y!: number; // 相对于目标元素的 Y 坐标
	protected m_button!: number; // 按下的鼠标按钮 (0=左, 1=中, 2=右)
	protected m_buttons!: number; // 按下的所有按钮的位掩码
	protected m_ctrl_key!: boolean;
	protected m_shift_key!: boolean;
	protected m_alt_key!: boolean;
	protected m_meta_key!: boolean;

	constructor(type: string, options?: MouseEventOptions) {
		super(type, options);
		this.m_x = options?.x ?? 0;
		this.m_y = options?.y ?? 0;
		this.m_client_x = options?.clientX ?? this.m_x;
		this.m_client_y = options?.clientY ?? this.m_y;
		this.m_screen_x = options?.screenX ?? this.m_x;
		this.m_screen_y = options?.screenY ?? this.m_y;
		this.m_offset_x = options?.offsetX ?? 0;
		this.m_offset_y = options?.offsetY ?? 0;
		this.m_button = options?.button ?? 0;
		this.m_buttons = options?.buttons ?? 0;
		this.m_ctrl_key = options?.ctrlKey ?? false;
		this.m_shift_key = options?.shiftKey ?? false;
		this.m_alt_key = options?.altKey ?? false;
		this.m_meta_key = options?.metaKey ?? false;
	}

	GetX(): number {
		return this.m_x;
	}
	GetY(): number {
		return this.m_y;
	}
	GetClientX(): number {
		return this.m_client_x;
	}
	GetClientY(): number {
		return this.m_client_y;
	}
	GetScreenX(): number {
		return this.m_screen_x;
	}
	GetScreenY(): number {
		return this.m_screen_y;
	}
	GetOffsetX(): number {
		return this.m_offset_x;
	}
	GetOffsetY(): number {
		return this.m_offset_y;
	}
	GetButton(): number {
		return this.m_button;
	}
	GetButtons(): number {
		return this.m_buttons;
	}
	IsCtrlKey(): boolean {
		return this.m_ctrl_key;
	}
	IsShiftKey(): boolean {
		return this.m_shift_key;
	}
	IsAltKey(): boolean {
		return this.m_alt_key;
	}
	IsMetaKey(): boolean {
		return this.m_meta_key;
	}
}

// ========== 键盘事件 ==========

export class IKeyboardEvent extends IEvent {
	protected m_key!: string; // 按键的字符串值
	protected m_code!: string; // 按键的物理位置代码
	protected m_key_code!: number; // 已弃用但保留兼容性
	protected m_ctrl_key!: boolean;
	protected m_shift_key!: boolean;
	protected m_alt_key!: boolean;
	protected m_meta_key!: boolean;
	protected m_repeat!: boolean; // 是否是重复按键

	constructor(type: string, options?: KeyboardEventOptions) {
		super(type, options);
		this.m_key = options?.key ?? "";
		this.m_code = options?.code ?? "";
		this.m_key_code = options?.keyCode ?? 0;
		this.m_ctrl_key = options?.ctrlKey ?? false;
		this.m_shift_key = options?.shiftKey ?? false;
		this.m_alt_key = options?.altKey ?? false;
		this.m_meta_key = options?.metaKey ?? false;
		this.m_repeat = options?.repeat ?? false;
	}

	GetKey(): string {
		return this.m_key;
	}
	GetCode(): string {
		return this.m_code;
	}
	GetKeyCode(): number {
		return this.m_key_code;
	}
	IsCtrlKey(): boolean {
		return this.m_ctrl_key;
	}
	IsShiftKey(): boolean {
		return this.m_shift_key;
	}
	IsAltKey(): boolean {
		return this.m_alt_key;
	}
	IsMetaKey(): boolean {
		return this.m_meta_key;
	}
	IsRepeat(): boolean {
		return this.m_repeat;
	}
}

// ========== 触摸事件 ==========

export interface ITouchPoint {
	identifier: number;
	x: number;
	y: number;
	clientX: number;
	clientY: number;
	screenX: number;
	screenY: number;
}

export class ITouchEvent extends IEvent {
	protected m_touches!: ITouchPoint[];
	protected m_changed_touches!: ITouchPoint[];
	protected m_target_touches!: ITouchPoint[];

	constructor(type: string, options?: TouchEventOptions) {
		super(type, options);
		this.m_touches = options?.touches ?? [];
		this.m_changed_touches = options?.changedTouches ?? [];
		this.m_target_touches = options?.targetTouches ?? [];
	}

	GetTouches(): ITouchPoint[] {
		return this.m_touches;
	}
	GetChangedTouches(): ITouchPoint[] {
		return this.m_changed_touches;
	}
	GetTargetTouches(): ITouchPoint[] {
		return this.m_target_touches;
	}
}

// ========== 滚轮事件 ==========

export class IWheelEvent extends IMouseEvent {
	protected m_delta_x!: number;
	protected m_delta_y!: number;
	protected m_delta_z!: number;
	protected m_delta_mode!: number; // 0=像素, 1=行, 2=页

	constructor(type: string, options?: WheelEventOptions) {
		super(type, options);
		this.m_delta_x = options?.deltaX ?? 0;
		this.m_delta_y = options?.deltaY ?? 0;
		this.m_delta_z = options?.deltaZ ?? 0;
		this.m_delta_mode = options?.deltaMode ?? 0;
	}

	GetDeltaX(): number {
		return this.m_delta_x;
	}
	GetDeltaY(): number {
		return this.m_delta_y;
	}
	GetDeltaZ(): number {
		return this.m_delta_z;
	}
	GetDeltaMode(): number {
		return this.m_delta_mode;
	}
}

// ========== 事件选项接口 ==========

export interface EventOptions {
	bubbles?: boolean;
	cancelable?: boolean;
	data?: any;
}

export interface MouseEventOptions extends EventOptions {
	x?: number;
	y?: number;
	clientX?: number;
	clientY?: number;
	screenX?: number;
	screenY?: number;
	offsetX?: number;
	offsetY?: number;
	button?: number;
	buttons?: number;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
}

export interface KeyboardEventOptions extends EventOptions {
	key?: string;
	code?: string;
	keyCode?: number;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	repeat?: boolean;
}

export interface TouchEventOptions extends EventOptions {
	touches?: ITouchPoint[];
	changedTouches?: ITouchPoint[];
	targetTouches?: ITouchPoint[];
}

export interface WheelEventOptions extends MouseEventOptions {
	deltaX?: number;
	deltaY?: number;
	deltaZ?: number;
	deltaMode?: number;
}

// ========== 事件监听器类型 ==========

export type EventListener = (event: IEvent) => void;
export type MouseEventListener = (event: IMouseEvent) => void;
export type KeyboardEventListener = (event: IKeyboardEvent) => void;
export type TouchEventListener = (event: ITouchEvent) => void;
export type WheelEventListener = (event: IWheelEvent) => void;

// ========== 事件监听器配置 ==========

export interface EventListenerOptions {
	capture?: boolean; // 是否在捕获阶段触发
	once?: boolean; // 是否只触发一次
	passive?: boolean; // 是否为被动监听器（不会调用 preventDefault）
}

// ========== 事件监听器包装器 ==========

export class EventListenerWrapper {
	public listener: EventListener;
	public options: EventListenerOptions;
	public triggered: boolean = false;

	constructor(listener: EventListener, options?: EventListenerOptions) {
		this.listener = listener;
		this.options = options || {};
	}

	ShouldCapture(): boolean {
		return this.options.capture ?? false;
	}

	ShouldRemoveAfterTrigger(): boolean {
		return this.options.once ?? false;
	}

	IsPassive(): boolean {
		return this.options.passive ?? false;
	}
}

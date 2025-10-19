import type { IRoot } from "./IRoot.ts";
import type { IElement } from "./IElement.ts";
import {
	IEvent,
	IMouseEvent,
	IKeyboardEvent,
	ITouchEvent,
	IWheelEvent,
	EventType,
	type ITouchPoint,
} from "./IEvent.ts";

/**
 * Vue 事件适配器 - 将 DOM 事件转换为 VueGui 事件
 */
export class VueEventAdapter {
	private root: IRoot;
	private canvas: HTMLCanvasElement | null = null;
	private lastHoveredElement: IElement | null = null;

	constructor(root: IRoot) {
		this.root = root;
	}

	/**
	 * 绑定到 Canvas 元素
	 * @param canvas Canvas 元素
	 */
	AttachToCanvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
		this.BindEvents();
	}

	/**
	 * 解绑 Canvas 元素
	 */
	DetachFromCanvas(): void {
		if (this.canvas) {
			this.UnbindEvents();
			this.canvas = null;
		}
	}

	/**
	 * 绑定所有事件
	 */
	private BindEvents(): void {
		if (!this.canvas) return;

		// 鼠标事件
		this.canvas.addEventListener("mousemove", this.OnMouseMove);
		this.canvas.addEventListener("mousedown", this.OnMouseDown);
		this.canvas.addEventListener("mouseup", this.OnMouseUp);
		this.canvas.addEventListener("click", this.OnClick);
		this.canvas.addEventListener("dblclick", this.OnDoubleClick);
		this.canvas.addEventListener("contextmenu", this.OnContextMenu);
		this.canvas.addEventListener("wheel", this.OnWheel);
		this.canvas.addEventListener("mouseenter", this.OnMouseEnter);
		this.canvas.addEventListener("mouseleave", this.OnMouseLeave);

		// 键盘事件
		this.canvas.addEventListener("keydown", this.OnKeyDown);
		this.canvas.addEventListener("keyup", this.OnKeyUp);
		this.canvas.addEventListener("keypress", this.OnKeyPress);

		// 触摸事件
		this.canvas.addEventListener("touchstart", this.OnTouchStart);
		this.canvas.addEventListener("touchmove", this.OnTouchMove);
		this.canvas.addEventListener("touchend", this.OnTouchEnd);
		this.canvas.addEventListener("touchcancel", this.OnTouchCancel);

		// 设置 tabindex 使 canvas 可以获得焦点
		if (!this.canvas.hasAttribute("tabindex")) {
			this.canvas.setAttribute("tabindex", "0");
		}
	}

	/**
	 * 解绑所有事件
	 */
	private UnbindEvents(): void {
		if (!this.canvas) return;

		this.canvas.removeEventListener("mousemove", this.OnMouseMove);
		this.canvas.removeEventListener("mousedown", this.OnMouseDown);
		this.canvas.removeEventListener("mouseup", this.OnMouseUp);
		this.canvas.removeEventListener("click", this.OnClick);
		this.canvas.removeEventListener("dblclick", this.OnDoubleClick);
		this.canvas.removeEventListener("contextmenu", this.OnContextMenu);
		this.canvas.removeEventListener("wheel", this.OnWheel);
		this.canvas.removeEventListener("mouseenter", this.OnMouseEnter);
		this.canvas.removeEventListener("mouseleave", this.OnMouseLeave);

		this.canvas.removeEventListener("keydown", this.OnKeyDown);
		this.canvas.removeEventListener("keyup", this.OnKeyUp);
		this.canvas.removeEventListener("keypress", this.OnKeyPress);

		this.canvas.removeEventListener("touchstart", this.OnTouchStart);
		this.canvas.removeEventListener("touchmove", this.OnTouchMove);
		this.canvas.removeEventListener("touchend", this.OnTouchEnd);
		this.canvas.removeEventListener("touchcancel", this.OnTouchCancel);
	}

	/**
	 * 获取相对于 Canvas 的坐标
	 */
	private GetCanvasCoordinates(
		e: MouseEvent | Touch
	): { x: number; y: number } {
		if (!this.canvas) return { x: 0, y: 0 };

		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	}

	/**
	 * 创建鼠标事件
	 */
	private CreateMouseEvent(e: MouseEvent, type: string): IMouseEvent {
		const coords = this.GetCanvasCoordinates(e);

		return new IMouseEvent(type, {
			x: coords.x,
			y: coords.y,
			clientX: e.clientX,
			clientY: e.clientY,
			screenX: e.screenX,
			screenY: e.screenY,
			offsetX: coords.x,
			offsetY: coords.y,
			button: e.button,
			buttons: e.buttons,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
			altKey: e.altKey,
			metaKey: e.metaKey,
		});
	}

	/**
	 * 创建键盘事件
	 */
	private CreateKeyboardEvent(e: KeyboardEvent, type: string): IKeyboardEvent {
		return new IKeyboardEvent(type, {
			key: e.key,
			code: e.code,
			keyCode: e.keyCode,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
			altKey: e.altKey,
			metaKey: e.metaKey,
			repeat: e.repeat,
		});
	}

	/**
	 * 创建滚轮事件
	 */
	private CreateWheelEvent(e: WheelEvent): IWheelEvent {
		const coords = this.GetCanvasCoordinates(e);

		return new IWheelEvent(EventType.WHEEL, {
			x: coords.x,
			y: coords.y,
			clientX: e.clientX,
			clientY: e.clientY,
			screenX: e.screenX,
			screenY: e.screenY,
			offsetX: coords.x,
			offsetY: coords.y,
			button: e.button,
			buttons: e.buttons,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
			altKey: e.altKey,
			metaKey: e.metaKey,
			deltaX: e.deltaX,
			deltaY: e.deltaY,
			deltaZ: e.deltaZ,
			deltaMode: e.deltaMode,
		});
	}

	/**
	 * 创建触摸事件
	 */
	private CreateTouchEvent(e: TouchEvent, type: string): ITouchEvent {
		const convertTouchList = (touchList: TouchList): ITouchPoint[] => {
			const points: ITouchPoint[] = [];
			for (let i = 0; i < touchList.length; i++) {
				const touch = touchList[i];
				const coords = this.GetCanvasCoordinates(touch);
				points.push({
					identifier: touch.identifier,
					x: coords.x,
					y: coords.y,
					clientX: touch.clientX,
					clientY: touch.clientY,
					screenX: touch.screenX,
					screenY: touch.screenY,
				});
			}
			return points;
		};

		return new ITouchEvent(type, {
			touches: convertTouchList(e.touches),
			changedTouches: convertTouchList(e.changedTouches),
			targetTouches: convertTouchList(e.targetTouches),
		});
	}

	/**
	 * 派发事件到目标元素
	 */
	private DispatchToTarget(event: IEvent, x: number, y: number): void {
		const target = this.root.GetElementAtPoint(x, y);
		if (target) {
			target.DispatchEvent(event);
		}
	}

	// ========== 鼠标事件处理器 ==========

	private OnMouseMove = (e: MouseEvent): void => {
		const event = this.CreateMouseEvent(e, EventType.MOUSE_MOVE);
		const coords = this.GetCanvasCoordinates(e);
		const target = this.root.GetElementAtPoint(coords.x, coords.y);

		// 处理 mouseenter 和 mouseleave
		if (target !== this.lastHoveredElement) {
			// mouseleave
			if (this.lastHoveredElement) {
				const leaveEvent = this.CreateMouseEvent(e, EventType.MOUSE_LEAVE);
				this.lastHoveredElement.DispatchEvent(leaveEvent);

				// mouseout (冒泡)
				const outEvent = this.CreateMouseEvent(e, EventType.MOUSE_OUT);
				this.lastHoveredElement.DispatchEvent(outEvent);
			}

			// mouseenter
			if (target) {
				const enterEvent = this.CreateMouseEvent(e, EventType.MOUSE_ENTER);
				target.DispatchEvent(enterEvent);

				// mouseover (冒泡)
				const overEvent = this.CreateMouseEvent(e, EventType.MOUSE_OVER);
				target.DispatchEvent(overEvent);
			}

			this.lastHoveredElement = target;
		}

		// 派发 mousemove
		if (target) {
			target.DispatchEvent(event);
		}
	};

	private OnMouseDown = (e: MouseEvent): void => {
		const event = this.CreateMouseEvent(e, EventType.MOUSE_DOWN);
		const coords = this.GetCanvasCoordinates(e);
		this.DispatchToTarget(event, coords.x, coords.y);
	};

	private OnMouseUp = (e: MouseEvent): void => {
		const event = this.CreateMouseEvent(e, EventType.MOUSE_UP);
		const coords = this.GetCanvasCoordinates(e);
		this.DispatchToTarget(event, coords.x, coords.y);
	};

	private OnClick = (e: MouseEvent): void => {
		const event = this.CreateMouseEvent(e, EventType.CLICK);
		const coords = this.GetCanvasCoordinates(e);
		this.DispatchToTarget(event, coords.x, coords.y);
	};

	private OnDoubleClick = (e: MouseEvent): void => {
		const event = this.CreateMouseEvent(e, EventType.DOUBLE_CLICK);
		const coords = this.GetCanvasCoordinates(e);
		this.DispatchToTarget(event, coords.x, coords.y);
	};

	private OnContextMenu = (e: MouseEvent): void => {
		e.preventDefault(); // 阻止默认右键菜单
		const event = this.CreateMouseEvent(e, EventType.CONTEXT_MENU);
		const coords = this.GetCanvasCoordinates(e);
		this.DispatchToTarget(event, coords.x, coords.y);
	};

	private OnWheel = (e: WheelEvent): void => {
		const event = this.CreateWheelEvent(e);
		const coords = this.GetCanvasCoordinates(e);
		const target = this.root.GetElementAtPoint(coords.x, coords.y);
		if (target) {
			const prevented = !target.DispatchEvent(event);
			if (prevented) {
				e.preventDefault();
			}
		}
	};

	private OnMouseEnter = (e: MouseEvent): void => {
		// Canvas mouseenter - 可以用于特殊处理
	};

	private OnMouseLeave = (e: MouseEvent): void => {
		// 当鼠标离开 canvas 时，清理最后悬停元素
		if (this.lastHoveredElement) {
			const event = this.CreateMouseEvent(e, EventType.MOUSE_LEAVE);
			this.lastHoveredElement.DispatchEvent(event);
			this.lastHoveredElement = null;
		}
	};

	// ========== 键盘事件处理器 ==========

	private OnKeyDown = (e: KeyboardEvent): void => {
		const event = this.CreateKeyboardEvent(e, EventType.KEY_DOWN);
		// 键盘事件派发到 root，由 root 决定处理
		const prevented = !this.root.DispatchEvent(event);
		if (prevented) {
			e.preventDefault();
		}
	};

	private OnKeyUp = (e: KeyboardEvent): void => {
		const event = this.CreateKeyboardEvent(e, EventType.KEY_UP);
		const prevented = !this.root.DispatchEvent(event);
		if (prevented) {
			e.preventDefault();
		}
	};

	private OnKeyPress = (e: KeyboardEvent): void => {
		const event = this.CreateKeyboardEvent(e, EventType.KEY_PRESS);
		const prevented = !this.root.DispatchEvent(event);
		if (prevented) {
			e.preventDefault();
		}
	};

	// ========== 触摸事件处理器 ==========

	private OnTouchStart = (e: TouchEvent): void => {
		const event = this.CreateTouchEvent(e, EventType.TOUCH_START);
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			const coords = this.GetCanvasCoordinates(touch);
			this.DispatchToTarget(event, coords.x, coords.y);
		}
	};

	private OnTouchMove = (e: TouchEvent): void => {
		const event = this.CreateTouchEvent(e, EventType.TOUCH_MOVE);
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			const coords = this.GetCanvasCoordinates(touch);
			this.DispatchToTarget(event, coords.x, coords.y);
		}
	};

	private OnTouchEnd = (e: TouchEvent): void => {
		const event = this.CreateTouchEvent(e, EventType.TOUCH_END);
		if (e.changedTouches.length > 0) {
			const touch = e.changedTouches[0];
			const coords = this.GetCanvasCoordinates(touch);
			this.DispatchToTarget(event, coords.x, coords.y);
		}
	};

	private OnTouchCancel = (e: TouchEvent): void => {
		const event = this.CreateTouchEvent(e, EventType.TOUCH_CANCEL);
		if (e.changedTouches.length > 0) {
			const touch = e.changedTouches[0];
			const coords = this.GetCanvasCoordinates(touch);
			this.DispatchToTarget(event, coords.x, coords.y);
		}
	};
}

/**
 * Vue 组合式 API - 事件处理 Hook
 */
export function useVueGuiEvents(root: IRoot, canvas: HTMLCanvasElement) {
	const adapter = new VueEventAdapter(root);
	adapter.AttachToCanvas(canvas);

	// 返回清理函数
	return () => {
		adapter.DetachFromCanvas();
	};
}

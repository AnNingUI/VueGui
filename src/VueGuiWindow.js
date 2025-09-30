

class VueGuiWindow {
    constructor(native_window, window_painter) {
        this.m_native_window = native_window;
        this.m_window_painter = window_painter;
    }

    render() {
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Hello, Vue GUI!', 50, 50);
    }


}
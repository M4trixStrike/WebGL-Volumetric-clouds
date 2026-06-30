export class MouseManager {
    canvsas;
    mouseX = 0.;
    mouseY = 0.;
    mouseDown = false;
    constructor(canvas) {
        this.canvsas = canvas;
        this.canvsas.addEventListener("mousemove", (eData) => {
            this.mouseX = (eData.clientX - canvas.getBoundingClientRect().left) / this.canvsas.width;
            this.mouseY = 1 - (eData.clientY - canvas.getBoundingClientRect().top) / this.canvsas.height;
        });
        this.canvsas.addEventListener("mousedown", () => this.mouseDown = true);
        this.canvsas.addEventListener("mouseup", () => this.mouseDown = false);
    }
    getMouseX() {
        return this.mouseX;
    }
    getMouseY() {
        return this.mouseY;
    }
    mouseActive() {
        return this.mouseDown;
    }
}

export class MouseManager {
    canvsas;
    mouseX = .5;
    mouseY = .5;
    mouseDown = false;
    constructor(canvas) {
        this.canvsas = canvas;
        this.canvsas.addEventListener("mousemove", (eData) => {
            this.mouseX = eData.clientX / this.canvsas.width;
            this.mouseY = 1 - eData.clientY / this.canvsas.height;
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

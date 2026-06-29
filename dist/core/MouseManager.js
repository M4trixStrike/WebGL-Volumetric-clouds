export class MouseManager {
    canvsas;
    mouseX = .5;
    mouseY = .5;
    constructor(canvas) {
        this.canvsas = canvas;
        this.canvsas.addEventListener("mousemove", (eData) => {
            this.mouseX = eData.clientX / this.canvsas.width;
            this.mouseY = 1 - eData.clientY / this.canvsas.height;
        });
    }
    getMouseX() {
        return this.mouseX;
    }
    getMouseY() {
        return this.mouseY;
    }
}

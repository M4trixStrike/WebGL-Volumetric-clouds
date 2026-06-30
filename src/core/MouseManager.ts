
export class MouseManager{

    private readonly canvsas: HTMLCanvasElement;

    private mouseX: number = 0.;
    private mouseY: number = 0.;

    private mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement){

        this.canvsas = canvas;

        this.canvsas.addEventListener("mousemove", (eData) => {

            this.mouseX = (eData.clientX - canvas.getBoundingClientRect().left) / this.canvsas.width;
            this.mouseY = 1 - (eData.clientY - canvas.getBoundingClientRect().top) / this.canvsas.height;

        })

        this.canvsas.addEventListener("mousedown",() => this.mouseDown = true);
        this.canvsas.addEventListener("mouseup",() => this.mouseDown = false);

    }

    public getMouseX(): number{
        return this.mouseX;
    }

    public getMouseY(): number{
        return this.mouseY;
    }

    public mouseActive(): boolean{
        return this.mouseDown;
    }

}
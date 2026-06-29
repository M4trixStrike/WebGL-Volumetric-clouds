
export class MouseManager{

    private readonly canvsas: HTMLCanvasElement;

    private mouseX: number = .5;
    private mouseY: number = .5;

    private mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement){

        this.canvsas = canvas;

        this.canvsas.addEventListener("mousemove", (eData) => {

            this.mouseX = eData.clientX / this.canvsas.width;
            this.mouseY = 1 - eData.clientY / this.canvsas.height;

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
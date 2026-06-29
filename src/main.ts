import { ShaderManager, UniformType } from "./ShaderManager.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const sm = new ShaderManager(canvas, 500, 500);

await sm.compileShaders();

let deltaT = Date.now();
let fps = 67;

function renderLoop(){

    if(Date.now() - deltaT >= 1000){
        document.title = `FPS: ${fps}`;
        fps = 0;
        deltaT = Date.now();
    }
    fps ++;

    

    sm.renderShaders();
    window.requestAnimationFrame(renderLoop);
}

renderLoop();
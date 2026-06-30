import { ShaderManager, UniformType } from "./ShaderManager.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const sizeX = document.getElementById("sizeX") as HTMLInputElement;
const sizeY = document.getElementById("sizeY") as HTMLInputElement;
const sizeZ = document.getElementById("sizeZ") as HTMLInputElement;

const speedX = document.getElementById("speedX") as HTMLInputElement;
const speedY = document.getElementById("speedY") as HTMLInputElement;
const speedZ = document.getElementById("speedZ") as HTMLInputElement;

const resetBtn = document.getElementById("resetBttn") as HTMLButtonElement;

const userControl = document.getElementById("userControl") as HTMLInputElement;
let controlStatus = 0;

userControl.onchange = () => {

    controlStatus = controlStatus==1?0:1;

}

resetBtn.onclick = () => {

    document.querySelectorAll("input").forEach((e: HTMLInputElement)=>{
        e.value = "0";
    })

}

const sm = new ShaderManager(canvas, 500, 500);

await sm.compileShaders();

let deltaT = Date.now();
let fps = 67;

function renderLoop(){

    sm.addUniform(UniformType.VECTOR_FLOAT_3,"uUserSize",[parseFloat(sizeX.value),parseFloat(sizeY.value),parseFloat(sizeZ.value)])
    sm.addUniform(UniformType.VECTOR_FLOAT_3,"uUserSpeed",[parseFloat(speedX.value),parseFloat(speedY.value),parseFloat(speedZ.value)])
    sm.addUniform(UniformType.FLOAT,"uUserControl",[controlStatus])

    if(Date.now() - deltaT >= 1000){
        document.title = `FPS: ${fps} | RTE: ${Math.floor(sm.getRuntime())}s`;
        fps = 0;
        deltaT = Date.now();
    }
    fps ++;

    sm.renderShaders();
    window.requestAnimationFrame(renderLoop);
}

renderLoop();
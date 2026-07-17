import { UniformType } from "./core/managers/UniformManager.js";
import { ShaderProgram } from "./ShaderProgram.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const sizeX = document.getElementById("sizeX") as HTMLInputElement;
const sizeY = document.getElementById("sizeY") as HTMLInputElement;
const sizeZ = document.getElementById("sizeZ") as HTMLInputElement;

const speedX = document.getElementById("speedX") as HTMLInputElement;
const speedY = document.getElementById("speedY") as HTMLInputElement;
const speedZ = document.getElementById("speedZ") as HTMLInputElement;

const sunX = document.getElementById("sunPosX") as HTMLInputElement;
const sunY = document.getElementById("sunPosY") as HTMLInputElement;
const sunZ = document.getElementById("sunPosZ") as HTMLInputElement;

const sunIntensity = document.getElementById("int") as HTMLInputElement;

const resetBtn = document.getElementById("resetBttn") as HTMLButtonElement;
const randomBtn = document.getElementById("randomBttn") as HTMLButtonElement;

const zoom = document.getElementById("zoom") as HTMLInputElement;

const scale = document.getElementById("scale") as HTMLInputElement;

const color = document.getElementById("sunColor") as HTMLInputElement;

const userControl = document.getElementById("userControl") as HTMLInputElement;
let controlStatus = 0;

function hexToNum(hex: string): number{

    return Number("0x"+hex);

}

userControl.onchange = () => {

    controlStatus = controlStatus==1?0:1;

}

resetBtn.onclick = () => {

    document.querySelectorAll("input[data-default]").forEach((e) => {
        const input = e as HTMLInputElement;
        input.value = input.dataset.default || "";
    });
    
};

randomBtn.onclick = () => {
    sm.setUniform(UniformType.VECTOR_FLOAT_3,"uRandomVector",[Math.random()*100,Math.random()*100,Math.random()*100]);
}

const sm = new ShaderProgram(canvas, 500, 500);

await sm.compileShader();

let deltaT = Date.now();
let fps = 67;

sm.setUniform(UniformType.VECTOR_FLOAT_3,"uRandomVector",[Math.random()*100,Math.random()*100,Math.random()*100]);

function renderLoop(){

    sm.setUniform(UniformType.VECTOR_FLOAT_3,"uUserSize",[parseFloat(sizeX.value),parseFloat(sizeY.value),parseFloat(sizeZ.value)]);
    sm.setUniform(UniformType.VECTOR_FLOAT_3,"uUserSpeed",[parseFloat(speedX.value),parseFloat(speedY.value),parseFloat(speedZ.value)]);
    sm.setUniform(UniformType.VECTOR_FLOAT_3,"uUserSunPos",[parseFloat(sunX.value),parseFloat(sunY.value),parseFloat(sunZ.value)]);
    sm.setUniform(UniformType.FLOAT,"uUserControl",[controlStatus]);
    sm.setUniform(UniformType.FLOAT,"uUserZoom",[parseFloat(zoom.value)]);
    sm.setUniform(UniformType.FLOAT,"uUserInt",[parseFloat(sunIntensity.value)]);
    sm.setUniform(UniformType.FLOAT,"uUserScale",[parseFloat(scale.value)]);

    sm.setUniform(UniformType.VECTOR_FLOAT_3,"uUserSunColor",[
        hexToNum(color.value.substring(1,3)) / 255,
        hexToNum(color.value.substring(3,5)) / 255,
        hexToNum(color.value.substring(5,7)) / 255,
    ])

    if(Date.now() - deltaT >= 1000){
        document.title = `FPS: ${fps} | RTE: ${Math.floor(sm.getRuntime())}s`;
        fps = 0;
        deltaT = Date.now();
    }
    fps ++;

    sm.renderShader();
    window.requestAnimationFrame(renderLoop);
}

renderLoop();
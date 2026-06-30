import { ShaderManager, UniformType } from "./ShaderManager.js";
const canvas = document.getElementById("canvas");
const sizeX = document.getElementById("sizeX");
const sizeY = document.getElementById("sizeY");
const sizeZ = document.getElementById("sizeZ");
const speedX = document.getElementById("speedX");
const speedY = document.getElementById("speedY");
const speedZ = document.getElementById("speedZ");
const resetBtn = document.getElementById("resetBttn");
const userControl = document.getElementById("userControl");
let controlStatus = 0;
userControl.onchange = () => {
    controlStatus = controlStatus == 1 ? 0 : 1;
};
resetBtn.onclick = () => {
    document.querySelectorAll("input").forEach((e) => {
        e.value = "0";
    });
};
const sm = new ShaderManager(canvas, 500, 500);
await sm.compileShaders();
let deltaT = Date.now();
let fps = 67;
function renderLoop() {
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSize", [parseFloat(sizeX.value), parseFloat(sizeY.value), parseFloat(sizeZ.value)]);
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSpeed", [parseFloat(speedX.value), parseFloat(speedY.value), parseFloat(speedZ.value)]);
    sm.addUniform(UniformType.FLOAT, "uUserControl", [controlStatus]);
    if (Date.now() - deltaT >= 1000) {
        document.title = `FPS: ${fps} | RTE: ${Math.floor(sm.getRuntime())}s`;
        fps = 0;
        deltaT = Date.now();
    }
    fps++;
    sm.renderShaders();
    window.requestAnimationFrame(renderLoop);
}
renderLoop();

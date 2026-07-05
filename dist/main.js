import { ShaderManager, UniformType } from "./ShaderManager.js";
const canvas = document.getElementById("canvas");
const sizeX = document.getElementById("sizeX");
const sizeY = document.getElementById("sizeY");
const sizeZ = document.getElementById("sizeZ");
const speedX = document.getElementById("speedX");
const speedY = document.getElementById("speedY");
const speedZ = document.getElementById("speedZ");
const sunX = document.getElementById("sunPosX");
const sunY = document.getElementById("sunPosY");
const sunZ = document.getElementById("sunPosZ");
const sunIntensity = document.getElementById("int");
const resetBtn = document.getElementById("resetBttn");
const randomBtn = document.getElementById("randomBttn");
const zoom = document.getElementById("zoom");
const color = document.getElementById("sunColor");
const userControl = document.getElementById("userControl");
let controlStatus = 0;
function hetToNum(hex) {
    return Number("0x" + hex);
}
userControl.onchange = () => {
    controlStatus = controlStatus == 1 ? 0 : 1;
};
resetBtn.onclick = () => {
    document.querySelectorAll("input").forEach((e) => {
        if (e.name == "reset30")
            e.value = "-30";
        if (e.name == "reset4")
            e.value = "4";
        if (e.name == "reset")
            e.value = "0";
        if (e.name == "light")
            e.value = "#E5E5E5";
        if (e.name == "int")
            e.value = "1.2";
        if (e.name == "x")
            e.value = "20";
        if (e.name == "y")
            e.value = "20";
        if (e.name == "z")
            e.value = "50";
    });
};
randomBtn.onclick = () => {
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uRandomVector", [Math.random() * 100, Math.random() * 100, Math.random() * 100]);
};
const sm = new ShaderManager(canvas, 500, 500);
await sm.compileShaders();
let deltaT = Date.now();
let fps = 67;
sm.addUniform(UniformType.VECTOR_FLOAT_3, "uRandomVector", [Math.random() * 100, Math.random() * 100, Math.random() * 100]);
function renderLoop() {
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSize", [parseFloat(sizeX.value), parseFloat(sizeY.value), parseFloat(sizeZ.value)]);
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSpeed", [parseFloat(speedX.value), parseFloat(speedY.value), parseFloat(speedZ.value)]);
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSunPos", [parseFloat(sunX.value), parseFloat(sunY.value), parseFloat(sunZ.value)]);
    sm.addUniform(UniformType.FLOAT, "uUserControl", [controlStatus]);
    sm.addUniform(UniformType.FLOAT, "uUserZoom", [parseFloat(zoom.value)]);
    sm.addUniform(UniformType.FLOAT, "uUserInt", [parseFloat(sunIntensity.value)]);
    sm.addUniform(UniformType.VECTOR_FLOAT_3, "uUserSunColor", [
        hetToNum(color.value.substring(1, 3)) / 255,
        hetToNum(color.value.substring(3, 5)) / 255,
        hetToNum(color.value.substring(5, 7)) / 255,
    ]);
    if (Date.now() - deltaT >= 1000) {
        document.title = `FPS: ${fps} | RTE: ${Math.floor(sm.getRuntime())}s`;
        fps = 0;
        deltaT = Date.now();
    }
    fps++;
    sm.renderShader();
    window.requestAnimationFrame(renderLoop);
}
renderLoop();

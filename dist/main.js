import { ShaderManager, UniformType } from "./ShaderManager.js";
const canvas = document.getElementById("canvas");
const sm = new ShaderManager(canvas, 500, 500);
await sm.compileShaders();
function renderLoop() {
    sm.renderShaders();
    window.requestAnimationFrame(renderLoop);
}
renderLoop();

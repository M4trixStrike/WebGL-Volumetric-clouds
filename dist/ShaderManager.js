import { Shader } from "./core/Shader.js";
import { File } from "./core/File.js";
import { MouseManager } from "./core/MouseManager.js";
import { Timer } from "./core/Timer.js";
const SHADER_VERT_SRC = "shaders/shader.vert";
const SHADER_FRAG_SRC = "shaders/shader.frag";
const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1
]);
export var UniformType;
(function (UniformType) {
    UniformType[UniformType["FLOAT"] = 0] = "FLOAT";
    UniformType[UniformType["VECTOR_FLOAT_2"] = 1] = "VECTOR_FLOAT_2";
    UniformType[UniformType["VECTOR_FLOAT_3"] = 2] = "VECTOR_FLOAT_3";
    UniformType[UniformType["VECTOR_FLOAT_4"] = 3] = "VECTOR_FLOAT_4";
    UniformType[UniformType["INT"] = 4] = "INT";
    UniformType[UniformType["VECTOR_INT_2"] = 5] = "VECTOR_INT_2";
    UniformType[UniformType["VECTOR_INT_3"] = 6] = "VECTOR_INT_3";
    UniformType[UniformType["VECTOR_INT_4"] = 7] = "VECTOR_INT_4";
    UniformType[UniformType["MATRIX_2"] = 8] = "MATRIX_2";
    UniformType[UniformType["MATRIX_3"] = 9] = "MATRIX_3";
    UniformType[UniformType["MATRIX_4"] = 10] = "MATRIX_4";
})(UniformType || (UniformType = {}));
export class ShaderManager {
    gl;
    GLSLProgram;
    fragmentCache;
    vertexCache;
    resX;
    resY;
    mouseManager;
    timer;
    constructor(canvas, resX, resY) {
        this.gl = canvas.getContext("webgl");
        this.resX = resX;
        this.resY = resY;
        canvas.width = resX;
        canvas.height = resY;
        this.mouseManager = new MouseManager(canvas);
        this.timer = new Timer();
    }
    async loadShaderData() {
        if (this.vertexCache == undefined) {
            const vertFileHandler = new File(SHADER_VERT_SRC);
            this.vertexCache = await vertFileHandler.open();
        }
        const fragFileHandler = new File(SHADER_FRAG_SRC);
        this.fragmentCache = await fragFileHandler.open();
    }
    async compileShaders() {
        const t1 = Date.now();
        await this.loadShaderData();
        if (!this.gl)
            throw new Error("WebGl is not supported in your browser!");
        if (this.vertexCache == undefined || this.fragmentCache == undefined)
            throw new Error("Load shader data before compiling the shaders!");
        const vertexShader = new Shader(this.gl.VERTEX_SHADER, this.vertexCache, this.gl);
        const fragShader = new Shader(this.gl.FRAGMENT_SHADER, this.fragmentCache, this.gl);
        this.GLSLProgram = this.gl.createProgram();
        this.gl.attachShader(this.GLSLProgram, vertexShader.getCompiledShader());
        this.gl.attachShader(this.GLSLProgram, fragShader.getCompiledShader());
        this.gl.linkProgram(this.GLSLProgram);
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const aPosition = this.gl.getAttribLocation(this.GLSLProgram, "aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.useProgram(this.GLSLProgram);
        console.info(`Shader compiled in ${Date.now() - t1}ms.`);
    }
    renderShaders() {
        this.gl.viewport(0, 0, this.resX, this.resY);
        const uResolution = this.gl.getUniformLocation(this.GLSLProgram, "uResolution");
        this.gl.uniform2f(uResolution, this.resX, this.resY);
        const uMouse = this.gl.getUniformLocation(this.GLSLProgram, "uMouse");
        this.gl.uniform2f(uMouse, this.mouseManager.getMouseX(), this.mouseManager.getMouseY());
        const uTime = this.gl.getUniformLocation(this.GLSLProgram, "uTime");
        const time = this.timer.getTime();
        this.gl.uniform1f(uTime, time);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length);
    }
    // Uniform injectors
    addUniform(uType, uName, uVector) {
        const uLoc = this.gl.getUniformLocation(this.GLSLProgram, uName);
        switch (uType) {
            case UniformType.FLOAT:
                this.gl.uniform1fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_2:
                this.gl.uniform2fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_3:
                this.gl.uniform3fv(uLoc, uVector);
                break;
            case UniformType.VECTOR_FLOAT_4:
                this.gl.uniform4fv(uLoc, uVector);
                break;
            case UniformType.INT:
                this.gl.uniform1iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_2:
                this.gl.uniform2iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_3:
                this.gl.uniform3iv(uLoc, uVector);
                break;
            case UniformType.VECTOR_INT_4:
                this.gl.uniform4iv(uLoc, uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }
    }
    addUniformMatrix(uType, uName, uVector, mTranspose) {
        const uLoc = this.gl.getUniformLocation(this.GLSLProgram, uName);
        switch (uType) {
            case UniformType.MATRIX_2:
                this.gl.uniformMatrix2fv(uLoc, mTranspose, uVector);
                break;
            case UniformType.MATRIX_3:
                this.gl.uniformMatrix3fv(uLoc, mTranspose, uVector);
                break;
            case UniformType.MATRIX_4:
                this.gl.uniformMatrix4fv(uLoc, mTranspose, uVector);
                break;
            default:
                throw new Error(`Uniform [${uType}] is not supported nor recognized by this function!`);
        }
    }
}

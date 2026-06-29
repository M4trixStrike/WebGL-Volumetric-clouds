
export class Shader{

    private readonly shader: WebGLShader;

    constructor(type: number, source: string, gl: WebGLRenderingContext){


        this.shader = gl.createShader(type)!;

        gl.shaderSource(this.shader, source);
        gl.compileShader(this.shader);

        const compileStatus = gl.getShaderParameter(this.shader, gl.COMPILE_STATUS);
        if(!compileStatus)
            throw new Error(`The shader [${type==gl.VERTEX_SHADER?"VERTEX":"FRAGMENT"}] could not be compiled.`)
    }

    public getCompiledShader(): WebGLShader{

        return this.shader;

    }

}
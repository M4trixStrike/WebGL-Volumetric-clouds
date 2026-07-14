
export interface IShaderAddon{

    readonly name: string;

    inject(gl: WebGLRenderingContext, program: WebGLProgram): void;

}
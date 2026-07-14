import type { IShaderAddon } from "./IShaderAddon.js";

export class OESAddonBase implements IShaderAddon{

    readonly name: string = "BASE_ADDON";
    private extension: any;

    inject(gl: WebGLRenderingContext): void{
        
        this.extension = gl.getExtension(this.name);
        if (!this.extension) {
            console.error(`[${this.name}] is not suported in your browser!`);
        }
        console.info(`[${this.name}] has been successfully added to your shader program!`);

    }

}
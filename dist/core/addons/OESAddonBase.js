export class OESAddonBase {
    name = "BASE_ADDON";
    extension;
    inject(gl) {
        this.extension = gl.getExtension(this.name);
        if (!this.extension) {
            console.error(`[${this.name}] is not suported in your browser!`);
        }
        console.info(`[${this.name}] has been successfully added to your shader program!`);
    }
}

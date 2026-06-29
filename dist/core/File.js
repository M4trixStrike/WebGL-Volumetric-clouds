export class File {
    src;
    constructor(src) {
        this.src = src;
    }
    async open() {
        const response = await fetch(new URL(this.src, window.location.href));
        if (!response.ok)
            throw new Error(`Could not open the file at: [${this.src}]`);
        else
            return response.text();
    }
}

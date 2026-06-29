
export class File{

    private src: string;

    constructor(src: string){
        
        this.src = src;

    }

    public async open(): Promise<string> {

        const response = await fetch(new URL(this.src,window.location.href));

        if(!response.ok)
            throw new Error(`Could not open the file at: [${this.src}]`);

        else return response.text();

    }

}
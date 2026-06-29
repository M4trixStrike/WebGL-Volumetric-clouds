
export class Timer{

    private initTime: number;

    constructor(){

        this.initTime = Date.now();

    }

    getTime(){

        return ( Date.now() - this.initTime ) / 1000;

    }

}
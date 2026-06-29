export class Timer {
    initTime;
    constructor() {
        this.initTime = Date.now();
    }
    getTime() {
        return (Date.now() - this.initTime) / 1000;
    }
}

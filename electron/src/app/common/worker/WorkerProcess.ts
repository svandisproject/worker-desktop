import {ChildProcess} from "child_process";

export class WorkerProcess {
    private process: ChildProcess;

    public execute() {
        const exec = require('child_process').exec;

        this.process = exec('npm run start:prod',
            (error: any, stdout: any, stderr: any) => {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    public killWorker(): void {
        if (this.isAlive()) {
            this.process.kill('SIGINT');
        }
    }

    private isAlive(): boolean {
        return this.process && !this.process.killed;
    }
}

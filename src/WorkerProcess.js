module.exports = class WorkerProcess {

    constructor() {
        this.process = undefined;
    }

    execute() {
        if (this.isAlive()) {
            return;
        }

        const exec = require('child_process').execFile;
        this.process = exec(__dirname + '/../worker-build/worker-app-win.exe',
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    killWorker() {
        if (this.isAlive()) {
            this.process.kill('SIGINT');
        }
    }

    isAlive() {
        return this.process && !this.process.killed;
    }
};

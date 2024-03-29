const fs = require('fs');
const fileExists = require('file-exists');
const os = require('os');
const _ = require('lodash');


module.exports = class WorkerProcess {

    constructor() {
        this.process = undefined;
    }

    execute(token) {
        if (typeof token !== 'string') {
            throw new Error('Bad token received');
        }

        const runtimePath = __dirname + '/../runtime.json';

        if (this.isAlive()) {
            return;
        }
        this.updateRuntime(runtimePath, token);
        const exec = require('child_process').execFile;

        let executablePath = '/../worker-build/worker-app';

        if (os.platform() === 'darwin') {
            executablePath += '-macos';
        } else if (os.platform() === 'win32') {
            executablePath += '-win.exe';
        }else {
            executablePath += '-linux';
        }

        this.process = exec(__dirname + executablePath, ['--token', token]);
        this.process.stdout.pipe(process.stdout);
    }

    updateRuntime(runtimePath, token) {
        if (!fileExists.sync(runtimePath)) {
            fs.writeFileSync(runtimePath, JSON.stringify({token: token}));
        } else {
            const runtime = require(runtimePath);

            if (runtime.token !== token) {
                fs.writeFileSync(runtimePath, JSON.stringify({token: token}));
            }
        }
    }

    killWorker() {
        if (this.isAlive()) {
            this.process.kill('SIGINT');
            console.warn('Worker Killed');
        }
    }

    isAlive() {
        return this.process && !this.process.killed;
    }
};

import {app, BrowserWindow, ipcMain} from 'electron';
import {WorkerStartParams} from "./common/worker/WokerStartParams";
import {WorkerProcess} from "./common/worker/WorkerProcess";

let mainWindow: BrowserWindow;
let worker = new WorkerProcess();

function createWindow() {
    mainWindow = new BrowserWindow({width: 1366, height: 768});
    mainWindow.loadURL('http://localhost:4200');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        worker.killWorker();
        mainWindow.destroy();
    })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        worker.killWorker();
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

ipcMain.on('startWorker', (event: any, args: WorkerStartParams) => {
    worker.execute();
    console.log('works', args.token)
});
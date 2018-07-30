import {app, BrowserWindow, ipcMain} from 'electron';
import {WorkerStartParams} from "./common/worker/WokerStartParams";
import {WorkerProcess} from "./common/worker/WorkerProcess";

let mainWindow: BrowserWindow;
const worker = new WorkerProcess();

function createWindow() {
    mainWindow = new BrowserWindow({width: 1366, height: 768});
    mainWindow.loadURL('https://svandis-frontend.herokuapp.com/');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        worker.killWorker();
        mainWindow.destroy();
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        worker.killWorker();
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('startWorker', (event: any, args: WorkerStartParams) => {
    worker.execute();
    console.log('works', args.token);
});
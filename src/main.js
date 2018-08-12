const { app, BrowserWindow, ipcMain } = require('electron');

const WorkerProcess = require('./WorkerProcess');
const worker = new WorkerProcess();
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1366, height: 768});
    mainWindow.loadURL('https://svandis-frontend.herokuapp.com');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

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
    if (!mainWindow) {
        createWindow();
    }
});

ipcMain.on('startWorker', (event, args) => {
    worker.execute();
    console.log('Worker running', args);
});

ipcMain.on('stopWorker', () => {
    worker.killWorker();
    console.log('Worker Killed');
});
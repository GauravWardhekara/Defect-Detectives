const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

const isDev = !app.isPackaged;
let serverProcess;

function startServer() {
  if (!isDev) {
    const serverPath = path.join(__dirname, '../dist/server.cjs');
    serverProcess = fork(serverPath);
    serverProcess.on('error', (err) => {
      console.error('Failed to start backend server:', err);
    });
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    // In production, the backend server binds to port 3000 and serves the frontend.
    // Wait slightly to ensure the server is up before loading.
    setTimeout(() => {
      win.loadURL('http://localhost:3000');
    }, 1500);
  }
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

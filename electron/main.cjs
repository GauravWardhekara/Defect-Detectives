const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const http = require('http');

const isDev = !app.isPackaged;
let serverProcess;

function startServer() {
  if (!isDev) {
    // In production, dist/ is unpacked from the asar archive so fork() can execute it.
    // The unpacked files live at: resources/app.asar.unpacked/dist/
    const serverPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'server.cjs');
    
    console.log('Starting backend server from:', serverPath);
    
    serverProcess = fork(serverPath, [], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        USER_DATA_PATH: app.getPath('userData')
      }
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start backend server:', err);
    });

    serverProcess.on('exit', (code) => {
      console.log('Backend server exited with code:', code);
    });
  }
}

/**
 * Waits for the backend server to become available by polling it.
 * Returns a Promise that resolves when the server responds.
 */
function waitForServer(url, maxRetries = 30, interval = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      http.get(url, (res) => {
        resolve();
      }).on('error', () => {
        if (attempts >= maxRetries) {
          reject(new Error(`Server did not start after ${maxRetries} attempts`));
        } else {
          setTimeout(check, interval);
        }
      });
    };
    check();
  });
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
    // Wait for the backend server to be ready before loading the URL
    waitForServer('http://localhost:3000/api/config')
      .then(() => {
        win.loadURL('http://localhost:3000');
      })
      .catch((err) => {
        console.error('Server failed to start:', err);
        // Show an error page as a fallback
        win.loadURL(`data:text/html,<h2>Error: Backend server failed to start.</h2><p>${err.message}</p>`);
      });
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

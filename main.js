const { app, BrowserWindow, ipcMain, BrowserView } = require('electron');
const path = require('path');

let mainWindow;
let tabs = [];
let activeTab = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    title: "Glider Browser"
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Handle tab management
ipcMain.handle('new-tab', (event, url) => {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  view.webContents.loadURL(url);
  tabs.push(view);

  if(activeTab) mainWindow.removeBrowserView(activeTab);
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 70, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 70 });
  activeTab = view;

  return tabs.length - 1; // tab id
});

ipcMain.handle('switch-tab', (event, tabId) => {
  if(tabs[tabId] && tabs[tabId] !== activeTab){
    if(activeTab) mainWindow.removeBrowserView(activeTab);
    activeTab = tabs[tabId];
    mainWindow.setBrowserView(activeTab);
    activeTab.setBounds({ x: 0, y: 70, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 70 });
  }
});

ipcMain.handle('navigate', (event, tabId, url) => {
  if(tabs[tabId]){
    tabs[tabId].webContents.loadURL(url);
  }
});

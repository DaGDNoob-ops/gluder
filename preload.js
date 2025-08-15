const { ipcRenderer } = require('electron');

window.api = {
  newTab: (url) => ipcRenderer.invoke('new-tab', url),
  switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
  navigate: (tabId, url) => ipcRenderer.invoke('navigate', tabId, url)
};

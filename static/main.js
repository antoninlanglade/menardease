const { app, BrowserWindow } = require('electron');
const path = require('path');

let window;

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 600,
    height: 600
  });

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  // Only close the window on blur if dev tools isn't opened
  // window.on('blur', () => {
  //   if (!window.webContents.isDevToolsOpened()) {
  //     window.hide();
  //   }
  // });
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

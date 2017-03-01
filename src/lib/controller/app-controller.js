'use strict';
import Browser from './browser-controller';
import {app} from 'electron';
import {ipcMain} from 'electron';
import {autoUpdater} from 'electron-updater';
const browser = new Browser();

export default class AppController {
    constructor() {
    app.on('ready', this.ready);
    autoUpdater.on('checking-for-update', () => {
      this.sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (ev, info) => {
      this.sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (ev, info) => {
      this.sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (ev, err) => {
      this.sendStatusToWindow('Error in auto-updater.');
    })
    autoUpdater.on('download-progress', (ev, progressObj) => {
      this.sendStatusToWindow('Download progress...');
    })
    autoUpdater.on('update-downloaded', (ev, info) => {
      this.sendStatusToWindow('Update downloaded; will install in 5 seconds');
    });
    autoUpdater.on('update-downloaded', (ev, info) => {
      // Wait 5 seconds, then quit and install
      // In your application, you don't need to wait 5 seconds.
      // You could call autoUpdater.quitAndInstall(); immediately
      setTimeout(function() {
        autoUpdater.quitAndInstall();
      }, 5000)
    })
  }

  get win() {
    return this._win;
  }

  set win(value) {
    this._win = value;
  }

  ready() {
    app.setName('Hitch.on');
    this.win = browser.createWindow('main', 'index');
    autoUpdater.checkForUpdates();
  }

  quit() {
    app.quit();
  }

  sendStatusToWindow(text) {
    // TODO: Add ipcRenderer to listen for messages & display them [example](https://github.com/iffy/electron-updater-example/blob/master/version.html)
    // this.win.webContents.send('message', text);
  }
}

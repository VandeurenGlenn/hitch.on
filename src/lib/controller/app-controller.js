'use strict';
import Browser from './browser-controller';
import {app} from 'electron';
import {ipcMain} from 'electron';
const browser = new Browser();

export default class AppController {
  constructor() {
    app.on('ready', this.ready);
  }

  ready() {
    app.setName('Hitch.on');
    browser.createWindow('main', 'app/html/index');
  }

  quit() {
    app.quit();
  }
}

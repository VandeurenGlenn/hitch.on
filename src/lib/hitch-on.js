'use strict';
import Server from './server';
import Client from './client';
import Connection from './connection/connection';
import DesktopCapturer from './desktop-capturer';
import Clipboard from './integration/clipboard';
import mouseListener from './controls/mouse-listener';
import FirebaseController from './controller/firebase-controller.js';

export default class Hitchon extends FirebaseController {
  constructor() {
    super();

    this._setup().then(hitchon => {
      window.hitchon = hitchon;

      requestIdleCallback(() => {
        this.login();
        this._setupEventListeners();
      })
    });
  }

  _setupEventListeners() {
    hitchon.desktopCapturer.on('stream-update', (stream) => {
      hitchon.server.post('stream', stream);
      document.dispatchEvent(new CustomEvent('stream-update', {detail: stream}));
    });

    document.addEventListener('screen-select-update', (event) => {
      hitchon.desktopCapturer.stream(event.detail);
    });
  }

  _setup() {
    return new Promise(resolve => {
      var hitchon = window.hitchon || {};
      hitchon.user = hitchon.user || {settings: {}};
      hitchon.client = new Client();
      hitchon.server = new Server();
      hitchon.connection = new Connection();
      hitchon.desktopCapturer = new DesktopCapturer();
      hitchon.clipboard = new Clipboard();
      hitchon.login = this.login;
      resolve(hitchon);
    });
  }
}

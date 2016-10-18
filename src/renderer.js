'use strict';
import Server from './lib/server';
import Client from './lib/client';
import Connection from './lib/connection/connection';
import {ipcRenderer} from 'electron';
import DesktopCapturer from './lib/desktop-capturer';
import Clipboard from './lib/integration/clipboard'

const desktopCapturer = new DesktopCapturer();

var hitchon = window.hitchon || {};
hitchon.user = hitchon.user || {settings: {}};
hitchon.client = new Client();
hitchon.server = new Server();
hitchon.connection = new Connection();
hitchon.desktopCapturer = new DesktopCapturer();
hitchon.clipboard = new Clipboard();
hitchon.desktopCapturer.on('stream-update', (stream) => {
  hitchon.server.post('stream', stream);
  document.dispatchEvent(new CustomEvent('stream-update', {detail: stream}));
});
document.addEventListener('screen-select-update', (event) => {
  hitchon.desktopCapturer.stream(event.detail);
});
// hitchon.server.on('capturer', (stream) => {
//   hitchon.client.stream(stream);
// });

window.hitchon = hitchon;

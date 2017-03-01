'use strict';
import AppController from './lib/controller/app-controller';
import SquirrelStartup from './lib/helpers/squirel-startup';

const app = new AppController();
const squirelStartup = new SquirrelStartup();

squirelStartup.on('quit-app', () => {
  app.quit();
});

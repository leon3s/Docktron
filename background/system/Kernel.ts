import * as E from 'electron';

import {createDebugLog} from '../utils';

const debugLog = createDebugLog('Kernel');

export default class Kernel {
  app:E.App;
  screen:E.Screen;
  primaryDisplay:E.Display;

  constructor() {
    debugLog('constructor');
    this.app = E.app;
  }

  public async boot() {
    debugLog('boot');
    if (process.platform === 'darwin') {
      this.app.dock.hide();
    }
    // Disable harware acceleration for transparent background compatibility may be needed on some system
    // this.app.disableHardwareAcceleration();
    this.__blindAppListenner();
    await this.app.whenReady();
    this.__initScreen();
  }

  public async quit() {
    return this.app.quit();
  }

  public beforeQuit(callback) {
    this.app.on('before-quit', function() {
      console.log('before-quit!');
      callback();
    });
  }

  private __initScreen() {
    debugLog('__initScreen');
    debugLog('env: ', process.env.NODE_ENV);
    this.screen = E.screen;
    this.primaryDisplay = this.screen.getPrimaryDisplay();
  }

  private __blindAppListenner() {
    debugLog('__blindAppListenner');
    const kernel = this;
    this.app.on('window-all-closed', function() {
      kernel.app.quit();
    });
  }
}

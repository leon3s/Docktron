import {
  AppUpdater,
  autoUpdater,
} from 'electron-updater';

import System from '.';
import Window from './Window';
import { WindowManager } from './modules';
import { createDebugLog } from '../utils';

const debugLog = createDebugLog('AutoUpdate');

export default
class                       AutoUpdater {
  private __system:         System;
  private __win:            Window;
  private __autoUpdater:    AppUpdater;
  private __windowManager:  WindowManager;
  private __onReady:        Function = () => {};

  constructor(system:System) {
    this.__system = system;
    this.__autoUpdater = autoUpdater;
  }

  public onReady(callback:() => void|Promise<void> = () => {}) {
    this.__onReady = callback;
  }

  public async checkForUpdate() {
    this.__windowManager = this.__system.getModule<WindowManager>(WindowManager);
    this.__initListenners();
    try {
      const res = await autoUpdater.checkForUpdates();
      debugLog('res:', res);
      if (!res) {
        this.__onReady();
      } else {
        // do something else ?
      }
    } catch (e) {
    }
  }

  private __initListenners() {
    this.__autoUpdater.on('checking-for-update', () => {
      debugLog('Checking for update...');
    });

    this.__autoUpdater.on('update-available', (info) => {
      debugLog('Update available.', info);
      this.__win = this.__windowManager.createWindow('sys.auto.update', 'update', {
        title: 'AutoUpdate',
        resizable: false,
        width: 500,
        height: 200,
      });
      this.__win.instantiate();
      this.__win.render();
      this.__win.once('ready-to-show', () => {
        this.__win.show();
      });
    });

    this.__autoUpdater.on('update-not-available', (info) => {
      debugLog('Update not available.', info);
      this.__onReady();
    });

    this.__autoUpdater.on('error', (err) => {
      debugLog('Error in auto-updater. ' + err);
      this.__onReady();
    });

    this.__autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      debugLog(log_message);
      this.__win.ipcEmit('update:progress', progressObj);
    });

    this.__autoUpdater.on('update-downloaded', (info) => {
      debugLog('Update downloaded');
      this.__win.BWindow.destroy();
      this.__autoUpdater.quitAndInstall();
    });
  }
}

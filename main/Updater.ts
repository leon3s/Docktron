import { EventEmitter } from 'events';

import {
  BrowserWindow
} from 'electron';
import {
  AppUpdater,
  autoUpdater,
} from 'electron-updater';

import { log } from './utils';

import Page from './Page';

export default class Updater {
  window:BrowserWindow;
  autoUpdater:AppUpdater;
  page:Page;
  eventEmiter:EventEmitter;

  constructor() {
    this.autoUpdater = autoUpdater;
    this.autoUpdater.logger = log;
    this.page = new Page('update');
    this.eventEmiter = new EventEmitter();
  }

  private _createUpdateWindow() {
    this.window = new BrowserWindow({
      show: false,
      center: true,
      frame: false,
      skipTaskbar: true,
      vibrancy: 'ultra-dark',
      webPreferences: {
        spellcheck: false,
        webviewTag: true,
        nodeIntegration: true,
        plugins: true,
        contextIsolation: false,
      },
    });

    this.window.webContents.on('dom-ready', () => {
      this.window.show();
    });
  }

  once(event:string, fn:(...args) => void) {
    this.eventEmiter.once(event, fn);
  }

  private _initEvent() {
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available.', info);
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available.', info);
      this.eventEmiter.emit('ready');
    });

    autoUpdater.on('error', (err) => {
      log.info('Error in auto-updater. ' + err);
      this.eventEmiter.emit('ready');
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      log.info(log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded');
      autoUpdater.quitAndInstall();
    });
  }

  public async checkForUpdate() {
    autoUpdater.checkForUpdatesAndNotify().then((res) => {
      log.info(res);
      if (!res) {
        this.eventEmiter.emit('ready');
      } else {
        // do something else ?
      }
    }).catch((err) => {
      log.error(err);
    });
  }
}

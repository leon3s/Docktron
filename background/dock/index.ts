import {
  ipcMain,
  IpcMainEvent,
  BrowserWindow,
} from 'electron';

import System from '../system';

import * as IPC_EVENTS from '../../ipc';

import {
  __appsDir,
  __configDir,
} from '../utils';

import {
  TrayModule,
  ConfigModule,
  PackagesModule,
  NotificationModule,
} from './modules';
import { WindowManager } from '../system/modules';

export default
class                   Dock {
  private __system:     System;
  public configManager: ConfigModule;
  public windowManager: WindowManager;

  constructor() {
    this.__system = new System();
  }

  public async boot() {
    await this.__system.boot();
    this.configManager = this.__system.loadModule<ConfigModule>(ConfigModule);
    this.__system.loadModule(PackagesModule);
    this.__system.loadModule(TrayModule);
    this.__system.loadModule(NotificationModule);
    this.configManager = this.__system.getModule<ConfigModule>(ConfigModule);
    this.windowManager = this.__system.getModule<WindowManager>(WindowManager);
  }

  public async start() {
    const {__system, configManager} = this;
    await __system.start(
      'com.docktron',
      'dock', {
        resizable: false,
        transparent: true,
    });
    this.__bindIpcEvents();
    __system.win.preRender(this.__preRender);
    __system.win.once('ready-to-show', function() {
      configManager.syncConfig();
      __system.win.show();
    });
    await __system.win.render();
  }

  private __bindIpcEvents() {
    const {__system} = this;
    ipcMain.on(IPC_EVENTS.DOCK.SHOW, (e:IpcMainEvent) => {
      const { size } = __system.screen.getPrimaryDisplay();
      const win = BrowserWindow.fromWebContents(e.sender);
      win.setSize(200, size.height);
      win.setContentSize(200, size.height);
      win.setPosition(size.width - 200, 0);
    });

    ipcMain.on(IPC_EVENTS.DOCK.APP_OPEN, (e:IpcMainEvent, pkg) => {
      console.log('calling open for ', {pkg});
      const win = this.windowManager.getByID(pkg.ID);
      this.__system.win.ipcEmit(IPC_EVENTS.NOTIFICATION.COUNT, {
        appId: pkg.id,
        number: 0,
      });
      win.show();
    });

    ipcMain.on(IPC_EVENTS.APP.GOBACK, (e) => {
      const win = BrowserWindow.fromWebContents(e.sender);
      win.webContents.send(IPC_EVENTS.APP.GOBACK);
    });

    ipcMain.on(IPC_EVENTS.APP.GONEXT, (e) => {
      const win = BrowserWindow.fromWebContents(e.sender);
      win.webContents.send(IPC_EVENTS.APP.GONEXT);
    });

    ipcMain.on(IPC_EVENTS.DOCK.HIDE, (e:IpcMainEvent) => {
      const { size } = __system.screen.getPrimaryDisplay();
      const win = BrowserWindow.fromWebContents(e.sender);
      win.setSize(1, size.height, false);
      win.setPosition(size.width - 1, 0);
    });
  }

  private __preRender = (win:BrowserWindow) => {
    const { size } = this.__system.screen.getPrimaryDisplay();
    win.setSize(200, size.height);
    win.setContentSize(200, size.height);
    win.setPosition(size.width - 200, 0);
    win.setSkipTaskbar(true);
    win.setMenuBarVisibility(false);
    win.setVisibleOnAllWorkspaces(true);
    win.setAlwaysOnTop(true, 'screen-saver');
  }
}

import {
  ipcMain,
  IpcMainEvent,
  BrowserWindow,
} from 'electron';

import System from '../system';

import * as IPC_EVENTS from '../../ipc';

import { IDockConfig } from '../../headers/docktron.h';

import {
  __appsDir,
  __configDir,
} from '../utils';
import config from './config';

import {
  PKGModule,
  TrayModule,
  WebappModule
} from './modules';

export default
class               Dock {
  private __system: System;
  private __config: IDockConfig;

  constructor() {
    this.__system = new System();
  }

  public async boot() {
    await this.__system.boot();
    this.__system.loadModule(PKGModule);
    this.__system.loadModule(TrayModule);
    this.__system.loadModule(WebappModule);
    this.__config = config(__appsDir);
  }

  public async start() {
    const {__system, __config} = this;
    await __system.start(
      'com.docktron',
      'dock', {
        resizable: false,
        transparent: true,
    });
    this.__bindIpcEvents();
    __system.win.preRender(this.__preRender);
    __system.win.once('ready-to-show', function() {
      __system.win.ipcEmit(IPC_EVENTS.DOCK.SYNC_CONFIG, __config);
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

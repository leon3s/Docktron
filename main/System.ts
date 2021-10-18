import path from 'path';
import {
  App,
  app,
  screen,
  Screen,
  Display,
  IpcMain,
  ipcMain,
} from 'electron';
import serve from 'electron-serve';

import Dock from './Dock';
import DockTray from './DockTray';
import DockConfig from './DockConfig';
import AppManager from './AppManager';

import '../headers/docktron.h';

import * as Events from './Events';
import { isProd, __static } from './utils';
import AppStore from './AppStore';
import { IApp } from '../headers/docktron.h';
import { existsSync } from 'fs';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath(
    'userData',
    `${app.getPath('userData')} (dev)`,
  );
}


const widevinecdmPath = path.join(__static, 'browser-plugins/widevinecdm/widevinecdm.dll');
const isExist = existsSync(widevinecdmPath);
console.log(isExist);
app.commandLine.appendSwitch('widevine-cdm-path', widevinecdmPath);
app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2209.1');

export default class System {
  app:App;
  dock:Dock;
  screen:Screen;
  tray:DockTray;
  ipcMain:IpcMain;
  appStore:AppStore;
  appManager:AppManager;
  dockConfig:DockConfig;
  primaryDisplay:Display;
  trayIconPath:string = path.join(__static, './images/docktron_logo.png');

  /** Bind electron app to our class */
  constructor() {
    this.app = app;
    this.ipcMain = ipcMain;
    this.app.setName('Docktron');
    this.app.setAppUserModelId('docktron.org');
  }

  /** bind display info */
  private _initDisplay() {
    this.screen = screen;
    this.primaryDisplay = this.screen.getPrimaryDisplay();
  }

  /** Init all subsystem */
  private _initSubsystem() {
    this._initDisplay();
    this._initEvents();
    this.dock = new Dock();
    this.tray = new DockTray(
      'Docktron',
      this.trayIconPath,
    );
    this.appStore = new AppStore();
    this.appManager = new AppManager();
    this.dockConfig = new DockConfig(this.dock);
    // Google services user agent
    // this.app.userAgentFallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36';
    this._initAppStoreEvents();
    this._initAppManagerEvents();
  }

  private _setupTray() {
    this.tray.create();
    this.tray.on('exit:click', () => {
      this.app.quit();
    });
    this.tray.on('store:click', () => {
      this.appStore.open();
    });
    this.tray.on('dock:dev-tools:click', () => {
      this.appStore.window.webContents.send('open:dev-tools');
    });
    this.tray.on('store:dev-tools:click', () => {
      this.appStore.window.webContents.send('open:dev-tools');
    });
  }

  /** init subsystem and config before enable dock  */
  private _start() {
    this._setupTray();
    const config = this.dockConfig.getConfig();
    this.dock.setupConfig(config);
    this.dock.start();
    this.appManager.preloadApps(config.apps);
    this.appStore.prepare();
  }

  private _initEvents() {
    const system = this;
    Object.keys(Events).forEach((key) => {
      const event = Events[key];
      ipcMain.on(event.name, event.fn(system));
    });
  }

  private _initAppStoreEvents() {
    this.appStore.on('appStore:app:update', (app:IApp) => {
      this.dockConfig.readConfig();
      this.appManager.onUpdateApp(app);
      this.dock.window.webContents.send('dock:config:reply', this.dockConfig.getConfig());
    });
    this.appStore.on('appStore:app:uninstall', (app:IApp) => {
      this.dockConfig.readConfig();
      this.appManager.killByID(app.id);
      this.dock.window.webContents.send('dock:config:reply', this.dockConfig.getConfig());
    });
  }

  private _initAppManagerEvents() {
    this.appManager.on('app:close', (e) => {
      const {id} = e;
      this.dock.window.webContents.send(Events.notificationCount.name, {
        appId: id,
        number: 0,
      });
    });
  }

  /** We prepare front to be show */
  private async _init() {
    this._initSubsystem();
    setTimeout(() => this._start(), 500);
  }

  /** Enable system */
  public async start() {
    const system = this;
    // Disable harware acceleration for transparent background compatibility
    // this.app.disableHardwareAcceleration();
    // Hide app in dock if we are on MacOSX
    if (process.platform === 'darwin') {
      this.app.dock.hide();
    }
    this.app.on('before-quit', function () {
      system.tray.destroy();
      system.dock.destroy();
      system.appStore.destroy();
      system.appManager.destroy();
    });
    // Quit the app once all windows are closed
    this.app.on('window-all-closed', () => {
      this.app.quit();
    });
    await this.app.whenReady();
    this._init();
    // this.app.on('widevine-ready', () => {
    //   this._init();
    // });
  }
}

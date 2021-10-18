import {
  screen,
  ipcMain,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from 'electron';

import Page from './Page';

import {
  IDockConfig,
} from '../headers/docktron.h';

export default class Dock {
  page:Page;
  window:BrowserWindow;
  config:IDockConfig;
  windowOptions:BrowserWindowConstructorOptions = {
    frame: false,
    resizable: false,
    skipTaskbar: true,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    vibrancy: 'ultra-dark',
    title: 'docktron',
    fullscreenable: false,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  };

  constructor() {
    this.page = new Page('dock');
  }

  private setupWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const {
      size,
    } = primaryDisplay;
    this.window.setSize(200, size.height);
    this.window.setContentSize(200, size.height);
    this.window.setPosition(size.width - 200, 0);
    this.window.setSkipTaskbar(true);
    this.window.setMenuBarVisibility(false);
    this.window.setVisibleOnAllWorkspaces(true);
    this.window.setAlwaysOnTop(true, 'screen-saver');
  }

  public destroy() {
    this.window.destroy();
  }

  public createWindow() {
    this.window = new BrowserWindow(this.windowOptions);
    this.setupWindow();
    this.window.on('close', function(e) {
      e.preventDefault();
    });
    this.window.on('ready-to-show', function() {
      this.show();
    })
  }

  public setupConfig(config:IDockConfig) {
    this.config = config;
  }

  public start() {
    this.createWindow();
    const {config} = this;
    ipcMain.on('dock:config', (e) => {
      e.reply('dock:config:reply', config);
    });
    this.window.loadURL(this.page.url);
  }
}

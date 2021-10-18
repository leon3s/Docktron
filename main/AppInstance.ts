import path from 'path';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';

import moment, { Moment } from 'moment';

import Page from './Page';
import { isProd, __static } from './utils';
import { IApp } from '../headers/docktron.h';

export default class AppInstance {
  url:string;
  name:string;
  page:Page;
  id:string;
  icon:string;
  window:BrowserWindow;
  notificationCount:number = 0;
  windowOptions:BrowserWindowConstructorOptions = {
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
  }
  lastFocusTime:Moment;
  windowState:string = 'hidden';

  static calculateId(name: string, url:string) {
    return Buffer.from(name + url).toString('base64');
  }

  constructor(app:IApp) {
    this.name = app.name;
    this.url = app.url;
    this.icon = app.icon;
    this.id = AppInstance.calculateId(app.name, app.url);
    this.page = new Page('app');
    this.page.setQuerystring({
      name: app.name,
      url: app.url,
      id: this.id,
      load: app.load,
      icon: app.icon,
      userAgent: app.userAgent,
      preloadPath: path.join(__static, './scripts/preload.js'),
    });
    this.windowOptions.title = this.name;
    this._attachWindow();
  }

  private _attachWindow() {
    this.window = new BrowserWindow(
      this.windowOptions,
    );
    // Not working ?
    // this.window.webContents.on('new-window', function(e, url) {
    //   // make sure local urls stay in electron perimeter
    //   if('file://' === url.substr(0, 'file://'.length)) {
    //     return;
    //   }
    //   console.log('Im called !');
    //   // and open every other protocols on the browser      
    //   e.preventDefault();
    //   shell.openExternal(url);
    // });
    this.window.loadURL(this.page.url);
    this.window.on('close', (e) => {
      e.preventDefault();
      this.hide();
      this.windowState = 'hidden';
    });
    this.window.on('blur', () => {
      this.lastFocusTime = moment();
      this.windowState = 'blur';
    });
    this.window.on('show', () => {
      this.windowState = 'visible';
    });
  }

  public show() {
    this.window.show();
  }

  public focus() {
    this.window.focus();
  }

  public hide() {
    this.window.hide();
  }
}

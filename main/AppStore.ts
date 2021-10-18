import fs from 'fs';
import path from 'path';
import imageType from 'image-type';
import { BrowserWindow } from "electron"
import { EventEmitter } from 'events';

import {
  __static,
  __appsDir,
  __configDir,
  isProd,
} from './utils';

import Page from "./Page";
import AppInstance from "./AppInstance";
import { IApp } from '../headers/docktron.h';

export default class AppStore {
  page:Page;
  window:BrowserWindow;
  configDir:string = __configDir;
  appsDir:string = __appsDir;
  eventEmitter:EventEmitter = new EventEmitter();

  constructor() {
    this.page = new Page('app');
    this.page.setQuerystring({
      name: 'Docktron Store',
      url: isProd ? 'http://docktron.org/store' : 'http://localhost:3001/store',
      id: AppInstance.calculateId('Docktron Store', 'http://localhost:3001/store'),
      load: '',
      icon: '/images/docktron_logo.png',
      userAgent: 'Docktron/1.0',
      preloadPath: path.join(__static, './scripts/preload.js'),
    });
  }
 
  prepare() {
    this.window = new BrowserWindow({
      show: false,
      center: true,
      frame: false,
      skipTaskbar: true,
      vibrancy: 'ultra-dark',
      webPreferences: {
        spellcheck: false,
        webviewTag: true,
        plugins: true,
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    this.window.webContents.session.setPreloads([
      path.join(__static, '/scripts/docktron_preload.js'),
      path.join(__static, '/scripts/preload.js'),
    ]);
    this.window.loadURL(this.page.url);
    this.window.on('close', (e) => {
      e.preventDefault();
      this.window.hide();
    });
  }

  private _imgBase64toBinary(b64:string) {
    return Buffer.from(atob(b64.replace('data:image/png;base64,', '').toString()), 'binary');
  }

  private _createAppIcon(appPath:string, appIcon:string):string|null {
    const imgBuffer = this._imgBase64toBinary(appIcon);
    const imgType = imageType(imgBuffer);
    if (imgType) {
      const iconName = `appIcon.${imgType.ext}`;
      const imgPath = path.join(appPath, iconName);
      fs.writeFileSync(imgPath, imgBuffer);
      return iconName;
    }
    return null;
  }

  private _createAppIndex(appPath:string, app:IApp) {
const js = `module.exports = {
  url: '${app.url}',
  name: '${app.name}',
  icon: '${app.icon}',
  userAgent: '${app.userAgent}',
  lastUpdateDate: '${app.lastUpdateDate}',
};
`;
    fs.writeFileSync(path.join(appPath, 'index.js'), js);
  }

  private _getAppPath(appName:string) {
    return path.join(this.appsDir, appName.toLowerCase());
  }

  public install(app:IApp) {
    const appPath = this._getAppPath(app.name);
    const bIsPathExist = fs.existsSync(appPath);
    console.log({
      appPath,
      bIsPathExist,
    });
    if (!bIsPathExist) {
      fs.mkdirSync(appPath);
    }
    const appIcon = this._createAppIcon(appPath, app.icon);
    if (appIcon) {
      this._createAppIndex(appPath, {
        ...app,
        icon: appIcon,
      });
      this.eventEmitter.emit('appStore:app:update', app);
    }
  }

  public getSystemApp(app:IApp):IApp|null {
    const appPath = this._getAppPath(app.name);
    const bIsPathExist = fs.existsSync(appPath);
    if (bIsPathExist) {
      const appInfoBuffer = fs.readFileSync(path.join(appPath, './index.js')).toString();
      const appInfo = eval(appInfoBuffer);
      return appInfo;
    }
    return null;
  }

  public uninstall(app:IApp) {
    const appPath = this._getAppPath(app.name);
    const bIsPathExist = fs.existsSync(appPath);
    if (bIsPathExist) {
      fs.rmSync(appPath, { recursive: true });
      this.eventEmitter.emit('appStore:app:uninstall', app);
    }
  }

  public on(event:string, listener:(...args:any) => void) {
    this.eventEmitter.on(event, listener);
  }

  public once(event:string, listener:(...args:any) => void) {
    this.eventEmitter.once(event, listener);
  }

  public removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }

  public open() {
    this.window.show();
  }

  public close() {
    this.window.hide();
  }

  public destroy() {
    if (this.window) {
      this.window.destroy();
    }
  }
}

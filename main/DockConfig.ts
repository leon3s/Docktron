import fs from 'fs';
import path from 'path';

import {
  IApp,
  IDockConfig,
} from '../headers/docktron.h';

import * as Events from '../events';

import {
  __configDir,
  __appsDir,
} from './utils';

import Dock from './Dock';
import AppInstance from './AppInstance';

export default class DockConfig {
  dock:Dock;
  config:IDockConfig;
  configDir:string = __configDir;
  appsDir:string = __appsDir;

  constructor(dock:Dock) {
    this.dock = dock;
    this.readConfig();
    // this._watchConfig();
  }

  private _watchConfig() {
    fs.watchFile(path.join(this.configDir, 'config'), () => {
      // this._readConfig();
      this.dock.window.webContents.send(Events.configUpdate, this.config);
    });
  }

  private parseApp(appPath:string, app:IApp): IApp {
    const {
      name,
      url,
      load,
      icon,
    } = app;
    if (load) {
      const loadJS = fs.readFileSync(path.join(appPath, load)).toString();
      app.load = loadJS;
    }
    const iconContent = fs.readFileSync(path.join(appPath, icon)).toString('base64');
    app.icon = `data:image/png;base64,${iconContent}`;
    app.id = AppInstance.calculateId(name, url);
    return app;
  }

  private _getApps(): IApp[] {
    const apps = [];
    const appNames = fs.readdirSync(this.appsDir);
    appNames.forEach((appName) => {
      const appPath = path.join(this.appsDir, appName);
      try {
        const js = fs.readFileSync(path.join(appPath, './index.js')).toString();
        const app = eval(js);
        const parsedApp = this.parseApp(appPath, app);
        apps.push(parsedApp);
      } catch (e) {
        console.error(e);
      }
    });
    return apps;
  }

  public readConfig() {
    this.config = {
      key: null,
      apps: [],
    };
    this.config.apps = this._getApps();
  }

  public getConfig() {
    return this.config;
  }
}

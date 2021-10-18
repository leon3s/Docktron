import moment from 'moment';
import {EventEmitter} from 'events';

import { isProd } from './utils';

import AppInstance from './AppInstance';

import { IApp } from '../headers/docktron.h';

interface AppInstances {
  [key:string]: AppInstance;
}

export default class AppManager {
  appIntances:AppInstances = {};
  eventEmitter:EventEmitter = new EventEmitter();

  private _AppIsRunning(id:string) {
    return this.appIntances[id] || null;
  }

  private _restoreAppInstance(appInstance: AppInstance) {
    const {window} = appInstance;
    const diffTime = moment.utc(moment()).diff(appInstance.lastFocusTime);
    console.log(diffTime);
    if (appInstance.windowState === 'blur' && (diffTime > 500)) {
      window.show();
      window.focus();
      this.eventEmitter.emit('app:show', {
        id: appInstance.id,
      });
      return;
    } else if (appInstance.windowState === 'blur' && (diffTime < 500)) {
      window.close();
      this.eventEmitter.emit('app:hide', {
        id: appInstance.id,
      });
      return;
    }
    if (appInstance.windowState === 'visible') {
      window.close();
      this.eventEmitter.emit('app:hide', {
        id: appInstance.id,
      });
      return;
    }
    if (appInstance.windowState === 'hidden') {
      window.show();
      window.focus();
      this.eventEmitter.emit('app:show', {
        id: appInstance.id,
      });
      return;
    }
    return;
  }

  private preloadApp(app:IApp) {
    const appInstance = new AppInstance(app);
    this.appIntances[appInstance.id] = appInstance;
    if (!isProd) {
      // appInstance.window.webContents.openDevTools({
      //   mode: 'detach',
      // });
    }
  }

  public preloadApps(apps:IApp[]) {
    apps.forEach((app) => {
      this.preloadApp(app);
    });
  }

  public getAppById(appId:string) {
    return this.appIntances[appId] || null;
  }

  public open(app:IApp) {
    const id = AppInstance.calculateId(app.name, app.url);
    const appInstance = this._AppIsRunning(id);
    if (appInstance) {
      this._restoreAppInstance(appInstance);
    }
  }

  public onUpdateApp(app:IApp) {
    const id = AppInstance.calculateId(app.name, app.url);
    const appInstance = this._AppIsRunning(id);
    if (appInstance) {
      // reload app with new setups
    } else {
      // start app
      this.preloadApp(app);
    }
  }

  killByID(id:string) {
    const appInstance = this._AppIsRunning(id);
    if (appInstance) {
      delete this.appIntances[id];
      appInstance.window.destroy();
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

  public destroy() {
    Object.keys(this.appIntances).forEach((key) => {
      const appInstance = this.appIntances[key];
      appInstance.window.destroy();
    });
  }
}

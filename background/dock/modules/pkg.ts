import vm from 'vm';
import fs from "fs";
import path from "path";
import imageType from 'image-type';

import { IDockConfig, IWebApp } from "../../../headers/docktron.h";

import { WindowManager } from "../../system/modules";
import Module, { TIpcListeners } from "../../system/Module";

import {
  __configDir,
  __appsDir,
  __isProd,
  __static,
} from "../../utils";

import config from '../config';
import * as IPC_EVENTS from '../../../ipc';

import { WebappModule } from './webapp';

export
class   PKGModule extends Module {
  public static settings = {
    id: 'system.pkg',
  };

  config:IDockConfig = {
    apps: [],
  };

  webappManager:WebappModule;

  ipcListeners:TIpcListeners = {
    [IPC_EVENTS.PKG.INSTALL]: (e, pkg) => {
      const pkgVersion = this.__getAppVersion(pkg);
      if (!pkgVersion) {
        const response = this.__installApp(pkg);
        const dockConfig = config(__appsDir);
        this.system.win.ipcEmit(IPC_EVENTS.DOCK.SYNC_CONFIG, dockConfig);
        e.returnValue = response;
        return;
      }
      if (pkgVersion.lastUpdateDate !== pkg.lastUpdateDate) {
        const response = this.__installApp(pkg);
        const dockConfig = config(__appsDir);
        this.webappManager.loadApp(pkg);
        this.system.win.ipcEmit(IPC_EVENTS.DOCK.SYNC_CONFIG, dockConfig);
        e.returnValue = response;
        return;
      }
      e.returnValue = {success: false, error: new Error('Package have latest update')};
    },
    [IPC_EVENTS.PKG.VERSION]: (e, pkg) => {
      const appVersion = this.__getAppVersion(pkg);
      console.log(appVersion);
      e.returnValue = appVersion;
    },
    [IPC_EVENTS.PKG.UNINSTALL]: (e, pkg) => {
      if (pkg && pkg.id) {
        const appPath = path.join(__appsDir, pkg.id);
        const bIsPathExist = fs.existsSync(appPath);
        if (bIsPathExist) {
          fs.rmSync(appPath, { recursive: true });
          const dockConfig = config(__appsDir);
          this.system.win.ipcEmit(IPC_EVENTS.DOCK.SYNC_CONFIG, dockConfig);
        }
      }
    }
  }

  public async boot() {
    this.config = config(__appsDir);
    this.webappManager = this.system.getModule<WebappModule>(WebappModule);
    const windowManager = this.system.getModule<WindowManager>(WindowManager);
    this.win = windowManager.createWindow('system.pkg', 'app', {
      title: 'Packages',
      alwaysOnTop: false,
    });
    this.win.bindData({
      name: 'Doctron Packages',
      userAgent: 'Docktron/1.0',
      icon: '/images/docktron-logo.png',
      preloadPath: path.join(__static, './scripts/preload.js'),
      url: __isProd ? 'https://docktron.org/store' : 'http://localhost:3001/store',
    });
    this.win.instantiate();
    this.win.render();
    this.win.once('ready-to-show', () => {
      this.win.show();
    });
  };

  private __generateAppIcon(appPath, iconB64) {
    const iconBuffer = Buffer.from(iconB64.replace('data:image/png;base64,', ''), 'base64');
    const imgType = imageType(iconBuffer);
    if (imgType) {
      const iconName = `icon.${imgType.ext}`;
      const imgPath = path.join(appPath, iconName);
      fs.writeFileSync(imgPath, iconBuffer);
      return iconName;
    }
    return null;
  }

  private __installApp(pkg:IWebApp) {
    try {
      const appPath = path.join(__appsDir, pkg.ID);
      const bIsPathExist = fs.existsSync(appPath);
      if (!bIsPathExist) {
        fs.mkdirSync(appPath);
      }
      const iconeName = this.__generateAppIcon(appPath, pkg.icon);
  const js = `module.exports = {
    id: '${pkg.ID}',
    url: '${pkg.url}',
    name: '${pkg.name}',
    icon: '${iconeName}',
    userAgent: '${pkg.userAgent}',
    lastUpdateDate: '${pkg.lastUpdateDate}',
  };
  `;
      fs.writeFileSync(path.join(appPath, 'index.js'), js);
      return {success:true, error: null};
    } catch (e) {
      return {success: false, error: new Error(e)};
    }
  }

  private __getAppVersion(pkg:IWebApp) {
    try {
      const pkgJS = fs.readFileSync(path.join(__appsDir, pkg.ID, 'index.js')).toString();
      const pkgVm = new vm.Script(pkgJS);
      const pkgConfig = pkgVm.runInNewContext({
        module: {},
      });
      return pkgConfig;
    } catch (e) {
      return null;
    }
  }
}

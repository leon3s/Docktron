/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \background\dock\modules\pkg.ts
 * Project: docktron
 * Created Date: Tuesday, 19th October 2021 3:46:58 pm
 * Author: leone
 * -----
 * Last Modified: Sun Oct 24 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import vm from 'vm';
import fs from "fs";
import path from "path";
import imageType from 'image-type';

import { IWebApp } from "@docktron/headers";

import {NativeImage, nativeImage} from 'electron';

import * as IPC_EVENTS from '~/ipc';

import { WindowManager } from "../../system/modules";
import Module, { TIpcListeners } from "../../system/Module";

import { ConfigModule } from './config';

import {
  __configDir,
  __appsDir,
  __isProd,
  __static,
} from "../../utils";

export
class             PackagesModule extends Module {
  public static   settings = {
    id: 'dock.pkg',
  };

  configModule:   ConfigModule;
  windowManager:  WindowManager;

  ipcListeners:   TIpcListeners = {

    [IPC_EVENTS.PKG.INSTALL]:
      (e, pkg) => {
        const pkgVersion = this.__getAppVersion(pkg);
        if (!pkgVersion) {
          const response = this.__installApp(pkg);
          this.configModule.syncConfig();
          e.returnValue = response;
          return;
        }
        if (pkgVersion.lastUpdateDate !== pkg.lastUpdateDate) {
          const response = this.__installApp(pkg);
          this.__loadApp(pkg);
          this.configModule.syncConfig();
          e.returnValue = response;
          return;
        }
        e.returnValue = {success: false, error: new Error('Package have latest update')};
    },

    [IPC_EVENTS.PKG.VERSION]:
      (e, pkg) => {
        const appVersion = this.__getAppVersion(pkg);
        e.returnValue = appVersion;
    },

    [IPC_EVENTS.PKG.UNINSTALL]:
      (e, pkg) => {
        if (pkg && pkg.id) {
          const appPath = path.join(__appsDir, pkg.id);
          const bIsPathExist = fs.existsSync(appPath);
          if (bIsPathExist) {
            fs.rmSync(appPath, { recursive: true });
            this.configModule.syncConfig();
          }
        }
    },
  }

  public async boot() {
    this.windowManager = this.system.getModule<WindowManager>(WindowManager);
    this.configModule = this.system.getModule<ConfigModule>(ConfigModule);
    this.__createPackageWindow();
    this.__loadApps();
  };

  private __loadApp = (app:IWebApp) => {
    // console.log('loading app ', app.icon);
    const iconBuffer = Buffer.from(app.icon.replace('data:image/png;base64,', ''), 'base64');
    console.log('--- loooad app ---');
    console.log(iconBuffer);
    const icon = nativeImage.createFromBuffer(iconBuffer);
    console.log(icon);
    console.log(icon.isEmpty());
    console.log(icon.toPNG());
    console.log('--- loooad app ---');
    const win = this.windowManager.createWindow(app.id, 'app', {
      title: app.name,
      icon: icon,
    });
    win.bindData({
      ...app,
      preloadPath: path.join(__static, './scripts/preload.js'),
    });
    win.instantiate();
    win.on('close', (e) => {
      e.preventDefault();
      win.hide();
    });
    win.render();
  }

  private __loadApps() {
    this.configModule.config.apps.forEach(this.__loadApp);
  }

  private __createPackageWindow() {
    this.win = this.windowManager.createWindow('system.pkg', 'app', {
      title: 'Packages',
      alwaysOnTop: false,
    });
    this.win.bindData({
      name: 'Docktron Packages',
      userAgent: 'Docktron/1.0',
      icon: '/images/docktron-logo.png',
      preloadPath: path.join(__static, './scripts/preload.js'),
      url: __isProd ? 'https://docktron.org/packages' : 'http://localhost:3001/packages',
    });
    this.win.instantiate();
    this.win.on('close', (e) => {
      e.preventDefault();
      this.win.hide();
    });
    this.win.render();
    this.win.once('ready-to-show', () => {
      this.win.show();
    });
  }

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

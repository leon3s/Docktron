/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \background\dock\modules\config.ts
 * Project: docktron
 * Created Date: Wednesday, 20th October 2021 3:54:35 pm
 * Author: leone
 * -----
 * Last Modified: Sun Oct 24 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import fs from 'fs';
import vm from 'vm';
import path from 'path';

import Module from '../../system/Module';

import * as IPC_EVENTS from '~/ipc';

import {
  __configDir,
  createDebugLog,
} from '../../utils';

import {
  IWebApp,
  IDockConfig,
} from '@docktron/headers';

const debugLog = createDebugLog('DockConfigModule');

export
class                   ConfigModule extends Module {
  public static settings = {
    id: 'dock.config',
  }
  public config:        IDockConfig;
  private __configDir:  string = __configDir;

  public async boot() {
    this.config = this.readConfigDir();
    // debugLog('booting config', this.config);
  }

  public readAppDir(appDirPath:string):IWebApp {
    try {
      const appConfig = this.readConfigFile(path.join(appDirPath, './index.js'));
      if (appConfig.load) {
        const loadJS = fs.readFileSync(path.join(appDirPath, appConfig.load)).toString();
        appConfig.load = loadJS;
      }
      const iconContent = fs.readFileSync(path.join(appDirPath, appConfig.icon)).toString('base64');
      appConfig.icon = `data:image/png;base64,${iconContent}`;
      return appConfig;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public readAppsDir() {
    const appsDirPath = path.join(this.__configDir, 'apps');
    const bIsAppsDirExist = fs.existsSync(appsDirPath);
    if (!bIsAppsDirExist) return [];
    const appNames = fs.readdirSync(appsDirPath);
    return appNames.reduce((acc, appName) => {
      const appPath = path.join(appsDirPath, appName);
      const app = this.readAppDir(appPath);
      if (app) acc.push(app);
      return acc;
    }, []);
  }

  public readConfigFile(confPath:string) {
    const configString = fs.readFileSync(confPath).toString();
    const script = new vm.Script(configString);
    const config = script.runInNewContext({
      module: {},
    });
    return config;
  }

  public readConfigDir() {
    let baseConf = {
      apps: [],
    };
    const bIsConfigExist = fs.existsSync(this.__configDir);
    if (!bIsConfigExist) {
      fs.mkdirSync(this.__configDir);
      return baseConf;
    }
    const confPath = path.join(this.__configDir, 'config.js');
    const bIsConfPathExist = fs.existsSync(confPath);
    if (bIsConfPathExist) {
      const localConf = this.readConfigFile(confPath);
      baseConf = {
        ...baseConf,
        ...localConf,
      };
    }
    baseConf.apps = this.readAppsDir() || [];
    return baseConf;
  }

  public syncConfig() {
    this.config = this.readConfigDir();
    debugLog('Sync config', this.config, this.__configDir);
    this.system.win.ipcEmit(IPC_EVENTS.DOCK.SYNC_CONFIG, this.config);
  }
}

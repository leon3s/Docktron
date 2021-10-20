import { ipcMain } from 'electron';

import Kernel from './Kernel';
import Module from './Module';
import Window, {WindowOpts} from './Window';
import AutoUpdater from './AutoUpdater';

import * as moduleNatifs from './modules';

import { createDebugLog } from '../utils';

const debugLog = createDebugLog('System');

type ModuleType = typeof Module;

export default
class                     System {
  private __kernel:       Kernel;
  private __win:          Window;
  private __autoUpdater:  AutoUpdater;
  private __modules:      { [id:string]: Module } = {};

  get win() {
    return this.__win;
  }

  constructor() {
    debugLog('constructor')
    this.__kernel = new Kernel();
    this.__autoUpdater = new AutoUpdater(this);
  }

  get screen() {
    return this.__kernel.screen;
  }

  public async boot() {
    debugLog('boot');
    await this.__kernel.boot();
    await this.__loadModuleNatifs();
    this.beforeQuit();
  }

  public async quit() {
    this.__kernel.quit();
  }

  public beforeQuit(callback = () => {}) {
    this.__kernel.beforeQuit(async () => {
      await this.__stopModules();
      callback();
    });
  }

  public async loadModule(NewModule:ModuleType) {
    const {id} = NewModule.settings;
    debugLog('loadModule', id);
    if (this.__modules[id]) {
      throw new Error(`Module ${id} is Already loaded aborded.`);
    }
    this.__modules[id] = new NewModule(this);
  }

  public getModule<T extends Module>(ModuleRef:ModuleType|string) {
    if (typeof ModuleRef === 'string') {
      return this.__modules[ModuleRef] as T;
    }
    return this.__modules[ModuleRef.settings.id] as T;
  }

  public async start(id:string, render:string, opts:WindowOpts = {}) {
    debugLog('start', {id, render});
    this.__autoUpdater.onReady(this.__startMainWindow(id, render, opts));
    await this.__autoUpdater.checkForUpdate();
  }

  private __startMainWindow(id:string, render:string, opts:WindowOpts = {}) {
    return async () => {
      this.__win = new Window(id, render, opts);
      this.__win.instantiate();
      await this.__bootModules();
    }
  }

  private async __stopModules() {
    await Promise.all(Object.keys(this.__modules).map(async (ID:string) => {
      const module = this.__modules[ID];
      await module.stop();
    }));    
  }

  private async __bootModules() {
    await Promise.all(Object.keys(this.__modules).map(async (ID:string) => {
      debugLog('Booting module: ', ID);
      const module = this.__modules[ID];
      Object.keys(module.ipcListeners).forEach((key) => {
        ipcMain.on(key, module.ipcListeners[key]);
      });
      await module.boot();
    }));
  }

  private async __loadModuleNatifs() {
    debugLog('__loadModuleNatifs');
    Promise.all(Object.keys(moduleNatifs).map(async (moduleName) => {
      const ModuleNatif:typeof Module = moduleNatifs[moduleName];
      await this.loadModule(ModuleNatif);
    }));
  }
}

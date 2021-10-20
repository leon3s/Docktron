import path from "path";

import { PKGModule } from "./pkg";
import { __static } from "../../utils";

import * as IPC_EVENTS from '../../../ipc';

import { WindowManager } from "../../system/modules";
import Module, { TIpcListeners } from "../../system/Module";

import { IWebApp } from "../../../headers/docktron.h";

export class
WebappModule extends        Module {
  public static settings = {
    id: 'sys.webapp',
  }

  private __windowManager:  WindowManager;

  ipcListeners:             TIpcListeners = {
    [IPC_EVENTS.DOCK.APP_OPEN]: (e, pkg:IWebApp) => {
      const win = this.__windowManager.getByID(pkg.id);
      win.show();
    },
  }

  public loadApp = (app:IWebApp) => {
    const win = this.__windowManager.createWindow(app.id, 'app', {
      title: app.name,
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

  async boot() {
    const pkgModule = this.system.getModule<PKGModule>(PKGModule);
    this.__windowManager = this.system.getModule<WindowManager>(WindowManager);
    pkgModule.config.apps.forEach(this.loadApp);
  }
}

/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \background\dock\modules\notification.ts
 * Project: docktron
 * Created Date: Sunday, 24th October 2021 9:20:58 pm
 * Author: leone
 * -----
 * Last Modified: Sun Oct 24 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import * as IPC_EVENTS from '~/ipc';

import Module, {TIpcListeners} from "../../system/Module";
import { WindowManager } from "../../system/modules/WindowManager";

export
class                   NotificationModule extends Module {
  public static settings = {
    id: 'sys.notification',
  }

  windowManager:        WindowManager;
  ipcListeners:         TIpcListeners = {

    [IPC_EVENTS.NOTIFICATION.NEW]:
      (e, app) => {
        this.system.win.ipcEmit(IPC_EVENTS.NOTIFICATION.NEW, app);
    },

    [IPC_EVENTS.NOTIFICATION.CLICK]:
      (e, {appId}) => {
        this.windowManager.getByID(appId).show();
    },
  }

  async boot() {
    this.windowManager = this.system.getModule<WindowManager>(WindowManager);
  }
}

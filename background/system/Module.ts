import { IpcMainEvent } from 'electron';

import System from '.';
import Window from './Window';

interface                 IModuleSettings {
  id:                     string;
};

export type               TIpcListeners = {
  [key:string]:           (e:IpcMainEvent, ...args:any[]) => void
}

export default
class                     Module {
  public static settings: IModuleSettings;
  public ipcListeners:    TIpcListeners = {} as TIpcListeners;
  public system:          System;
  public win:             Window;

  constructor(system:System) {
    this.system = system;
    return this;
  }

  public async boot() {};

  public async stop() {};
}

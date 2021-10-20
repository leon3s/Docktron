import path from 'path';
import {Menu, Tray} from 'electron';

import Module from '../../system/Module';

import { PKGModule } from './pkg';

import { __static } from '../../utils';

export
class                     TrayModule extends Module {
  public static settings = {
    id: 'sys.tray',
  }

  public tray:            Tray;
  private __title:        string = 'Docktron';
  private __iconPath:     string = path.join(__static, './images/docktron_logo.png');

  async boot() {
    this.tray = new Tray(this.__iconPath);
    this.tray.setToolTip(this.__title);
    const windowManager = this.system.getModule<PKGModule>(PKGModule);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Packages',
        click: () => {
          windowManager.win.show();
        },
      },
      {
        label: 'Exit',
        click: () => {
          this.system.quit();
        }
      },
    ]);
    this.tray.setContextMenu(contextMenu);
  }

  async stop() {
    this.tray.destroy();
  }
}

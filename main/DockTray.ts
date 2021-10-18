import {
  app,
  Tray,
  Menu,
} from 'electron';
import {EventEmitter} from 'events';

export default class DockTray {
  tray:Tray;
  title:string;
  iconPath:string;
  eventEmitter:EventEmitter = new EventEmitter();

  constructor(title:string, iconPath:string) {
    this.title = title;
    this.iconPath = iconPath;
  }

  public destroy() {
    this.tray.destroy();
  }

  public on(name:string, fn:(...args) => void) {
    this.eventEmitter.on(name, fn);
  }

  public off(name, fn:(...args) => void) {
    this.eventEmitter.off(name, fn);
  }

  public once(event:string, listener:(...args:any) => void) {
    this.eventEmitter.once(event, listener);
  }

  public removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }

  public create() {
    this.tray = new Tray(this.iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Store',
        click: () => {
          this.eventEmitter.emit('store:click');
        },
      },
      {
        label: 'Developers',
        submenu: [
          {
            label: 'open store dev-tools',
            click: () => {
              this.eventEmitter.emit('store:dev-tools:click');
            },
          },
          {
            label: 'open dock dev-tools',
            click: () => {
              this.eventEmitter.emit('dock:dev-tools:click');
            },
          },
        ]
      },
      {
        label: 'Exit',
        click: () => {
          this.eventEmitter.emit('exit:click');
        }
      },
    ]);
    this.tray.setToolTip(this.title);
    this.tray.setContextMenu(contextMenu);
  }
}

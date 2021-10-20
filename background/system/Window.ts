import * as E from 'electron';

import {NextRender} from './NextRender';

type TPreRenderFn = (win:E.BrowserWindow) => void;

export interface WindowOpts
  extends E.BrowserWindowConstructorOptions {}

export default
class                     Window {
  public  id:             string;
  private __win:          E.BrowserWindow;
  private __nextRender:   NextRender;
  private __preRenderFn:  TPreRenderFn
  private __opts:         E.BrowserWindowConstructorOptions = {
    show: false,
    center: true,
    frame: false,
    skipTaskbar: false,
    vibrancy: 'ultra-dark',
    webPreferences: {
      enableRemoteModule: true,
      spellcheck: false,
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  }

  get BWindow() {
    return this.__win;
  }

  constructor(id:string, pageName:string, opts:E.BrowserWindowConstructorOptions = {}) {
    this.id = id;
    this.__opts = {
      ...this.__opts,
      ...opts,
    }
    this.__nextRender = new NextRender(pageName);
  }

  public on(eName, eFn: (...args:any[]) => void) {
    this.__win.on(eName, eFn);
  }

  public once(eName, eFn: (...args:any[]) => void) {
    this.__win.once(eName, eFn);
  }

  public ipcOn(eName, eFn: (...args:any[]) => void) {
    this.__win.webContents.on(eName, eFn);
  }

  public ipcEmit(eName:string, ...args) {
    this.__win.webContents.send(eName, ...args);
  }

  public bindData(data) {
    this.__nextRender.bindData(data)
  }

  public show() {
    this.__win.show();
  }

  public hide() {
    this.__win.hide();
  }

  public instantiate() {
    this.__win = new E.BrowserWindow(this.__opts);
  }

  public preRender(preRenderFn:TPreRenderFn) {
    this.__preRenderFn = preRenderFn;
  }

  public async render() {
    if (this.__preRenderFn) {
      this.__preRenderFn(this.__win);
    }
    await this.__win.loadURL(this.__nextRender.url);
  }
}

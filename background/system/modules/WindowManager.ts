import Module, { TIpcListeners } from "../Module";
import Window, { WindowOpts } from "../Window";

export
class   WindowManager extends Module {
  private __wins: {[ID:string]: Window} = {};

  public static settings = {
    id: 'sys.window_manager',
  };

  ipcListeners:TIpcListeners = {}

  getByID(id:string) {
    return this.__wins[id];
  }

  createWindow(id:string, render:string, opts:WindowOpts = {}): Window {
    if (this.__wins[id]) throw new Error(`Window already have this ID: ${id}`);
    const win = new Window(id, render, {
      ...opts,
    });
    this.__wins[id] = win;
    return win;
  }

  async stop() {
    Promise.all(Object.keys(this.__wins).map(async (ID) => {
      const win = this.__wins[ID];
      win.BWindow.destroy();
    }));
  }
}

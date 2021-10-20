/**
  docktron SDK injected to every webapp
*/
const {
  shell,
  ipcRenderer,
} = require('electron');

/** Click listener to open _blank target in default browser **/
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.target === '_blank' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href);
  }
});

/** NOTIFICATION OVERRIDE **/
const OldNotification = window.Notification;
window.Notification = function(...args) {
  ipcRenderer.send('notification', {
    appId: window.docktronAppId,
    args,
  });
  const notification = new OldNotification(...args);
  setTimeout(() => {
    const oldOnClick = notification.onclick;
    notification.onclick = function() {
      ipcRenderer.send('notification:click', {
        appId: window.docktronAppId,
      });
      if (oldOnClick) oldOnClick();
    }
  }, 100);
  return notification;
}
Object.keys(OldNotification).forEach((key) => {
  window.Notification[key] = OldNotification[key];
});

class PKG {
  install = async (pkg) => {
    const {sucess, error} = await ipcRenderer.sendSync('system:pkg:install', pkg);
    return {sucess, error};
  }

  version = async (pkg) => {
    const pkgInfo = await ipcRenderer.sendSync('system:pkg:version', pkg);
    return pkgInfo;
  }
}

class DockNotification {
  setValue = (number) => {
    ipcRenderer.send('notification:count', {
      appId: window.docktronAppId,
      number,
    });
  }
}

class System {
  constructor() {
    this.pkg = new PKG();
  }
}

class DocktronSDK {
  constructor() {
    this.system = new System();
    this.notification = new DockNotification();
  }
  isInsideDocktron = () => true;
}

window.docktronSDK = new DocktronSDK();

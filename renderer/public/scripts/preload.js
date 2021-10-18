/**
  docktron SDK injected to every webapp
*/
const {
  shell,
  ipcRenderer,
} = require('electron');

function setNotificationCount(number) {
  ipcRenderer.send('notification:count', {
    appId: window.docktronAppId,
    number,
  });
}

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

function installApp(app) {
  ipcRenderer.send('docktron:install:app', app);
}

async function isAppInstalled(app) {
  const appInfo = await ipcRenderer.sendSync('docktron:is:app:installed', app);
  return appInfo;
}

document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.target === '_blank' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href);
  }
});

Object.keys(OldNotification).forEach((key) => {
  window.Notification[key] = OldNotification[key];
});

const appStore = {
  install: installApp,
  getSystemApp: isAppInstalled,
}

const dockNotification = {
  setNotificationCount,
}

window.docktronSDK = {
  isInsideDocktron: () => true,
  appStore,
  dockNotification,
  setNotificationCount,
};

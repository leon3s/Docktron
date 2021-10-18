import {
  IpcMainEvent,
  BrowserWindow,
} from "electron";

import {eventCreator} from './utils';

import System from "./System";

import * as Events from '../events';

import {
  IApp,
  IEventNotification,
  IEventNotificationCount,
} from "../headers/docktron.h";

export const dockShow = eventCreator(Events.dockShow, (system:System) =>
(e:IpcMainEvent) => {
  const {size} = system.primaryDisplay;
  const browserWindow = BrowserWindow.fromWebContents(e.sender);
  browserWindow.setSize(200, size.height);
  browserWindow.setContentSize(200, size.height);
  browserWindow.setPosition(size.width - 200, 0);
});

export const dockHide = eventCreator(Events.dockHide, (system:System) =>
(e:IpcMainEvent) => {
  const {size} = system.primaryDisplay;
  const browserWindow = BrowserWindow.fromWebContents(e.sender);
  browserWindow.setSize(1, size.height, false);
  browserWindow.setPosition(size.width - 1, 0);
});

export const appOpen = eventCreator(Events.appOpen, (system:System) =>
(e: IpcMainEvent, app: IApp) => {
  system.appManager.open(app);
  system.dock.window.webContents.send(Events.notificationCount, {
    appId: app.id,
    number: 0,
  });
});

export const notificationCount = eventCreator(Events.notificationCount, (system:System) =>
(e:IpcMainEvent, notificationCount:IEventNotificationCount) => {
  system.dock.window.webContents.send(Events.notificationCount, notificationCount);
});

export const notification = eventCreator(Events.notification, (system:System) =>
(e:IpcMainEvent, notification:IEventNotification) => {
  console.log(notification);
  system.dock.window.webContents.send(Events.notification, notification);
});

export const notificationClick = eventCreator(Events.notificationClick, (system:System) =>
(e:IpcMainEvent, notificationClick) => {
  const appInstance = system.appManager.getAppById(notificationClick.appId);
  system.dock.window.webContents.send(Events.notificationCount, {
    appId: appInstance.id,
    number: 0,
  });
  appInstance.show();
  appInstance.focus();
});

export const appInstall = eventCreator(Events.installApp, (system:System) =>
(e:IpcMainEvent, app:IApp) => {
    system.appStore.install(app);
  },
)

export const isAppInstalled = eventCreator(Events.isAppInstalled, (system:System) =>
(e:IpcMainEvent, app:IApp) => {
  const systemApp = system.appStore.getSystemApp(app);
  e.returnValue = systemApp;
});

export const appOpenDevTools = eventCreator(Events.appOpenDevTools, (system:System) =>
(e:IpcMainEvent, app:IApp) => {
  const appInstance = system.appManager.getAppById(app.id);
  appInstance.window.webContents.send('open:dev-tools');
});

export const appReload = eventCreator(Events.appReload, (system:System) =>
(e:IpcMainEvent, app:IApp) => {
  const appInstance = system.appManager.getAppById(app.id);
  appInstance.window.webContents.reload();
});

export const appUninstall = eventCreator(Events.appUninstall, (system:System) =>
(e:IpcMainEvent, app:IApp) => {
  system.appStore.uninstall(app);
});

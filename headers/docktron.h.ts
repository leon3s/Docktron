declare const NodeJS: {
  global: {
    __static: string;
  }
}

export interface IApp {
  name:string;
  url:string;
  icon:string;
  id:string;
  load:string;
  userAgent:string;
  lastUpdateDate:Date;
  lastCreationDate:Date;
}

export interface IEventNotification {
  appId:string;
  args: any;
}

export interface IDockConfig {
  key:string;
  apps: IApp[];
}

export interface IEventNotificationCount {
  appId:string;
  number:number;
}

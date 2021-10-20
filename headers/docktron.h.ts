export interface IApp {
  name:string;
  url:string;
  icon:string;
  id:string;
  load:string;
  userAgent:string;
  lastUpdateDate:Date;
  lastCreationDate:Date;
  ID: string;
}

export interface IEventNotification {
  appId:string;
  args: any;
}

export interface IDockConfig {
  apps: IApp[];
}

export interface IEventNotificationCount {
  appId:string;
  number:number;
}

export interface IWebApp {
  name:string;
  url:string;
  icon:string;
  id:string;
  load:string;
  userAgent:string;
  lastUpdateDate:Date;
  lastCreationDate:Date;
  ID: string;
}

import os from 'os';
import defaultLog from 'electron-log';
import path from 'path';

defaultLog.transports.file.level = 'info';

export const log = defaultLog;

export const isProd: boolean = process.env.NODE_ENV === 'production';

export const __static = isProd ? path.resolve(__dirname) : path.join(__dirname, '../renderer/public/');

export const __configDir:string = path.join(os.homedir(), '.docktron');

export const __appsDir:string = path.join(__configDir, 'apps');

export const eventCreator = (name:string, fn:Function) => {
  return {
    name,
    fn,
  }
}

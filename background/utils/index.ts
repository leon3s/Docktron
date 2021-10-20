import os from 'os';
import defaultLog from 'electron-log';
import path from 'path';

defaultLog.transports.file.level = 'info';

export const log = defaultLog;

export const isTest:      boolean = process.env.NODE_ENV === 'test';
export const __isProd:    boolean = process.env.NODE_ENV === 'production';

export const __configDir: string = path.join(os.homedir(), '.docktron');
export const __appsDir:   string = path.join(__configDir, 'apps');
export const __static:    string = __isProd ? path.resolve(__dirname) : path.join(__dirname, '../renderer/public/');

export const createDebugLog = (title:string) => (...args:any[]) => {
  const [subtitle, ...otherArgs] = args;
  log.info(`${title}:${subtitle}`, ...otherArgs);
}

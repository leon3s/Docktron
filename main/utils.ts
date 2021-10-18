import os from 'os';
import path from 'path';

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

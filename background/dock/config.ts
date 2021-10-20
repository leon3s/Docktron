import fs from 'fs';
import path from 'path';
import vm from 'vm';

import {
  IWebApp,
  IDockConfig,
} from '../../headers/docktron.h';
import { createDebugLog } from '../utils';

const debugLog = createDebugLog('Config')

const __parseWebApp = (appPath:string, app:IWebApp): IWebApp => {
  const {
    name,
    url,
    load,
    icon,
  } = app;
  if (load) {
    const loadJS = fs.readFileSync(path.join(appPath, load)).toString();
    app.load = loadJS;
  }
  const iconContent = fs.readFileSync(path.join(appPath, icon)).toString('base64');
  app.icon = `data:image/png;base64,${iconContent}`;
  return app;
}

const getConfig = (appDirPath:string): IDockConfig => {
  debugLog('getConfig', {appDirPath});
  const apps = [];
  const appNames = fs.readdirSync(appDirPath);
  appNames.forEach((appName) => {
    const appPath = path.join(appDirPath, appName);
    try {
      const js = fs.readFileSync(path.join(appPath, './index.js')).toString();
      const appScript = new vm.Script(js);
      const appConfig = appScript.runInNewContext({
        module: {},
      });
      const parsedApp = __parseWebApp(appPath, appConfig);
      apps.push(parsedApp);
    } catch (e) {
      console.error(e);
    }
  });
  return {
    apps,
  };
}

export default getConfig;

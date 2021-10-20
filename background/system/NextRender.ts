import serve from 'electron-serve';
import querystring from 'querystring';

import { __isProd } from '../utils';

if (__isProd) {
  serve({ directory: 'app' });
}

export
class       NextRender {
  url:      string;
  used:     boolean;
  baseUrl:  string;

  constructor(page: string) {
    const devPath = `http://localhost:3002/${page}`;
    const prodPath = `app://./${page}.html`
    this.url = __isProd ? prodPath : devPath;
    this.baseUrl = this.url;
    return this;
  }

  bindData(data = {}) {
    let sep = this.used ? '&': '?';
    this.used = true;
    this.url = `${this.url}${sep}${querystring.stringify(data)}`;
    return this;
  }
}

import querystring from 'querystring';

import { isProd } from './utils';

export default class Page {
  url: string;
  used: boolean;
  baseUrl: string;

  constructor(page: string) {
    const devPath = `http://localhost:3002/${page}`;
    const prodPath = `app://./${page}.html`
    this.url = isProd ? prodPath : devPath;
    this.baseUrl = this.url;
    return this;
  }

  setQuerystring(params = {}) {
    let sep = this.used ? '&': '?';
    this.used = true;
    this.url = `${this.url}${sep}${querystring.stringify(params)}`;
    return this;
  }
}

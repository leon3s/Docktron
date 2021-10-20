import url from 'url';
import path from 'path';
import React from 'react';

import * as Style from './style';
import { ipcRenderer } from 'electron';

interface WebviewProps {
  id:string;
  url:string;
  name:string;
  load:string;
  userAgent:string;
  preloadPath:string;
}

interface WebView extends HTMLElement {
  openDevTools: () => void;
  executeJavaScript: (js:string) => Promise<{e:string}>;
}

export default class Webview extends React.PureComponent<WebviewProps> {
  componentDidMount() {
    const webview = document.getElementById('app-webview') as WebView;
    ipcRenderer.on('open:dev-tools', () => {
      webview.openDevTools();
    });
    webview.addEventListener('dom-ready', () => {
      webview.executeJavaScript(`
        window.docktronAppId = '${this.props.id}';
      `).catch((err) => {
        console.error(err);
      });
      if (this.props.load) {}
    });
  }

  render() {
    const preload = url.format({
      slashes: true,
      protocol: 'file:',
      pathname: path.resolve(this.props.preloadPath),
    });
    console.log('render webview !', {
      props: this.props,
    });
    return (
      <Style.Container id="webview-container">
        <webview
          id="app-webview"
          title={this.props.name}
          preload={preload}
          src={this.props.url}
          webpreferences="contextIsolation=no, enableRemoteModule=yes"
          useragent={this.props.userAgent}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
        </webview>
      </Style.Container>
    )
  }
}

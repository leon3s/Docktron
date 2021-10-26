import url from 'url';
import path from 'path';
import React from 'react';
import { ipcRenderer } from 'electron';

import * as IPC_EVENTS from '~/ipc';

import type {WebviewTag} from 'electron';

import * as Style from './style';

interface WebviewProps {
  id:string;
  url:string;
  name:string;
  load:string;
  userAgent:string;
  preloadPath:string;
};

export default class Webview extends React.PureComponent<WebviewProps> {
  componentDidMount() {
    const webview = document.getElementById('app-webview') as WebviewTag;

    ipcRenderer.on(IPC_EVENTS.APP.GOBACK, () => {
      webview.canGoBack() && webview.goBack();
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
          webpreferences="contextIsolation=no"
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

/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\containers\Dock\index.tsx
 * Project: docktron
 * Created Date: Tuesday, 17th August 2021 7:59:22 am
 * Author: leone
 * -----
 * Last Modified: Fri Oct 22 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import React from 'react';
import {ipcRenderer} from 'electron';
import {
  IWebApp,
  IDockConfig,
} from '@docktron/headers'

import * as IPC_EVENTS from '~/ipc';

import AppList from '../../components/AppList';

import * as Style from './style';

interface IDockProps {
  config:IDockConfig;
  notifications: {
      [key:string]:number;
  }
}

export default class Dock extends React.PureComponent<IDockProps> {
  ref = React.createRef<AppList>();

  onPressApp = (app: IWebApp): void => {
    ipcRenderer.send(IPC_EVENTS.DOCK.APP_OPEN, app);
  }

  onMouseEnter = () => {
    ipcRenderer.send(IPC_EVENTS.DOCK.SHOW);
  }

  onMouseLeave = () => {
    ipcRenderer.send(IPC_EVENTS.DOCK.HIDE);
    this.ref.current.onCloseContextMenu();
  }

  onContextMenuOption = (action:string, app:IWebApp) => {
    ipcRenderer.send(action, app);
  }

  render() {
    if (!this.props.config) return null;
    return (
      <Style.Container
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <AppList
          ref={this.ref}
          onPressApp={this.onPressApp}
          apps={this.props.config.apps}
          notifications={this.props.notifications}
          onPressContextMenuOption={this.onContextMenuOption}
        />
      </Style.Container>
    )
  }
}

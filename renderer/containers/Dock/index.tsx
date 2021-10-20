import React from 'react';
import {ipcRenderer} from 'electron';

import AppList from '../../components/AppList';

import {
  IApp,
  IDockConfig,
} from '../../../headers/docktron.h'

import * as IPC_EVENTS from '../../../ipc';

import * as Style from './style';

interface IDockProps {
  config:IDockConfig;
  notifications: {
      [key:string]:number;
  }
}

export default class Dock extends React.PureComponent<IDockProps> {
  ref = React.createRef<AppList>();

  onPressApp = (app: IApp): void => {
    ipcRenderer.send(IPC_EVENTS.DOCK.APP_OPEN, app);
  }

  onMouseEnter = () => {
    ipcRenderer.send(IPC_EVENTS.DOCK.SHOW);
  }

  onMouseLeave = () => {
    ipcRenderer.send(IPC_EVENTS.DOCK.HIDE);
    this.ref.current.onCloseContextMenu();
  }

  onContextMenuOption = (action:string, app:IApp) => {
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

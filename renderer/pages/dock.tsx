import React from 'react';

import {
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

import Dock from '../containers/Dock';

import {
  IEventNotification,
  IEventNotificationCount,
} from '../../headers/docktron.h';

import * as IPC_EVENTS from '../../ipc';

export default class DockPage extends React.Component {
  state = {
    config: null,
    notifications: {},
  };

  componentDidMount() {
    ipcRenderer.on(IPC_EVENTS.DOCK.SYNC_CONFIG, (e, config) => {
      this.setState({
        config,
      });
    });
    ipcRenderer.on('notification:count',
    (e:IpcRendererEvent, data:IEventNotificationCount) => {
      const {appId, number} = data;
      this.setState({
        config: this.state.config,
        notifications: {
          ...this.state.notifications,
          [appId]: number,
        }
      });
    });
    ipcRenderer.on('notification',
    (e:IpcRendererEvent, data:IEventNotification) => {
      const {appId, args} = data;
      this.setState({
        config: this.state.config,
        notifications: {
          ...this.state.notifications,
          [appId]: (this.state.notifications[appId] || 0) + 1,
        },
      });
    });
  }

  render() {
    const {config} = this.state;
    return (
      config ?
        <Dock
          config={config}
          notifications={this.state.notifications}
        />
      : null
    );
  }
};

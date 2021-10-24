/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\pages\dock.tsx
 * Project: docktron
 * Created Date: Tuesday, 17th August 2021 7:00:27 am
 * Author: leone
 * -----
 * Last Modified: Su/10/yyyy 09:nn:14
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import {PureComponent} from 'react';

import {
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

import Dock from '../containers/Dock';

import {
  IEventNotification,
  IEventNotificationCount,
} from '@docktron/headers';

import * as IPC_EVENTS from '../../ipc';

export default
class DockPage extends PureComponent {
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
    ipcRenderer.on(IPC_EVENTS.NOTIFICATION.COUNT,
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
    ipcRenderer.on(IPC_EVENTS.NOTIFICATION.NEW,
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

import React from 'react';

import {
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

import Dock from '../containers/Dock';

import {
  IDockConfig,
  IEventNotification,
  IEventNotificationCount,
} from '../../headers/docktron.h';

export default class DockPage extends React.Component {
  state = {
    config: null,
    notifications: {},
  };

  private parseUrl = () => {
    const url = new window.URL(window.location.href);
    const config = url.searchParams.get('config');
    return {
      config: JSON.parse(config),
    }
  }


  componentDidMount() {
    ipcRenderer.send('dock:config');
    ipcRenderer.on('dock:config:reply', (e, config) => {
      this.setState({
        config,
      });
    })
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
      console.log('im called !');
      this.setState({
        config: this.state.config,
        notifications: {
          ...this.state.notifications,
          [appId]: (this.state.notifications[appId] || 0) + 1,
        },
      }, () => {
        console.log(this.state);
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

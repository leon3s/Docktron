/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\components\AppContextMenu\index.tsx
 * Project: docktron
 * Created Date: Monday, 18th October 2021 12:07:57 pm
 * Author: leone
 * -----
 * Last Modified: Fri Oct 22 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import React from 'react';
import { IWebApp } from '@docktron/headers';

import * as Style from './style';

interface IAppContextMenu {
  app:IWebApp;
  posY:number;
  posX:number;
  onClose:() => void;
  onPressOption:(action:string) => void;
}

import * as IPC_EVENTS from '../../../ipc';

export default class AppContextMenu extends React.PureComponent<IAppContextMenu> {
  onPressOption = (action:string) => () => {
    this.props.onPressOption(action);
    this.props.onClose();
  }

  render() {
    const {
      posX,
      posY,
      onClose,
    } = this.props;
    return (
      <React.Fragment>
        <Style.Backdrop onClick={onClose} />
        <Style.Container
          posX={posX}
          posY={posY}
          onBlur={onClose}
          onContextMenu={onClose}
        >
          <Style.MenuList>
            {/* <Style.MenuOption onClick={this.onPressOption(IPC_EVENTS.appOpenDevTools)}>
              Open dev tools
            </Style.MenuOption> */}
            {/* <Style.MenuOption onClick={this.onPressOption(IPC_EVENTS.appReload)}>
              Reload
            </Style.MenuOption> */}
            <Style.MenuOption onClick={this.onPressOption(IPC_EVENTS.PKG.UNINSTALL)}>
              Uninstall
            </Style.MenuOption>
          </Style.MenuList>
        </Style.Container>
      </React.Fragment>
    )
  }
}
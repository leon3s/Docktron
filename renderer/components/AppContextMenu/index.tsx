import React from 'react';
import { IApp } from '../../../headers/docktron.h';

import * as Style from './style';

interface IAppContextMenu {
  app:IApp;
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
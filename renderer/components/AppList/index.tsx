/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\components\AppList\index.tsx
 * Project: docktron
 * Created Date: Tuesday, 17th August 2021 7:48:45 am
 * Author: leone
 * -----
 * Last Modified: Fri Oct 22 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import {
  Fragment,
  PureComponent,
} from 'react';

import {IWebApp} from '@docktron/headers'

import AppItem from '../AppItem';
import AppContextMenu from '../AppContextMenu';

import * as Style from './style';

interface                   IWebAppListProps {
  apps:                     IWebApp[];
  onPressApp:               (app: IWebApp) => void;
  notifications:            {[key:string]:number}
  onPressContextMenuOption: (action:string, app:IWebApp) => void;
}

export default
class AppList extends PureComponent<IWebAppListProps> {
  state = {
    posX:0,
    posY:0,
    app:null,
    showContextMenu: false,
  }

  onPressAppGenerator = (app: IWebApp) => () => {
    this.props.onPressApp(app);
  }

  onContextMenu = (e:React.MouseEvent<HTMLDivElement>, app:IWebApp) => {
    e.preventDefault();
    this.setState({
      showContextMenu: true,
      posX: e.pageX,
      posY: e.pageY,
      app,
    });
  }

  onPressContextMenuOption = (action:string) => {
    this.props.onPressContextMenuOption(action, this.state.app);
  }

  onCloseContextMenu = () => {
    this.setState({
      showContextMenu: false,
    });
  }

  render() {
    const {apps} = this.props;
    const {posX, posY, app, showContextMenu} = this.state;
    return (
      <Fragment>
        {showContextMenu ?
          <AppContextMenu
            app={app}
            posX={posX}
            posY={posY}
            onClose={this.onCloseContextMenu}
            onPressOption={this.onPressContextMenuOption}
          />
        : null}
        <Style.Container>
          <Style.List>
            {apps.map((data, i) => (
              <AppItem
                key={data.name}
                noborder
                onContextMenu={this.onContextMenu}
                position="right"
                onPress={this.onPressAppGenerator(data)}
                index={i}
                selected={true}
                data={data}
                notification={this.props.notifications[data.id] || 0}
              />
            ))}
          </Style.List>
        </Style.Container>
      </Fragment>
    )
  }
}

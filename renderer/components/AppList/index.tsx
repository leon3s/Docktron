import React from 'react';

import AppItem from '../AppItem';

import * as Style from './style';

import {IApp} from '../../../headers/docktron.h'
import AppContextMenu from '../AppContextMenu';

interface IAppListProps {
  apps: IApp[];
  onPressApp: (app: IApp) => void;
  notifications: {
      [key:string]:number;
  }
  onPressContextMenuOption:(action:string, app:IApp) => void;
}

export default class AppList extends React.PureComponent<IAppListProps> {
  state = {
    posX:0,
    posY:0,
    app:null,
    showContextMenu: false,
  }

  onPressAppGenerator = (app: IApp) => () => {
    this.props.onPressApp(app);
  }

  onContextMenu = (e:React.MouseEvent<HTMLDivElement>, app:IApp) => {
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
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}

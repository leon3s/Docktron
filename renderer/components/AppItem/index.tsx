import React from 'react';

import { IApp } from '../../../headers/docktron.h';

import CountBadge from '../CountBadge';

import * as Style from './style';

interface IAppItemProps {
  data: IApp;
  index:number;
  position:string;
  selected:boolean;
  noborder:boolean;
  onPress:() => void;
  notification:number;
  onContextMenu:(e:React.MouseEvent<HTMLDivElement>, app:IApp) => void;
}

export default class AppItem extends React.PureComponent<IAppItemProps> {
  onContextMenu = (e:React.MouseEvent<HTMLDivElement>) => {
    this.props.onContextMenu(e, this.props.data);
  }

  render() {
    const {
      data,
      onPress,
      notification,
    } = this.props;
    return (
      <Style.Container
        title={data.name}
        onClick={onPress}
        data-itemID={data.id}
      >
        <Style.CountBadgeContainer>
          {notification ?
            <CountBadge number={notification} />
          : null}
        </Style.CountBadgeContainer>
        <Style.Icon
          onContextMenu={this.onContextMenu}
          src={data.icon}
        />
      </Style.Container>
    );
  }
}

/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\components\AppItem\index.tsx
 * Project: docktron
 * Created Date: Tuesday, 17th August 2021 7:39:59 am
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

import CountBadge from '../CountBadge';

import * as Style from './style';

interface IAppItemProps {
  data: IWebApp;
  index:number;
  position:string;
  selected:boolean;
  noborder:boolean;
  onPress:() => void;
  notification:number;
  onContextMenu:(e:React.MouseEvent<HTMLDivElement>, app:IWebApp) => void;
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

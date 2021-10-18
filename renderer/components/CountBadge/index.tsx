import React from 'react';

import * as Style from './style';

interface ICountBadgeProps {
  number:number;
  className?:string;
}

const CountBadge = ({ number, className }:ICountBadgeProps) => (
  <Style.View className={className}>
    <Style.Text>{number}</Style.Text>
  </Style.View>
);

export default CountBadge;

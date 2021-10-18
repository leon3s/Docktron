import React from 'react';

import * as Style from './style';

interface IHeaderBarProps {
  title:string;
  favicon:string;
}

export default class HeaderBar extends React.PureComponent<IHeaderBarProps> {

  onClickExit = () => {
    window.close();
  }

  render() {
    const {
      title,
      favicon,
    } = this.props;
    return (
      <Style.Container>
        <Style.FaviconContainer>
          <Style.Favicon src={favicon} />
        </Style.FaviconContainer>
        <Style.HeaderMovable>
          <Style.Title>
            {title}
          </Style.Title>
        </Style.HeaderMovable>
        <Style.ButtonContainer>
          <Style.Button onClick={this.onClickExit}/>
        </Style.ButtonContainer>
      </Style.Container>
    )
  }
}

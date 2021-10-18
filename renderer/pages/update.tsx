import React from 'react';
import { ipcRenderer } from 'electron';

import HeaderBar from '../containers/HeaderBar';
import Update from '../containers/Update';

interface IUpdateProps {
}

export default class App extends React.Component<IUpdateProps> {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <Update />
    )
  }
}

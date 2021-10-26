/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\pages\app.tsx
 * Project: docktron
 * Created Date: Saturday, 25th September 2021 3:42:20 pm
 * Author: leone
 * -----
 * Last Modified: Tu/10/yyyy 04:nn:57
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import React from 'react';

import HeaderBar from '../containers/HeaderBar';
import Webview from '../containers/Webview';

interface AppProps {
  url:string;
  name:string;
  id:string;
  preloadPath:string;
}

export default class App extends React.Component<AppProps> {
  state = {
    ID: '',
    url: '',
    name: '',
    load: '',
    icon: '',
    userAgent: '',
    preloadPath: '',
    isReady: false,
  };

  componentDidMount() {
    const pageUrl = new window.URL(window.location.href);
    const query = pageUrl.searchParams.values();
    console.log({query});
    const ID = pageUrl.searchParams.get('ID');
    const url = pageUrl.searchParams.get('url');
    const name = pageUrl.searchParams.get('name');
    const load = pageUrl.searchParams.get('load');
    const icon = pageUrl.searchParams.get('icon');
    const userAgent = pageUrl.searchParams.get('userAgent');
    const preloadPath = pageUrl.searchParams.get('preloadPath');
    this.setState({
      ID,
      url,
      name,
      load,
      icon,
      userAgent,
      preloadPath,
      isReady: true,
    });
  }

  render() {
    const {
      ID,
      url,
      name,
      icon,
      isReady,
      load,
      userAgent,
      preloadPath,
    } = this.state;
    return (
      isReady ?
        <React.Fragment>
          <HeaderBar
            title={name}
            favicon={icon}
          />
          <Webview
            ID={ID}
            url={url}
            name={name}
            load={load}
            userAgent={userAgent}
            preloadPath={preloadPath}
          />
        </React.Fragment>
      : null
    )
  }
}

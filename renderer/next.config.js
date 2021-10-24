/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\next.config.js
 * Project: docktron
 * Created Date: Tuesday, 17th August 2021 7:00:27 am
 * Author: leone
 * -----
 * Last Modified: Sun Oct 24 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '~/ipc': '../ipc',
      }
    }
    return config;
  },
};

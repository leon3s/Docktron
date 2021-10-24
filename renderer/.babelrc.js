/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \renderer\.babelrc.js
 * Project: docktron
 * Created Date: Saturday, 2nd October 2021 2:19:23 pm
 * Author: leone
 * -----
 * Last Modified: Sun Oct 24 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */
const path = require('path');

module.exports = {
  "presets": [
    "next/babel",
    path.join(__dirname, '../.babelrc.js'),
  ],
  "plugins": [
    ["styled-components", { "ssr": true }],
  ]
}

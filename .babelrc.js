/*
*  ___   _   _ |  _|_ __  _     
*  |__) [_] |_ |<  |_ |  [_] |\|
* 
* File: \.babelrc.js
* Project: docktron
* Created Date: Friday, 22nd October 2021 2:04:48 am
* Author: leone
* -----
* Last Modified: Fri Oct 22 2021
* Modified By: leone
* -----
* Copyright (c) 2021 docktron
* -----
*/

module.exports = function(api) {
  api.cache(() => process.env.NODE_ENV);
  return {
    "presets": ["@babel/preset-typescript"],
    "plugins": [
      ["module-resolver", {
        "alias": {
          "~/ipc": "./ipc",
          "~/system": "./background/system"
        },
      }]
    ]
  }
}

const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge').default;
const configure = require('./webpack.config');

const existsSync = (f) => {
  try {
    fs.accessSync(f, fs.constants.F_OK);
    return true;
  } catch (_) {
    return false;
  }
};

const cwd = process.cwd();
const ext = existsSync(path.join(cwd, 'tsconfig.json')) ? '.ts' : '.js';

const getNextronConfig = () => {
  const nextronConfigPath = path.join(cwd, 'nextron.config.js');
  if (existsSync(nextronConfigPath)) {
    return require(nextronConfigPath);
  } else {
    return {};
  }
};

const getWebpackConfig = (env) => {
  const { mainSrcDir, webpack } = getNextronConfig();
  const userConfig = merge(configure(env), {
    entry: {
      background: path.join(cwd, mainSrcDir || 'main', `background${ext}`),
    },
    output: {
      filename: '[name].js',
      path: path.join(cwd, 'app'),
    },
  });
  const userWebpack = webpack || {};
  if (typeof userWebpack === 'function') {
    return userWebpack(userConfig, env);
  } else {
    return merge(userConfig, userWebpack);
  }
};

module.exports.getNextronConfig = getNextronConfig;
module.exports.getWebpackConfig = getWebpackConfig;
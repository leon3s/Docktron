const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();
const externals = require(path.join(cwd, 'package.json')).dependencies;

const existsSync = (f)=> {
  try {
    fs.accessSync(f, fs.constants.F_OK);
    return true;
  } catch (_) {
    return false;
  }
};

const getBabelrc = () => {
  if (existsSync(path.join(cwd, '.babelrc'))) return path.join(cwd, '.babelrc');
  if (existsSync(path.join(cwd, '.babelrc.js'))) return path.join(cwd, '.babelrc.js');
  if (existsSync(path.join(cwd, 'babel.config.js'))) return path.join(cwd, 'babel.config.js');
  return path.join(__dirname, './babel.js');
};

module.exports = (env) => ({
  mode: env,
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [...Object.keys(externals || {})],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(cwd, 'app'), 'node_modules'],
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: false,
            extends: getBabelrc(),
          },
        },
        exclude: [
          /node_modules/,
          path.join(cwd, 'renderer'),
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],
});

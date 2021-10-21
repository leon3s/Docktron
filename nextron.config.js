const path = require('path');

module.exports = {
  testBin: 'mocha',
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'background',
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: 'renderer',

  // main process' webpack config
  webpack: (defaultConfig, env) => {
    const webpackConfig = Object.assign(defaultConfig, {
      entry: {
        background: path.resolve('./background/index.ts'),
      },
    });
    return webpackConfig;
  },
};

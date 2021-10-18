const path = require('path');
module.exports = {
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'main',
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: 'renderer',

  // main process' webpack config
  webpack: (defaultConfig, env) => {
    const ret = Object.assign(defaultConfig, {
      entry: {
        background: path.resolve('./main/main.ts'),
      },
    });
    console.log({
      ret,
      defaultConfig,
    });
    return ret;
  },
};

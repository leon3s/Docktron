const path = require('path');
const execa = require('execa');
const delay = require('delay');
const webpack = require('webpack');
const {
  getWebpackConfig,
} = require('./webpack');

function mainExit() {
  process.exit(0);
}
process.env.NODE_ENV = 'development';

function spawnMocha() {
  const mochaPath = path.join(__dirname, './node_modules/.bin/mocha');
  const mocha = execa(mochaPath, ['--verbose'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    stripFinalNewline: true,
  });
  mocha.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code);
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137);
      }
      process.exit(1);
    }
    process.exit(0);
  });
  mocha.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
  return mocha;
}

function spawnWebpack() {
  const compiler = webpack(getWebpackConfig('development'));
  return new Promise((resolve, reject) => {
    compiler.run(function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function spawnNext() {
  const nextPath = path.join(__dirname, './node_modules/.bin/next');
  const nextPS = execa(nextPath, ['./renderer', '--port', '3002'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    detached: true,
    stripFinalNewline: true,
  });
  return nextPS;
}

async function main() {
  const nextPS = spawnNext();
  // Wait for next to build renderer
  await delay(8000);
  const compiler = spawnWebpack();
  await compiler;

  const mocha = spawnMocha();

  function onExit() {
    nextPS.kill('SIGTERM', {
      forceKillAfterTimeout: 100
    });
    mocha.kill('SIGTERM', {
      forceKillAfterTimeout: 100
    });
  }

  process.on('SIGINT', mainExit);
  process.on('SIGTERM', mainExit);
  process.on('exit', onExit);
  await mocha;
}

(async() => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

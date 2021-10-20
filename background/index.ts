import Dock from './dock';

const dock = new Dock();

(async function main() {
  await dock.boot();
  await dock.start();
})();

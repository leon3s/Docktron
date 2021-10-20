const path = require('path');
const assert = require('assert');
const electronPath = require('electron');
const Application = require('spectron').Application;

const app = new Application({
    path: electronPath,
    env: {
        NODE_ENV: 'production',
    },
    chromeDriverArgs: [`user-data-dir=${path.join(__dirname, '../test-data.tmp')}`],
    args: [path.join(__dirname, '..', )],
});

const __global = {
    TIMEOUT: 100000,
}

const mainWindowUrl = 'http://localhost:3002/dock';
const storeUrl = 'http://localhost:3001/store';

describe('Docktron spec', function() {
    this.timeout(__global.TIMEOUT);

    before(async function() {
        this.timeout(__global.TIMEOUT);
        await app.start();
        return true;
    });

    it('Should have a visible window', async function() {
        this.timeout(__global.TIMEOUT);
        await app.client.waitUntilWindowLoaded(__global.TIMEOUT);
        const isVisible = await app.browserWindow.isVisible();
        assert.strictEqual(isVisible, true);
        return true;
    });

    it(`Main window should have url ${mainWindowUrl}`, async function() {
        this.timeout(__global.TIMEOUT);
        const url = await app.client.getUrl();
        assert.strictEqual(url, mainWindowUrl);
        
        return true;
    });

    it(`Should have a Package window url ${storeUrl}`, async function() {
        await app.client.switchWindow('Packages');
        await app.client.waitUntilWindowLoaded();
        const el = await app.client.$('#webview-container');
        const text = await el.getText();
        console.log(text);
        return true;
    });

    after(async function() {
        this.timeout(__global.TIMEOUT);
        await app.stop();
        return true;
    });
});

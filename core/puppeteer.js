const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { IS_PROD } = require('../utils/constants');

puppeteer.use(StealthPlugin());

// In order to run chromium processes in parallel. https://github.com/puppeteer/puppeteer/issues/594#issuecomment-325919885
process.setMaxListeners(Infinity);

const getBrowserInstance = async (port) => {
  const browser = await puppeteer.launch({
    args: IS_PROD ? ['--no-sandbox', `--proxy-server=socks5://127.0.0.1:${port}`] : ['--no-sandbox'],
    devtools: !IS_PROD,
    executablePath: IS_PROD ? '/usr/bin/chromium-browser' : undefined,
  });
  return browser.createIncognitoBrowserContext();
};

module.exports = {
  getBrowserInstance,
};

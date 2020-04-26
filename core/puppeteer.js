const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { IS_PROD } = require('../utils/constants');

puppeteer.use(StealthPlugin());

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

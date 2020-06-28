const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { IS_PROD } = require('../utils/constants');

puppeteer.use(stealthPlugin());

// In order to run chromium processes in parallel. https://github.com/puppeteer/puppeteer/issues/594#issuecomment-325919885
process.setMaxListeners(Infinity);

const getBrowserInstance = async (port) => {
  const browser = await puppeteer.launch({
    args: IS_PROD ? ['--no-sandbox', `--proxy-server=socks5://127.0.0.1:${port}`] : ['--no-sandbox'],
    devtools: !IS_PROD,
    executablePath: IS_PROD ? '/usr/bin/chromium-browser' : undefined,
  });
  const incognitoBrowserContext = browser.createIncognitoBrowserContext();
  incognitoBrowserContext.close = browser.close;
  return incognitoBrowserContext;
};

module.exports = {
  getBrowserInstance,
};

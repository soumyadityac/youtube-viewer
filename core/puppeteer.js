const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { isProduction } = require('../utils');

puppeteer.use(StealthPlugin());

const getBrowserInstance = async (port) => {
  return puppeteer.launch({
    args: isProduction() ? ['--no-sandbox', `--proxy-server=socks5://127.0.0.1:${port}`] : ['--no-sandbox'],
    devtools: !isProduction(),
    executablePath:  isProduction() ? '/usr/bin/chromium-browser' : undefined,
  });
};

module.exports = {
  getBrowserInstance,
};

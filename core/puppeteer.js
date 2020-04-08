const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const getBrowserInstance = async (port) => {
  return puppeteer.launch({
    args: ['--no-sandbox', `--proxy-server=socks5://127.0.0.1:${port}`],
    // devtools: true,
  });
};

module.exports = {
  getBrowserInstance,
};

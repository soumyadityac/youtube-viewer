const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const getBrowserInstance = async (port) => {
  return puppeteer.launch({
    args: [`--proxy-server=socks5://127.0.0.1:${port}`],
    // devtools: true,
  });
};

module.exports = {
  getBrowserInstance,
};

const puppeteer = require('puppeteer');

const getBrowserInstance = async (port) => {
  return puppeteer.launch({
    args: ['--disable-gpu', '--full-memory-crash-report', '--unlimited-storage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', `--proxy-server=socks5://127.0.0.1:${port}`],
    // devtools: true,
  });
};

module.exports = {
  getBrowserInstance,
};

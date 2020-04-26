const chalk = require('chalk');

const store = {};

const info = (message) => console.log(`${chalk.blue.inverse(`[INFO] [${(new Date()).toLocaleTimeString()}]`)} ${chalk.blue(message)}`);
const error = (message) => console.log(`${chalk.red.inverse(`[ERROR] [${(new Date()).toLocaleTimeString()}]`)} ${chalk.red(message)}`);
const success = (message) => console.log(`${chalk.green.inverse(`[SUCCESS] [${(new Date()).toLocaleTimeString()}]`)} ${chalk.green(message)}`);

const logFailedAttempt = (url, ipAddr) => {
  error(`An attempt to view ${url} with IP: ${ipAddr} was probably blocked.`);
};

const logCount = async (page, url, ipAddr, duration) => {
  try {
    const currentLiveViewCount = await page.$eval('.view-count', (viewCountNode) => viewCountNode.innerText.replace(/[^0-9]/g, ''));
    if (!store[url]) store[url] = { initial: currentLiveViewCount };
    store[url].current = currentLiveViewCount;
    store[url].added = store[url].current - store[url].initial;
    success(`Attempted ${url} with IP: ${ipAddr} for ${duration} seconds. (Init View Count: ${store[url].initial} Current View Count: ${store[url].current} Views added this session: ${store[url].added})`);
  } catch {
    logFailedAttempt(url, ipAddr);
  }
};

module.exports = {
  logCount,
  logFailedAttempt,
  info,
  error,
  success,
};

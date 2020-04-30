const chalk = require('chalk');

const { IS_PROD } = require('./constants');

const store = {};

const info = (message) => console.log(`${chalk.white.inverse(` [${(new Date()).toLocaleTimeString()}] - INFO    `)} ${chalk.white(message)}`);
const error = (message) => console.log(`${chalk.red.inverse(` [${(new Date()).toLocaleTimeString()}] - ERROR   `)} ${chalk.red(message)}`);
const success = (message) => console.log(`${chalk.green.inverse(` [${(new Date()).toLocaleTimeString()}] - SUCCESS `)} ${chalk.green(message)}`);
const debug = (message) => {
  if (IS_PROD) return;
  console.log(`${chalk.magenta.inverse(` [${(new Date()).toLocaleTimeString()}] - DEBUG   `)} ${chalk.magenta(message)}`);
};
const warn = (message) => console.log(`${chalk.yellow.inverse(` [${(new Date()).toLocaleTimeString()}] - WARN    `)} ${chalk.yellow(message)}`);

const logFailedAttempt = (url, ipAddr) => {
  warn(`An attempt to view ${url} with IP: ${ipAddr} was probably blocked.`);
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
  warn,
  success,
  debug,
};

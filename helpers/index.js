/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');

const { logger } = require('../utils');

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationInSeconds) => {
  for (const url of targetUrlsList) {
    await page.goto(url, { waitUntil: 'load' });
    try {
      await page.waitForSelector('.view-count', { timeout: 5000 });
      await page.mouse.click(100, 100);
      const duration = (durationInSeconds + _random(-(durationInSeconds / 6), (durationInSeconds / 6), true));
      await page.waitFor(duration * 1000);
      await logger.logCount(page, url, ipAddr, duration);
    } catch {
      logger.logFailedAttempt(url, ipAddr);
    }
  }
};

module.exports = { watchVideosInSequence };

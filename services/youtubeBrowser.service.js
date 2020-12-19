const _shuffle = require('lodash/shuffle');
const _take = require('lodash/take');

const puppeteer = require('../core/puppeteer');
const { watchVideosInSequence } = require('../helpers');
const { logger } = require('../utils');
const { VIEW_ACTION_COUNT, IP_GETTER_URL, PAGE_DEFAULT_TIMEOUT } = require('../utils/constants');

const getCurrentIP = async (page) => {
  await page.goto(IP_GETTER_URL, { waitUntil: 'load' });
  return page.$eval('body', (body) => body.innerText);
};

const handlePageCrash = (page) => (error) => {
  logger.error('Browser page crashed');
  logger.debug(error);
  page.close();
};

const viewVideosInBatch = async ({ targetUrls, durationInSeconds, port }) => {
  let browser;
  try {
    browser = await puppeteer.getBrowserInstance(port);
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    page.setDefaultTimeout(PAGE_DEFAULT_TIMEOUT * 1000);
    page.on('error', handlePageCrash(page));
    page.on('pageerror', handlePageCrash(page));

    await page.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
    });
    const ipAddr = await getCurrentIP(page);
    const targetUrlsForAction = _take(_shuffle(targetUrls), VIEW_ACTION_COUNT);
    await watchVideosInSequence(page, ipAddr, targetUrlsForAction, durationInSeconds);
    await page.close();
  } catch (error) {
    logger.warn('Entire view action in a batch failed. Waiting for TOR to acquire a new set of IPs');
    logger.debug(error);
  } finally {
    await browser.close();
  }
};

module.exports = { getCurrentIP, viewVideosInBatch };

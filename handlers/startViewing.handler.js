const _shuffle = require('lodash/shuffle');
const _take  = require('lodash/take');
const _random = require('lodash/random');

const puppeteer = require('../core/puppeteer');
const { logger } = require('../utils');

const getCurrentIP = async (page) => {
  await page.goto("https://api.ipify.org/", { waitUntil: "load" });
  return await page.$eval('body', body => body.innerText);
}

const watchVideos = async (page, ipAddr, targetUrlsList, durationInSeconds) => {
  for (const url of targetUrlsList) {
    await page.goto(url, { waitUntil: "load" });
    try {
      await page.waitForSelector('.view-count', { timeout: 5000 });
      await page.mouse.click(100, 100);
      const duration = (durationInSeconds + _random(-20, 0, true));
      await page.waitFor(duration * 1000);
      await logger.logCount(page, url, ipAddr, duration);
    } catch {
      logger.logFailedAttempt(url, ipAddr);
    }
  }
}

const startViewingHandler = async ({ targetUrl, durationInSeconds, port }) => {
  let log = `[${new Date().toLocaleString()}] - Port: ${port} - `;
  try {
    const browser = await puppeteer.getBrowserInstance(port);
    const page = await browser.newPage();
    page.setDefaultTimeout(600000);
    await page.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
    });
    const ipAddr = await getCurrentIP(page);
    const targetUrlsList = _take(_shuffle(targetUrl), 10);
    await watchVideos(page, ipAddr, targetUrlsList, durationInSeconds);
    await page.close();
    await browser.close();
  } catch(err) {
    console.log("Failed - ", err);
    await browser.close();
    log += err;
  }
  return log;
}

module.exports = startViewingHandler;
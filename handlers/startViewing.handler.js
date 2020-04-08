const _shuffle = require('lodash/shuffle');
const _take  = require('lodash/take');

const puppeteer = require('../core/puppeteer');

const startViewingHandler = async ({ targetUrl, durationInSeconds, port }) => {
  let log = `[${new Date().toLocaleString()}] - Port: ${port} - `;
  try {
    const browser = await puppeteer.getBrowserInstance(port);
    const page = await browser.newPage();
    page.setDefaultTimeout(0);
    await page.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1,
    });
    await page.goto("https://api.ipify.org/", { waitUntil: "load" });
    const ipAddr = await page.$eval('body', body => body.innerText);
    const targetUrlsList = _take(_shuffle(targetUrl), 10);
    for (const url of targetUrlsList) {
      console.log(`Attempting ${url} with IP: ${ipAddr}`);
      await page.goto(url, { waitUntil: "load" });
      await page.mouse.click(100, 100);
      await page.waitFor(durationInSeconds * 1000);
      // console.log("IMAGE \n", await page.screenshot({ encoding: 'base64' }));
    }
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
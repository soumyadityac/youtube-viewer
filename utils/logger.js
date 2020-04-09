const store = {};

const logCount = async (page, url, ipAddr, duration) => {
  try {
    const currentLiveViewCount = await page.$eval('.view-count', viewCountNode => viewCountNode.innerText.replace(/[^0-9]/g,''));
    if (!store[url]) store[url] = { initial: currentLiveViewCount };
    store[url].current = currentLiveViewCount;
    store[url].added =  store[url].current - store[url].initial;
    console.log(`Attempted ${url} with IP: ${ipAddr} for ${duration} seconds.\nInit View Count: ${store[url].initial} Current View Count: ${store[url].current} Views added this session: ${store[url].added}`)
  } catch {
    console.log(`An attempt to view ${url} with IP: ${ipAddr} was probably blocked.`);
  }
}

module.exports = { logCount };
const IS_PROD = (process.env.NODE_ENV === 'production');
const SHOULD_FORCE_DEBUG_LOGS = process.env.YOUTUBE_VIEWER_FORCE_DEBUG;
const IP_GETTER_URL = 'https://api.ipify.org/';
const URL_CONTAINER_FILE_NAME = 'urls.txt';

/**
 * START_PORT - Port TOR will start using from for SOCKS proxy.
 * BATCH_COUNT - Number of parallel chromium instances to run.
 * TOTAL_COUNT - Total number of view actions. A single view action comprises of sequential viewing of VIEW_ACTION_COUNT random videos among the list. Ensure this number is exactly divisible by BATCH_COUNT for optimal resource usage.
 * VIEW_ACTION_COUNT - A single browsing session will watch these many videos sequentially.
 * VIEW_DURATION - Max duration of a single view in seconds. Actual view duration will be +/- 16.6% of this number.
 * PAGE_DEFAULT_TIMEOUT - Max duration in seconds to wait for any action in the page.
 */
const START_PORT = 9052;
const BATCH_COUNT = IS_PROD ? 6 : 1;
const TOTAL_COUNT = 96;
const VIEW_ACTION_COUNT = 10;
const VIEW_DURATION = 50;
const PAGE_DEFAULT_TIMEOUT = 600;

module.exports = {
  IS_PROD,
  SHOULD_FORCE_DEBUG_LOGS,
  IP_GETTER_URL,
  URL_CONTAINER_FILE_NAME,

  START_PORT,
  BATCH_COUNT,
  TOTAL_COUNT,
  VIEW_ACTION_COUNT,
  VIEW_DURATION,
  PAGE_DEFAULT_TIMEOUT,
};

const { exec } = require('child_process');
const startViewingHandler = require('./handlers/startViewing.handler');
const { isProduction } = require('./utils');

const START_PORT = 9052;
const BATCH_COUNT = isProduction() ? 6 : 1;

let successes = 0, failures = 0, total = 0;

const execWithPromise = (command) => new Promise((res, rej) => exec(command, (error, stdout, stderr) => {
  if (error) return rej(new Error(error));
  res(`stdout: ${stdout}`);
  res(`stderr: ${stderr}`);
}));

const writeTorConfig = async (count) => {
  await execWithPromise('touch /etc/tor/torrc && echo > /etc/tor/torrc');
  const promiseArr = [];
  for(let i = 0; i < count; i++) {
    const port = START_PORT + i;
    promiseArr.push(execWithPromise(`echo "SocksPort ${port}" >> /etc/tor/torrc`));
  }
  return Promise.all(promiseArr);
}

const stopTor = async () => {
  try {
    await execWithPromise('pkill -9 -f "tor"');
  } catch {
    console.log("Failed to stop TOR.");
  }
}

const startTor = async () => {
  console.log('-------- Restarting TOR -------- ');
  await stopTor();
  try {
    console.log(await execWithPromise('/usr/bin/tor --RunAsDaemon 1'));
  } catch {
    process.exit(1); // container restarts with non zero exit
  }
}

const handleBatchView = async (options, index) => {
  if(isProduction()) await startTor();
  const promiseArr = [];
  for(let i = 0; i < BATCH_COUNT; i++) {
    const port = START_PORT + i;
    promiseArr.push(startViewingHandler({ ...options, port }))
  }
  return Promise.allSettled(promiseArr).then(settedPromises => {
    settedPromises.map(({ status, value }, i) => {
      total += 1;
      if(status === 'fulfilled') successes +=1;
      else failures += 1;

      console.log(`View ${index * BATCH_COUNT + i + 1} - ${status} - ${value || ''}`);
      console.log(`Success - ${successes}\t Failed - ${failures}\t Total - ${total}`);
    });
  })
}

async function main() {
  const count = 96;
  const durationInSeconds = 60;
  const targetUrl = [
    "https://www.youtube.com/watch?v=dRtaWY4sMtY", "https://www.youtube.com/watch?v=4iGhJpjtXkM", "https://www.youtube.com/watch?v=39vELWRzpIY", "https://www.youtube.com/watch?v=_hW3jzJAnUE", "https://www.youtube.com/watch?v=2iP8MCPt9tQ",
  ];

  console.log(`Request received to generate ${count} views. Target URL: ${targetUrl} Duration: ${durationInSeconds} seconds`);
  console.log(`----------------------------------------------`);
  if(isProduction()) {
    console.log('App running in production. Will use rotating proxy via TOR.');
    console.log('-------- Written Tor Config -------- \n', await writeTorConfig(BATCH_COUNT));
  }

  for(let i = 0; i < Math.ceil(count/BATCH_COUNT); i++) {
    console.time(`Batch ${i+1} `);
    await handleBatchView({ targetUrl, durationInSeconds }, i);
    console.timeEnd(`Batch ${i+1} `);
  }
  if(isProduction()) await stopTor();
  process.exit(1); // container restarts with non zero exit
}

main();
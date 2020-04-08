const { exec } = require('child_process');
const startViewingHandler = require('./handlers/startViewing.handler');

const START_PORT = 9052;
const BATCH_COUNT = 6;

let successes = 0, failures = 0, total = 0;

const execWithPromise = (command) => new Promise((res, rej) => exec(command, (error, stdout, stderr) => {
  if (error) return rej(new Error(error));
  res(`stdout: ${stdout}`);
  res(`stderr: ${stderr}`);
}));

const writeTorConfig = (count) => {
  const promiseArr = [];
  for(let i = 0; i < count; i++) {
    const port = START_PORT + i;
    promiseArr.push(execWithPromise(`echo "SocksPort ${port}" >> /etc/tor/torrc`));
  }
  return Promise.all(promiseArr);
}

const startTor = async () => {
  console.log('-------- Restarting TOR -------- ');
  try {
    await execWithPromise('pkill -9 -f "tor"');
  } catch {
    try {
      await execWithPromise('/etc/init.d/tor stop');
    } catch {
      console.log("Failed to stop TOR.");
    }
  }

  try {
    await execWithPromise('/etc/init.d/tor start');
  } catch {
    process.exit();
  }
}

const handleBatchView = async (options, index) => {
  await startTor();
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
  const count = 5000;
  const durationInSeconds = 40;
  const targetUrl = [
    // // PP
    "https://www.youtube.com/watch?v=VsrjyQ4B7ac", 
    "https://www.youtube.com/watch?v=x9Cs451PI9U", 
    // "https://www.youtube.com/watch?v=M0qPhdut-z0", 
    // "https://www.youtube.com/watch?v=Buer2EcHzS8", 
    "https://www.youtube.com/watch?v=XIz_bGqut2A", 
    // "https://www.youtube.com/watch?v=yY5PgOsgwns", 
    "https://www.youtube.com/watch?v=yie1iFv90M4", 
    // "https://www.youtube.com/watch?v=bA0W3MR_BhM", 
    // "https://www.youtube.com/watch?v=1_mD1IZ6BNE", 
    // "https://www.youtube.com/watch?v=-dd5vVbaWCw", 
    // "https://www.youtube.com/watch?v=0FB1hQHO5dw", 
    "https://www.youtube.com/watch?v=I4Kbe95ZxAw", 
    // "https://www.youtube.com/watch?v=PiI6Hge8W0k", 
    // "https://www.youtube.com/watch?v=s9Ki8ScPq64", 
    // "https://www.youtube.com/watch?v=Q_f4LoCbklg",

    // // Medha
    "https://www.youtube.com/watch?v=rIKLed-qt_U",
    "https://www.youtube.com/watch?v=w6inhy29dwE", 
    // "https://www.youtube.com/watch?v=9hOLlrP8Fx0", 
    // "https://www.youtube.com/watch?v=yHmysCj6Wag", 
    "https://www.youtube.com/watch?v=VhqImCwq2J0", 
    // "https://www.youtube.com/watch?v=ro_nC5Ilmq0", 
    // "https://www.youtube.com/watch?v=xhevNuuWJSc", 
    "https://www.youtube.com/watch?v=oC__52mFOko", 
    // "https://www.youtube.com/watch?v=Eib2P2oqR1w", 
    // "https://www.youtube.com/watch?v=1pWi7r9Qguc", 
    "https://www.youtube.com/watch?v=UuXNshOIoiQ", 
    // "https://www.youtube.com/watch?v=E_LETidM2M4", 
    // "https://www.youtube.com/watch?v=LEl3J_Ql_04", 
    // "https://www.youtube.com/watch?v=q1edNs6sNTI", 
    // "https://www.youtube.com/watch?v=k44vETCLZXA", 
    // "https://www.youtube.com/watch?v=ItFENbpIDaw", 
    // "https://www.youtube.com/watch?v=eCQQbDky8Vs", 
    // "https://www.youtube.com/watch?v=5XTF7j44A0w", 
    // "https://www.youtube.com/watch?v=z75-ym68oWM", 
    // "https://www.youtube.com/watch?v=oAKrVN1Ctac", 
    // "https://www.youtube.com/watch?v=Mzm2qswBJ5E", 
    // "https://www.youtube.com/watch?v=uhcv2ZSzyBo", 
    // "https://www.youtube.com/watch?v=Yo8ZK0G90q8", 
    // "https://www.youtube.com/watch?v=kmXGZ8Z2gsc", 
    // "https://www.youtube.com/watch?v=gNsWqjIDwJU", 
    // "https://www.youtube.com/watch?v=ZvD7f02Jb50", 
    // "https://www.youtube.com/watch?v=FgsYkf6jufo", 
    // "https://www.youtube.com/watch?v=gF1wVvYY01M", 
    // "https://www.youtube.com/watch?v=VVTGEhp7h1U", 
    // "https://www.youtube.com/watch?v=VpsBF13UpNk", 
    // "https://www.youtube.com/watch?v=y0NaSOKJoDY", 
    // "https://www.youtube.com/watch?v=WWW-AVaZjtI", 
    // "https://www.youtube.com/watch?v=amSZ73dv-Bg", 
    // "https://www.youtube.com/watch?v=N3CqPKBwspA", 
    // "https://www.youtube.com/watch?v=2tkRKPHD908", 
    // "https://www.youtube.com/watch?v=q4E1xVvoRtw", 
    // "https://www.youtube.com/watch?v=TcW7p7PMYgc", 
    // "https://www.youtube.com/watch?v=tpLUNcmy2M8", 
    // "https://www.youtube.com/watch?v=4mlmcdloPsU", 
    // "https://www.youtube.com/watch?v=9aQ_aezxk2E", 
    // "https://www.youtube.com/watch?v=gaOpEuox-s0", 
    // "https://www.youtube.com/watch?v=L7t_tcAxmR8", 
    // "https://www.youtube.com/watch?v=zRdN8RYW1c8", 
    // "https://www.youtube.com/watch?v=HXbXNb1Z3iE", 
    // "https://www.youtube.com/watch?v=j1dVyExHdr8", 
    // "https://www.youtube.com/watch?v=-kxb8XCPrfY", 
    // "https://www.youtube.com/watch?v=ODlxNn0bys0",
    // "https://www.youtube.com/watch?v=wrbWTV5wWpU", 
    // "https://www.youtube.com/watch?v=cvlAdQwCFx0", 
    // "https://www.youtube.com/watch?v=C4mgO9qjQJk"
  ];

  console.log(`Request received to generate ${count} views. Target URL: ${targetUrl} Duration: ${durationInSeconds} seconds`);
  console.log(`----------------------------------------------`);
  console.log('-------- Written Tor Config -------- \n', await writeTorConfig(BATCH_COUNT));

  for(let i = 0; i < Math.ceil(count/BATCH_COUNT); i++) {
    console.time(`Batch ${i+1} `);
    await handleBatchView({ targetUrl, durationInSeconds }, i);
    console.timeEnd(`Batch ${i+1} `);
  }
  process.exit();
}

main();
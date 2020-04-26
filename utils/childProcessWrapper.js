const { exec } = require('child_process');

const execWithPromise = (command) => new Promise((res, rej) => exec(command, (error, stdout, stderr) => {
  if (error) rej(new Error(error));
  else {
    res(`stdout: ${stdout}\n stderr: ${stderr}`);
  }
}));

module.exports = { execWithPromise };

const { parentPort, workerData } = require("worker_threads");
const fs = require('fs');
const { filePath } = workerData;

fs.unlink(filePath, (err) => {
    if (err) {
        throw err;
    };
    parentPort.postMessage(`${filePath} Removed succesfully`);
});

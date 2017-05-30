'use strict';

const WorkerBank = require('./libs/worker-bank');
const Worker = require('./libs/worker');

module.exports = {
   WorkerBank: function(scriptPath, workerCount) {
      return new WorkerBank(scriptPath, workerCount);
   },
   Worker
};

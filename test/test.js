'use strict';

const path = require('path');
const scriptPath = path.join(__dirname, 'worker.js');

const WorkerBank = require('../index').WorkerBank;

const wb = WorkerBank(scriptPath, 4);

for(let i = 0; i < 10; i++) {
   wb.dispatch('test', {
      delay: 200 + i * 100,
      id: i
   }).then((data) => {
      console.log(`bank${i}: ${data.msg}`);
   }).catch((err) => {
      console.log(`bank${i} err: ${err}`);
   });
}

setTimeout(() => {
   wb.close('SIGINT').then(() => {
      console.log('ddddddddd');
   });
}, 3000);

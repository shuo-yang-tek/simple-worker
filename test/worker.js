'use strict';

const Worker = require('../index').Worker;

Worker.on('test', (data, cb) => {
   setTimeout(() => {
      cb({
         msg: `no${data.id} done`
      });
   }, data.delay);
});

process.on('SIGINT', () => {
   console.log('SIGINT');
   process.exit(0);
});

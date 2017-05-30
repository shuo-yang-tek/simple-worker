WorkerBank
===

```javascript
const WorkerBank = require('simple-worker').WorkerBank;

// create 4 workers with 'workers.js'
const wb = WorkerBank(path.join(__dirname, 'worker.js'), 4);

// dispatch event, returns Promise
wb.dispath('event name', {
   data1: 'data1',
   data2: 10,
   data3: {
      flag1: true
   }
}).then( data => {
   console.log(data);
}).catch(err => {
   console.error(err);
});

// kill all workers with SIGINT
wb.close('SIGINT').then(() => {
   process.exit(0);
});
```

Worker
===

```javascript
const WorkerBank = require('simple-worker').Worker;

// listen event 'event name'
Worker.on('event name', (data, cb) => {
   console.log(data);

   // MUST call 'cb'
   cb({
      msg: 'done',
      otherData: 100
   });
});

// handle 'SIGINT' event
process.stdin.resume();

process.on('SIGINT', () => {
   closeSafely();
   process.exit(0);
});
```

TODO
===

* Worker's unecpected exit

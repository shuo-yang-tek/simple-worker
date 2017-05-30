'use strict';

const Fork = require('child_process').fork;

class WorkerBank {
   constructor(scriptPath, workerCount) {
      this._workers = [];
      this._killedCount = 0;

      for(let i = 0; i < workerCount; i++) {
         this._workers[i] = {
            childProcess: Fork(scriptPath),
            taskCBs: {}
         };

         this._workers[i].childProcess.on('message', data => {
            this._onWorkerMsg(this._workers[i], data);
         });

         this._workers[i].childProcess.on('exit', () => {
            this._onWorkerExit(this._workers[i]);
         });
      }

      this.dispatch = this.dispatch.bind(this);
   }

   dispatch(eventName, data) {
      return new Promise((resolve, reject) => {
         if(this._killCb) {
            reject('this bank has been closed');
            return;
         }

         const worker = this._getFreeWorker();

         let id = Date.now().toString();
         while( worker.taskCBs[id] )
            id += '#';

         worker.taskCBs[id] = {resolve, reject};
         worker.childProcess.send({
            id,
            eventName,
            data
         });
      });
   }

   close(signal) {
      return new Promise(resolve => {
         this._killCb = resolve;

         for(const w of this._workers)
            w.childProcess.kill(signal);
      });
   }

   _getFreeWorker() {
      let result = {};

      for(const w of this._workers) {
         if( !result.taskCBs )
            result = w;
         else if( Object.keys(result.taskCBs).length > Object.keys(w.taskCBs).length )
            result = w;
      }

      return result;
   }

   _onWorkerMsg(worker, data) {
      const cb = worker.taskCBs[data.id];
      delete worker.taskCBs[data.id];

      if(data.fail)
         cb.reject(data.fail);
      else
         cb.resolve(data.data);
   }

   _onWorkerExit(worker) {
      this._killedCount++;

      if(this._killCb && this._killedCount === this._workers.length)
         this._killCb();
   }
}

module.exports = WorkerBank;

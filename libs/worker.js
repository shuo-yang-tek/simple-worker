'use strict';

const taskHandlers = {};

function registerHandler(eventName, handler) {
   taskHandlers[eventName] = handler;
}

function onProcessMsg(data) {
   if(taskHandlers[data.eventName]) {
      const cb = (result) => {
         process.send({
            id: data.id,
            data: result
         });
      };

      taskHandlers[data.eventName](data.data, cb);
   } else {
      process.send({
         id: data.id,
         fail: 'no handler registered'
      });
   }
}

process.on('message', onProcessMsg);

module.exports = {
   on: registerHandler
};

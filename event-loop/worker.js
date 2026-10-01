import { parentPort } from 'node:worker_threads';

parentPort.once('message', ({iterations}) => {
    for(let i = 0; i < iterations; i++){};

    parentPort.postMessage({
        status: 'OK',
        message: 'CPU terminada en un worker Thread. El event loop siguio libre'
    });
});
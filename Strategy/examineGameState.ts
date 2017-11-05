// Use WebWorker API to parallelize game space search
import { Worker } from 'webworker-threads';
import Board from '../Board';

// Web-work globals
declare const postMessage:Function;
declare const close:Function;

function doWork() {
    const board = new Board();

    this.onmessage = e => {
        board.state

        postMessage(e.data);
        close();
    };
}

export default (gameState, playerToMove) => new Promise((resolve, reject) => {
    const worker = new Worker(doWork);
    worker.onmessage = e => resolve(e.data);
    worker.postMessage({
        gameState,
        playerToMove
    });
});
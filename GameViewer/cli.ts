#!/usr/bin/env node_modules/.bin/ts-node

import * as clear from 'clear';
import * as keypress from 'keypress';
import GameViewer from '.';
import getCellByXY from './getCellByXY';

const sgf = process.argv[2] || './DV-guest-Dumbot-2017-07-25-2157.sgf';

clear();

console.log(`
SGF DVONN Terminal Game Viewer 
=== Showing ${sgf} ===
(CTRL-C to quit)

Use arrow keys to navigate the frames of the game log:
    - LEFT arrow key    = Previous frame
    - RIGHT arrow key   = Next frame

Mouse click on any tile to show all legal moves for it.
`);

// Make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);
keypress.enableMouse(process.stdout);

const gameViewer = new GameViewer({sgf});

process.stdin.on('keypress', (ch, key) => {
    if(!key) return;
    clear();

    if(key.name === 'right') {
        gameViewer
            .forward()
            .show();
    } else if (key.name === 'left') {
        gameViewer
            .back()
            .show();
    } else if (key.name === 'w') {
        gameViewer.showLocality('w');
    } else if (key.name === 'b') {
        gameViewer.showLocality('b');
    } else if (key.ctrl && key.name == 'c') {
        process.stdin.pause();
    } else {
        gameViewer
            .show();
    }
    
});

process.stdin.on('mousepress', key=>{
    if(!key.release) return;

    const cell = getCellByXY(key.x, key.y - 3);
    if(cell) {
        clear();
        gameViewer.showLegalMovesForCell(cell);
    }
});

(process.stdin as any).setRawMode(true);
process.stdin.resume();

#!/usr/bin/env node_modules/.bin/ts-node

/*
import Board from './Board';

const b = new Board();
console.log(b.toString(undefined, 'D5'));

b.state.A1 = 'wwwdb';

console.log(b.getCompositionByCell('A1'));
*/

import * as clear from 'clear';
import * as keypress from 'keypress';
import SGFParser from './SGFParser';
import Board from './Board';
import getCellByXY from './getCellByXY';

const b = new Board();
const p = new SGFParser('./DV-guest-Dumbot-2017-07-25-2157.sgf');

// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);
keypress.enableMouse(process.stdout);

let currentPlayer = 'w';
let currentStack = 'd';
let currentMoveIndex = 0;

function processNextMove() {
    const move = p.next();
    if (move) {
        currentPlayer = move.player === 'P0' ? 'w' : 'b';

        if (move.type === 'move') {
            b.moveStack(currentPlayer, move.fromCell, move.toCell);
        } else if (move.type === 'pickb') {
            currentStack = b.pickStack(move.toCell);
        } else if (move.type === 'dropb') {
            // Initial set up of rings
            if (currentMoveIndex < 6) {
                currentStack = 'd';
            } else if (currentStack.length === 0) {
                currentStack = currentPlayer;
            }

            b.dropStack(currentStack, move.toCell);
            currentStack = '';
        }

        currentMoveIndex++;
    }
}

process.stdin.on('keypress', function (ch, key) {
    if (key) {
        clear();
        b.analysisFunc = b.showBoardStacksAndOwnership;

        if (key.name === 'right') {
            processNextMove();
        } else if (key.name === 'left') {
            if (currentMoveIndex > 0) {
                p.prev();
                b.undo();
                currentMoveIndex--;
            }
        } else if (key.name === 'up') {
            console.log(p.curr());
        } else if (key.name === 'down') {
            console.log(p.curr());
        } else if (key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }

        if (currentMoveIndex > 98) {
            b.pruneDeadCells();
        }

        console.log(b.toString(currentPlayer));
        console.log(`Frame ${currentMoveIndex}: ${p.toHumanString()}`);
    }
});

process.stdin.on('mousepress', function (key) {
    if (key.release) {
        const cell = getCellByXY(key.x, key.y - 3);
        
        if(cell) {
            clear();
            b.analysisFunc = b.showLegalMoves;
            console.log(b.toString(cell));
        }
    }
});

clear();
console.log(`
SGF DVONN Game Viewer (CTRL-C to quit)
Use arrow keys to navigate the frames of the game log:
    - LEFT arrow key    = Previous frame
    - RIGHT arrow key   = Next frame
    - DOWN arrow key    = Analyze best next move

Click on any tile to show all legal moves for it.

Press SPACE to continue.
`);

(process.stdin as any).setRawMode(true);
process.stdin.resume();

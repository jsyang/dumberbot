require('colors');
import * as fs from 'fs';

interface IMove {
    frameNumber: number;
    player: string;
    type: string;
    fromCell?: string;
    toCell?: string;
}

const getMoveFromSGFLine = l => {
    const frame = l.split('[')[1].replace(']', '').split(' ');
    const type = frame[1];

    const move: IMove = {
        player: l.substr(1, 2),
        frameNumber: parseFloat(frame[0]),
        type
    };

    if (type !== 'done') {
        move.fromCell = type === 'move' ? frame[2] + frame[3] : null;
        move.toCell = type === 'move' ? frame[4] + frame[5] : frame[2] + frame[3];

    }

    return move;
};

export default class SGFParser {
    hasResignation: boolean;
    moves: IMove[];

    nameWhitePlayer: string;
    nameBlackPlayer: string;

    constructor(filePath: string) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const lines = raw.split('\n');

        this.nameWhitePlayer = lines[6].split('id ')[1].replace(']', '').white;
        this.nameBlackPlayer = lines[7].split('id ')[1].replace(']', '').gray;

        this.moves = lines
            .filter(l => l[0] === ';')
            .slice(1) // Skip "Start" frame
            .map(getMoveFromSGFLine);

        this.hasResignation = raw.indexOf('resign]') !== -1;
    }

    index = -1;

    toHumanString = () => {
        const move = this.moves[this.index];
        if (move) {
            const name = move.player === 'P0' ? this.nameWhitePlayer : this.nameBlackPlayer;

            if (move.type === 'done') {
                return `${name} is done this turn.`;
            } else if (move.type === 'move') {
                return `${name} moves ${move.fromCell} to ${move.toCell}.`;
            } else {
                return `${name} ${move.type.replace('b', 's')} stack at ${move.toCell}.`;
            }
        }
    };

    curr = () => this.moves[this.index];
    
    next = () => {
        const move = this.moves[this.index + 1];
        
        // Don't advance the counter if no more moves in the log
        if(move) {
            this.index++;
            return move;
        }
    };
    
    prev = () => {
        this.index--;
        // Can only back track before the first move
        this.index = Math.max(this.index, -1);
        return this.moves[this.index];
    }
}
import Board from '../Board';

let board = new Board();
const INITIAL_PIECES = {
    'w': `dd${'w'.repeat(23)}`,
    'b': `d${'b'.repeat(23)}`
};

let friendlyColor = 'b';
let enemyColor = 'w';

let stackRemaining = {
    w: INITIAL_PIECES.w.split(''),
    b: INITIAL_PIECES.b.split('')
};

function reset() {
    board = new Board();
    friendlyColor = 'b';
    enemyColor = 'w';

    stackRemaining = {
        w: INITIAL_PIECES.w.split(''),
        b: INITIAL_PIECES.b.split('')
    };
}

const getEmptyCells = () => Object.keys(board.state).filter(cell => board.state[cell].length === 0);

const getRandomCellForPlacement = () => {
    const freeCells = getEmptyCells();

    return freeCells[Math.floor(freeCells.length * Math.random())];
};

const getTotalRemainingMoves = () => stackRemaining.w.length + stackRemaining.b.length;

function doFriendlyMove() {
    const friendlyStack = stackRemaining[friendlyColor].shift();

    if (friendlyStack) {
        const move = {
            stack: friendlyStack,
            to: getRandomCellForPlacement()
        };

        board.dropStack(move.stack, move.to);

        return move;
    }
}

function step(params: any = {}) {
    const { to } = params;

    if (to) {
        // Enemy move
        const enemyStack = stackRemaining[enemyColor].shift();
        let move;

        if (enemyStack) {
            if(getEmptyCells().indexOf(to) !== -1) {
                board.dropStack(enemyStack, to);
                move = { stack: enemyStack, to };
    
                return [
                    move,
                    doFriendlyMove()
                ].filter(Boolean);
            } else {
                stackRemaining[enemyColor].unshift(enemyStack);
                return [];
            }
            
        } else {
            return [];
        }

    } else {
        // Friendly move
        return [
            doFriendlyMove()
        ].filter(Boolean);
    }
}

export default {
    reset,
    getBoardState   : () => board.state,
    getFriendlyColor: () => friendlyColor,
    getEnemyColor   : () => enemyColor,

    setEnemyColor: color => {
        console.log(`Human is ${color}!`);
        enemyColor = color;

        if (color === 'b') {
            friendlyColor = 'w';

            return step();
        } else {
            friendlyColor = 'b';
        }
    },

    getTotalRemainingMoves,
    step
};

export const COLUMNS = 'ABCDEFGHIJK';
export const ROWS = '12345';

const INVALID_CELLS = 'A4,A5,B5,J1,K1,K2'.split(',');

const createState = () => {
    const state: any = {};

    for (let x = 0; x < COLUMNS.length; x++) {
        for (let y = 0; y < ROWS.length; y++) {
            state[COLUMNS[x] + ROWS[y]] = '';
        }
    }

    INVALID_CELLS.forEach(cell => delete state[cell]);

    return state;
};

interface IRelativeCell {
    dist: number;
    name: string;
}

const STACK_WHITE = /w/g;
const STACK_BLACK = /b/g;

export const getLastChar = s => s[s.length - 1];

export interface IScoredMove {
    from: string;
    to: string;
    scoreDifference: number;
}

const getOwnerByCell = (state, cell) => getLastChar(state[cell]);

const getDiagonalsForCell = name => {
    const column = name[0];
    const row = name[1];

    let diagonalCells: any = [];

    const currentRowIndex = ROWS.indexOf(row);
    const currentColumnIndex = COLUMNS.indexOf(column);

    for (let dist = 1; dist < ROWS.length; dist++) {
        const topCell = COLUMNS[currentColumnIndex + dist] + ROWS[currentRowIndex + dist];
        const bottomCell = COLUMNS[currentColumnIndex - dist] + ROWS[currentRowIndex - dist];
        if (topCell.length === 2) {
            diagonalCells.push({
                dist,
                name: topCell
            });
        }
        if (bottomCell.length === 2) {
            diagonalCells.push({
                dist,
                name: bottomCell
            });
        }
    }

    return diagonalCells;
};



const getPossibleMovesForCell = (name: string): IRelativeCell[] => {
    const column = name[0];
    const row = name[1];

    // Diagonal moves
    const possibleMoves: any = getDiagonalsForCell(name);

    const currentRowIndex = ROWS.indexOf(row);
    const currentColumnIndex = COLUMNS.indexOf(column);

    // Same-row moves
    for (let i = 0; i < COLUMNS.length; i++) {
        if (i !== currentColumnIndex) {
            possibleMoves.push({
                dist: Math.abs(currentColumnIndex - i),
                name: `${COLUMNS[i]}${row}`
            })
        }
    }

    // Same-column moves
    for (let i = 0; i < ROWS.length; i++) {
        if (i !== currentRowIndex) {
            possibleMoves.push({
                dist: Math.abs(currentRowIndex - i),
                name: `${column}${ROWS[i]}`
            })
        }
    }

    return possibleMoves;
};

const getLegalMovesForCell = (state, cell: string): IRelativeCell[] => {
    // Is completely surrounded?
    if (getAdjacentCells(state,cell).length === 6) {
        return [];
    } else {
        const stackHeight = state[cell].length;

        return getPossibleMovesForCell(cell)
            .filter(c => c.dist === stackHeight)
            .filter(c =>
                state[c.name] && state[c.name].length > 0
            );
    }
};

const getCompositionByCell = (state, cell, color) => {
    const stack = state[cell];
    const whiteCount = (stack.match(STACK_WHITE) || []).length;
    const blackCount = (stack.match(STACK_BLACK) || []).length;
    const totalCount = stack.length;

    if (totalCount === 0) {
        return 0;
    } else {
        if (color === 'w') {
            return whiteCount / totalCount;
        } else {
            return blackCount / totalCount;
        }
    }
};

const getAdjacentCells = (state, cell) => {
    const column = cell[0];
    const row = cell[1];

    const columnIndex = COLUMNS.indexOf(column);

    const cells = [
        column + (parseInt(row, 10) - 1), // SE
        COLUMNS[columnIndex - 1] + (parseInt(row, 10) - 1), // SW
        COLUMNS[columnIndex - 1] + row, // W
        column + (parseInt(row, 10) + 1),   // NW
        COLUMNS[columnIndex + 1] + (parseInt(row, 10) + 1), // NE
        COLUMNS[columnIndex + 1] + row  // E
    ]
        .filter(c => Boolean(state[c]));

    return cells;
}

const getLocalityByCell = (state, cell, color) => {
    /*
          NW  NE
        W       E
          SW SE
    */

    const adjacent = getAdjacentCells(state, cell)
        .map(c => state[c])
        .map(getLastChar)
        .join('');

    const whiteCount = (adjacent.match(STACK_WHITE) || []).length;
    const blackCount = (adjacent.match(STACK_BLACK) || []).length;

    if (color === 'w') {
        return {
            friendly: whiteCount / 7,
            hostile: blackCount / 7,
            total: adjacent.trim().length
        };
    } else {
        return {
            friendly: blackCount / 7,
            hostile: whiteCount / 7,
            total: adjacent.trim().length
        };
    }
};

const moveStack = (state, color, fromCell, toCell) => {
    state[toCell] += state[fromCell];
    state[fromCell] = '';
};

const pickStack = (state, fromCell) => {
    const stack = state[fromCell];
    state[fromCell] = '';

    return stack;
};

const dropStack = (state, stack, toCell) => {
    state[toCell] += stack;
};

// Recursively add connected cells
const addAdjacentCellsToConnected = (state,connected, cell) => {
    getAdjacentCells(state, cell).forEach(adjacentCell => {
        if (!(adjacentCell in connected)) {
            connected[adjacentCell] = true;
            addAdjacentCellsToConnected(state,connected, adjacentCell);
        }
    });
};

const pruneDeadCells = (state) => {
    const positionsDVONN = {};

    Object.keys(state).forEach(cell => {
        const hasDVONNRing = state[cell].indexOf('d') !== -1;
        if (hasDVONNRing) {
            positionsDVONN[cell] = true;
        }
    });


    Object.keys(positionsDVONN)
        .forEach(cell => addAdjacentCellsToConnected(state,positionsDVONN, cell));

    const prunedCells: any = [];

    Object.keys(state).forEach(cell => {
        if (!(cell in positionsDVONN)) {
            state[cell] = '';
            prunedCells.push(cell);
        }
    });

    return prunedCells;
};

const getScore = (state) => {
    const score = {
        w: 0,
        b: 0
    };

    Object.keys(state)
        .forEach(cell => {
            const stack = state[cell];
            score[getLastChar(stack)] += stack.length;
        });

    return score;
};

// Calculate all legal moves for color at current state and
// include objective metric (score)
const getAllLegalMovesByColor = (state,color: string) => {
    const legalMoves: IScoredMove[] = [];
    const currentScore = getScore(state)[color];

    Object.keys(state)
        .filter(cell => {
            const owner = getLastChar(state[cell]);
            return owner === color;
        })
        .forEach(cell => {
            this.getLegalMovesForCell(cell)
                .forEach(move => {
                    const newState = { ...this.state };
                    moveStack(newState, color,cell,move.name);
                    pruneDeadCells(newState);

                    const newScore = getScore(newState)[color];

                    legalMoves.push({
                        from: cell,
                        to: move.name,
                        scoreDifference: newScore - currentScore
                    });
                });
        });

    return legalMoves;
};

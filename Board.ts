require('colors');

const COLUMNS = 'ABCDEFGHIJK';
const ROWS = '12345';

const createState = () => {
    const state: any = {};
    for (let x = 0; x < COLUMNS.length; x++) {
        for (let y = 0; y < ROWS.length; y++) {
            state[COLUMNS[x] + ROWS[y]] = '';
        }
    }

    delete state.A4;
    delete state.A5;

    delete state.B5;

    delete state.J1;

    delete state.K1;
    delete state.K2;

    return state;
};

interface IRelativeCell {
    dist: number;
    name: string;
}

const STACK_WHITE = /w/g;
const STACK_BLACK = /b/g;

const getLastChar = s => s[s.length - 1];
const pad2 = s => {
    if (s.length > 0) {
        return s.length < 2 ? '_' + s : s;
    } else {
        return '__';
    }
};

export default class Board {
    analysisFunc: Function;

    playerColor = 'w';
    state: any = createState();
    history: string[] = [];
    
    getDiagonalsForCell = name => {
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

    getPossibleMovesForCell = (name: string): IRelativeCell[] => {
        const column = name[0];
        const row = name[1];

        // Diagonal moves
        const possibleMoves: any = this.getDiagonalsForCell(name);

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

    getLegalMovesForCell = (cell: string): IRelativeCell[] => {
        // Is completely surrounded?
        if (this.getAdjacentCells(cell).length === 6) {
            return [];
        } else {
            const stackHeight = this.state[cell].length;

            return this.getPossibleMovesForCell(cell)
                .filter(c => c.dist === stackHeight)
                .filter(c => 
                    this.state[c.name] && this.state[c.name].length > 0
                );
        }
    };

    getCompositionByCell = (cell, color) => {
        const stack = this.state[cell];
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

    getAdjacentCells = cell => {
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
            .filter(c => Boolean(this.state[c]));

        return cells;
    }

    getLocalityByCell = (cell, color) => {
        /*
              NW  NE
            W       E
              SW SE
        */

        const adjacent = this.getAdjacentCells(cell)
            .map(c => this.state[c])
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

    moveStack = (color, fromCell, toCell) => {
        this.state[toCell] += this.state[fromCell];
        this.state[fromCell] = '';
        this.pushHistory();
    };

    pickStack = (fromCell) => {
        const stack = this.state[fromCell];
        this.state[fromCell] = ''
        this.pushHistory();
        return stack;
    };

    dropStack = (stack, toCell) => {
        this.state[toCell] += stack;
        this.pushHistory();
    };

    pushHistory = () => this.history.push(JSON.stringify(this.state));

    undo = () => {
        this.history.pop();
        const lastState = this.history[this.history.length -1];

        if (lastState) {
            this.state = JSON.parse(lastState);
        } else {
            this.state = createState();
        }
    };

    // Recursively add connected cells
    addAdjacentCellsToConnected = (connected, cell) => {
        this.getAdjacentCells(cell).forEach(adjacentCell => {
            if (!(adjacentCell in connected)) {
                connected[adjacentCell] = true;
                this.addAdjacentCellsToConnected(connected, adjacentCell);
            }
        });
    };

    pruneDeadCells = () => {
        const { state } = this;

        const positionsDVONN = {};

        Object.keys(state).forEach(cell => {
            const hasDVONNRing = state[cell].indexOf('d') !== -1;
            if (hasDVONNRing) {
                positionsDVONN[cell] = true;
            }
        });


        Object.keys(positionsDVONN)
            .forEach(cell => this.addAdjacentCellsToConnected(positionsDVONN, cell));

        let pruneCount = 0;

        Object.keys(state).forEach(cell => {
            if (!(cell in positionsDVONN)) {
                state[cell] = '';
                pruneCount++;
            }
        });
    };

    showBoardStacksAndOwnership = () => {
        console.log(`Showing stacks and ownership:`);        
        const { state } = this;
        const displayState = JSON.parse(JSON.stringify(state));

        Object.keys(state).forEach(cell => {
            displayState[cell] = pad2(state[cell].length.toString());
            const owner = getLastChar(state[cell]);

            if (owner === 'w') {
                displayState[cell] = displayState[cell].white;
            } else if (owner === 'b') {
                displayState[cell] = displayState[cell].dim.gray;
            } else if (owner === 'd') {
                displayState[cell] = displayState[cell].dim.yellow;
            }

            if (state[cell].length === 0) {
                displayState[cell] = '__'.black.bgBlue;
            } else if (state[cell].indexOf('d') !== -1) {
                displayState[cell] = displayState[cell].bgRed;
            }

        });

        return displayState;
    };

    showBoardComposition = color => {
        console.log('Showing composition values for each position:');

        const { state } = this;
        const displayState = JSON.parse(JSON.stringify(state));

        Object.keys(state).forEach(cell => {
            let composition: any = this.getCompositionByCell(cell, color);

            if (composition === 1) {
                composition = '99';
            } else {
                composition = composition.toFixed(2).split('.')[1];
            }

            displayState[cell] = composition;

            const owner = getLastChar(state[cell]);

            if (owner === 'w') {
                displayState[cell] = displayState[cell].white;
            } else if (owner === 'b') {
                displayState[cell] = displayState[cell].dim.gray;
            } else if (owner === 'd') {
                displayState[cell] = displayState[cell].dim.yellow;
            }

            if (state[cell].length === 0) {
                displayState[cell] = '__'.black.bgBlue;
            } else if (state[cell].indexOf('d') !== -1) {
                displayState[cell] = displayState[cell].bgRed;
            }

        });

        return displayState;
    };

    showBoardLocality = color => {
        console.log('Showing locality values for each position:');

        const { state } = this;
        const displayState = JSON.parse(JSON.stringify(state));

        Object.keys(state).forEach(cell => {
            let locality: any = this.getLocalityByCell(cell, color).friendly;

            if (locality === 1) {
                locality = '99';
            } else {
                locality = locality.toFixed(2).split('.')[1];
            }

            displayState[cell] = locality;

            const owner = getLastChar(state[cell]);

            if (owner === 'w') {
                displayState[cell] = displayState[cell].white;
            } else if (owner === 'b') {
                displayState[cell] = displayState[cell].dim.gray;
            } else if (owner === 'd') {
                displayState[cell] = displayState[cell].dim.yellow;
            }

            if (state[cell].length === 0) {
                displayState[cell] = '__'.black.bgBlue;
            } else if (state[cell].indexOf('d') !== -1) {
                displayState[cell] = displayState[cell].bgRed;
            }

        });

        return displayState;
    };

    showLegalMoves = (cell: string) => {
        console.log(`Showing possible moves for ${cell}:`);
        const { state } = this;
        const displayState = JSON.parse(JSON.stringify(state));
        const possibleMoves = this.getLegalMovesForCell(cell)
            .map(m => m.name);

        Object.keys(state).forEach(c => {
            displayState[c] = c === cell ? '██' : '░░';

            if (possibleMoves.indexOf(c) !== -1) {
                displayState[c] = displayState[c].gray.bgYellow;
            } else {
                displayState[c] = displayState[c].gray.bgBlue;
            }
        });

        return displayState;
    };

    toString = (param) => {
        const displayState = this.analysisFunc(param);

        // @formatter:off
        const {
                A1, A2, A3,
            B1, B2, B3, B4,
            C1, C2, C3, C4, C5,
            D1, D2, D3, D4, D5,
            E1, E2, E3, E4, E5,
            F1, F2, F3, F4, F5,
            G1, G2, G3, G4, G5,
            H1, H2, H3, H4, H5,
            I1, I2, I3, I4, I5,
            J2, J3, J4, J5,
            K3, K4, K5
        } = displayState;
        // @formatter:on

        return [
            '',
            `     ${C5}  ${D5}  ${E5}  ${F5}  ${G5}  ${H5}  ${I5}  ${J5}  ${K5}`,
            `   ${B4}  ${C4}  ${D4}  ${E4}  ${F4}  ${G4}  ${H4}  ${I4}  ${J4}  ${K4}`,
            ` ${A3}  ${B3}  ${C3}  ${D3}  ${E3}  ${F3}  ${G3}  ${H3}  ${I3}  ${J3}  ${K3}`,
            `   ${A2}  ${B2}  ${C2}  ${D2}  ${E2}  ${F2}  ${G2}  ${H2}  ${I2}  ${J2}`,
            `     ${A1}  ${B1}  ${C1}  ${D1}  ${E1}  ${F1}  ${G1}  ${H1}  ${I1}`,
            ''
        ].join('\n')
    };
}

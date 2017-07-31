const COLUMNS = 'ABCDEFGHIJK';
const ROWS    = '12345';

const createState = () => {
    const state = {};
    for (let x = 0; x < COLUMNS.length; x++) {
        for (let y = 0; y < ROWS.length; y++) {
            state[COLUMNS[x] + ROWS[y]] = '';
        }
    }

    return state;
};

export default class Board {
    state = createState();

    getDiagonalsForCell = name => {
        const column = name[0];
        const row    = name[1];

        const diagonalCells: any = [];

        const currentRowIndex    = ROWS.indexOf(row);
        const currentColumnIndex = COLUMNS.indexOf(column);

        for (let dist = 1; dist < ROWS.length; dist++) {
            const topCell    = COLUMNS[currentColumnIndex + dist] + ROWS[currentRowIndex + dist];
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

    getPossibleMovesForCell = name => {
        const column = name[0];
        const row    = name[1];

        // Diagonal moves
        const legalMoves: any = this.getDiagonalsForCell(name);

        const currentRowIndex    = ROWS.indexOf(row);
        const currentColumnIndex = COLUMNS.indexOf(column);

        // Same-row moves
        for (let i = 0; i < COLUMNS.length; i++) {
            if (i !== currentColumnIndex) {
                legalMoves.push({
                    dist: Math.abs(currentColumnIndex - i),
                    name: `${COLUMNS[i]}${row}`
                })
            }
        }

        // Same-column moves
        for (let i = 0; i < ROWS.length; i++) {
            if (i !== currentRowIndex) {
                legalMoves.push({
                    dist: Math.abs(currentRowIndex - i),
                    name: ``
                })
            }
        }
    };
}

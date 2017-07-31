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

// Will eventually reference http://www.red-bean.com/sgf/user_guide/index.html

export default class Board {
    state = createState();

    getDiagonalsForCell = name => {
        const column = name[0];
        const row = name[1];

        const diagonalCells: any = [];

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
        const legalMoves: any = this.getDiagonalsForCell(name);

        const currentRowIndex = ROWS.indexOf(row);
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
                    name: `${column}${ROWS[i]}`
                })
            }
        }

        return legalMoves;
    };

    // D = DVONN ring
    // W = white ring
    // B = black ring

    toString = (s = this.state, cell?) => {
        const displayState = JSON.parse(JSON.stringify(s));

        const moves = cell? this.getPossibleMovesForCell(cell).map(m => m.name).concat(cell) : null;

        Object.keys(s).forEach(name => {
            let displayName = name;

            if (moves && moves.indexOf(name) !== -1) {
                displayName = displayName.red;
            } else {
                displayName = displayName.dim.gray;
            }

            displayState[name] = displayName;
        });

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

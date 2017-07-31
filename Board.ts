const COLUMNS = 'ABCDEFGHIJK';
const ROWS    = '12345';

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

// Will eventually reference http://www.red-bean.com/sgf/user_guide/index.html

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

    // D = DVONN ring
    // W = white ring
    // B = black ring

    toString = (s = this.state) => {
        const displayState = JSON.parse(JSON.stringify(s));

        Object.keys(s).forEach(name => {
            displayState[name] = name;
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
            `    ${A1}  ${A2}  ${A3}`,
            `  ${B1}  ${B2}  ${B3}  ${B4}`,
            `${C1}  ${C2}  ${C3}  ${C4}  ${C5}`,
            `${D1}  ${D2}  ${D3}  ${D4}  ${D5}`,
            `${E1}  ${E2}  ${E3}  ${E4}  ${E5}`,
            `${F1}  ${F2}  ${F3}  ${F4}  ${F5}`,
            `${G1}  ${G2}  ${G3}  ${G4}  ${G5}`,
            `${H1}  ${H2}  ${H3}  ${H4}  ${H5}`,
            `${I1}  ${I2}  ${I3}  ${I4}  ${I5}`,
            `  ${J2}  ${J3}  ${J4}  ${J5}`,
            `    ${K3}  ${K4}  ${K5}`,
            ''
        ].join('\n')
    };
}

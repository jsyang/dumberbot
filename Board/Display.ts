import { getLastChar, IScoredMove } from '.';

require('colors');

// Left pad for 2 digits
const pad2 = s => {
    if (s.length > 0) {
        return s.length < 2 ? '_' + s : s;
    } else {
        return '__';
    }
};

const deepCopy = o => JSON.parse(JSON.stringify(o));

export function showLegalMoves(state, cell) {
    console.log(`Showing possible moves for ${cell}:`);
    const displayState = deepCopy(state);
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
}

export function showBoardComposition(state, color) {
    console.log('Showing composition values for each position:');

    const displayState = deepCopy(state);

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
}

export function showBoardLocality(state, color) {
    console.log('Showing locality values for each position:');

    const displayState = deepCopy(state);

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
}

export function showBoardStacksAndOwnership(state) {
    console.log(`Showing stacks and ownership:`);
    const displayState = deepCopy(state);

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
}

export function showLegalMovesScored(state, cell: string) {
    let color = getLastChar(state[cell]);
    color = color === 'w' ? 'white'.white : 'black'.gray;

    console.log(`Showing difference in score for all legal moves for ${color}:`);

    const displayState = JSON.parse(JSON.stringify(state));
    const scoredMoves = this.getAllLegalMovesByColor(color);

    const toCells = {};

    scoredMoves.forEach((move: IScoredMove) => {
        const currentToScore = toCells[move.to] || -Infinity;

        if (currentToScore < move.scoreDifference) {
            toCells[move.to] = move.scoreDifference;
        }
    });

    Object.keys(displayState).forEach(c => {
        const bestScore = toCells[c];
        if (typeof bestScore !== 'undefined') {
            if (bestScore < 0) {
                displayState[c] = `${bestScore}`.blue;
            } else if (bestScore === 0) {
                displayState[c] = ` 0`.red;
            } else if (bestScore > 0) {
                displayState[c] = `+${bestScore}`.magenta;
            }
        } else {
            displayState[c] = '__';
        }
    });

    return displayState;
};

// Main board display
export function display(options) {
    const {
        analysisFunc, analysisOptions
    } = options;


    const displayState = analysisFunc(analysisOptions);
    const score = this.getScore();

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

    return [
        '',
        `     ${C5}  ${D5}  ${E5}  ${F5}  ${G5}  ${H5}  ${I5}  ${J5}  ${K5}`,
        `   ${B4}  ${C4}  ${D4}  ${E4}  ${F4}  ${G4}  ${H4}  ${I4}  ${J4}  ${K4}`,
        ` ${A3}  ${B3}  ${C3}  ${D3}  ${E3}  ${F3}  ${G3}  ${H3}  ${I3}  ${J3}  ${K3}`,
        `   ${A2}  ${B2}  ${C2}  ${D2}  ${E2}  ${F2}  ${G2}  ${H2}  ${I2}  ${J2}`,
        `     ${A1}  ${B1}  ${C1}  ${D1}  ${E1}  ${F1}  ${G1}  ${H1}  ${I1}`,
        '',
        ` white score = ${score.w}`,
        ` black score = ${score.b}`
    ].join('\n');
}
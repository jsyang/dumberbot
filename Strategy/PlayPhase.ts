import Board, { IScoredMove } from '../Board';

let board;
let friendlyColor;
let enemyColor;

function init(state, _friendlyColor, _enemyColor) {
    board = new Board(state);
    friendlyColor = _friendlyColor;
    enemyColor = _enemyColor;
}

function sortByHighestScore(m1: IScoredMove, m2: IScoredMove) {
    return m2.scoreDifference - m1.scoreDifference;
}

function doFriendlyMove() {
    const allLegalMoves = board.getAllLegalMovesByColor(friendlyColor);
    const bestScoreOutcomes = allLegalMoves.sort(sortByHighestScore);

    if (bestScoreOutcomes.length > 0) {
        const bestMove = bestScoreOutcomes.shift();
        const { from, to } = bestMove;

        board.moveStack(friendlyColor, from, to);

        const pruned = board.pruneDeadCells();

        return { from, to, pruned };
    } else {
        return null;
    }

}

function step(params: any = {}) {
    const { from, to } = params;
    const allLegalMoves = board.getAllLegalMovesByColor(enemyColor);
    if (allLegalMoves.length > 0) {
        if (board.getOwnerByCell(from) === enemyColor && allLegalMoves.find(move => move.to === to)) {
            board.moveStack(enemyColor, from, to);
            const pruned = board.pruneDeadCells();

            return [
                { ...params, pruned },
                doFriendlyMove()
            ].filter(Boolean);
        } else {
            return [];
        }
    } else {
        return [
            doFriendlyMove()
        ].filter(Boolean);
    }
}

export default {
    init,
    step,
    getIsGameOver: () => {
        const movesLeft =
            board.getAllLegalMovesByColor(enemyColor).length +
            board.getAllLegalMovesByColor(friendlyColor).length;

        console.log('Moves left for either side:', movesLeft);

        return movesLeft === 0;
    },
    getScore: () => board.getScore()
}
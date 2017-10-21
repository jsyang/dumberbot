import SGFParser from '../SGFParser';
import Board from '../Board';

const INDEX_BEGIN_PRUNE_DEAD_CELLS = 98;

export default class GameViewer {
    board = new Board();
    parser: SGFParser;

    // First move config
    player    = 'w';  // White
    stack     = 'd';  // DVONN token
    moveIndex = 0;    // line 0 of the SGF

    constructor({sgf}) {
        this.parser = new SGFParser(sgf);
    }

    // Step back within the SGF
    back = () => {
        const {board, parser} = this;

        this.moveIndex--;

        if(this.moveIndex < 0) {
            this.moveIndex = 0;
        }

        parser.prev();
        board.undo();  
        
        return this;
    };

    // Step forward in the SGF
    forward = () => {
        const action = this.parser.next();

        if(action) {
            this.moveIndex++;

            const {player, type, fromCell, toCell} = action;
            const {board, moveIndex} = this;

            this.player = player === 'P0' ? 'w' : 'b';

            if(type === 'move') {
                board.moveStack(this.player, fromCell, toCell);
            } else if(type === 'pickb') {
                this.stack = board.pickStack(toCell);
            } else if(type === 'dropb') {
                
                // For placement phase only
                if(moveIndex < 6) {
                    // The stack in the player's hand is a DVONN token
                    this.stack = 'd';
                } else if (this.stack.length ===0) {
                    // The stack in the player's hand is a player-colored token
                    this.stack = this.player;
                }

                board.dropStack(this.stack, toCell);
                this.stack = '';
            } else {
                // Record inaction state for consistency
                board.pushHistory();
            }
        }

        return this;
    };

    prune = () => {
        if(this.moveIndex > INDEX_BEGIN_PRUNE_DEAD_CELLS) {
            this.board.pruneDeadCells();
        }
    };

    // Display board state at current move
    show = () => {
        const {board, player, moveIndex, parser} = this;

        board.analysisFunc = board.showBoardStacksAndOwnership;

        this.prune();

        console.log(
            board.toString(player), '\n\n',
            `Frame ${moveIndex}: ${parser.toHumanString()}`
        );
    };

    showLegalMovesForCell = (cell:string) => {
        const {board} = this;
        
        board.analysisFunc = board.showLegalMoves;
        console.log(board.toString(cell));
    };
}
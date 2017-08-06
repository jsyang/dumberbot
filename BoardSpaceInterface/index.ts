import * as monitor from 'active-window';

import robotActions from './robotActions';

export default class BoardSpaceInterface {
    topLeftCoord: any;
    actions: Function[];

    constructor(props = { actions: [] }) {
        console.log(`

            How to use Dumberbot:
            1. Start BoardSpace
            2. Find a DVONN room and join with Dumbot as player 2 (human as player 1)
            3. This app will automatically recognize the game in progress and begin play

        `);

        monitor.getActiveWindow(this.onReceiveActiveWindow, -1, 1);

        this.actions = props.actions;
    }

    onTextOfGameActive = () => robotActions.getGameStateSGF();

    onReceiveActiveWindow = w => {
        try {
            const { title, app } = w;

            if (app.indexOf('java') !== -1 || app.indexOf('Boardspace') !== -1) {
                if (title.indexOf('BoardSpace') !== -1 && title.indexOf('Play Games') !== -1) {
                    this.onPlayGamesActive();
                } else if (title === 'Text of Game') {
                    this.onTextOfGameActive();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    onPlayGamesActive = () => {
        // Game play in progress
        const { hasTopLeftCoord } = robotActions;
        const { actions } = this;

        if (hasTopLeftCoord()) {
            if (actions.length > 0) {
                const action = actions[0];
                if (action) {
                    const isResultSatisfactory = action();
                    if (isResultSatisfactory) {
                        actions.shift();
                    }
                }
            } else {
                // No more actions 
                process.exit();
            }
        } else {
            robotActions.init();
        }
    };
}

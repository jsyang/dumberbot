import * as robot from 'robotjs';
import * as monitor from 'active-window';
import * as clipboard from 'clipboardy';

import color from './color';
import relativeOffset from './relativeOffset';

interface Coord {
    x: number;
    y: number;
}

let topLeftCoord: Coord;

const getAbsoluteCoord = offset => ({
    x: topLeftCoord.x + offset.dx,
    y: topLeftCoord.y + offset.dy,
});

const findGamePlayWindowReferenceCoord = () => {
    console.log('Searching...');
    const {width, height} = robot.getScreenSize();
    for (let y = 28; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (robot.getPixelColor(x, y) === color.OSX_WINDOW_ACTION_BUTTON &&
                robot.getPixelColor(x + 20, y) === color.OSX_WINDOW_ACTION_BUTTON &&
                robot.getPixelColor(x + 40, y) === color.OSX_WINDOW_ACTION_BUTTON
            ) {
                topLeftCoord = {x, y};
                console.log('Reference coordinate found!', topLeftCoord);
                return;
            }
        }
    }
}

const clickAtOffset = offset => {
    const endCoord = getAbsoluteCoord(offset);
    robot.moveMouse(endCoord.x, endCoord.y);
    robot.mouseClick();
}

const clickAtCoord = coord => {
    robot.moveMouse(coord.x, coord.y);
    robot.mouseClick();
}

const CLOSE_GAME_TEXT_WINDOW = {x: 17, y: 30};

const actions = [
    () => clickAtOffset(relativeOffset.MENU_ACTIONS),
    () => clickAtOffset(relativeOffset.MENU_ACTIONS_SHOW_SGF_OUTPUT),
    () => console.log(serializedGameState)
];

const onPlayGamesActive = () => {
    console.log('Game play in progress!');

    if (topLeftCoord) {
        if (actions.length > 0) {
            const action = actions.shift();
            if (action) {
                action();
            }
        } else {
            process.exit();
        }
    } else {
        findGamePlayWindowReferenceCoord();
    }
};

let serializedGameState: string;

const onTextOfGameActive = () => {
    console.log('Updating internal game state...');

    robot.keyTap('a', 'command');
    robot.keyTap('c', 'command');
    serializedGameState = clipboard.readSync();
    clickAtCoord(CLOSE_GAME_TEXT_WINDOW);
};

const onReceiveActiveWindow = w => {
    try {
        const {title, app} = w;

        if (app.indexOf('java') !== -1 || app.indexOf('BoardSpace') !== -1) {
            if (title.indexOf('BoardSpace') !== -1 && title.indexOf('Play Games') !== -1) {
                onPlayGamesActive();
            } else if (title === 'Text of Game') {
                onTextOfGameActive();
            }
        }
    } catch (err) {
        console.log(err);
    }
};

monitor.getActiveWindow(onReceiveActiveWindow, -1, 1);
console.log(`

Dumberbot instructions:
1. Start BoardSpace
2. Find a DVONN room and join with Dumbot (human as player 1)
3. This app will automatically recognize the game in progress

`);
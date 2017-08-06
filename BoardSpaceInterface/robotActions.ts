import * as robot from 'robotjs';
import { execSync } from 'child_process';
import * as clipboard from 'clipboardy';

import relativeOffset from './relativeOffset';
import color from './color';

interface Coord {
    x: number;
    y: number;
}

let topLeftCoord: Coord;

const getAbsoluteCoord = offset => ({
    x: topLeftCoord.x + offset.dx,
    y: topLeftCoord.y + offset.dy,
});

const clickAtOffset = offset => {
    const endCoord = getAbsoluteCoord(offset);
    robot.moveMouse(endCoord.x, endCoord.y);
    robot.mouseClick();
    return true;
}

const clickAtCoord = coord => {
    robot.moveMouse(coord.x, coord.y);
    robot.mouseClick();
    return true;
}

const getRandomFromArray = a => a[Math.floor(Math.random() * a.length)];

// Can we currently make a move?
const getCanMove = () => {
    const { x, y } = getAbsoluteCoord(relativeOffset.PLAYER_0_IS_ACTIVE);
    return robot.getPixelColor(x, y) === color.ACTIVE_CONTROL;
};


const getGameStateSGF = () => {
    // Updating internal game state
    robot.keyTap('a', 'command');
    robot.keyTap('c', 'command');

    clickAtCoord(relativeOffset.CLOSE_GAME_TEXT_WINDOW);
    return clipboard.readSync();
};

const init = () => {
    // Resize to fit relative offsets
    execSync('./resize-gameplay-window.scpt');

    // Searching for reference pixel...
    const { width, height } = robot.getScreenSize();

    for (let y = 28; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Note: this is only for jsyang's machine: my colors are set differently vs OSX default
            // colors for (x)(-)(^)
            if (robot.getPixelColor(x, y) === color.OSX_WINDOW_ACTION_BUTTON &&
                robot.getPixelColor(x + 20, y) === color.OSX_WINDOW_ACTION_BUTTON &&
                robot.getPixelColor(x + 40, y) === color.OSX_WINDOW_ACTION_BUTTON
            ) {
                topLeftCoord = { x, y };
                console.log('Reference coordinate found!', topLeftCoord);
                return;
            }
        }
    }
};

const hasTopLeftCoord = () => Boolean(topLeftCoord);

export default {
    getGameStateSGF,
    getCanMove,
    clickAtCoord,
    clickAtOffset,
    init,
    hasTopLeftCoord,
    getRandomFromArray
};
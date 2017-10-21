#!/usr/bin/env node_modules/.bin/ts-node

import BoardSpaceInterface from './BoardSpaceInterface';
import relativeOffset from './BoardSpaceInterface/relativeOffset';

import robotActions from './BoardSpaceInterface/robotActions';
const {
    getCanMove,
    getRandomFromArray,
    clickAtOffset,
} = robotActions;

const actions: any = [


    /* 
    () => {
        clickAtOffset(relativeOffset.MENU_ACTIONS);
        clickAtOffset(relativeOffset.MENU_ACTIONS_SHOW_SGF_OUTPUT);
        console.log(serializedGameState);
    }
    */


    () => {
        // Randomly click on any tile position then done button
        if (getCanMove()) {
            const position = getRandomFromArray(relativeOffset.LIST_OF_POSITIONS);
            clickAtOffset(relativeOffset[position]);
            clickAtOffset(relativeOffset.DONE_BUTTON)
        }
    }

];

new BoardSpaceInterface({ actions });
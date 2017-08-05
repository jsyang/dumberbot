#!/usr/bin/env node_modules/.bin/ts-node

import * as fs from 'fs';

const logError = err => err && console.log(err);

let count = 0;
let total = 0;

function renameFileIfHasResignation(filename) {
    const filePath = 'sgf/' + filename;
    const raw = fs.readFileSync(filePath, 'utf8');
    const hasResignation = raw.indexOf('resign]') !== -1;
    if (hasResignation) {
        fs.rename(filePath, filePath.replace('.sgf', '.resign.sgf'), logError);
        count++;
    }

    total ++;
}

fs.readdirSync('sgf/')
    .forEach(renameFileIfHasResignation);

console.log(`${count} files renamed out of ${total} found.`);

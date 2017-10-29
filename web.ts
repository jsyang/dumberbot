#!/usr/bin/env node_modules/.bin/ts-node

import * as express from 'express';

const app = express();

const sendFile = file => (
    (req, res) => res.sendFile(`${__dirname}/${file}`)
);

app.get('/', sendFile('index.html'));
app.get('/hex.svg', sendFile('hex.svg'));


// todo: hook api up to bot

app.listen(3000, ()=> console.log('Web server listening on :3000'));
#!/usr/bin/env node_modules/.bin/ts-node

import * as express from 'express';
import PlacementPhase from './Strategy/PlacementPhase';

const app = express();

const sendFile = file => (
    (req, res) => res.sendFile(`${__dirname}/${file}`)
);

app.use(express.json());

app.get('/',
    (req, res, next) => {
        PlacementPhase.reset();
        next();
    },
    sendFile('index.html')
);

app.get('/hex.svg', sendFile('hex.svg'));

app.get('/set/human/:color', ({ params }, res) => {
    const result = PlacementPhase.setEnemyColor(params.color);

    if (params.color === 'b') {
        res.json(result);
    } else {
        res.json(true);
    }
});

app.get('/move/:to', ({ params }, res) => {
    const result = PlacementPhase.step({ to: params.to });

    if (result) {
        res.json(result);
    }
});

app.listen(3000, () => console.log('Web server listening on :3000'));
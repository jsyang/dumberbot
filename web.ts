#!/usr/bin/env node_modules/.bin/ts-node

import * as express from 'express';
import PlacementPhase from './Strategy/PlacementPhase';
import PlayPhase from './Strategy/PlayPhase';

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

app.get('/move/:from/:to', ({ params }, res) => {
    const result = PlayPhase.step(params);
    res.json(result);
});

app.get('/drop/:to', ({ params }, res) => {
    const result = PlacementPhase.step({ to: params.to });

    if (result.length > 0) {
        res.json(result);
    } else {
        if (PlacementPhase.getTotalRemainingMoves() === 0) {
            console.log('Placement phase is complete!');
            PlayPhase.init(
                PlacementPhase.getBoardState(),
                PlacementPhase.getFriendlyColor(),
                PlacementPhase.getEnemyColor()
            );
            res.json({ isPlacementPhase: false });
        } else {
            res.json([]);
        }
    }
});

app.get('/score', (req, res) => {
    res.json({
        scores    : PlayPhase.getScore(),
        isGameOver: PlayPhase.getIsGameOver()
    });
});

app.listen(3000, () => console.log('Web server listening on :3000'));
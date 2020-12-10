import express from 'express';

import Game from './dungeonGen/Game.mjs';

const app = express();
const game = new Game({ debug: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

game.init();

app.listen(1337, () => console.log('listening on 1337'));

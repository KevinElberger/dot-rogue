import express from 'express';
import http from 'http';
import cors from 'cors';
import io from 'socket.io';
import Game from './dungeonGen/Game.mjs';
import Matrix from './Matrix.js';
import GameOfLife from './gameOfLife/GameOfLife';
import { randomGameOfLife } from './utils';

const app = express();
var game = null;
var gameOfLife = null;
var matrix = new Matrix();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = http.createServer(app);
const socketio = io(httpServer);

httpServer.listen(1337);

socketio.on('connection', socket => {
  socket.on('select', option => {
    if (option === 'game') {
      game = new Game({ debug: true });
      game.init();
      return socket.emit('init', {
        level: game.level,
        player: game.player
      });
    }

    if (option === 'meeting') {
      matrix.meeting();
    }
    if (option === 'pulse') {

    }
    if (option === 'clock') {
      matrix.clock();
    }
    if (option === 'game of life') {
      gameOfLife = new GameOfLife(randomGameOfLife());
      setInterval(gameOfLife.step, 1000);
    }
  });

  socket.on('clear', () => {
    matrix.stopMatrix();
    socket.emit('unselected');
  });

  socket.on('move', data => {
    const response = game.gameTick(data);
    socket.emit('move', response);
  });
});

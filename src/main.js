import express from 'express';
import http from 'http';
import cors from 'cors';
import io from 'socket.io';
import Game from './dungeonGen/Game.mjs';
import Matrix from './Matrix.js';

const app = express();
let game = null;
const matrix = new Matrix();

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
    if (option === 'clock') {
      // matrix.clock();
    }
  });

  socket.on('clear', () => {
    matrix.clear();
  });

  socket.on('move', data => {
    const response = game.gameTick(data);
    socket.emit('move', response);
  });
});

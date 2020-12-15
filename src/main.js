import express from 'express';
import http from 'http';
import cors from 'cors';
import io from 'socket.io';
import Game from './dungeonGen/Game.mjs';
import Matrix from './Matrix.js';

const app = express();
var game = null;
var matrix = null;

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
      matrix = new Matrix();
      matrix.meeting();
    }
    if (option === 'clock') {
      // matrix.clock();
    }
  });

  socket.on('clear', () => {
    console.log('clear()');
    console.log(matrix);
    console.log(matrix.stop);
    matrix.stop();
  });

  socket.on('move', data => {
    const response = game.gameTick(data);
    socket.emit('move', response);
  });
});

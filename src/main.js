import express from 'express';
import http from 'http';
import cors from 'cors';
import io from 'socket.io';
import Game from './dungeonGen/Game.mjs';
import Matrix from './Matrix';

const app = express();
const matrix = new Matrix();
const game = new Game({ debug: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

game.init();

const httpServer = http.createServer(app);
const socketio = io(httpServer);

httpServer.listen(1337);

let selected = null;

socketio.on('connection', socket => {
  socket.on('select', option => {
    if (selected === option) {
      selected = null;
      return socket.emit('unselected', option);
    }

    selected = option;

    if (option === 'game') {
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

  socket.on('move', data => {
    const response = game.gameTick(data);
    socket.emit('move', response);
  });
});

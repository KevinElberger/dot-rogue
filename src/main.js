import express from 'express';
import http from 'http';
import cors from 'cors';
import io from 'socket.io';
import Game from './dungeonGen/Game.mjs';

const app = express();
const game = new Game({ debug: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

game.init();

const httpServer = http.createServer(app);
const socketio = io(httpServer);

httpServer.listen(1337);

socketio.on('connection', socket => {
  socket.emit('init', {
    level: game.level,
    player: game.player
  });

  socket.on('move', data => {
    const move = game.gameTick(data);
    socket.emit('move', {
      text: move ? `You move ${data}.` : 'You cannot move there.'
    });
  });
});

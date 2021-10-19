const express = require("express");
require('dotenv').config();
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

const users = [];

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on('disconnect', () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
  //
  const userId = socket.handshake.query.userId;
  users.push({ id: socket.id, user: userId });

  socket.on('chat', async ({msg, id}) => {
    const newMsg = {
      ...msg,
      date: new Date(),
      id,
    };
    io.emit('chat', newMsg);
    api.post('/messages', newMsg);
  });
});

http.listen(process.env.PORT, () => console.log('server is running on port 8000'));

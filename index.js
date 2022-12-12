
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket) {

  // Set the room
  socket.join("nielsroom")

  socket.on('drawing', (data) => {
    // console.log('drawing')
    // console.log(socket.rooms)
    socket.broadcast.emit('drawing', data)
  });

  // called from onStartButtonClick - when client clicks start button
  socket.on('setdrawer', (data) => {
    // console.log('setdrawer')
    // console.log(data)
    socket.broadcast.emit('setdrawer', data)
  })
  
  // called from onClickWordBox - when client guesses a word
  socket.on('guessword', (data) => {
    console.log('guessword - - - - - - -')
    console.log(data)
    socket.broadcast.emit('guessword', data)
  })

  setTimeout(_ => {
    socket.emit('start', {
      room: socket.rooms
    });
  }, 200)
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

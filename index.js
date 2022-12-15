
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

let numUsers = 0;
let allUsers = [];
let theWord = ''

var removeByAttr = function(arr, attr, value){
  var i = arr.length;
  while(i--){
     if( arr[i] 
         && arr[i].hasOwnProperty(attr) 
         && (arguments.length > 2 && arr[i][attr] === value ) ){ 

         arr.splice(i,1);

     }
  }
  // return arr;
}

function onConnection(socket) {
  let addedUser = false;

  // Set the room
  socket.join("nielsroom")

  socket.on('drawing', (data) => {
    // console.log('drawing')
    // console.log(socket.rooms)
    socket.broadcast.emit('drawing', data)
  });
  
  socket.on('anotheronejoins', (data) => {
    console.log('anotheronejoins')
    console.log(data.username)
    // console.log(socket.rooms)
    // socket.broadcast.emit('anotheronejoins', data)

    // we store the username in the socket session for this client
    socket.username = data.username;
    ++numUsers;
    addedUser = true;
    // socket.emit('login', {
    //   numUsers: numUsers
    // });

    // TODO - Add to array of users
    allUsers.push( {
      username: socket.username,
      userID: socket.id,
      randomColor: data.randomColor,
      points: 0
    } )

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      allUsers,
      randomColor: data.randomColor,
      id: socket.id
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }

    // Delete the user that left
    allUsers.forEach( (user, index) => {
      if (socket.username === user.username) {
        removeByAttr(allUsers, 'username', socket.username)
      }
    })

  });

  // called from onStartButtonClick - when client clicks start button
  socket.on('setdrawer', (data) => {
    // console.log('setdrawer')
    // console.log(data)
    console.log('- - - - - the word - - - -')
    
    theWord = data.word
    console.log(theWord)

    socket.broadcast.emit('setdrawer response', data)
  })
  
  // called from onClickWordBox - when client guesses a word
  // socket.emit('guessword', {
  //   player: socket.id,
  //   word: word
  // });
  socket.on('guessword', (data) => {
    console.log('guessword - - - - - - -')
    console.log(data)
    
    if (data.word === theWord) {
      data.points = 2
    }
    console.log(data)

    socket.broadcast.emit('guessword response', data)

    // Delete the user that left
    // allUsers.forEach( (user, index) => {
    //   if (socket.username === user.username) {
    //     removeByAttr(allUsers, 'username', socket.username)
    //   }
    // })
  })

  setTimeout(_ => {
    socket.emit('start', {
      room: socket.rooms,
      allUsers
    });
  }, 200)
}

io.on('connection', onConnection);

http.listen(port, () => console.log(`listening on http://localhost:${port}`));

// User info data
// allUsers.push( {
//   username: socket.username,
//   userID: socket.id,
//   randomColor: data.randomColor,
//   points: 0
// } )
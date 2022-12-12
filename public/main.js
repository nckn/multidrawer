'use strict';

(function() {

  const words = [
    'Airplane', 'Bazooka', 'Circus', 'Dromedary', 'Elephant', 'Flower',
    'Giraffe', 'Halloween', 'Icecream', 'Jail', 'Kangaroo', 'Longboard',
  ]

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');

  var wordBoxWrapper = document.getElementById('wordBoxWrapper')
  var startButton = document.getElementById('startButton')
  var currentDrawerId = document.getElementById('currentDrawerId')
  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };
  let settings = {
    strokeWidth: 2,
    color: current.color
  }
  let random = ''

  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  // prevent elastic scrolling
  document.body.addEventListener(
    'touchmove',
    function (e) {
      e.preventDefault()
    },
    false
  )
  
  startButton.addEventListener('click', onStartButtonClick, false);

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  // socket.on("connection", (socket) => {
  //   socket.join("nielsroom")
  //   console.log('- - - - - on connection - - - - - -')
  //   console.log(socket.rooms)
  // });
  
  socket.on('drawing', data => {
    // console.log('we be drawing')
    onDrawingEvent(data)
  });
  
  socket.on('setdrawer', (data) => {
    console.log('we be setting drawer')

    console.log('socket')
    console.log(socket)
    console.log('socket.id')
    console.log(socket.id)

    onSetDrawerEvent(data)
  });
  
  socket.on('guessword', (data) => {
    console.log('a word has been guessed')

    console.log('data')
    console.log(data)

    onClickWordBoxEvent(data)
  });
  
  socket.on('start', (data) => {
    console.log('start')
    console.log(data)
  });

  window.addEventListener('resize', onResize, false);
  onResize();

  const init = () => {
    setTimeout(_ => {
      setFirstdrawer()
    }, 200)
  }

  init()

  const setFirstdrawer = () => {
    console.log('socket - - - - - ')
    console.log(socket)
    console.log('socket id - - - - - ')
    console.log(socket.id)
    
    //this is an ES6 Set of all client ids in the room
    const room = socket.rooms;
    // console.log(room)
    // const clients = io.sockets.adapter.rooms.get('nielsroom');
    // console.log(clients)
    // console.log(clients.size)

  }

  function drawLine(x0, y0, x1, y1, color, emit){
    console.log('socket.id')
    console.log(socket.id)
    console.log('String(currentDrawerId.innerHTML)')
    console.log(String(currentDrawerId.innerHTML))

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = settings.strokeWidth;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });

    // // If you are not the current drawer you cant draw
    // if (String(currentDrawerId.innerHTML) == socket.id) {
    // }

  }

  // The start button is clicked
  function onStartButtonClick(e){
    console.log('onStartButtonClick')

    // currentDrawerId.innerHTML = socket.id

    // Set random wordbox
    random = Math.floor(Math.random() * words.length)

    // Set player and word locally
    arrangeForDrawer( {player: socket.id, random: random } )

    // *************************************************
    // **** emit event - sent from client to server ****
    socket.emit('setdrawer', {
      player: socket.id,
      random: random
    });
  }

  // onClickWordBox
  function onClickWordBox(word) {
    console.log('the word is:')
    console.log(word)

    // *************************************************
    // **** emit event - sent from client to server ****
    socket.emit('guessword', {
      player: socket.id,
      word: word
    });
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    console.log('drawing')
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }
  
  function onSetDrawerEvent(data){
    // console.log('receiving')
    // console.log(data)
    
    // console.log('data')
    // console.log(data)

    arrangeForDrawer(data, data.random)
    // currentDrawerId.innerHTML = data.player
  }
  
  function onClickWordBoxEvent(data){
    console.log('word guess')
    console.log('data.word')
    console.log(data.word)
    console.log('random')
    console.log(words[random])

    // Check if in fact we have the correct word
    if (data.word === words[random]) {
      document.body.style.background = 'red'

      setTimeout(_ => {
        document.body.style.background = 'white'
      }, 500)
      // alert('correct guess')
    }

    // arrangeForDrawer(data, data.random)
    // currentDrawerId.innerHTML = data.player
  }

  function arrangeForDrawer( {player, random}) {
    // currentDrawerId.innerHTML = data.player
    currentDrawerId.innerHTML = player

    // Clear the canvas now that a new drawing has to happen
    context.clearRect(0, 0, canvas.width, canvas.height)

    const allWordBoxes = [...document.getElementsByClassName('word-box')]
    
    console.log('allWordBoxes')
    console.log(allWordBoxes)

    // return
    
    allWordBoxes.forEach( (box, index) => {
      // First remove selected class name
      box.classList.remove('word-box--selected')
      // Then add to the random wordbox
      // If you are not the current drawer you cant draw
      if (String(currentDrawerId.innerHTML) == socket.id) {
        if (index === random) {
          box.classList.add('word-box--selected')
        }
      }
    })
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } 

  // Setup all words
  function applyWords() {
    for (let i = 0; i < words.length; i++) {
      const wordBox = document.createElement('div')
      const wordBoxText = document.createElement('p')
      wordBox.classList.add('word-box')
      wordBoxText.innerHTML = words[ i ]
      wordBox.appendChild( wordBoxText )
      wordBoxWrapper.appendChild( wordBox )

      wordBox.addEventListener('click', () => { 
        console.log('hey')
        onClickWordBox(words[ i ])
      }, false)
      // wordBox.addEventListener('click', onClickWordBox(words[ i ]), false)
    }
  }

  function onMouseDown(e){
    drawing = true;
    // If you are not the current drawer you cant draw
    if (String(currentDrawerId.innerHTML) == socket.id) {
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    // If you are not the current drawer you cant draw
    if (String(currentDrawerId.innerHTML) == socket.id) {
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    }
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    // If you are not the current drawer you cant draw
    if (String(currentDrawerId.innerHTML) == socket.id) {
      drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    }
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  // Now apply words
  applyWords()

})();

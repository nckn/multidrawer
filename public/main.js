'use strict';

(function() {

  const words = [
    'Airplane', 'Bazooka', 'Circus', 'Dromedary', 'Elephant', 'Flower'
  ]

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');

  var startButton = document.getElementById('startButton')
  var currentDrawerId = document.getElementById('currentDrawerId')
  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };
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
    console.log(socket.id)
    console.log(String(currentDrawerId.innerHTML))

    // If you are not the current drawer you cant draw
    // if (String(currentDrawerId.innerHTML) != socket.id) {
    //   return
    // }

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
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
  }

  function onStartButtonClick(e){
    console.log('onStartButtonClick')

    currentDrawerId.innerHTML = socket.id

    socket.emit('setdrawer', {
      player: socket.id
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
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

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    console.log('drawing')
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }
  
  function onSetDrawerEvent(data){
    console.log('receiving')
    console.log(data)

    currentDrawerId.innerHTML = data.player
    // currentDrawerId.innerHTML = data.currentDrawerId
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();

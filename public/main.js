'use strict';

(function() {

  const words = [
    'Airplane', 'Bazooka', 'Circus', 'Dromedary', 'Elephant', 'Flower',
    'Giraffe', 'Halloween', 'Icecream', 'Jail', 'Kangaroo', 'Longboard',
    'Moon', 'Nails', 'Oreo', 'Pillow', 'Queen', 'Radio', 'Sun', 'Tennis'
  ]
  // Put words that are drawn in here so they dont appear again
  let wordsDrawn = []

  const playerColors = [
    '#3bd29e',
    '#7194e3',
    '#de71e3',
  ]

  let blockTime = 10000
  let pointsPerWin = 10

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');

  var scoreBoardWrapper = document.getElementById('scoreBoardWrapper')
  var wordBoxWrapper = document.getElementById('wordBoxWrapper')
  var theWordText = document.getElementById('theWord')
  var startButton = document.getElementById('startButton')
  var currentDrawerId = document.getElementById('currentDrawerId')
  var currentWord = document.getElementById('currentWord')
  
  // Countdown
  var fillCountDown = document.getElementById('fillCountDown')

  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };
  let settings = {
    strokeWidth: 2,
    color: current.color
  }
  let random = ''
  let theWord = ''
  let theCurrentDrawerID = ''
  let myUserName = ''

  // All users. corresponds to / reflects servers allUsers
  let allUsers = [{}];

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

  document.addEventListener('keyup', onKeyUp, false)

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

  // Look for when don content is loaded
  window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    joinGame()
  })

  function onKeyUp (e) {
    console.log(e)
    if (e.key === 's') {
      onStartButtonClick()
    }
  }

  const joinGame = () => {
    // weAreLoaded()
    // Set new user name
    // const randomUserName = Math.random().toFixed(4)
    // const randomUserName = makeid( 6 )
    const randomUserName = rapNameGenerator()
    const randomColor = Math.floor(Math.random()*16777215).toString(16)

    myUserName = randomUserName
    createANewPlayer( { username: randomUserName, randomColor, id: socket.id, isItMe: true })

    socket.emit('anotheronejoins', {
      // socket.id
      username: randomUserName,
      randomColor
    });
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
  
  // When receiving back from server
  socket.on('setdrawer response', (data) => {
    console.log('we be setting drawer')

    // console.log('socket')
    // console.log(socket)
    // console.log('socket.id')
    // console.log(socket.id)
    // console.log(data.word)

    // theWord = socket.word
    setWord('server', data.word)

    // // Set the theWord DOM
    // theWordText.innerHTML = theWord

    onSetDrawerEvent(data)
  });
  
  // When receiving back from server
  // If someone try to guess it
  socket.on('guessword response', (data) => {
    console.log('a word has been guessed')

    console.log('data')
    console.log(data)

    onClickWordBoxEvent(data)
  });
  
  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    console.log('user joined')
    console.log(data)

    createANewPlayer(data)
    // log(`${data.username} joined`);
    // addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  // Delete the user from allUsers
  socket.on('user left', (data) => {
    console.log('user left')
    console.log(data)
    
    console.log('allUsers - before')
    console.log(allUsers)

    // Delete the user that left
    allUsers.forEach( (user, index) => {
      if (data.username === user.username) {
        removeByAttr(allUsers, 'username', user.username)

        // Delete the DOM in question
        deleteAssociatedDom( user.username )
      }
    })

    console.log('allUsers - after')
    console.log(allUsers)

    // log(`${data.username} left`);
    // addParticipantsMessage(data);
    // removeChatTyping(data);
  });
  
  socket.on('start', (data) => {
    console.log('start')
    console.log(data)

    // TODO - Create all other players
    const allExistingUsers = data.allUsers
    allExistingUsers.forEach( (user, index) => {
      console.log('user was added')
      console.log(user)
      if (myUserName !== user.username) {
        createANewPlayer( { username: user.username, randomColor: user.randomColor, id: user.id })
      }
    });
    
    // createANewPlayer(data)
  });

  window.addEventListener('resize', onResize, false);
  onResize();

  const init = () => {
    setTimeout(_ => {
      setFirstdrawer()
    }, 200)
  }

  init()

  const deleteAssociatedDom = ( username ) => {
    console.log('deleteAssociatedDom')
    const allPlayerRows = [...document.getElementsByClassName('player-row')]
    allPlayerRows.forEach( (row, index) => {
      const dataName = row.getAttribute('data-name')
      if (dataName === username) {
        row.parentNode.removeChild(row)
      }
    })
  }

  const createANewPlayer = ( data ) => {
    console.log('createANewPlayer')
    console.log(data)

    // allUsers.push( data.allUsers )
    allUsers = data.allUsers

    const playerRow = document.createElement('div')
    const playerRowTextName = document.createElement('p')
    const playerRowBar = document.createElement('div')
    
    playerRow.classList.add('player-row')
    playerRowTextName.classList.add('player-row-text')
    playerRowBar.classList.add('player-row-bar')
    
    if (data.isItMe) {
      playerRowBar.classList.add('my-bar')
      playerRowTextName.classList.add('player-row-text--isitme')
    }

    // Add name attribute to playerRow
    playerRow.setAttribute('data-name', data.username)
    playerRow.setAttribute('data-id', data.id)
    
    // playerRowBar.style.background = `${playerColors[ Math.floor(Math.random() * playerColors.length) ]}`
    playerRowBar.style.background = `#${data.randomColor}`

    playerRow.appendChild( playerRowTextName )
    playerRow.appendChild( playerRowBar )
    scoreBoardWrapper.appendChild( playerRow )

    playerRow.classList.add('is-revealed')
    // setTimeout(_ => {
    //   playerRow.classList.add('is-revealed')
    // }, 10)
    
    // Add content
    playerRowTextName.innerHTML = data.username
  }

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
    // console.log('socket.id')
    // console.log(socket.id)
    // console.log('String(currentDrawerId.innerHTML)')
    // console.log(String(currentDrawerId.innerHTML))

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

  // The timer
  var startVal = 30;
  function startCcountdown(){
    fillCountDown.classList.add('iscountingdown')
    fillCountDown.style.animationDuration = `${startVal}s`
    var counter = startVal;
    var downloadTimer = setInterval(function(){
      // document.getElementById("pbar").value = 10 - --counter;
      // fillCountDown.style.width = `${((counter / startVal)) * 100}%`;
      // fillCountDown.style.width = `${(100 / startVal) * counter}%`;

      counter--

      if(counter <= 0)
        clearInterval(downloadTimer);
      
      document.getElementById("fillCountDownNumber").innerHTML= counter;
      
    },1000);
  }

  function hideStartButton(e){
    startButton.classList.add('hidden')
  }

  function setWord(src, word) {
    // let thisHereWord = word
    theWord = word
    // if (src === 'local') {
    //   theWord = words[ random ]
    // }
    // else {
    //   theWord = socket.word
    // }
    // Set the theWord DOM
    theWordText.innerHTML = theWord
  }

  // The start button is clicked
  function onStartButtonClick(e){
    
    hideStartButton()

    console.log('onStartButtonClick')

    startCcountdown()

    // currentDrawerId.innerHTML = socket.id

    // Set random wordbox
    random = Math.floor(Math.random() * words.length)

    setWord('local', words[ random ])

    // Set player and word locally
    arrangeForDrawer( {player: socket.id, random: random, word: words[ random ] } )

    // *************************************************
    // **** emit event - sent from client to server ****
    socket.emit('setdrawer', {
      player: theCurrentDrawerID === '' ? socket.id : theCurrentDrawerID,
      random: random,
      word: words[ random ]
    });
  }

  // Guess word - locally
  // onClickWordBox
  function onClickWordBox(word) {
    console.log('the word is:')
    console.log(word)

    // Did I guess correctly?
    // Yes. 
    // console.log(theWord)
    if (word === theWord) {
      // *** I guessed the word ***
      // document.body.style.background = 'green'

      // I guess it gives me points
      assignPoints( {playerName: myUserName } )
    }
    // No 
    else {
      blockMoreGuessing()
    }

    // *************************************************
    // **** emit event - sent from client to server ****
    socket.emit('guessword', {
      player: socket.id,
      playerName: myUserName,
      word: word
    });
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    // console.log('drawing')
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
    console.log('theWord')
    console.log(theWord)
    // console.log('random')
    // console.log(words[random])

    // Check if in fact we have the correct word
    // if (data.word === words[random]) {
    // *****************
    // *** Key event ***
    // Someone guessed it!
    if (data.word === theWord) {
      // document.body.style.background = 'red'
      // document.body.classList.add('body--guessed')

      assignPoints(data)

      theCurrentDrawerID = data.player

      onStartButtonClick()

      // setTimeout(_ => {
      //   document.body.style.background = 'white'
      // }, 500)
      // alert('correct guess')
    }
    // else {
    //   blockMoreGuessing()
    // }

    // arrangeForDrawer(data, data.random)
    // currentDrawerId.innerHTML = data.player
  }

  const assignPoints = (data) => {
    console.log('someone guessed it')
    // console.log('data.player', data.player, 'socket.id', socket.id)
    console.log('data.playerName', data.playerName, 'myUserName', myUserName)

    // get the point bar
    const allBars = [...document.getElementsByClassName('player-row')] 
    allBars.forEach( (barParent, index) => {
      const dataName = String(barParent.getAttribute('data-name'))
      console.log('dataName', dataName, 'data.playerName', data.playerName)
      if (dataName === String(data.playerName)) {

        const bar = barParent.children[ 1 ]
        // const style = document.computed
        let style = window.getComputedStyle(bar, null)
        let width = parseInt(style.width, 10)
        // var width = parseInt(bar.style.width, 10);
        bar.style.width = `${width + pointsPerWin}%`
        // bar.style.width = `${10}%`
        // bar.querySelector('player-row-bar').style.width = `${10}%`
      }
    })
    // const theOneWithPoints = 

    // if (data.username ===) {}
    // if (theCurrentDrawerID === socket.id) {
    // if (data.player === socket.id) {
    // if (data.playerName === myUserName) {
    //   const myPlayerRowBar = document.querySelector('.my-bar')
    //   myPlayerRowBar.style.width = `${10}%`
    // }
  }

  // Block guessing locally
  const blockMoreGuessing = () => {
    wordBoxWrapper.classList.add('block-more-guessing')
    setTimeout(_ => {
      wordBoxWrapper.classList.remove('block-more-guessing')
    }, blockTime)
  }

  function arrangeForDrawer( {player, random, word}) {
    // currentDrawerId.innerHTML = data.player
    currentDrawerId.innerHTML = player
    currentWord.innerHTML = word

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

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('Unable to fetch data:', error);
    }
  }

  // async function weAreLoaded() {
  //   const allNames = await fetchNames('male')
  //   const randomName = await allNames[Math.floor(Math.random() * allNames.length)]
  //   console.log('randomName')
  //   console.log(randomName)

  //   socket.emit('anotheronejoins', {
  //     // socket.id
  //     username: Math.random().toFixed(4)
  //   });
  // }

  function fetchNames(nameType) {
    return fetchData(`https://www.randomlists.com/data/names-${nameType}.json`);
  }

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

  const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function rapNameGenerator(){
    // Add your own words to the wordlist. Be careful to obey the showed syntax
    
    var wordlist1 = ["Easy","Big","Golden","Flexer","Myssis","Retardo","Poffin","Three Time","Holy","Big Man","Big Time","Lighter","Muscled","Everyday","Lil","Little","Toned","Dirty","Dusty","Clean","Fly","Gang","Game","The","Quick","Elementor","Guy","Machine Mouth","Two Tone","Rider","Vanilla","Chocolate","Coco","Marmalade","Viral","Slinger","Ten Toes","Scamazon","Your Dad","Digits","Post","Angry","Happy","Deadly","Talented","Positive","Army","Platinum","Scolder","Scholor","Ruthless","Phoner","Eager","Lawn","Every Cloud","Last Chance","Baby","Flower","Shower","Fast Tounge","Duke","Chewey","Gappy","Overflow","Louder","Sergeant","Mr","Royal","Pump","Shoveler","Hats Down","Forceful","Fly","Greezy","Bat Man","Show Time","Cash","Mulla","Counter","Aries","Taurus","Leo","Virgo","Libra","Evergreen","Audio","Certi","Certified","Gorilla","Park","Brudda","Brother","Key","Bearded","Fresh","Old","Old Man","P.O","Po","Dean","Street","More","Drive By",];
    var wordlist2 = ["Q","Flex","Money","Baddie","E","Tone","R","Tinee","Ricardo","T","Grapes","Every Day","Dog","Pence","Cent","The Rapper","Dirty","The Stunter","Da Boss","Uzi","Flame","Time","Hustle","1","Thug","North","Brown","Green","2","G","Gee","Cream","East","3","Paper","Chains","Tumble","Roll","4","Thrones","Clapper","Mute","Bank","5","Dimes","On Da Corner","2 Gangster","6","Drinkz","Friday","Recruit","Pump","Rhymes","7","Cuz","Rider","Green","Fam","Gold","8","Light","Ice","Face","Black","Da Rapper","South","Man","9","Boy","Styles","Clips","Spray","Mr","Royal Man","Ape","Smith","Tay","Jay","Trillion","West","Dukes","Rap Up","Tape","Son","Planner","Habits","Z","Is Me","Gold","Silver","2.0","4000","Eternal","Dean","Malone","O Geezy","Mon","Grass","Roller","Barrel","Peez","IQ","Wordz","Gums","Sims","London","Place",]
    
    // Random numbers are made 
    var randomNumber1 = parseInt(Math.random() * wordlist1.length);
    var randomNumber2 = parseInt(Math.random() * wordlist2.length);
    var name = wordlist1[randomNumber1] + " " + wordlist2[randomNumber2];			
    return name
    //alert(name); //Remove first to slashes to alert the name
    
    //If there's already a name it is removed  
    // if(document.getElementById("result")){
    //   document.getElementById("placeholder").removeChild(document.getElementById("result"));
    // }
    // // A div element is created to show the generated name. The Name is added as a textnode. Textnode is added to the placeholder.
    // var element = document.createElement("div");
    // element.setAttribute("id", "result");
    // element.appendChild(document.createTextNode(name));
    // document.getElementById("placeholder").appendChild(element);
  }

  // Now apply words
  applyWords()

})();

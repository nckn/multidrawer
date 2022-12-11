class Drawer {
  constructor () {
    this.canvas = document.getElementById('canvas')
    this.context = canvas.getContext('2d')
    this.startButton = document.getElementById('go')

    // this.canvas.width = document.body.clientWidth
    // this.canvas.height = document.body.clientHeight
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.initDrawer()

    console.log('canvas is: ')
    console.log(this.canvas)

    // this.draw(e)

    this.startButton.addEventListener('mousedown', this.go.bind(this), false)
    this.startButton.addEventListener('touchstart', this.go.bind(this), false)

  }
  
  initDrawer (e) {
    let _this = this

    _this.addEventListeners()

    _this.drawer = {
      isDrawing: false,
      mousedown: _this.start.bind(this),
      mousemove: _this.move.bind(this),
      mouseup: _this.stop.bind(this),
      touchstart: _this.start.bind(this),
      touchmove: _this.move.bind(this),
      touchend: _this.stop.bind(this)
    }

    // Start the drawing
    // this.draw(e)
  }

  draw (e) {
    let _this = this
    console.log('draw')
    console.log('e is - - - - - - - - ')
    console.log(e.targetTouches)
    // console.log(window)
    let coors = ''
    // if (e.clientX || e.targetTouches) {
    if (e.clientX || e.targetTouches.length > 0) {
      coors = {
        // x: e.clientX || e.targetTouches[0].pageX,
        // y: e.clientY || e.targetTouches[0].pageY
        x: e.clientX || e.targetTouches[0].clientX,
        y: e.clientY || e.targetTouches[0].clientY
      }
      _this.drawer[e.type](coors)
    }
    else {
      return
    }
  }

  start (coors) {
    let _this = this
    _this.context.beginPath()
    _this.context.moveTo(coors.x, coors.y)
    _this.drawer.isDrawing = true
  }

  move (coors) {
    let _this = this
    console.log('moving')
    if (this.drawer.isDrawing) {
      _this.context.strokeStyle = '#fff'
      _this.context.lineJoin = 'round'
      _this.context.lineWidth = 3
      _this.context.lineTo(coors.x, coors.y)
      _this.context.stroke()
    }
  }

  stop (coors) {
    let _this = this
    if (_this.drawer.isDrawing) {
      _this.drawer.touchmove(coors)
      _this.drawer.isDrawing = false
    }
  }

  go(e) {
    let _this = this
    const target = e.target
    
    console.log(target.parentNode)
    if (target.parentNode) {
      target.parentNode.removeChild(target)
    }

    console.log('starting drawing')
    
    // Start the drawing
    _this.draw(e)
  }

  addEventListeners () {
    let _this = this
    const canvas = _this.canvas
    canvas.addEventListener('mousedown', _this.draw.bind(_this), false)
    canvas.addEventListener('mousemove', _this.draw.bind(_this), false)
    canvas.addEventListener('mouseup', _this.draw.bind(_this), false)
    canvas.addEventListener('touchstart', _this.draw.bind(_this), false)
    canvas.addEventListener('touchmove', _this.draw.bind(_this), false)
    canvas.addEventListener('touchend', _this.draw.bind(_this), false)

    // prevent elastic scrolling
    document.body.addEventListener(
      'touchmove',
      function (e) {
        e.preventDefault()
      },
      false
    )

    // end body:touchmove
    window.onresize = function (e) {
      canvas.width = document.body.clientWidth
      canvas.height = document.body.clientHeight
    }
  }

}

export default Drawer

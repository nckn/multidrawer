class Drawer() {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.context = canvas.getContext('2d')

    this.drawer = {
      isDrawing: false,
      mousedown: start,
      mousemove: move,
      mouseup: stop,
      touchstart: start,
      touchmove: move,
      touchend: stop
    }

    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight

    this.addEventlisteners()
    
    this.move()
    
  }
  
  draw(e) {
    var coors = {
      x: e.clientX || e.targetTouches[0].pageX,
      y: e.clientY || e.targetTouches[0].pageY
    }
    drawer[e.type](coors)
  }

  addEventListener() {
    let _this = this
    const canvas = _this.canvas
    canvas.addEventListener('mousedown', draw, false)
    canvas.addEventListener('mousemove', draw, false)
    canvas.addEventListener('mouseup', draw, false)
    canvas.addEventListener('touchstart', draw, false)
    canvas.addEventListener('touchmove', draw, false)
    canvas.addEventListener('touchend', draw, false)
  }

  start(coors) {
    context.beginPath()
    context.moveTo(coors.x, coors.y)
    this.isDrawing = true
  }

  move(coors) {
    if (this.isDrawing) {
      context.strokeStyle = '#fff'
      context.lineJoin = 'round'
      context.lineWidth = 3
      context.lineTo(coors.x, coors.y)
      context.stroke()
    }
  }

  stop(coors) {
    if (this.isDrawing) {
      this.touchmove(coors)
      this.isDrawing = false
    }
  }

}

export default Drawer
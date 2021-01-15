const height = 42;
const color = '#8c8c8c'
class Event {
  constructor(start, end, duration, zoomFactor, pixelsPerSecond) {
    this.eventElement = document.createElement('div')
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.zoomFactor = zoomFactor;
    this.pixelsPerSecond = pixelsPerSecond;

    // Const style properties
    this.eventElement.style.height = height;
    this.eventElement.style.top = 30;
    this.eventElement.style.position = "absolute";
    this.eventElement.style.backgroundColor = color;
    document.body.appendChild(this.eventElement);

    // decorate element
    this.decorateElement();
  
    // Mouse scroll resize
    //window.addEventListener('wheel', this._onScroll.bind(this));
  }

  width() {
    console.log('event pps', this.pixelsPerSecond);
    const width = Math.round(this.duration * this.zoomFactor * this.pixelsPerSecond)
    console.log(width);
    return width;
  }

  decorateElement() {
    this.eventElement.style.left = this.start * this.pixelsPerSecond;
    this.eventElement.style.width = this.width();
  }

  /*
  _onScroll(e) {
    const scrollTick = Math.round(e.deltaY / 50);
    const scrollPosRatio = e.offsetX / e.srcElement.clientWidth;

    if (scrollTick > 0) {
      this._zoomOut(scrollTick, scrollPosRatio);
    }
  }

  _zoomOut(amt, pos) {
    const range = this.duration;
    const growSize = range * Math.pow(1.05, amt) - range;
    console.log(Math.pow(1.005, amt));
    return growSize;
  }

  _zoomIn(amt, pos) {
    return;
  }*/

  updateScale(pixelsPerSecond) {
    this.pixelsPerSecond = pixelsPerSecond;
    // Redecor element
    this.decorateElement();
  }
}

class TimeMarking {
  constructor(pixelsPerSecond) {
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.style.position = "absolute";
    this.canvasElement.style.left = 0;
    this.ctx = this.canvasElement.getContext('2d');
    this.pixelsPerSecond = pixelsPerSecond;
    this.height = 30;
    this.markingHeight = 6;

    this._setupCanvas();
    this._drawTimes(this.ctx);
    document.body.appendChild(this.canvasElement);
  }

  _setupCanvas() {
    var dpr = window.devicePixelRatio;
    this.canvasElement.width = document.body.clientWidth;
    this.canvasElement.height = this.height*dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;
    this.pixelsPerSecond = Math.round(this.pixelsPerSecond/dpr);
  }

  _drawTimes(ctx) {
    let markingsPerSecond = 10;
    let timeMarkingOffset = this.pixelsPerSecond / markingsPerSecond;
    let numTimeMarks = document.body.clientWidth / timeMarkingOffset;
    let x = 0;
    let t = 0.0;

    for(var i=0; i<numTimeMarks;i++) {
      let markingHeight = this.markingHeight;
      // Text markings
      if(i % markingsPerSecond === 0) {
        markingHeight = this.markingHeight + 6; 
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center'
        ctx.fillText(t, x, this.markingHeight+14);
        t += 1.0;
      }
      // Vertical line markings
      ctx.strokeStyle="#000000";
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x, markingHeight);
      ctx.stroke();
      x += timeMarkingOffset;
    }
  }
  
  updateScale(pixelsPerSecond) {
    this.pixelsPerSecond = pixelsPerSecond;
    this._setupCanvas();
    this._drawTimes(this.ctx);
  }
}

var viewableDur = 30.0;
const clientWidth = document.body.clientWidth;
var pixelsPerSecond = Math.round(clientWidth/viewableDur);
const dur = 3.0;
const newStart = 2;
console.log("w",clientWidth);
console.log("pps", pixelsPerSecond);

const newTimeMarkings = new TimeMarking(pixelsPerSecond);
const newEvent = new Event(newStart, newStart + dur, dur, 1.0, pixelsPerSecond);

window.addEventListener('wheel', onScroll);
function onScroll(e) {
  if(e.deltaY > 0) {
    console.log(e);
    viewableDur = viewableDur * 1.025;
    pixelsPerSecond = Math.round(clientWidth/viewableDur);
    newTimeMarkings.updateScale(pixelsPerSecond)
    newEvent.updateScale(pixelsPerSecond);
  } else {
    viewableDur = viewableDur * (1/1.025);
    pixelsPerSecond = Math.round(clientWidth/viewableDur);
    newTimeMarkings.updateScale(pixelsPerSecond)
    newEvent.updateScale(pixelsPerSecond);
  }
}







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
    //console.log('event pps', this.pixelsPerSecond);
    const width = Math.round(this.duration * this.zoomFactor * this.pixelsPerSecond)
    //console.log(width);
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
  constructor(viewableDur, minTimemarkings) {
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.style.position = "absolute";
    this.canvasElement.style.left = 0;
    this.ctx = this.canvasElement.getContext('2d');
    this.viewableDur = viewableDur;
    this.pixelsPerSecond = Math.round(document.body.clientWidth/viewableDur);
    this.height = 30;
    this.markingHeight = 6;
    this.minTimemarkings = minTimemarkings;
    //this.dpr = window.devicePixelRatio;

    this._setupCanvas();
    this._drawTimes(this.ctx);
    document.body.appendChild(this.canvasElement);
  }

  _setupCanvas() {
    const dpr = window.devicePixelRatio;
    this.canvasElement.width = document.body.clientWidth;
    this.canvasElement.height = this.height*dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;
    //this.pixelsPerSecond = Math.round(this.pixelsPerSecond/dpr);
  }

  //  1, 5, 15, 30
  //  1*minTimemarkings, 5*minTimemarkings.. etc
  _getTimeOffset() {
    const durations = [0.5,1,5,15,30,60];
    let prev = 1000000;
    for(var i=durations.length;i>=0;i--) {
      //dur < this.viewableDur < prev
      if(durations[i]*this.minTimemarkings < this.viewableDur && this.viewableDur <= prev){
        return durations[i];
      }
      prev = durations[i]*this.minTimemarkings;
    }
    return 60;
  }

  // Drawtimes
  _drawTimes(ctx) {
    const dpr = window.devicePixelRatio;
    let markingsPerTick = 5;
    let tickOffset = this._getTimeOffset();
    //console.log('tick',tickOffset);
    let pixelsPerTick = Math.round((1/dpr)*document.body.clientWidth/(viewableDur/tickOffset));
    let timeMarkingOffset = pixelsPerTick / markingsPerTick;
    let numTimeMarks = document.body.clientWidth / timeMarkingOffset;
    /*
    let markingsPerSecond = 10;
    let timeMarkingOffset = this.pixelsPerSecond / markingsPerSecond;
    let numTimeMarks = document.body.clientWidth / timeMarkingOffset;
    */
    let x = 0;
    let t = 0.0;

    for(var i=0; i<numTimeMarks;i++) {
      let markingHeight = this.markingHeight;
      // Text markings
      //if(i % markingsPerSecond === 0) {
      if(i % markingsPerTick === 0) {
        markingHeight = this.markingHeight + 6; 
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center'
        ctx.fillText(t, x, this.markingHeight+14);
        t += tickOffset;
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
  
  updateScale(viewableDur) {
    this.pixelsPerSecond = Math.round(document.body.clientWidth/viewableDur);
    this.viewableDur = viewableDur;
    this._setupCanvas();
    this._drawTimes(this.ctx);
  }
}

const clientWidth = document.body.clientWidth;
const dur = 3.0;
const newStart = 2;
var viewableDur = 30.0;
var minTimemarkings = 3;
var pixelsPerSecond = Math.round(clientWidth/viewableDur);
console.log("w",clientWidth);
console.log("pps", pixelsPerSecond);

const newTimeMarkings = new TimeMarking(viewableDur, minTimemarkings);
const newEvent = new Event(newStart, newStart + dur, dur, 1.0, pixelsPerSecond);

window.addEventListener('wheel', onScroll);
function onScroll(e) {
  if(e.deltaY > 0) {
    //console.log(e);
    viewableDur = viewableDur+1;
    pixelsPerSecond = Math.round(clientWidth/viewableDur);
    newTimeMarkings.updateScale(viewableDur)
    newEvent.updateScale(pixelsPerSecond);
  } else {
    viewableDur = viewableDur-1;
    pixelsPerSecond = Math.round(clientWidth/viewableDur);
    newTimeMarkings.updateScale(viewableDur)
    newEvent.updateScale(pixelsPerSecond);
  }
}







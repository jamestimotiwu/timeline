const height = 50;
const color = '#8c8c8c'
class Event {
  constructor(start, end, duration, zoomFactor) {
    this.eventElement = document.createElement('div')
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.zoomFactor = zoomFactor;
    this.pixelsPerSecond = 250;

    // Const style properties
    this.eventElement.style.height = height;
    this.eventElement.style.backgroundColor = color;
    document.body.appendChild(this.eventElement);

    // decorate element
    this.decorateElement();
  
    // Mouse scroll resize
  }

  width() {
    const width = Math.round(this.duration * this.zoomFactor * this.pixelsPerSecond)
    console.log(width);
    return width;
  }

  decorateElement() {
    this.eventElement.style.width = this.width();
  }
}

const newEvent = new Event(0, 2.36667, 2.366667, 1.0);








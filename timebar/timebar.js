const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

var width = 800;
var height = 20;
var markingHeight = 10;

function setupCanvas() {
  canvas.width = width;
  canvas.height = height;
}

function drawTimes(ctx) {
  // Clear canvas: clearRect
  // Calculate number of time pixels difference: totalTime / pixels per second: totalTimePixels
  // Get count of time markings given width and totalTimeOffset
  let timeOffset = 100;
  let timeMarkOffset = timeOffset/5;
  let numTimemarks = width / timeMarkOffset;
  let numTimestamps = width / timeOffset;
  let x = 0;

  for(i = 0; i<numTimemarks;i++){
    x = x + timeMarkOffset;
    // Add vertical line markings
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, markingHeight);
    ctx.stroke();
    // Add timestamps
    //
  }
}

setupCanvas();
drawTimes(ctx);
document.body.appendChild(canvas);

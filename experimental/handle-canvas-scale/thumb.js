//<video style={{ display: "none" }} ref={this.thumbVidRef} preload="metadata" width="80" height="45" src={this.props.blob}></video>
//<canvas style={{ display: "none" }} ref={this.canvasRef} />

const canv = document.getElementById("video-canvas");
//const vid = document.getElementById("vid0");
//const vid = document.querySelector('video');
const vid_out = document.getElementById("video-out");
const vid_in = document.getElementById("upload-video");
const strip_out = document.getElementById("strip-out");
var canvasCtx = [];

function createThumbStrip(vid) {
  var ctx = canv.getContext('2d');
  let curr_time = 0;
  let thumbnails = [];
  canv.height = 45;
  canv.width = 720;

  if(ctx!=null) {
    let interval = vid.duration / 9;
    let x = 0;
    vid.currentTime = 0.1;
    // Create thumbnail at new time
    let start = Date.now();
    vid.addEventListener('seeked', () => {  
      for(var i=0;i<canvasCtx.length;i++){
        //console.log(canvasCtx[i]);
        canvasCtx[i].drawImage(vid, x, 0, 80, 45);
      }
      ctx.drawImage(vid, x, 0, 80, 45);
      x += 80;
      if(isNaN(interval)) {
        interval = vid.duration / 9;
      }

      if(canv.current === null) {
        return;
      }
      /*
      canv.toBlob((blob) => {
        const blob_link = URL.createObjectURL(blob);
        thumbnails.push(blob_link);
      }, 'image/jpeg');
*/
      // Seek video further
      curr_time += interval;
      if(curr_time <= vid.duration) {
        vid.currentTime = curr_time;
      }

      if (thumbnails.length >= 9) {
        //let img_strip = renderThumbStrip(thumbnails);
        //console.log(img_strip);
        //strip_out.innerHTML = img_strip;
        console.log(Date.now() - start);
        return;
      }

    });
    return;
  }
}

function renderThumbStrip(thumbnails) {
  let no_sel = "no-select"
  return thumbnails.map((img) => {
    return '<img class='+no_sel+' src='+img+'>';
  }).join('');
}

vid_in.addEventListener('change', () => {
  let video = null;
  while(video===null) {
    video = document.querySelector('video');
  }
  video.addEventListener('loadeddata', () => {
    console.log("video loaded");
    createThumbStrip(video);
  });
});

// generate a ton of canvases
const parent_canvases = document.getElementById('canvases');

function generateCanvases(n) {
  console.log("generating ", n);
  var currTop = 100;
  var deltaTop = 50;
  for(var i=0;i<n;i++) {
    var newCanvas = document.createElement('canvas');
    var newCtx = newCanvas.getContext('2d');
    newCanvas.id = 'canvas'+i;
    newCanvas.style.position = 'absolute';
    currTop += deltaTop;
    newCanvas.style.top = currTop;
    newCanvas.height = 45;
    newCanvas.width = 720;
    canvasCtx.push(newCtx);
    parent_canvases.appendChild(newCanvas);
  }
}

generateCanvases(100);

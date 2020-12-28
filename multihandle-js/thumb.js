//<video style={{ display: "none" }} ref={this.thumbVidRef} preload="metadata" width="80" height="45" src={this.props.blob}></video>
//<canvas style={{ display: "none" }} ref={this.canvasRef} />

const canv = document.getElementById("video-canvas");
//const vid = document.getElementById("vid0");
//const vid = document.querySelector('video');
const vid_out = document.getElementById("video-out");
const vid_in = document.getElementById("upload-video");
const strip_out = document.getElementById("strip-out");

function createThumbStrip(vid) {
  var ctx = canv.getContext('2d');
  let curr_time = 0;
  let thumbnails = [];
  canv.height = 45;
  canv.width = 80;

  if(ctx!=null) {
    let interval = vid.duration / 9;
    vid.currentTime = 0.1;
    // Create thumbnail at new time
    vid.addEventListener('seeked', () => {  
      ctx.drawImage(vid, 0, 0, 80, 45);
      if(isNaN(interval)) {
        interval = vid.duration / 9;
      }

      if(canv.current === null) {
        return;
      }
      canv.toBlob((blob) => {
        const blob_link = URL.createObjectURL(blob);
        thumbnails.push(blob_link);
      }, 'image/jpeg');

      // Seek video further
      curr_time += interval;
      if(curr_time <= vid.duration) {
        vid.currentTime = curr_time;
      }

      if (thumbnails.length >= 9) {
        let img_strip = renderThumbStrip(thumbnails);
        console.log(img_strip);
        strip_out.innerHTML = img_strip;
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

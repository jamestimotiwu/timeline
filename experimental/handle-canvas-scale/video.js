const video_in = document.getElementById('upload-video');
const video_out = document.getElementById('video-out');
var state = {
  videos: []
};

function loadVideo() {
  const vids = video_in.files

  for (const file of vids) {
    state.videos.push(
      {
        file: file,
        blob: URL.createObjectURL(file),
      }
    );
  }
  video_out.innerHTML = renderVideo();
}

function renderVideo() {
  if (state.videos.length < 1) return 'None';
  return state.videos.map((item, i) => {
    let vid_id = "vid" + i;
    console.log(item.blob);
    return '<video id='+vid_id+' width="100%" style="display:none" height="auto" controls><source src='+ item.blob +'></source></video>'
  });
}
console.log(video_in);

video_in.addEventListener('change', loadVideo);

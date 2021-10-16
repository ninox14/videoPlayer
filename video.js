const player = document.querySelector('.video__video-container');
const video = player.querySelector('.video__video');
const playBig = player.querySelector('.video__play-button');
const play = player.querySelector('.video__play');
const progressBar = player.querySelector('.video__progress');
const volumeLvl = player.querySelector('.video__volume_level');
const volumeBtn = player.querySelector('.video__volume');
const fullscreen = player.querySelector('.video__fullscreen');
let isFullscreen = false;
let videoStated = false;
let oldHeight;
/* functions */

function togglePlay () {
  if (video.paused) {
    videoStated = true;
    video.play();
  } else {
    video.pause();
  }
}

function updateBtn() {
  play.classList.toggle('active');
  playBig.classList.toggle('active');
}
function updateVlmBtn() {
  volumeBtn.classList.toggle('active');
}
function updateFlscrnBtn() {
  fullscreen.classList.toggle('active');
}

function volumeUpd() {
  video[this.name] = this.value;
}
function mute() {
  if (video.muted && video.volume == 0) {
    video.muted = false;
    video.volume = 0.2;
    updateVlmBtn();
    drawRange(volumeLvl, video.volume);
  } else if (video.muted) {
    video.muted = false;
    updateVlmBtn();
    drawRange(volumeLvl, video.volume);
  } else {
    video.muted = true;
    updateVlmBtn();
    drawRange(volumeLvl, 0);
  }
}

function drawRange(element, currValue) {
  const percent = element == volumeLvl ? currValue*100 : currValue;
  element.value = currValue;
  element.style.background = `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #fff ${percent}%, white 100%)`
}

function handleProgress() {
  const value =  video.currentTime / video.duration;
  const percent = value * 100;
  // change progressBar on page also
  drawRange(progressBar, percent);
}

function scrub(value) {
  video.currentTime = (value / 100) * video.duration;
}

function toggleFlscr() {
  if (isFullscreen) {
    document.exitFullscreen();
    updateFlscrnBtn();
    video.setAttribute('style', `object-fit: fill; height: ${oldHeight}px`);
    player.style.display='block';
    isFullscreen = false;
  } else {
    oldHeight = video.offsetHeight;
    player.requestFullscreen();
    updateFlscrnBtn();
    video.setAttribute('style', 'object-fit: inherit; height: auto');
    player.style.display='flex';
    isFullscreen = true;
  }
}

/* event listeners */

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateBtn);
video.addEventListener('pause', updateBtn);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('dblclick', toggleFlscr)

playBig.addEventListener('click', togglePlay);
play.addEventListener('click', togglePlay);
volumeBtn.addEventListener('click', mute);
fullscreen.addEventListener('click', toggleFlscr);


volumeLvl.addEventListener('change', volumeUpd);
volumeLvl.addEventListener('mousemove', volumeUpd);


progressBar.addEventListener('input', function () {
  scrub(this.value);
  drawRange(this, this.value);
});
volumeLvl.addEventListener('input', function () {
  drawRange(this, this.value);
  if (this.value == 0) {
    updateVlmBtn();
    video.muted = true;
  } else {
    volumeBtn.classList.remove('active');
    video.muted = false;
  }
});

// Default sound

window.addEventListener('load', () => {
  video.volume = volumeLvl.value;
});


// Hotkeys
document.addEventListener('keyup', e => {
  if (videoStated) {
    if (e.code === 'Space') {
      togglePlay();
    } else if(e.ctrlKey && e.code === 'Comma') {
      video.playbackRate -= 0.1;
    } else if (e.ctrlKey && e.code === 'Period') {
      video.playbackRate += 0.1;
    } else if (e.code === 'KeyF') {
      toggleFlscr();
    } else if (e.code === 'KeyM') {
      mute();
    }
  }
}, false)


console.log();
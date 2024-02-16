//select all required tags or element
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

//load random music on page refresh
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadmusic(musicIndex); //calling load music function once window loaded
  playingNow();
});

//load music function
function loadmusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//next music function
function nextMusic() {
  //here we`ll just increment of index by 1
  musicIndex++;
  //if musicIndex is greater than array lenght then musicIndex will be 1 so the  first song will play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadmusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic() {
  //here we`ll just decrement of index by 1
  musicIndex--;
  //if musicIndex is less than 1 then musicIndex will be array lenght so the  last song will play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadmusic(musicIndex);
  playMusic();
  playingNow();
}

//play or pause music btn
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  //if isMusicPaused is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

//next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});

prevBtn.addEventListener("click", () => {
  prevMusic(); //calling prev music function
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting current time of song
  const duration = e.target.duration; //getting duration  of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding 0 if sec. is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //adding 0 if sec. is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressBarval = progressArea.clientWidth; //getting width of prgress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting total duration

  mainAudio.currentTime = (clickedOffSetX / progressBarval) * songDuration;
  playMusic();
});

//repeat , shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  //get the innertext of the icon then we`ll change accordingly
  let getText = repeatBtn.innerText; //getting innrtext of icon
  //do different change of different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one": //if icon is repeat_one then change  it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback Shuffle");
      break;
    case "shuffle": //if icon is shuffle then change  it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

//above i just changed the icon, now lets work on what to do
//after song ended

mainAudio.addEventListener("ended", () => {
  //do according to the icon means if user has set icon to loop song then we`ll repeat
  //the current song and will do further accordingly

  let getText = repeatBtn.innerText; //getting innrtext of icon
  //do different change of different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then simply we call the nextMusic function to so the next song will play
      nextMusic();
      break;
    case "repeat_one": //if icon is repeat_one then we`ll change the current playing song current time to 0 so song  will play from beginning
      mainAudio.currentTime = 0;
      loadmusic(musicIndex);
      playMusic(); //calling playMusic function
      break;
    case "shuffle": //if icon is shuffle then change  it to repeat
      //generating random index between the max range of array length
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number won`t be the same of current music index
      musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play
      loadmusic(musicIndex); //calling loadMusic function
      playMusic(); //calling playMusic function
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
              <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
              </div>
              <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
              <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
            </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding 0 if sec. is less than 10
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    //adding t duration attribute which we`ll use below
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//let add onclick attribute in all li
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    //remove playing class from all other li exept the last one which is clicked
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      //let`s get that audtio duration value and pass to .audio-duration innertext
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration; //passing t-duration value to audio duration innertext
    }
    //if there is an li tag which li-index is equal to musicIndex
    //then this music is playing now and we'll style it
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    //adding onlclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//let`s play song on li clicked
function clicked(element) {
  //getting li index of particular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passing that li-index to musicIndex
  loadmusic(musicIndex);
  playMusic();
  playingNow();
}

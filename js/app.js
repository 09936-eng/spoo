/* MUSIC DATA */
const music = [
  {
    id: 1,
    title: "สิทธิ์ของเธอ",
    artist: "อัสนี & วสันต์",
    type: "เพลง",
    emoji: "⭐",
    color1: "#f7b733",
    color2: "#fc4a1a",
    duration: 180,
    audio: "song.mp3"
  },
  {
    id: 2,
    title: "Midnight City",
    artist: "Neon Wave",
    type: "เพลง",
    emoji: "🎵",
    color1: "#1d2b64",
    color2: "#f8cdda",
    duration: 210,
    audio: "song.mp3"
  }
];

/* PLAYER STATE */
let currentTrack = music[0];
let isPlaying = false;
let audioPlayer = new Audio(currentTrack.audio);
let favorites = [];

/* FUNCTIONS */
function playTrack(track) {
  currentTrack = track;
  audioPlayer.src = track.audio;
  audioPlayer.play().then(() => {
    isPlaying = true;
    updateUI();
  }).catch(err => console.log("Playback error:", err));
}

function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.play().then(() => {
      isPlaying = true;
    }).catch(err => console.log("Playback error:", err));
  }
  updateUI();
}

function updateUI() {
  const playBtn = document.querySelector("#playBtn");
  if (playBtn) playBtn.textContent = isPlaying ? "⏸️" : "▶️";
}

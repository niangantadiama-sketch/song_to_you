// Remplace les liens par tes fichiers audio et vidéos locaux (ex: "videos/video1.mp4")
const playlist = [
  {
    title: "Je t'aime",
    artist: "Wally Seck",
    audioSrc: "wally-jetaime", 
   videoSrc: "video1", 
    memory: "Je me souviendrai toujours de cette soirée où on a écouté ce son en boucle jusqu'à 3h du matin. Merci d'être toujours là !"
  },
  {
    title: "Waxtu",
    artist: "Amadeus",
    audioSrc: "amadeus-waxtu",
    videoSrc: "video2",
    memory: "À chaque fois que j'entends cette mélodie, je pense à nos discussions interminables."
  },
  {
    title: "Damalay bëgg",
    artist: "Jahman X Press",
    audioSrc: "jahman",
    videoSrc: "video3",
    memory: "Je ne savais pas ce que c'était d'aimer aussi fort avant que tu n'entres dans ma vie. Merci d'être mon repère."
  },
  {
     title: "Me You and God",
     artist: "Obree Daman",
     audioSrc: "obree-me",
     videoSrc: "video4",
     memory: "Tu es la plus belle chose qui me soit arrivée. Cette chanson, c'est un peu notre histoire en musique"
   },
   {
      title: "Banneex",
      artist: "Obree Daman",
      audioSrc: "obree-banneex",
      videoSrc: "video5",
      memory: "Même si le temps s'arrêtait, je passerais chaque seconde à tes côtés. Tu hites toutes mes pensées."
    },
    {
         title: "Méritewoumala",
         artist: "Amadeus",
         audioSrc: "amadeus-merite",
         videoSrc: "video6",
         memory: "Parfois je me regarde et je me demande ce que j'ai bien pu faire pour mériter quelqu'un d'aussi merveilleux dans ma vie... 🤍"
       }
   
];

let currentIndex = 0;

// Éléments du DOM
const audio = document.getElementById('audio-player');
const trackVideo = document.getElementById('track-video');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackMemory = document.getElementById('track-memory');

const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const playlistList = document.getElementById('playlist-list');
const trackCount = document.getElementById('track-count');

// Initialisation
function init() {
  trackCount.textContent = playlist.length;
  renderPlaylist();
  loadAndPlayTrack(currentIndex);
}

// Charger et lancer automatiquement la piste et la vidéo
function loadAndPlayTrack(index) {
  const track = playlist[index];
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackMemory.textContent = `"${track.memory}"`;

  audio.src = track.audioSrc;
  trackVideo.src = track.videoSrc;

  // Lancement simultané audio + vidéo
  audio.play().catch(e => console.log("Lecture automatique bloquée par le navigateur :", e));
  trackVideo.play().catch(e => console.log("Lecture vidéo bloquée :", e));

  updatePlaylistUI();
}

// Navigation
function prevTrack() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadAndPlayTrack(currentIndex);
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadAndPlayTrack(currentIndex);
}

// Mise à jour de la barre de progression
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (isNaN(duration)) return;

  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

// Cliquer sur la barre de progression
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
  trackVideo.currentTime = audio.currentTime; // Synchroniser la vidéo
}

// Formatage du temps
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Générer la liste des pistes en bas
function renderPlaylist() {
  playlistList.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.className = `playlist-item ${index === currentIndex ? 'active' : ''}`;
    li.innerHTML = `
      <div>
        <span class="playlist-item-title">${track.title}</span><br>
        <span class="playlist-item-artist">${track.artist}</span>
      </div>
      <span class="playing-indicator">${index === currentIndex ? 'Lecture...' : ''}</span>
    `;
    li.addEventListener('click', () => {
      currentIndex = index;
      loadAndPlayTrack(currentIndex);
    });
    playlistList.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    const indicator = item.querySelector('.playing-indicator');
    if (index === currentIndex) {
      item.classList.add('active');
      indicator.textContent = 'En cours...';
    } else {
      item.classList.remove('active');
      indicator.textContent = '';
    }
  });
}

// Événements
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack);
progressContainer.addEventListener('click', setProgress);

// Lancement au chargement
init();

// Mettre en pause le son et la vidéo quand on quitte l'onglet ou l'application
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.pause();
    trackVideo.pause();
  } else {
    // Relance automatiquement quand on revient sur la page (optionnel)
    audio.play().catch(e => console.log("Reprise bloquée :", e));
    trackVideo.play().catch(e => console.log("Reprise vidéo bloquée :", e));
  }
});

// Sécurité supplémentaire pour Safari / iOS lors de la fermeture ou du changement d'app
window.addEventListener('pagehide', () => {
  audio.pause();
  trackVideo.pause();
});


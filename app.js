// Music Player App
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');
const volumeSlider = document.getElementById('volumeSlider');
const trackList = document.getElementById('trackList');
const vinylDisc = document.getElementById('vinylDisc');

// Tracks data
const tracks = [
    {
        title: 'Lo-Fi Nights',
        artist: '111PLURAT',
        file: 'tracks/01_lofi_nights.mp3'
    },
    {
        title: 'Dreamscape Drift',
        artist: '111PLURAT',
        file: 'tracks/02_dreamscape_drift.mp3'
    },
    {
        title: 'Soft Pulse',
        artist: '111PLURAT',
        file: 'tracks/03_soft_pulse.mp3'
    },
    {
        title: 'Acoustic Breeze',
        artist: '111PLURAT',
        file: 'tracks/04_acoustic_breeze.mp3'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Initialize the app
function init() {
    loadTrack(currentTrackIndex);
    renderPlaylist();
    setupEventListeners();
    registerServiceWorker();
    setupPWAInstall();
}

// Load a track
function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.file;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Update active track in playlist
    updatePlaylistUI();
}

// Render playlist
function renderPlaylist() {
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title;
        li.dataset.index = index;
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            play();
        });
        trackList.appendChild(li);
    });
    updatePlaylistUI();
}

// Update playlist UI
function updatePlaylistUI() {
    const items = trackList.querySelectorAll('li');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play/Pause toggle
function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Play
function play() {
    audioPlayer.play();
    isPlaying = true;
    updatePlayButton();
    vinylDisc.classList.add('spinning');
}

// Pause
function pause() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
    vinylDisc.classList.remove('spinning');
}

// Update play button icon
function updatePlayButton() {
    if (isPlaying) {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
        `;
    } else {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
    }
}

// Previous track
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        play();
    }
}

// Next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        play();
    }
}

// Update progress bar
function updateProgress() {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    duration.textContent = formatTime(audioPlayer.duration);
}

// Format time in mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Seek in track
function seek(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Update volume
function updateVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
}

// Setup event listeners
function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextTrack);
    progressBar.addEventListener('click', seek);
    volumeSlider.addEventListener('input', updateVolume);
    
    // Set initial volume
    audioPlayer.volume = 0.7;
}

// Register service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// PWA Install
let deferredPrompt;

function setupPWAInstall() {
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installPrompt.style.display = 'block';
    });
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            installPrompt.style.display = 'none';
        }
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installPrompt.style.display = 'none';
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

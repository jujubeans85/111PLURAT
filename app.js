let tracks=[
  {src:"tracks/01_lofi_nights.mp3",title:"Lo-Fi Nights"},
  {src:"tracks/02_dreamscape_drift.mp3",title:"Dreamscape Drift"},
  {src:"tracks/03_soft_pulse.mp3",title:"Soft Pulse"},
  {src:"tracks/04_acoustic_breeze.mp3",title:"Acoustic Breeze"},
  {src:"tracks/05_bjork_all_is_full_of_love_remix.mp3",title:"Björk - All Is Full of Love (Plaid Remix)"}
];
let idx=0; let player; let nowPlaying;
window.onload=()=>{player=document.getElementById('player');nowPlaying=document.getElementById('nowPlaying');loadTrack(0)};
function loadTrack(i){idx=(i+tracks.length)%tracks.length;player.src=tracks[idx].src;nowPlaying.innerText="Now Playing: "+tracks[idx].title;}
function nextTrack(){loadTrack(idx+1);player.play();}
function prevTrack(){loadTrack(idx-1);player.play();}
function togglePlay(){if(player.paused){player.play()}else{player.pause()}}
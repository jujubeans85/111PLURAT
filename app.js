// API proxy; Netlify redirects /api/* -> https://api.cratejuice.org
const API_BASE = '/api';

const player = document.getElementById('player');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const vol = document.getElementById('vol');
const pitch = document.getElementById('pitch');
const vuL = document.getElementById('vuL');
const vuR = document.getElementById('vuR');
const trackListEl = document.getElementById('trackList');
const recentListEl = document.getElementById('recentList');
const trackTitle = document.getElementById('trackTitle');
const trackSource = document.getElementById('trackSource');
const qrLink = document.getElementById('qrLink');
const copyLinkBtn = document.getElementById('copyLink');
const userSel = document.getElementById('userSel');
const memo = document.getElementById('memo');

const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('trackModal');
const m_title = document.getElementById('m_title');
const m_url = document.getElementById('m_url');
const m_source = document.getElementById('m_source');
const m_art = document.getElementById('m_art');
const m_save = document.getElementById('m_save');

let crate = [];
let current = null;

function slugify(s){
  return (s||'').toString().trim()
    .toLowerCase()
    .replace(/['"]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function saveCrate(){
  localStorage.setItem('cratejuice_crate', JSON.stringify(crate));
}
function loadCrate(){
  try{
    const raw = localStorage.getItem('cratejuice_crate');
    if (raw) return JSON.parse(raw);
  }catch(e){}
  return [];
}

function addTrackToUI(t){
  const li = document.createElement('li');
  const left = document.createElement('div');
  const right = document.createElement('div');
  left.innerHTML = `<strong>${t.title}</strong> <small class="dim">· ${t.source || 'file/URL'}</small>`;
  const btn = document.createElement('button');
  btn.className = 'track-btn';
  btn.textContent = 'Load';
  btn.onclick = () => selectTrack(t, true);
  const linkBtn = document.createElement('button');
  linkBtn.className = 'track-btn';
  linkBtn.textContent = 'Link';
  linkBtn.title = 'Copy share link';
  linkBtn.onclick = () => copyShareLink(t);
  right.appendChild(btn);
  right.appendChild(linkBtn);
  li.appendChild(left); li.appendChild(right);
  trackListEl.appendChild(li);
}

function renderCrate(){
  trackListEl.innerHTML='';
  crate.forEach(addTrackToUI);
}

function selectTrack(t, autostart){
  current = t;
  // Set slug if missing
  if (!current.slug) current.slug = slugify(current.title || current.url || 'track');
  // If it's a direct audio, set src to url; else leave blank and just open external
  if (t.url && (t.url.endsWith('.mp3') || t.url.endsWith('.wav') || t.url.endsWith('.ogg') || t.url.includes('.mp3?') || t.url.includes('.wav?') || t.url.includes('.ogg?'))){
    player.src = t.url;
  } else {
    player.removeAttribute('src');
  }
  trackTitle.textContent = t.title || '—';
  trackSource.textContent = t.source ? `source: ${t.source}` : 'source: file/URL';
  qrLink.href = buildShareURL(t); // use share URL so QR lands with slug
  if (autostart && player.src) {
    player.play().then(()=>logPlay()).catch(()=>{});
  }
  // update copy button action
  copyLinkBtn.onclick = () => copyShareLink(t);
}

function buildShareURL(t){
  const slug = t.slug || slugify(t.title || t.url || 'track');
  const url = new URL(window.location.href);
  url.searchParams.set('t', slug);
  return url.toString();
}

async function copyShareLink(t){
  const url = buildShareURL(t);
  try{
    await navigator.clipboard.writeText(url);
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(()=>copyLinkBtn.textContent='Copy Link', 1200);
  }catch(e){
    // fallback
    prompt('Copy this link:', url);
  }
}

playBtn.onclick = async () => {
  try{
    await player.play();
    logPlay();
  }catch(e){ console.error(e); }
};
pauseBtn.onclick = () => player.pause();
vol.oninput = () => player.volume = parseFloat(vol.value);
pitch.oninput = () => player.playbackRate = parseFloat(pitch.value);

// VU animation using AnalyserNode when possible, else fallback
let ctx, analyser, dataArray;
function setupAudioAnalyser(){
  try{
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaElementSource(player);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    src.connect(analyser);
    analyser.connect(ctx.destination);
    animateVU();
  }catch(e){
    // fallback
    player.addEventListener('timeupdate', ()=>{
      const level = Math.abs(Math.sin(player.currentTime*6));
      vuL.style.height = (6 + level*18)+'px';
      vuR.style.height = (6 + level*18)+'px';
    });
  }
}
function animateVU(){
  requestAnimationFrame(animateVU);
  if (!analyser) return;
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i=0;i<dataArray.length;i++){
    const v = (dataArray[i]-128)/128;
    sum += v*v;
  }
  const rms = Math.sqrt(sum/dataArray.length);
  const h = Math.min(18 + rms*120, 140);
  vuL.style.height = h+'px';
  vuR.style.height = (h*0.9)+'px';
}
setupAudioAnalyser();

// Modal logic
addBtn.onclick = () => {
  m_title.value=''; m_url.value=''; m_art.value=''; m_source.value='file';
  modal.showModal();
};
m_save.onclick = (e) => {
  e.preventDefault();
  const t = {
    title: m_title.value.trim(),
    url: m_url.value.trim(),
    source: m_source.value,
    art: m_art.value.trim() || undefined,
    slug: slugify(m_title.value.trim())
  };
  if (!t.title || !t.url) return;
  crate.push(t); saveCrate(); renderCrate();
  modal.close();
};

async function logPlay(){
  if (!current) return;
  const payload = {
    track_id: current.url || current.title,
    source: current.source || 'file',
    user: userSel.value || 'guest',
    memo: memo.value || undefined
  };
  try {
    await fetch(`${API_BASE}/tracks/log`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    loadRecent();
  } catch { /* ok if offline */ }
}

async function loadRecent(){
  try{
    const r = await fetch(`${API_BASE}/tracks/recent?limit=10`);
    const data = await r.json();
    recentListEl.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      const when = new Date(item.played_at).toLocaleString();
      li.innerHTML = `<div><strong>${item.track_id}</strong> <small class="dim">· ${item.source||''}</small></div><div>${when}</div>`;
      recentListEl.appendChild(li);
    });
  }catch{}
}

function findBySlug(slug){
  if (!slug) return null;
  slug = slug.toLowerCase();
  return crate.find(t => (t.slug||slugify(t.title||t.url||'')).toLowerCase() === slug) || null;
}

// Boot
(async function boot(){
  // seed from file + saved from localStorage
  let seeds = [];
  try{
    const r = await fetch('tracks.json'); seeds = await r.json();
  }catch{}
  const local = loadCrate();
  // Ensure slugs exist
  seeds.forEach(t => t.slug = t.slug || slugify(t.title || t.url || 'track'));
  local.forEach(t => t.slug = t.slug || slugify(t.title || t.url || 'track'));
  crate = [...seeds, ...local];
  renderCrate();

  // deep-link: ?t=slug
  const params = new URLSearchParams(window.location.search);
  const tslug = params.get('t');
  const match = findBySlug(tslug);
  if (match){ selectTrack(match, true); }
  else if (crate[0]) { selectTrack(crate[0], false); }

  loadRecent();
})();
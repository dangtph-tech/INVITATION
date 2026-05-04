/* ====================================================
   script.js — YEC 25th Anniversary Invitation
   Tapestry of Remembrance
   ==================================================== */

// ─── CONTINUOUS BACKGROUND PARTICLES ─────────────────
const bgCanvas = document.getElementById('bg-particles');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
let bgParticlesList = [];
const NUM_PARTICLES = 50;

function resizeBgCanvas() {
  if (!bgCanvas) return;
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function initBgParticles() {
  if (!bgCanvas) return;
  resizeBgCanvas();
  bgParticlesList = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    bgParticlesList.push(createBgParticle(true));
  }
}

function createBgParticle(randomY = false) {
  const types = ['circle', 'diamond', 'line', 'cross'];
  const type = types[Math.floor(Math.random() * types.length)];
  const size = Math.random() * 3 + 1.5; 
  const colors = ['#F97316', '#F59E0B', '#D97706', '#E5E7EB']; // Orange, Gold, Bronze, Light gray
  
  return {
    x: Math.random() * window.innerWidth,
    y: randomY ? Math.random() * window.innerHeight : -20,
    size: size,
    type: type,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 0.5 + 0.2, // Gentle falling speed
    speedX: (Math.random() - 0.5) * 0.2, // Slight horizontal drift
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    opacity: Math.random() * 0.4 + 0.15
  };
}

function drawBgParticles() {
  if (!bgCtx) return;
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  bgParticlesList.forEach(p => {
    bgCtx.save();
    bgCtx.translate(p.x, p.y);
    bgCtx.rotate(p.rot);
    bgCtx.globalAlpha = p.opacity;
    bgCtx.fillStyle = p.color;
    bgCtx.strokeStyle = p.color;
    
    if (p.type === 'circle') {
      bgCtx.beginPath();
      bgCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      bgCtx.fill();
    } else if (p.type === 'diamond') {
      bgCtx.beginPath();
      bgCtx.moveTo(0, -p.size);
      bgCtx.lineTo(p.size, 0);
      bgCtx.lineTo(0, p.size);
      bgCtx.lineTo(-p.size, 0);
      bgCtx.closePath();
      bgCtx.fill();
    } else if (p.type === 'line') {
      bgCtx.beginPath();
      bgCtx.moveTo(-p.size, 0);
      bgCtx.lineTo(p.size, 0);
      bgCtx.lineWidth = 1;
      bgCtx.stroke();
    } else if (p.type === 'cross') {
      bgCtx.beginPath();
      bgCtx.moveTo(-p.size, 0);
      bgCtx.lineTo(p.size, 0);
      bgCtx.moveTo(0, -p.size);
      bgCtx.lineTo(0, p.size);
      bgCtx.lineWidth = 1.5;
      bgCtx.stroke();
    }
    
    bgCtx.restore();
    
    // Update position
    p.y += p.speedY;
    p.x += p.speedX;
    p.rot += p.rotSpeed;
    
    // Reset if off screen (recycle at top)
    if (p.y > bgCanvas.height + 10) {
      Object.assign(p, createBgParticle(false));
      p.opacity = Math.random() * 0.4 + 0.15; // Retain opacity
    }
    if (p.x > bgCanvas.width + 10) p.x = -10;
    if (p.x < -10) p.x = bgCanvas.width + 10;
  });
  
  requestAnimationFrame(drawBgParticles);
}

if (bgCanvas) {
  window.addEventListener('resize', resizeBgCanvas);
  initBgParticles();
  drawBgParticles();
}

// ─── DOM REFERENCES ──────────────────────────────────
const form            = document.getElementById('invitation-form');
const nameInput       = document.getElementById('name-input');
const genInput        = document.getElementById('gen-input');
const welcomeScreen   = document.getElementById('welcome-screen');
const fallingCanvas   = document.getElementById('falling-canvas');
const invitationScreen= document.getElementById('invitation-screen');
const invitationCard  = document.getElementById('invitation-card');
const actionButtons   = document.getElementById('action-buttons');
const displayName     = document.getElementById('display-name');
const displayGen      = document.getElementById('display-gen');
const downloadBtn     = document.getElementById('download-btn');
const toast           = document.getElementById('toast');
const displaySalutation = document.getElementById('display-salutation');
const inlineSalutations = document.querySelectorAll('.inline-salutation');
const closingSalLower   = document.getElementById('closing-salutation-lower');
const closingSalUpper   = document.getElementById('closing-salutation-upper');

// ─── URL PARAMETERS & PRE-FILL ───────────────────────
const urlParams = new URLSearchParams(window.location.search);
let paramName = urlParams.get('name');
let paramGen = urlParams.get('gen');
let paramSalutation = urlParams.get('salutation');
const paramToken = urlParams.get('token');

// Function to safely decode UTF-8 Base64
function decodeBase64UTF8(base64Str) {
  try {
    // Revert WebSafe Base64 characters and add padding
    let str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const binaryStr = atob(str);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return null;
  }
}

if (paramToken) {
  const decoded = decodeBase64UTF8(paramToken);
  if (decoded) {
    const parts = decoded.split('|');
    if (parts.length >= 2) {
      paramName = parts[0];
      paramGen = parts[1];
      paramSalutation = parts[2] || 'Anh';
    }
  }
}

if (paramName && paramGen) {
  // Hide the form inputs
  const formInputs = document.getElementById('form-inputs');
  if (formInputs) formInputs.style.display = 'none';

  // Change the welcome description
  const welcomeDesc = document.getElementById('welcome-desc');
  if (welcomeDesc) {
    welcomeDesc.textContent = `${paramSalutation} nhấn nút phía dưới để bắt đầu ạ!`;
  }

  // Change button text
  const openBtn = document.getElementById('open-btn');
  if (openBtn) {
    openBtn.innerHTML = '<span class="btn-icon">🍊</span>Bắt Đầu';
  }

  // Hide parameters from address bar immediately for a cleaner look
  if (window.history && window.history.replaceState) {
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);
  }
}

// ─── ORANGE DRAWING ───────────────────────────────────
// Always drawn via Canvas — no PNG, no white box artifacts

// ─── FORM SUBMIT ─────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let name = '';
  let gen = '';
  let salutation = '';

  if (paramName && paramGen) {
    name = paramName;
    gen = paramGen;
    salutation = paramSalutation || 'Anh';
  } else {
    name = nameInput.value.trim();
    gen  = genInput.value.trim();
    salutation = document.querySelector('input[name="salutation"]:checked')?.value || 'Anh';

    if (!name) {
      shakeInput(nameInput);
      showToast('Bạn chưa nhập Họ và Tên nhé! 😊');
      return;
    }
    if (!gen) {
      shakeInput(genInput);
      showToast('Bạn chưa nhập Thế Hệ nhé! 🍊');
      return;
    }
  }

  // Populate invitation card
  displayName.textContent = name;
  displayGen.textContent  = gen;
  displaySalutation.textContent = salutation;
  // inline salutations inside body text — lowercase
  inlineSalutations.forEach(el => el.textContent = salutation.toLowerCase());
  // closing salutation
  if (closingSalLower) closingSalLower.textContent = salutation.toLowerCase();
  if (closingSalUpper) closingSalUpper.textContent = salutation.toLowerCase();

  // Start the transition sequence
  startSequence();
});

// ─── INPUT SHAKE ANIMATION ───────────────────────────
function shakeInput(el) {
  el.style.animation = 'none';
  el.style.borderColor = '#EF4444';
  el.style.boxShadow  = '0 0 0 3px rgba(239, 68, 68, 0.15)';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 1200);
}

// ─── MAIN SEQUENCE ───────────────────────────────────
function startSequence() {
  // Step 1: Fade out the welcome form
  welcomeScreen.classList.add('fade-out');

  // Step 2: After fade-out (600ms), start orange rain
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    startOrangeRain();
  }, 600);
}

// ─── CANVAS ANIMATION: ORANGE RAIN ───────────────────
const DURATION      = 2800;   // ms total
const ORANGE_COUNT  = 45;     // number of oranges
const MIN_SIZE      = 28;
const MAX_SIZE      = 62;

let oranges       = [];
let animationId   = null;
let startTimestamp= null;

const ctx = fallingCanvas.getContext('2d');

function resizeCanvas() {
  fallingCanvas.width  = window.innerWidth;
  fallingCanvas.height = window.innerHeight;
}

function spawnOranges() {
  oranges = [];
  for (let i = 0; i < ORANGE_COUNT; i++) {
    const size   = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
    const x      = Math.random() * (window.innerWidth + 80) - 40;
    const speed  = 200 + Math.random() * 300;   // px/s
    const delay  = Math.random() * 1000;         // ms stagger
    const rotDir = Math.random() > 0.5 ? 1 : -1;
    const rotSpd = (0.5 + Math.random() * 2.5) * rotDir;// rad/s
    const wobble = (Math.random() - 0.5) * 60;  // horizontal drift

    oranges.push({
      x, y: -size - Math.random() * 200,
      size, speed, delay, rotSpd,
      angle: Math.random() * Math.PI * 2,
      wobble, wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0.82 + Math.random() * 0.18
    });
  }
}

function drawOrange(o) {
  ctx.save();
  ctx.globalAlpha = o.opacity;
  ctx.translate(o.x, o.y);
  ctx.rotate(o.angle);

  const r = o.size / 2;

  // Drop shadow
  ctx.shadowColor = 'rgba(180, 80, 0, 0.25)';
  ctx.shadowBlur  = r * 0.5;
  ctx.shadowOffsetX = r * 0.1;
  ctx.shadowOffsetY = r * 0.15;

  // Body — radial gradient for 3D sphere look
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(
    -r * 0.3, -r * 0.3, r * 0.05,
     r * 0.1,  r * 0.1, r * 1.05
  );
  bodyGrad.addColorStop(0.00, '#FFD580');  // bright highlight
  bodyGrad.addColorStop(0.25, '#FFB347');  // golden orange
  bodyGrad.addColorStop(0.60, '#F97316');  // vivid orange
  bodyGrad.addColorStop(0.85, '#EA580C');  // deep orange
  bodyGrad.addColorStop(1.00, '#C2410C');  // dark shadow edge
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Skin texture — subtle peel dots
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  for (let i = 0; i < 6; i++) {
    const tx = (Math.random() - 0.5) * r * 1.2;
    const ty = (Math.random() - 0.5) * r * 1.2;
    if (tx * tx + ty * ty < r * r * 0.85) {
      ctx.beginPath();
      ctx.arc(tx, ty, r * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 80, 0, 0.18)';
      ctx.fill();
    }
  }

  // Specular highlight
  ctx.beginPath();
  ctx.ellipse(-r * 0.28, -r * 0.30, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.fill();

  // Stem nub at top
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.92, r * 0.09, r * 0.07, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#7C3A0A';
  ctx.fill();

  // Leaf
  ctx.save();
  ctx.translate(r * 0.1, -r * 0.88);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.22, r * 0.11, r * 0.22, 0.3, 0, Math.PI * 2);
  const leafGrad = ctx.createLinearGradient(0, -r * 0.4, 0, 0);
  leafGrad.addColorStop(0, '#4ADE80');
  leafGrad.addColorStop(1, '#16A34A');
  ctx.fillStyle = leafGrad;
  ctx.fill();
  // Leaf vein
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.4);
  ctx.quadraticCurveTo(r * 0.04, -r * 0.2, 0, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = r * 0.025;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function animateOranges(timestamp) {
  if (!startTimestamp) startTimestamp = timestamp;
  const elapsed = timestamp - startTimestamp;

  // Clear
  ctx.clearRect(0, 0, fallingCanvas.width, fallingCanvas.height);

  let allDone = true;

  oranges.forEach((o) => {
    const activeTime = elapsed - o.delay;
    if (activeTime < 0) {
      allDone = false;
      return; // not yet spawned
    }

    // Update position
    const dt = activeTime / 1000; // seconds
    o.y = -o.size / 2 + o.speed * dt;
    o.angle = o.rotSpd * dt;
    o.x += Math.sin(o.wobblePhase + dt * 1.5) * 0.4; // subtle sway

    // Fade-out near bottom
    const fadeStart = fallingCanvas.height * 0.7;
    if (o.y > fadeStart) {
      const progress = (o.y - fadeStart) / (fallingCanvas.height - fadeStart + o.size);
      ctx.globalAlpha = Math.max(0, 1 - progress);
    }

    if (o.y < fallingCanvas.height + o.size) {
      allDone = false;
      drawOrange(o);
    }
  });

  // Finish when elapsed > DURATION and all oranges done
  if (elapsed < DURATION || !allDone) {
    animationId = requestAnimationFrame(animateOranges);
  } else {
    ctx.clearRect(0, 0, fallingCanvas.width, fallingCanvas.height);
    fallingCanvas.style.display = 'none';
    showInvitation();
  }
}

function startOrangeRain() {
  resizeCanvas();
  spawnOranges();

  fallingCanvas.style.display = 'block';
  startTimestamp = null;
  animationId    = requestAnimationFrame(animateOranges);
}

// Handle window resize during animation
window.addEventListener('resize', () => {
  if (fallingCanvas.style.display === 'block') {
    resizeCanvas();
  }
});

// ─── SHOW INVITATION ─────────────────────────────────
function showInvitation() {
  invitationScreen.classList.add('visible');

  // Trigger slide-up animation on next frame
  requestAnimationFrame(() => {
    invitationCard.classList.add('slide-up');
    setTimeout(() => {
      actionButtons.classList.add('visible');
    }, 300);
  });
}

// ─── DOWNLOAD BUTTON ─────────────────────────────────
downloadBtn.addEventListener('click', async () => {
  if (typeof html2canvas === 'undefined') {
    showToast('Thư viện chưa tải xong, vui lòng thử lại!');
    return;
  }

  // Show loading state
  const originalHTML = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<span class="loading-spinner"></span> Đang xuất ảnh...';
  downloadBtn.disabled  = true;

  try {
    // Temporarily hide action buttons from screenshot
    actionButtons.style.visibility = 'hidden';

    const canvas = await html2canvas(invitationCard, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      removeContainer: true,
    });

    actionButtons.style.visibility = '';

    const dataURL = canvas.toDataURL('image/png', 1.0);

    // Trigger download
    const a  = document.createElement('a');
    const safeName = displayName.textContent.replace(/\s+/g, '_');
    a.href     = dataURL;
    a.download = `Thiep_Moi_YEC25_${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('🎉 Thiệp đã được tải về thành công!');
  } catch (err) {
    console.error('html2canvas error:', err);
    actionButtons.style.visibility = '';
    showToast('Có lỗi xảy ra khi tải ảnh. Thử lại nhé!');
  } finally {
    downloadBtn.innerHTML = originalHTML;
    downloadBtn.disabled  = false;
  }
});

// (Removed share feature)

// ─── TOAST HELPER ────────────────────────────────────
let toastTimer = null;

function showToast(msg, duration = 3000) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ─── AUDIO CONTROLS (VINTAGE PLAYER) ─────────────────
const bgMusic = document.getElementById('bg-music');
const vinylWrapper = document.getElementById('vinyl-wrapper');
const timeDisplay = document.getElementById('time-display');
const progressWrapper = document.getElementById('progress-wrapper');
const progressBar = document.getElementById('progress-bar');
let isMusicPlaying = false;
let hasInteractedWithMusic = false;

// Format seconds into m:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Update UI on time update
if (bgMusic) {
  bgMusic.addEventListener('timeupdate', () => {
    const cur = bgMusic.currentTime;
    const max = bgMusic.duration;
    if (!isNaN(max) && max > 0) {
      const percentage = (cur / max) * 100;
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (timeDisplay) timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(max)}`;
    }
  });

  bgMusic.addEventListener('loadedmetadata', () => {
    bgMusic.currentTime = 10; // Cắt (bỏ qua) 10s đầu
    if (timeDisplay) timeDisplay.textContent = `0:10 / ${formatTime(bgMusic.duration)}`;
  });
}

function toggleMusic() {
  if (!bgMusic) return;
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    if (vinylWrapper) vinylWrapper.classList.remove('playing');
  } else {
    if (bgMusic.currentTime < 10) {
      bgMusic.currentTime = 10;
    }
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (vinylWrapper) vinylWrapper.classList.add('playing');
    }).catch(err => {
      console.log('Audio play failed:', err);
    });
  }
}

// Click vinyl to play/pause
if (vinylWrapper) {
  vinylWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    hasInteractedWithMusic = true;
    toggleMusic();
  });
}

// Click progress bar to seek
if (progressWrapper && bgMusic) {
  progressWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    hasInteractedWithMusic = true;
    
    const rect = progressWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    // Fallback if metadata isn't full yet
    if (bgMusic.duration && isFinite(bgMusic.duration)) {
      const newTime = percentage * bgMusic.duration;
      bgMusic.currentTime = newTime;
    }
    
    if (!isMusicPlaying) toggleMusic();
  });
}

// Aggressive autoplay function
function attemptAutoplay() {
  if (isMusicPlaying || !bgMusic) return;
  bgMusic.volume = 0.5;
  if (bgMusic.currentTime < 10) {
    bgMusic.currentTime = 10;
  }
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    if (vinylWrapper) vinylWrapper.classList.add('playing');
    hasInteractedWithMusic = true;
  }).catch(() => {
    // Autoplay blocked by browser. Wait for user moving mouse/scrolling/clicking
  });
}

// Try autoplay immediately
window.addEventListener('DOMContentLoaded', attemptAutoplay);

// Fallback: Play music on ANY global interaction (mouse move, click, scroll, touch) if autoplay failed
const interactionEvents = ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'];
interactionEvents.forEach(eventType => {
  document.addEventListener(eventType, (e) => {
    // Nếu chưa tương tác với nhạc và chưa đang gõ phím vào input form
    if (e.target && e.target.tagName === 'INPUT') return;
    
    if (!hasInteractedWithMusic && !isMusicPlaying) {
      hasInteractedWithMusic = true; // prevent multiple triggers
      attemptAutoplay();
    }
  }, { once: false, passive: true });
});

/* ====================================================
   script.js — YEC 25th Anniversary Invitation
   Tapestry of Remembrance
   ==================================================== */

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
const shareBtn        = document.getElementById('share-btn');
const toast           = document.getElementById('toast');
const displaySalutation = document.getElementById('display-salutation');
const inlineSalutation  = document.getElementById('inline-salutation');

// ─── URL PARAMETERS & PRE-FILL ───────────────────────
const urlParams = new URLSearchParams(window.location.search);
const paramName = urlParams.get('name');
const paramGen = urlParams.get('gen');
const paramSalutation = urlParams.get('salutation');

if (paramName && paramGen) {
  // Hide the form inputs
  const formInputs = document.getElementById('form-inputs');
  if (formInputs) formInputs.style.display = 'none';

  // Change the welcome description
  const welcomeDesc = document.getElementById('welcome-desc');
  if (welcomeDesc) welcomeDesc.textContent = 'Nhấn nút phía dưới để bắt đầu nhận thư mời của bạn.';

  // Change button text
  const openBtn = document.getElementById('open-btn');
  if (openBtn) {
    openBtn.innerHTML = '<span class="btn-icon">🍊</span>Bắt Đầu';
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
  // inline salutation inside body text — lowercase
  inlineSalutation.textContent = salutation.toLowerCase();

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

// ─── SHARE BUTTON ────────────────────────────────────
shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Thư Mời Kỷ Niệm 25 Năm YEC-NEU',
    text : `Mình vừa nhận được thư mời đặc biệt trong sự kiện kỷ niệm 25 năm CLB Nhà Kinh Tế Trẻ (YEC-NEU) — "Tapestry of Remembrance". Cùng nhau hoài niệm, kết nối và vinh danh tinh thần YEC bất diệt! 🍊`,
    url  : window.location.href,
  };

  // Try Web Share API with image if supported
  if (navigator.share) {
    try {
      // Try to generate image first
      if (typeof html2canvas !== 'undefined') {
        const originalHTML = shareBtn.innerHTML;
        shareBtn.innerHTML = '<span class="loading-spinner"></span> Đang chuẩn bị...';
        shareBtn.disabled  = true;

        try {
          actionButtons.style.visibility = 'hidden';
          const canvas  = await html2canvas(invitationCard, {
            scale: 2, useCORS: true, allowTaint: true,
            backgroundColor: '#FFFFFF', logging: false,
          });
          actionButtons.style.visibility = '';

          const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, 'image/png', 1.0)
          );
          const file = new File(
            [blob],
            `Thiep_Moi_YEC25_${displayName.textContent.replace(/\s+/g, '_')}.png`,
            { type: 'image/png' }
          );

          shareBtn.innerHTML = originalHTML;
          shareBtn.disabled  = false;

          // Check if the browser supports sharing files
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: shareData.title, text: shareData.text });
          } else {
            await navigator.share(shareData);
          }
        } catch (imgErr) {
          actionButtons.style.visibility = '';
          shareBtn.innerHTML = originalHTML;
          shareBtn.disabled  = false;
          // Fallback to text share
          await navigator.share(shareData);
        }
      } else {
        await navigator.share(shareData);
      }
      showToast('🎉 Chia sẻ thành công!');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        fallbackCopyLink();
      }
    }
  } else {
    // Desktop fallback: copy link
    fallbackCopyLink();
  }
});

function fallbackCopyLink() {
  const textToCopy = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('🔗 Đã sao chép link! Dán vào Messenger, Zalo hoặc mạng xã hội nhé.');
    });
  } else {
    // Older browser fallback
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.style.position = 'fixed';
    el.style.opacity  = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('🔗 Đã sao chép link để chia sẻ!');
  }
}

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

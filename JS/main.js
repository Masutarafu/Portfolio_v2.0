/* ═══════════════════════════════════════════════════════════
SPLASH SCREEN
═══════════════════════════════════════════════════════════ */
(function () {
  const fill = document.getElementById("splashBar");
  const splash = document.getElementById("splash");
  const DURATION = 1500; // total ms — adjust to taste

  // Hesitation keyframes: [progress%, time%]
  // Eases in, stalls around 60%, then completes
  const keyframes = [
    [0, 0],
    [30, 25],
    [58, 50], // ← hesitation starts here
    [62, 70], // ← slow crawl through the stall
    [100, 100],
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getProgress(timeRatio) {
    for (let i = 1; i < keyframes.length; i++) {
      const [p0, t0] = keyframes[i - 1];
      const [p1, t1] = keyframes[i];
      if (timeRatio <= t1 / 100) {
        const localT = (timeRatio - t0 / 100) / ((t1 - t0) / 100);
        return lerp(p0, p1, localT);
      }
    }
    return 100;
  }

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const timeRatio = Math.min(elapsed / DURATION, 1);
    const pct = getProgress(timeRatio);

    fill.style.width = pct + "%";

    if (timeRatio < 1) {
      requestAnimationFrame(step);
    } else {
      // Brief pause at 100% then fade out
      setTimeout(() => {
        splash.classList.add("fade-out");
        setTimeout(() => {
          splash.style.display = "none";
        }, 650);
      }, 200);
    }
  }

  requestAnimationFrame(step);
})();

/* ═══════════════════════════════════════════════════════════
SMOOTH SCROLL
═══════════════════════════════════════════════════════════ */
function smoothScroll(e, targetId) {
  e.preventDefault();
  const target = document.getElementById(targetId);
  const targetPos = target.getBoundingClientRect().top + window.scrollY - 70;
  const startPos = window.scrollY;
  const distance = targetPos - startPos;
  const duration = 800; // ms — lower = faster, higher = slower
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startPos + distance * easeInOutCubic(progress));
    if (elapsed < duration) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════
FLOATING NAV
═══════════════════════════════════════════════════════════ */
function toggleFab() {
  document.getElementById("fabMenu").classList.toggle("open");
}
function closeFab() {
  document.getElementById("fabMenu").classList.remove("open");
}
document.addEventListener("click", (e) => {
  const fab = document.getElementById("fabNav");
  if (fab && !fab.contains(e.target)) closeFab();
});

/* ═══════════════════════════════════════════════════════════
THEME TOGGLE
═══════════════════════════════════════════════════════════ */
function toggleTheme() {
  const isDark =
    document.documentElement.getAttribute("data-theme") !== "light";
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "light" : "dark",
  );
  localStorage.setItem("theme", isDark ? "light" : "dark");
  document.getElementById("iconSun").style.display = isDark ? "none" : "block";
  document.getElementById("iconMoon").style.display = isDark ? "block" : "none";
}

document.getElementById("themeToggle").addEventListener("click", toggleTheme);

const saved = localStorage.getItem("theme");
if (saved === "light") toggleTheme();

/* ═══════════════════════════════════════════════════════════
LEARNING LOG PROGRESS BAR
═══════════════════════════════════════════════════════════ */
(function () {
  const fill = document.getElementById("progress-fill");
  const pctEl = document.getElementById("progress-pct");
  const TARGET = 15; // ← UPDATE as you advance (0–100)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          fill.style.width = TARGET + "%";
          pctEl.textContent = TARGET + "%";
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(document.querySelector(".progress-track"));
})();

/* ═══════════════════════════════════════════════════════════
NAV ACTIVE LINK HIGHLIGHT
═══════════════════════════════════════════════════════════ */
(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 80) current = s.getAttribute("id");
    });
    navLinks.forEach((a) => {
      a.style.color =
        a.getAttribute("href") === "#" + current ? "var(--accent-hi)" : "";
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
PROJECT LIGHTBOX

To add real screenshots to a project card:
1. Open index.html and find the project's <div class="project-card">
2. Update the data-screenshots attribute with comma-separated image paths
3. Example: data-screenshots="img/app-home.png,img/app-detail.png,img/app-settings.png"
4. There is no hard limit — add as many paths as you have screenshots
═══════════════════════════════════════════════════════════ */
(function () {
  const overlay = document.getElementById("lightboxOverlay");
  const scroll = document.getElementById("lightboxScroll");
  const title = document.getElementById("lightboxTitle");
  const closeBtn = document.getElementById("lightboxClose");
  const cards = document.querySelectorAll(".project-card");

  function openLightbox(card) {
    const screenshots = card.dataset.screenshots
      ? card.dataset.screenshots
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (!screenshots.length) return;

    title.textContent = card.dataset.title || "Screenshots";

    // Clear previous images
    scroll.innerHTML = "";

    // Inject images
    screenshots.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Screenshot ${i + 1}`;
      img.loading = "lazy";
      scroll.appendChild(img);
    });

    // Show hint only if more than one screenshot
    document.querySelector(".lightbox-hint").style.display =
      screenshots.length > 1 ? "block" : "none";

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Open on card click
  cards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });

  // Close on X button
  closeBtn.addEventListener("click", closeLightbox);

  // Close on outside click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();

/* ═══════════════════════════════════════════════════════════
AMBIENT CURSOR GLOW
═══════════════════════════════════════════════════════════ */
(function () {
  // Only run on non-touch devices
  if (window.matchMedia("(hover: none)").matches) return;

  const glow = document.createElement("div");
  glow.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: opacity 0.4s ease;
        opacity: 0;
        top: 0;
        left: 0;
        `;
  document.body.appendChild(glow);

  let mouseX = 0,
    mouseY = 0;
  let glowX = 0,
    glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = "1";
  });

  // Fade out when cursor leaves the window
  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });

  // Smooth lazy follow using lerp
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animate);
  }

  animate();
})();

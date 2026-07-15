// Typewriter
const words = ["desenvolvedor web", "founder do bitto", "graduado em ADS"];
let wi = 0,
  ci = 0,
  deleting = false;
const twEl = document.getElementById("typewriter");
function tick() {
  const word = words[wi];
  if (!deleting) {
    ci++;
    twEl.textContent = word.slice(0, ci);
    if (ci === word.length) {
      deleting = true;
      setTimeout(tick, 1300);
      return;
    }
  } else {
    ci--;
    twEl.textContent = word.slice(0, ci);
    if (ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
  }
  setTimeout(tick, deleting ? 35 : 65);
}
tick();

// Cursor hint animation on load
window.addEventListener("load", () => {
  document.getElementById("cursorHint").classList.add("play");
});

// Breadcrumb scrollspy
const crumb = document.getElementById("crumb");
const sections = ["hero", "sobre", "skills", "projetos", "contato"];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        crumb.style.opacity = 0;
        setTimeout(() => {
          crumb.textContent = entry.target.id;
          crumb.style.opacity = 1;
        }, 120);
      }
    });
  },
  { threshold: 0.5 },
);
sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  },
  { threshold: 0.15 },
);
reveals.forEach((el) => revealObserver.observe(el));

// ---------- Project media viewer (auto-detects how many images exist) ----------
const PROJECT_MEDIA = {}; // { p1: { desktop: [...paths], mobile: [...paths], type: 'desktop', index: 0, video: '' } }

function preloadSequence(basePath, prefix, max = 12) {
  return new Promise((resolve) => {
    const found = [];
    let i = 1;
    function tryNext() {
      if (i > max) {
        resolve(found);
        return;
      }
      const num = String(i).padStart(2, "0");
      const src = `${basePath}/${prefix}-${num}.png`;
      const img = new Image();
      img.onload = () => {
        found.push(src);
        i++;
        tryNext();
      };
      img.onerror = () => resolve(found);
      img.src = src;
    }
    tryNext();
  });
}

// ---------- Lightbox ----------
function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = src;
  lb.classList.add("open");
}
function closeLightbox(e) {
  if (e && e.target.id === "lightboxImg") return;
  document.getElementById("lightbox").classList.remove("open");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function renderMedia(id) {
  const state = PROJECT_MEDIA[id];
  const viewer = document.getElementById(id + "-media");
  const imgEl = viewer.querySelector(".media-img");
  const counterEl = viewer.querySelector(".media-counter");
  const videoStateEl = viewer.querySelector(".media-video-state");
  const navBtns = viewer.querySelectorAll(".media-nav");

  if (state.type === "video") {
    imgEl.style.display = "none";
    videoStateEl.style.display = "flex";
    counterEl.style.display = "none";
    navBtns.forEach((b) => (b.style.display = "none"));
    return;
  }

  const list = state[state.type] || [];
  videoStateEl.style.display = "none";
  if (list.length === 0) {
    imgEl.style.display = "none";
    counterEl.style.display = "none";
    navBtns.forEach((b) => (b.style.display = "none"));
    return;
  }
  imgEl.style.display = "block";
  imgEl.src = list[state.index];
  imgEl.className =
    "media-img " + (state.type === "mobile" ? "is-mobile" : "is-desktop");
  const showNav = list.length > 1;
  counterEl.style.display = showNav ? "block" : "none";
  navBtns.forEach((b) => (b.style.display = showNav ? "flex" : "none"));
  counterEl.textContent = `${state.index + 1} / ${list.length}`;
}

function mediaNav(id, dir) {
  const state = PROJECT_MEDIA[id];
  const list = state[state.type] || [];
  if (list.length < 2) return;
  state.index = (state.index + dir + list.length) % list.length;
  renderMedia(id);
}

function setTab(btn, project, type) {
  const group = btn.parentElement;
  group
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const map = { desk: "desktop", mob: "mobile", vid: "video" };
  const state = PROJECT_MEDIA[project];
  state.type = map[type];
  state.index = 0;
  renderMedia(project);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("media-img") && e.target.src)
    openLightbox(e.target.src);
});

function initVideoClicks() {
  document.querySelectorAll(".media-viewer").forEach((viewer) => {
    const id = viewer.id.replace("-media", "");
    viewer.querySelector(".media-video-state").addEventListener("click", () => {
      const state = PROJECT_MEDIA[id];
      if (state && state.video) window.open(state.video, "_blank");
    });
  });
}
initVideoClicks();

async function initProjectMedia() {
  const viewers = document.querySelectorAll(".media-viewer");
  for (const viewer of viewers) {
    const id = viewer.id.replace("-media", "");
    const projectSlug = viewer.dataset.project;
    const video = viewer.dataset.video || "";
    const base = `assets/projetos/${projectSlug}`;
    const [desktop, mobile] = await Promise.all([
      preloadSequence(`${base}/desktop`, "desktop"),
      preloadSequence(`${base}/mobile`, "mobile"),
    ]);
    PROJECT_MEDIA[id] = { desktop, mobile, video, type: "desktop", index: 0 };
    renderMedia(id);
  }
}
initProjectMedia();

// Copy email
function copyEmail() {
  navigator.clipboard.writeText("pedrogm.dev@gmail.com");
  const el = document.getElementById("emailText");
  const old = el.textContent;
  el.textContent = "copiado!";
  setTimeout(() => (el.textContent = old), 1500);
}

// Skill tap toggle (mobile-friendly: tap to reveal label)
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("tapped"));
});

// Skill cards: pseudo-3D tilt following the mouse (desktop only)
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(300px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.08)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(300px) rotateY(0) rotateX(0) scale(1)";
  });
});

// Coffee cup fills up as the page is scrolled
const coffeeLiquid = document.getElementById("coffeeLiquid");
const coffeeProgress = document.getElementById("coffeeProgress");
const CUP_TOP = 11,
  CUP_BOTTOM = 44; // interior bounds of the cup in the SVG
const CUP_HEIGHT = CUP_BOTTOM - CUP_TOP;

function updateCoffee() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct =
    docHeight > 0
      ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      : 0;
  const liquidHeight = (pct / 100) * CUP_HEIGHT;
  coffeeLiquid.setAttribute("height", liquidHeight);
  coffeeLiquid.setAttribute("y", CUP_BOTTOM - liquidHeight);
  coffeeProgress.classList.toggle("full", pct > 88);
}
window.addEventListener("scroll", updateCoffee);
window.addEventListener("resize", updateCoffee);
updateCoffee();

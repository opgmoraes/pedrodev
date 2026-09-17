/**
 * Pedro Gabriel Gomes — Portfólio Personal
 * Motor de Animação, Interações & Sliders
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initMobileMenu();
  initCursorGlow();
  initScrollAnimations();
  initProjectSliders();
  initCopyEmail();
});

/**
 * Muda background e padding da Navbar ao rolar a página
 */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("nav-scrolled");
    } else {
      navbar.classList.remove("nav-scrolled");
    }
  });
}

/**
 * Controle do Menu Mobile (Hambúrguer)
 */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const iconPath = document.getElementById("menu-icon-path");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!btn || !menu) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    if (isOpen) {
      menu.classList.remove("opacity-0", "pointer-events-none");
      menu.classList.add("opacity-100", "pointer-events-auto");
      iconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
      document.body.style.overflow = "hidden"; 
    } else {
      menu.classList.add("opacity-0", "pointer-events-none");
      menu.classList.remove("opacity-100", "pointer-events-auto");
      iconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
      document.body.style.overflow = ""; 
    }
  }

  btn.addEventListener("click", toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (isOpen) toggleMenu();
    });
  });
}

/**
 * Efeito de iluminação suave que segue o mouse
 */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  window.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/**
 * Animações de Scroll com Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  const animatableElements = document.querySelectorAll(".reveal, .stagger-container");
  animatableElements.forEach(el => observer.observe(el));
}

/**
 * Controle de Copiar E-mail em 1 clique com Feedback
 */
function initCopyEmail() {
  const copyBtn = document.getElementById("copy-email-btn");
  const emailText = document.getElementById("email-text")?.innerText;

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(emailText).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "✓ Copiado!";
      copyBtn.classList.add("bg-emerald-400", "text-black");

      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.classList.remove("bg-emerald-400", "text-black");
      }, 2500);
    });
  });
}

/**
 * Motor de Galeria/Slider para os Projetos
 */
function initProjectSliders() {
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach(slider => {
    const track = slider.querySelector(".slider-track");
    const slides = track.querySelectorAll("img");
    const prevBtn = slider.querySelector(".slider-btn.prev");
    const nextBtn = slider.querySelector(".slider-btn.next");
    const dotsContainer = slider.querySelector(".slider-dots");

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    let currentIndex = 0;

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".slider-dot");

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
      });
    }
  });
}

  // Typewriter
  const words = ["desenvolvedor web", "founder do bitto", "graduado em ADS"];
  let wi = 0, ci = 0, deleting = false;
  const twEl = document.getElementById('typewriter');
  function tick() {
    const word = words[wi];
    if (!deleting) {
      ci++; twEl.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1300); return; }
    } else {
      ci--; twEl.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();

  // Cursor hint animation on load
  window.addEventListener('load', () => {
    document.getElementById('cursorHint').classList.add('play');
  });

  // Breadcrumb scrollspy
  const crumb = document.getElementById('crumb');
  const sections = ['hero','sobre','skills','projetos','contato'];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        crumb.style.opacity = 0;
        setTimeout(() => { crumb.textContent = entry.target.id; crumb.style.opacity = 1; }, 120);
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObserver.observe(el));

  // Project tabs
  function setTab(btn, project, type) {
    const group = btn.parentElement;
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const preview = document.getElementById(project + '-preview');
    if (type === 'desk') preview.innerHTML = '<svg class="icon" style="font-size:22px;"><use href="#icon-monitor"></use></svg> preview desktop';
    if (type === 'mob') preview.innerHTML = '<svg class="icon" style="font-size:22px;"><use href="#icon-smartphone"></use></svg> preview mobile';
    if (type === 'vid') preview.innerHTML = '<svg class="icon" style="font-size:22px;"><use href="#icon-youtube"></use></svg> vídeo demo (link do youtube)';
  }

  // Copy email
  function copyEmail() {
    navigator.clipboard.writeText('pedrogm.dev@gmail.com');
    const el = document.getElementById('emailText');
    const old = el.textContent;
    el.textContent = 'copiado!';
    setTimeout(() => el.textContent = old, 1500);
  }

  // Skill tap toggle (mobile-friendly: tap to reveal label)
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('tapped'));
  });

  // Skill cards: pseudo-3D tilt following the mouse (desktop only)
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(300px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(300px) rotateY(0) rotateX(0) scale(1)';
    });
  });

  // Coffee cup fills up as the page is scrolled
  const coffeeLiquid = document.getElementById('coffeeLiquid');
  const coffeeProgress = document.getElementById('coffeeProgress');
  const CUP_TOP = 11, CUP_BOTTOM = 44; // interior bounds of the cup in the SVG
  const CUP_HEIGHT = CUP_BOTTOM - CUP_TOP;

  function updateCoffee() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    const liquidHeight = (pct / 100) * CUP_HEIGHT;
    coffeeLiquid.setAttribute('height', liquidHeight);
    coffeeLiquid.setAttribute('y', CUP_BOTTOM - liquidHeight);
    coffeeProgress.classList.toggle('full', pct > 88);
  }
  window.addEventListener('scroll', updateCoffee);
  window.addEventListener('resize', updateCoffee);
  updateCoffee();

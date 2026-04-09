// 1. Inicializar Ícones
lucide.createIcons();

// 2. Efeito Spotlight
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
    gsap.to(spotlight, {
        duration: 0.3,
        background: `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.08) 0%, transparent 70%)`
    });
});

// 3. Nuvem de Skills em Órbita (GSAP)
const items = document.querySelectorAll('.orbit-item');
items.forEach((item, i) => {
    const angle = (i / items.length) * Math.PI * 2;
    const radius = 180;
    
    // Posicionamento Inicial
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    gsap.set(item, { x, y });

    // Animação de Rotação Contínua
    gsap.to(item, {
        duration: 20,
        repeat: -1,
        ease: "none",
        modifiers: {
            x: gsap.utils.unitize(x => Math.cos(parseFloat(x)/radius + Date.now()/2000) * radius),
            y: gsap.utils.unitize(y => Math.sin(parseFloat(y)/radius + Date.now()/2000) * radius)
        }
    });
});

// 4. Scroll Horizontal com Mouse Wheel no Slider
const slider = document.getElementById('project-slider');
slider.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
        e.preventDefault();
        slider.scrollLeft += e.deltaY;
    }
});

// 5. Reflexo de Vidro Dinâmico no Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.glass').forEach(card => {
        card.style.backgroundPosition = `${scrolled * 0.5}px`;
    });
});

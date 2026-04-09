// Inicializa ícones Lucide
lucide.createIcons();

// Efeito Spotlight Dinâmico
const spotlight = document.getElementById('spotlight');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 80%)`;
});

// Scroll suave para o slider (Opção 2)
const slider = document.querySelector('.slider-container');
slider.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    slider.scrollLeft += evt.deltaY;
});

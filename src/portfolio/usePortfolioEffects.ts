import { useEffect } from 'react'

// Porta o js/script.js original do portfólio (navbar scroll, menu mobile,
// glow do cursor, scroll reveal, slider de projetos, copiar e-mail) pra
// dentro do React. Roda depois que a página monta, e limpa os listeners
// ao desmontar — evita duplicar handlers ao navegar entre rotas.
export function usePortfolioEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = []

    // Navbar scroll
    const navbar = document.getElementById('navbar')
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 40) navbar.classList.add('nav-scrolled')
        else navbar.classList.remove('nav-scrolled')
      }
      window.addEventListener('scroll', onScroll)
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    // Menu mobile
    const btn = document.getElementById('mobile-menu-btn')
    const menu = document.getElementById('mobile-menu')
    const iconPath = document.getElementById('menu-icon-path')
    const mobileLinks = document.querySelectorAll('.mobile-link')
    let isOpen = false
    function toggleMenu() {
      if (!menu || !iconPath) return
      isOpen = !isOpen
      if (isOpen) {
        menu.classList.remove('opacity-0', 'pointer-events-none')
        menu.classList.add('opacity-100', 'pointer-events-auto')
        iconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12')
        document.body.style.overflow = 'hidden'
      } else {
        menu.classList.add('opacity-0', 'pointer-events-none')
        menu.classList.remove('opacity-100', 'pointer-events-auto')
        iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16')
        document.body.style.overflow = ''
      }
    }
    if (btn && menu) {
      btn.addEventListener('click', toggleMenu)
      cleanups.push(() => btn.removeEventListener('click', toggleMenu))
      mobileLinks.forEach((link) => {
        const handler = () => { if (isOpen) toggleMenu() }
        link.addEventListener('click', handler)
        cleanups.push(() => link.removeEventListener('click', handler))
      })
    }

    // Glow do cursor
    const glow = document.getElementById('cursor-glow')
    if (glow) {
      const onMove = (e: MouseEvent) => {
        glow.style.left = `${e.clientX}px`
        glow.style.top = `${e.clientY}px`
      }
      window.addEventListener('mousemove', onMove)
      cleanups.push(() => window.removeEventListener('mousemove', onMove))
    }

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active')
        })
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .stagger-container').forEach((el) => observer.observe(el))
    cleanups.push(() => observer.disconnect())

    // Copiar e-mail
    const copyBtn = document.getElementById('copy-email-btn')
    const emailText = document.getElementById('email-text')?.textContent
    if (copyBtn && emailText) {
      const onCopy = () => {
        navigator.clipboard.writeText(emailText).then(() => {
          const original = copyBtn.textContent
          copyBtn.textContent = '✓ Copiado!'
          copyBtn.classList.add('bg-emerald-400', 'text-black')
          setTimeout(() => {
            copyBtn.textContent = original
            copyBtn.classList.remove('bg-emerald-400', 'text-black')
          }, 2500)
        })
      }
      copyBtn.addEventListener('click', onCopy)
      cleanups.push(() => copyBtn.removeEventListener('click', onCopy))
    }

    // Sliders de projeto
    document.querySelectorAll('[data-slider]').forEach((slider) => {
      const track = slider.querySelector('.slider-track') as HTMLElement | null
      const dotsContainer = slider.querySelector('.slider-dots')
      const prevBtn = slider.querySelector('.slider-btn.prev') as HTMLElement | null
      const nextBtn = slider.querySelector('.slider-btn.next') as HTMLElement | null
      if (!track || !dotsContainer) return
      const slides = track.querySelectorAll('img')
      if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none'
        if (nextBtn) nextBtn.style.display = 'none'
        return
      }
      dotsContainer.innerHTML = ''
      let currentIndex = 0
      slides.forEach((_, index) => {
        const dot = document.createElement('button')
        dot.classList.add('slider-dot')
        if (index === 0) dot.classList.add('active')
        const onDotClick = () => { currentIndex = index; update() }
        dot.addEventListener('click', onDotClick)
        cleanups.push(() => dot.removeEventListener('click', onDotClick))
        dotsContainer.appendChild(dot)
      })
      const dots = dotsContainer.querySelectorAll('.slider-dot')
      function update() {
        track!.style.transform = `translateX(-${currentIndex * 100}%)`
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex))
      }
      if (nextBtn) {
        const onNext = () => { currentIndex = (currentIndex + 1) % slides.length; update() }
        nextBtn.addEventListener('click', onNext)
        cleanups.push(() => nextBtn.removeEventListener('click', onNext))
      }
      if (prevBtn) {
        const onPrev = () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; update() }
        prevBtn.addEventListener('click', onPrev)
        cleanups.push(() => prevBtn.removeEventListener('click', onPrev))
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])
}

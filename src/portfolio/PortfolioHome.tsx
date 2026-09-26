import { usePortfolioEffects } from './usePortfolioEffects'
import './portfolio.css'

const html = `  <!-- Cursor Glow Follower -->
  <div id="cursor-glow" class="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-blue-400/10 rounded-full blur-3xl transition-opacity duration-500 z-0 opacity-0 md:opacity-100"></div>

  <!-- ================= NAV ================= -->
  <nav id="navbar" class="fixed top-0 w-full z-[65] px-6 py-6 md:px-12 flex justify-between items-center transition-all duration-300 border-b border-transparent bg-[#EDEAE2]/85 backdrop-blur-md">
    <a href="#hero" class="text-sm font-semibold tracking-widest uppercase text-[#15150F] hover:opacity-70 transition-opacity relative z-50">Pedro Gomes <span class="text-[#2F5DFF]">· tech</span></a>
    
    <button id="mobile-menu-btn" aria-label="Abrir menu" class="md:hidden text-[#15150F] hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F5DFF] relative z-[70]">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path id="menu-icon-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <div class="text-xs tracking-widest uppercase text-[#15150F]/65 space-x-8 hidden md:flex relative z-50">
      <a href="/" class="hover:opacity-70 transition-opacity">Início</a>
      <a href="#sobre" class="hover:opacity-70 transition-opacity">Sobre</a>
      <a href="#skills" class="hover:opacity-70 transition-opacity">Skills</a>
      <a href="#projetos" class="hover:opacity-70 transition-opacity">Projetos</a>
      <a href="#contato" class="hover:opacity-70 transition-opacity">Contato</a>
    </div>
  </nav>

  <!-- Menu Mobile — precisa ficar FORA da nav: nav tem backdrop-blur,
       que cria um containing block novo pra filhos "fixed" e quebra o
       inset-0 (o menu passava a se posicionar relativo à nav, não à tela). -->
  <div id="mobile-menu" class="fixed inset-0 bg-[#EDEAE2] flex-col items-center justify-center gap-8 text-sm tracking-widest uppercase text-[#15150F] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden flex z-[60]">
    <a href="/" class="hover:opacity-70 transition-opacity mobile-link">Início</a>
    <a href="#sobre" class="hover:opacity-70 transition-opacity mobile-link">Sobre</a>
    <a href="#skills" class="hover:opacity-70 transition-opacity mobile-link">Skills</a>
    <a href="#projetos" class="hover:opacity-70 transition-opacity mobile-link">Projetos</a>
    <a href="#contato" class="hover:opacity-70 transition-opacity mobile-link">Contato</a>
  </div>

  <!-- ================= HERO ================= -->
  <section id="hero" class="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 relative overflow-hidden z-10 bg-[#EDEAE2] text-[#15150F]">
    <div aria-hidden class="absolute rounded-full pointer-events-none" style="width:420px;height:420px;top:-10%;right:-8%;background:#2F5DFF;filter:blur(100px);opacity:0.2;"></div>
    <div aria-hidden class="absolute rounded-full pointer-events-none" style="width:320px;height:320px;bottom:-8%;left:-10%;background:#D9A441;filter:blur(90px);opacity:0.15;"></div>
    <div class="relative z-10 max-w-7xl mx-auto w-full stagger-container active">
      
      <div class="stagger-item mb-8 flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-[#2F5DFF] animate-pulse"></span>
        <p class="text-xs tracking-widest uppercase text-[#15150F]/55">
          Pedro Gabriel Gomes <span class="mx-2">—</span> <span class="serif-text lowercase text-[#15150F]/45">Luziânia, GO</span>
        </p>
      </div>

      <div class="stagger-item">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight max-w-5xl">
          Construindo produtos <span class="serif-text text-[#2F5DFF]">do zero,</span> da ideia ao deploy.
        </h1>
      </div>

      <div class="stagger-item mt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <p class="max-w-md text-[#15150F]/65 text-lg leading-relaxed font-light">
          Graduado em Análise e Desenvolvimento de Sistemas (ADS). Desenvolvedor Web e Founder — construo do zero e cuido pra continuar funcionando depois.
        </p>
        <a href="#projetos" class="group flex items-center gap-4 text-xs tracking-widest uppercase border-b border-[#15150F]/30 pb-3 hover:border-[#15150F] transition-all duration-300">
          Explorar Projetos 
          <span class="group-hover:translate-x-2 transition-transform duration-500">→</span>
        </a>
      </div>

    </div>
  </section>

  <!-- ================= SOBRE ================= -->
  <section id="sobre" class="py-32 px-6 md:px-12 border-t border-[#15150F]/10 relative z-10 bg-[#EDEAE2] text-[#15150F]">
    <div class="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-28 items-center">
      
      <div class="w-full md:w-2/5 reveal">
        <div class="profile-card relative group rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-[#15150F]/20 to-transparent">
          <div class="relative rounded-xl overflow-hidden bg-black">
            <img 
              src="/assets/perfil/foto-perfil.jpg" 
              alt="Foto de Pedro Gabriel Gomes" 
              class="profile-img w-full aspect-[3/4] object-cover transition-all duration-700 ease-out group-hover:scale-105"
            >
            <div class="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
              <p class="text-xs text-gray-300 font-medium">Pedro Gabriel</p>
              <p class="text-[10px] text-gray-400 tracking-wider uppercase">Founder @ BITTO</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="w-full md:w-3/5 flex flex-col justify-center reveal">
        <h2 class="text-3xl md:text-5xl font-medium mb-8 leading-tight">
          Penso em produto como negócio. <br>
          <span class="serif-text text-[#2F5DFF]">Hoje, meu foco principal é a BITTO.</span>
        </h2>
        <p class="text-[#15150F]/65 text-lg leading-relaxed font-light mb-6">
          Construo produtos do zero: penso no design, escrevo o código e ligo tudo às APIs que fazem funcionar de verdade. Quando o usuário nem repara na tecnologia por trás, é sinal de que deu certo.
        </p>
        <p class="text-[#15150F]/65 text-lg leading-relaxed font-light">
          Isso junta engenharia com atenção a detalhe: interface rápida, fluida e que não atravanca quem tá usando.
        </p>
      </div>

    </div>
  </section>

  <!-- ================= SKILLS ================= -->
  <section id="skills" class="py-32 px-6 md:px-12 bg-[#15150F] relative overflow-hidden z-10 border-t border-gray-900/50">
    <div aria-hidden class="absolute rounded-full pointer-events-none" style="width:480px;height:480px;top:-15%;left:50%;transform:translateX(-50%);background:#2F5DFF;filter:blur(110px);opacity:0.13;"></div>
    <div class="relative z-10 max-w-7xl mx-auto w-full">
      
      <div class="reveal mb-20">
        <h2 class="text-4xl md:text-5xl font-medium">Tecnologias & <span class="serif-text text-gray-400">Ferramentas</span></h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 stagger-container">
        
        <!-- FRONTEND -->
        <div class="stagger-item backdrop-blur-sm p-8 rounded-xl border border-gray-800/60 hover:border-gray-700 transition-all duration-300" style="background:rgba(18,18,18,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <span class="serif-text text-gray-500 text-2xl">01</span>
            <h3 class="text-xs tracking-widest uppercase text-white font-semibold">Frontend</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-javascript-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">JavaScript</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-react-original colored text-2xl"></i>
              <span class="text-sm text-gray-300">React</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-tailwindcss-original colored text-2xl"></i>
              <span class="text-sm text-gray-300">Tailwind</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-html5-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">HTML5 / CSS3</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-typescript-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">TypeScript</span>
            </div>
          </div>
        </div>

        <!-- BACKEND & INFRA -->
        <div class="stagger-item backdrop-blur-sm p-8 rounded-xl border border-gray-800/60 hover:border-gray-700 transition-all duration-300" style="background:rgba(18,18,18,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <span class="serif-text text-gray-500 text-2xl">02</span>
            <h3 class="text-xs tracking-widest uppercase text-white font-semibold">Backend & Infra</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-nodejs-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">Node.js</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-firebase-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">Firebase</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-cloudflare-plain colored text-2xl"></i>
              <span class="text-sm text-gray-300">Cloudflare</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <i class="devicon-vercel-original text-2xl text-white"></i>
              <span class="text-sm text-gray-300">Vercel</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <span class="text-xl">🔗</span>
              <span class="text-sm text-gray-300">API REST</span>
            </div>
          </div>
        </div>

        <!-- INTELIGÊNCIA ARTIFICIAL -->
        <div class="stagger-item backdrop-blur-sm p-8 rounded-xl border border-gray-800/60 hover:border-gray-700 transition-all duration-300" style="background:rgba(18,18,18,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <span class="serif-text text-gray-500 text-2xl">03</span>
            <h3 class="text-xs tracking-widest uppercase text-white font-semibold">IA & Integrações</h3>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <span class="text-xl">✨</span>
              <span class="text-sm text-gray-300">APIs de LLM (OpenAI / Gemini)</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <span class="text-xl">🧠</span>
              <span class="text-sm text-gray-300">Engenharia de Prompt Avançada</span>
            </div>
            <div class="skill-badge flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-gray-800/80 hover:border-gray-600 transition-all">
              <span class="text-xl">⚡</span>
              <span class="text-sm text-gray-300">Agentes & Fluxos Automatizados</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= PROJETOS ================= -->
  <section id="projetos" class="py-32 px-6 md:px-12 relative z-10 bg-[#15150F]">
    <div class="max-w-7xl mx-auto w-full">
      
      <div class="reveal mb-24 md:mb-32">
        <h2 class="text-5xl md:text-6xl font-medium">Projetos <span class="serif-text text-gray-400">Selecionados</span></h2>
      </div>

      <!-- PROJETO 1: BITTO -->
      <article class="project-card reveal flex flex-col md:flex-row gap-12 md:gap-20 items-center mb-32 md:mb-44">
        
        <div class="w-full md:w-3/5 project-slider relative group bg-[#111] aspect-video rounded-xl overflow-hidden border border-gray-800/80 shadow-2xl" data-slider="bitto">
          <div class="slider-track w-full h-full flex transition-transform duration-500 ease-out">
            <img src="/assets/projetos/bitto/desktop/desktop-01.png" alt="Bitto Preview 1" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/bitto/desktop/desktop-02.png" alt="Bitto Preview 2" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/bitto/desktop/desktop-03.png" alt="Bitto Preview 3" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/bitto/desktop/desktop-04.png" alt="Bitto Preview 4" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/bitto/desktop/desktop-05.png" alt="Bitto Preview 5" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/bitto/desktop/desktop-06.png" alt="Bitto Preview 6" class="w-full h-full object-cover flex-shrink-0">
          </div>

          <button class="slider-btn prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">←</button>
          <button class="slider-btn next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">→</button>
          
          <div class="slider-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"></div>
        </div>
        
        <div class="w-full md:w-2/5 flex flex-col items-start">
          <div class="flex items-center gap-4 mb-6">
            <p class="serif-text text-gray-500 text-2xl">01</p>
            <span class="px-3 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full text-[10px] text-blue-400 tracking-widest uppercase font-medium">Em Produção</span>
          </div>
          <h3 class="text-4xl font-medium mb-6">BITTO</h3>
          <p class="text-gray-400 text-base leading-relaxed font-light mb-8">
            Plataforma de estudos alimentada por IA que transforma qualquer arquivo ou texto em flashcards, quizzes e resumos automáticos. Conta com sistema de XP, planner e assistente virtual.
          </p>
          <div class="flex gap-6">
            <a href="https://www.usebitto.com" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-2 text-xs uppercase tracking-widest link-hover pb-1 font-semibold">
              Acessar Plataforma <span class="group-hover:translate-x-1 transition-transform">↗</span>
            </a>
            <a href="https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20bitto." target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
              Repositório
            </a>
          </div>
          <p class="text-[11px] text-gray-600 mt-4">Repositório privado — código proprietário, acesso mediante solicitação.</p>
        </div>
      </article>

      <!-- PROJETO 2: CINEGIFT -->
      <article class="project-card reveal flex flex-col md:flex-row-reverse gap-12 md:gap-20 items-center mb-32 md:mb-44">
        
        <div class="w-full md:w-3/5 project-slider relative group bg-[#111] aspect-video rounded-xl overflow-hidden border border-gray-800/80 shadow-2xl" data-slider="cinegift">
          <div class="slider-track w-full h-full flex transition-transform duration-500 ease-out">
            <img src="/assets/projetos/cinegift/desktop/desktop-01.png" alt="CineGift Preview 1" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/cinegift/desktop/desktop-02.png" alt="CineGift Preview 2" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/cinegift/desktop/desktop-03.png" alt="CineGift Preview 3" class="w-full h-full object-cover flex-shrink-0">
          </div>

          <button class="slider-btn prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">←</button>
          <button class="slider-btn next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">→</button>
          
          <div class="slider-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"></div>
        </div>
        
        <div class="w-full md:w-2/5 flex flex-col items-start">
          <div class="flex items-center gap-4 mb-6">
            <p class="serif-text text-gray-500 text-2xl">02</p>
            <span class="px-3 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full text-[10px] text-blue-400 tracking-widest uppercase font-medium">Em Produção</span>
          </div>
          <h3 class="text-4xl font-medium mb-6">CineGift</h3>
          <p class="text-gray-400 text-base leading-relaxed font-light mb-8">
            Experiência digital interativa que converte fotos, vídeos e mensagens em um ingresso de cinema personalizado para presentear pessoas especiais.
          </p>
          <div class="flex gap-6">
            <a href="https://www.cinegift.com.br/" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-2 text-xs uppercase tracking-widest link-hover pb-1 font-semibold">
              Acessar Plataforma <span class="group-hover:translate-x-1 transition-transform">↗</span>
            </a>
            <a href="https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20CineGift." target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
              Repositório
            </a>
          </div>
          <p class="text-[11px] text-gray-600 mt-4">Repositório privado — código proprietário, acesso mediante solicitação.</p>
        </div>
      </article>

      <!-- PROJETO 3: KONT HUB -->
      <article class="project-card reveal flex flex-col md:flex-row gap-12 md:gap-20 items-center">
        
        <div class="w-full md:w-3/5 project-slider relative group bg-[#111] aspect-video rounded-xl overflow-hidden border border-gray-800/80 shadow-2xl" data-slider="konthub">
          <div class="slider-track w-full h-full flex transition-transform duration-500 ease-out">
            <img src="/assets/projetos/konthub/desktop/desktop-01.png" alt="Kont Hub Preview 1" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/konthub/desktop/desktop-02.png" alt="Kont Hub Preview 2" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/konthub/desktop/desktop-03.png" alt="Kont Hub Preview 3" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/konthub/desktop/desktop-04.png" alt="Kont Hub Preview 4" class="w-full h-full object-cover flex-shrink-0">
            <img src="/assets/projetos/konthub/desktop/desktop-05.png" alt="Kont Hub Preview 5" class="w-full h-full object-cover flex-shrink-0">
          </div>
          
          <button class="slider-btn prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">←</button>
          <button class="slider-btn next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black">→</button>
          
          <div class="slider-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"></div>
        </div>
        
        <div class="w-full md:w-2/5 flex flex-col items-start">
          <div class="flex items-center gap-4 mb-6">
            <p class="serif-text text-gray-500 text-2xl">03</p>
            <span class="px-3 py-1 border border-amber-500/30 bg-amber-500/10 rounded-full text-[10px] text-amber-400 tracking-widest uppercase font-medium">Em Desenvolvimento</span>
          </div>
          <h3 class="text-4xl font-medium mb-6">Kont Hub</h3>
          <p class="text-gray-400 text-base leading-relaxed font-light mb-8">
            MicroSaaS focado na gestão contábil moderna: CRM de clientes, pipeline Kanban de tarefas, gestão financeira e cofre de documentos em nuvem.
          </p>
          <div class="flex gap-6">
            <a href="https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20gostaria%20de%20solicitar%20acesso%20ao%20reposit%C3%B3rio%20do%20Kont%20Hub." target="_blank" rel="noopener noreferrer" class="group flex items-center gap-2 text-xs uppercase tracking-widest link-hover pb-1 font-semibold">
              Solicitar Repositório <span class="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          <p class="text-[11px] text-gray-600 mt-4">Repositório privado — código proprietário, acesso mediante solicitação.</p>
        </div>
      </article>

    </div>
  </section>

  <!-- ================= CONTATO ================= -->
  <section id="contato" class="py-32 px-6 md:px-12 bg-[#15150F] border-t border-gray-800/80 relative overflow-hidden z-10">
    <div aria-hidden class="absolute rounded-full pointer-events-none" style="width:460px;height:460px;top:50%;left:50%;transform:translate(-50%,-50%);background:#2F5DFF;filter:blur(110px);opacity:0.18;"></div>
    <div class="relative z-10 max-w-7xl mx-auto w-full">
      
      <div class="stagger-container flex flex-col items-center text-center">
        
        <div class="stagger-item flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span class="text-xs uppercase tracking-widest text-gray-300 font-medium">Disponível para novos projetos & parcerias</span>
        </div>

        <h2 class="text-5xl md:text-7xl font-medium leading-tight mb-8 stagger-item">
          Tem um projeto <br> 
          <span class="serif-text text-gray-400">em mente?</span>
        </h2>

        <p class="max-w-xl text-gray-400 text-base md:text-lg font-light mb-12 stagger-item">
          Seja para criar um produto do zero, integrar IA ao seu negócio ou conversar sobre desenvolvimento e tecnologia.
        </p>

        <!-- CAIXA DE E-MAIL COM BOTÃO DE COPIAR -->
        <div class="stagger-item w-full max-w-xl backdrop-blur-sm p-4 md:p-3 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-16" style="background:rgba(20,20,23,0.65);box-shadow:inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -20px rgba(0,0,0,0.6);">
          <div class="flex items-center gap-3 md:pl-4 overflow-hidden">
            <span class="text-gray-500">✉️</span>
            <span id="email-text" class="text-sm md:text-base text-gray-200 font-mono truncate">pedrogm.dev@gmail.com</span>
          </div>
          <button id="copy-email-btn" class="w-full md:w-auto px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shrink-0">
            Copiar E-mail
          </button>
        </div>

        <!-- CARDS DE CANAIS DIRETO -->
        <div class="stagger-item grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          
          <a href="https://wa.me/5561936182176?text=Ol%C3%A1%20Pedro%2C%20vi%20seu%20portf%C3%B3lio%2C%20vamos%20conversar%3F" target="_blank" rel="noopener noreferrer" class="group p-6 rounded-xl backdrop-blur-sm border border-gray-800/80 hover:border-blue-500/50 transition-all text-left" style="background:rgba(18,18,21,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
            <div class="flex justify-between items-center mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.821.487 3.53 1.338 5.003L2.05 22l5.144-1.302C8.622 21.526 10.263 22 12.001 22 17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.153c-1.583 0-3.05-.462-4.29-1.257l-.308-.19-3.076.78.802-3.02-.202-.31A8.13 8.13 0 013.848 12c0-4.494 3.659-8.153 8.153-8.153 4.494 0 8.153 3.659 8.153 8.153 0 4.494-3.659 8.153-8.153 8.153z"/></svg>
              <span class="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Conversar →</span>
            </div>
            <h4 class="text-sm font-semibold text-white mb-1">WhatsApp</h4>
            <p class="text-xs text-gray-500">+55 (61) 93618-2176</p>
          </a>

          <a href="https://www.instagram.com/pedrogm.dev/" target="_blank" rel="noopener noreferrer" class="group p-6 rounded-xl backdrop-blur-sm border border-gray-800/80 hover:border-blue-500/50 transition-all text-left" style="background:rgba(18,18,21,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
            <div class="flex justify-between items-center mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#E4405F" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="#E4405F" stroke="none"></circle></svg>
              <span class="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Seguir →</span>
            </div>
            <h4 class="text-sm font-semibold text-white mb-1">Instagram</h4>
            <p class="text-xs text-gray-500">@pedrogm.dev</p>
          </a>

          <a href="https://www.linkedin.com/in/pedrogmdev" target="_blank" rel="noopener noreferrer" class="group p-6 rounded-xl backdrop-blur-sm border border-gray-800/80 hover:border-blue-500/50 transition-all text-left" style="background:rgba(18,18,21,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
            <div class="flex justify-between items-center mb-4">
              <i class="devicon-linkedin-plain colored text-2xl"></i>
              <span class="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Ver perfil →</span>
            </div>
            <h4 class="text-sm font-semibold text-white mb-1">LinkedIn</h4>
            <p class="text-xs text-gray-500">/in/pedrogmdev</p>
          </a>

          <a href="https://github.com/opgmoraes" target="_blank" rel="noopener noreferrer" class="group p-6 rounded-xl backdrop-blur-sm border border-gray-800/80 hover:border-purple-500/50 transition-all text-left" style="background:rgba(18,18,21,0.6);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
            <div class="flex justify-between items-center mb-4">
              <i class="devicon-github-original text-2xl text-white"></i>
              <span class="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">Ver projetos →</span>
            </div>
            <h4 class="text-sm font-semibold text-white mb-1">GitHub</h4>
            <p class="text-xs text-gray-500">@opgmoraes</p>
          </a>

        </div>

      </div>

    </div>
  </section>

  <!-- ================= FOOTER ================= -->
  <footer class="py-8 px-6 text-center border-t border-[#15150F]/10 relative z-10 bg-[#EDEAE2] text-[#15150F]">
    <p class="text-xs text-[#15150F]/50 tracking-widest uppercase">
      © 2026 Pedro Gabriel Gomes
    </p>
    <p class="text-[10px] text-[#15150F]/40 tracking-widest uppercase mt-2 flex items-center justify-center gap-1.5">
      <span>☕</span> Cafés consumidos nesse projeto: 247
    </p>
  </footer>

`

export default function PortfolioHome() {
  usePortfolioEffects()
  return <div className="bg-[#15150F] text-gray-100 antialiased selection:bg-[#2F5DFF] selection:text-white relative overflow-x-hidden" dangerouslySetInnerHTML={{ __html: html }} />
}

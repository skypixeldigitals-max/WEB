// Regenerates portfolio.html from portfolio-manifest.json + gallery data.
// Layout identical to the hand-built version; adds per-property section ids,
// clickable preview photos, [ VIEW GALLERY — N PHOTOS ] links, and the lightbox.
const fs = require("fs");
const path = require("path");

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "portfolio-manifest.json"), "utf8"));
// Read gallery counts from the generated data file
const galleryJs = fs.readFileSync(path.join(__dirname, "..", "js", "gallery-data.js"), "utf8");
const GALLERIES = JSON.parse(galleryJs.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, ""));

const esc = (s) => s.replace(/&/g, "&amp;");

const sections = manifest.map((p, i) => {
  const reverse = i % 2 === 1;
  const caption = [p.location, p.category].filter(Boolean).map(esc).join(" · ");
  const count = (GALLERIES[p.slug] || { images: [] }).images.length;
  const imgs = p.images.map((img, idx) => `
                <div class="image-reveal aspect-[4/3] overflow-hidden cursor-pointer" data-gallery="${p.slug}" data-start="${idx}">
                    <img alt="${esc(p.folder)} - photo ${idx + 1}" class="w-full h-full object-cover" loading="lazy" src="images/portfolio/${img}">
                </div>`).join("");
  return `        <section class="project-section grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start scroll-mt-32" id="${p.slug}">
            <div class="md:col-span-4${reverse ? " md:order-last" : ""} md:sticky md:top-32">
                <h2 class="text-headline-md font-normal mb-3">${esc(p.folder)}</h2>
                <p class="font-label-caps text-[12px] text-on-surface-variant tracking-[0.2em] font-bold uppercase mb-6">${caption}</p>
                <button class="bracket-link font-label-caps text-label-caps text-primary uppercase tracking-widest hover:opacity-70 transition-opacity" data-gallery="${p.slug}" data-start="0" type="button">View Gallery — ${count} Photos</button>
            </div>
            <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">${imgs}
            </div>
        </section>`;
}).join("\n\n");

const html = `<!DOCTYPE html>
<html class="scroll-smooth" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Portfolio | Shakir Jamaldeen Photography — Sri Lanka</title>
    <meta content="A curated portfolio of villas, resorts and interiors shot by Shakir Jamaldeen across Sri Lanka." name="description">
    <link href="https://fonts.googleapis.com/css2?family=Poiret+One&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-background text-on-surface selection:bg-primary selection:text-white font-body-md">

<!-- Navigation -->
<nav class="fixed top-0 w-full z-50 bg-glass-overlay backdrop-blur-xl border-b border-black/5">
    <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-unit max-w-container-max mx-auto h-24">
        <a class="nav-logo text-on-surface uppercase flex items-center gap-3" href="index.html">
            <img alt="Shakir Jamaldeen logo" class="h-11 w-auto object-contain" src="images/logo.png">
            <span class="hidden sm:block font-bold text-[16px] md:text-[20px] tracking-[0.18em]">SHAKIR JAMALDEEN</span>
        </a>
        <div class="hidden md:flex items-center gap-12 font-label-caps text-label-caps tracking-widest">
            <a class="text-primary active-nav" href="portfolio.html">PORTFOLIO</a>
            <a class="text-secondary hover:text-primary transition-colors bracket-link" href="about.html">ABOUT</a>
            <a class="text-secondary hover:text-primary transition-colors bracket-link" href="about.html#contact">CONTACT</a>
        </div>
        <button aria-label="Toggle Menu" class="md:hidden p-2" id="menuToggle">
            <span class="material-symbols-outlined text-[32px]">menu</span>
        </button>
    </div>
    <div class="hidden md:hidden bg-glass-overlay backdrop-blur-xl border-b border-black/5" id="mobileMenu">
        <div class="flex flex-col gap-8 px-margin-mobile py-10 font-label-caps text-label-caps tracking-widest">
            <a class="text-primary" href="portfolio.html">PORTFOLIO</a>
            <a class="text-secondary" href="about.html">ABOUT</a>
            <a class="text-secondary" href="about.html#contact">CONTACT</a>
        </div>
    </div>
</nav>

<!-- Hero -->
<header class="pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
    <div class="max-w-4xl">
        <h1 class="text-display-lg-mobile md:text-display-lg mb-8 uppercase tracking-tight leading-[0.9]">Projects</h1>
        <p class="font-body-lg text-body-lg text-on-surface/90 max-w-xl leading-relaxed">Seventeen properties across Sri Lanka — villas, resorts and private homes, documented in architecture, interiors and aerial photography. Open any project to browse its full gallery.</p>
    </div>
</header>

<!-- Portfolio Sections -->
<main class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-section-gap space-y-24 md:space-y-32">

${sections}

</main>

<!-- Lightbox -->
<div aria-hidden="true" class="fixed inset-0 z-[100] bg-black/95 hidden flex-col" id="lightbox">
    <div class="flex justify-between items-center px-6 md:px-12 h-20 shrink-0">
        <span class="font-label-caps text-label-caps text-white/90 uppercase tracking-widest" id="lbTitle"></span>
        <div class="flex items-center gap-8">
            <span class="font-label-caps text-label-caps text-white/60 tracking-widest" id="lbCounter"></span>
            <button aria-label="Close gallery" class="text-white/60 hover:text-white transition-colors" id="lbClose" type="button">
                <span class="material-symbols-outlined text-[32px]">close</span>
            </button>
        </div>
    </div>
    <div class="relative flex-1 flex items-center justify-center px-4 md:px-24 pb-8 min-h-0">
        <button aria-label="Previous photo" class="absolute left-2 md:left-8 z-10 text-white/60 hover:text-white transition-colors p-2" id="lbPrev" type="button">
            <span class="material-symbols-outlined text-[44px]">chevron_left</span>
        </button>
        <img alt="" class="max-w-full max-h-full object-contain select-none" id="lbImage" src="">
        <button aria-label="Next photo" class="absolute right-2 md:right-8 z-10 text-white/60 hover:text-white transition-colors p-2" id="lbNext" type="button">
            <span class="material-symbols-outlined text-[44px]">chevron_right</span>
        </button>
    </div>
</div>

<!-- Footer -->
<footer class="bg-canvas-off-white pt-section-gap pb-12 border-t border-black/5">
    <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
            <div class="max-w-md">
                <a class="flex items-center gap-4 mb-8" href="index.html">
                    <img alt="Shakir Jamaldeen logo" class="h-14 w-auto object-contain" src="images/logo.png">
                    <span class="uppercase font-bold text-[20px] tracking-[0.18em] text-on-surface">Shakir Jamaldeen</span>
                </a>
                <p class="text-[17px] text-on-surface/90 leading-loose">
                    Commercial photography &amp; video for brands across Sri Lanka. Architecture &amp; interiors, food, aerial, landscapes and products — precision in every frame.
                </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-12">
                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Based in</span>
                    <p class="text-[15px] text-on-surface-variant leading-relaxed">Sri Lanka<br>Available island-wide</p>
                </div>
                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Contact</span>
                    <a class="text-[15px] text-on-surface-variant hover:text-black transition-colors underline decoration-black/20 underline-offset-4 break-all" href="mailto:shakir.jamaldeen@gmail.com">shakir.jamaldeen@gmail.com</a>
                    <a class="text-[15px] text-on-surface-variant hover:text-black transition-colors" href="tel:+94777536266">+94 77 753 6266</a>
                </div>
                <div class="flex flex-col gap-5">
                    <span class="uppercase font-bold tracking-[0.2em] text-[13px] text-on-surface">Social</span>
                    <div class="flex flex-col gap-3 text-[15px] text-on-surface-variant">
                        <a class="hover:text-black transition-colors" href="https://www.instagram.com/shakir.jamaldeen/" rel="noopener" target="_blank">Instagram</a>
                        <a class="hover:text-black transition-colors" href="https://www.facebook.com/shakirjamaldeenphoto" rel="noopener" target="_blank">Facebook</a>
                        <a class="hover:text-black transition-colors" href="https://www.behance.net/ShakirJamaldeen" rel="noopener" target="_blank">Behance</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-black/10 gap-6">
            <p class="uppercase tracking-[0.12em] text-[12px] text-on-surface-variant">
                © 2026 Shakir Jamaldeen Photography. All rights reserved.
            </p>
        </div>
    </div>
</footer>

<script src="js/gallery-data.js"></script>
<script>
    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

    // Lightbox
    const lb = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbTitle = document.getElementById('lbTitle');
    const lbCounter = document.getElementById('lbCounter');
    let currentSlug = null;
    let currentIdx = 0;

    function preload(src) { const i = new Image(); i.src = src; }

    function render() {
        const g = window.GALLERIES[currentSlug];
        if (!g) return;
        const n = g.images.length;
        currentIdx = ((currentIdx % n) + n) % n;
        lbImage.src = g.images[currentIdx];
        lbImage.alt = g.name + ' — photo ' + (currentIdx + 1) + ' of ' + n;
        lbTitle.textContent = g.name;
        lbCounter.textContent = String(currentIdx + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
        preload(g.images[(currentIdx + 1) % n]);
        preload(g.images[(currentIdx - 1 + n) % n]);
    }

    function openLightbox(slug, start) {
        currentSlug = slug;
        currentIdx = start || 0;
        lb.classList.remove('hidden');
        lb.classList.add('flex');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        render();
    }

    function closeLightbox() {
        lb.classList.add('hidden');
        lb.classList.remove('flex');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lbImage.src = '';
    }

    document.querySelectorAll('[data-gallery]').forEach(el => {
        el.addEventListener('click', () => openLightbox(el.dataset.gallery, parseInt(el.dataset.start || '0', 10)));
    });
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', () => { currentIdx--; render(); });
    document.getElementById('lbNext').addEventListener('click', () => { currentIdx++; render(); });
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target === lb.firstElementChild) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (lb.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') { currentIdx--; render(); }
        else if (e.key === 'ArrowRight') { currentIdx++; render(); }
    });

    // If the page is restored from the back/forward cache (e.g. user came back
    // via a homepage card link), make sure a stale lightbox never blocks the view.
    window.addEventListener('pageshow', (e) => { if (e.persisted) closeLightbox(); });

    // Basic swipe support
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) { currentIdx += dx < 0 ? 1 : -1; render(); }
        touchX = null;
    }, { passive: true });
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "..", "portfolio.html"), html);
console.log("portfolio.html regenerated:", manifest.length, "sections + lightbox");

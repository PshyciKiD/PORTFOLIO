// Vercel Web Analytics & Speed Insights
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };

console.log("%c Cyronix Dev & Security — Built by Akbar M A", "color:#C9A84C;font-size:14px;font-weight:bold;background:#08090E;padding:10px;border:1px solid #C9A84C;");

// Always start at top on load (for animation impact)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (window.location.hash) {
            history.replaceState('', document.title, window.location.pathname + window.location.search);
        }
    }, 100);
});

// ── Navigation: active state + smooth scroll ──────────────────────────────
const sections  = document.querySelectorAll('section');
const navLinks  = document.querySelectorAll('.nav-links a');
const nav       = document.querySelector('.soc-nav');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navLinksContainer = document.getElementById('nav-links');
                const hamburger = document.getElementById('nav-hamburger');
                if (navLinksContainer?.classList.contains('open')) {
                    navLinksContainer.classList.remove('open');
                    if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= (section.offsetTop - section.clientHeight / 3)) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
    });
    nav.style.background = scrollY > 50 ? 'rgba(7, 9, 15, 0.97)' : 'rgba(7, 9, 15, 0.75)';
    nav.style.boxShadow  = scrollY > 50 ? '0 4px 6px -1px rgba(0,0,0,0.5)' : 'none';
}, { passive: true });

// ── Intersection Observer: fade-in-up ────────────────────────────────────
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
}, { rootMargin: '0px', threshold: 0.12 });

document.querySelectorAll('#home .fade-in-up').forEach(el => el.classList.add('visible'));
document.querySelectorAll('.fade-in-up').forEach(el => {
    if (!el.closest('#home')) observer.observe(el);
});

// ── Copy to clipboard ────────────────────────────────────────────────────
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btnElement.querySelector('i');
        const orig = icon.className;
        icon.className = 'fa-solid fa-check';
        icon.style.color = 'var(--ac)';
        setTimeout(() => { icon.className = orig; icon.style.color = ''; }, 2000);
    }).catch(() => {});
}
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() { copyToClipboard(this.dataset.copy, this); });
});

// ── Text Scramble Engine ─────────────────────────────────────────────────
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#_0123456789ABCDEF';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length  = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from  = oldText[i] || '';
            const to    = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end   = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '', complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) { complete++; output += to; }
            else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; }
                output += `<span class="soc-accent">${char}</span>`;
            } else { output += from; }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) this.resolve();
        else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
    }
    randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}

const scrambleEl = document.getElementById('scramble-text');
if (scrambleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fx = new TextScramble(scrambleEl);
    setTimeout(() => fx.setText(scrambleEl.getAttribute('data-value')), 800);
}

// ── Hero Typewriter ───────────────────────────────────────────────────────
const typewriterEl = document.getElementById('typewriter-text');
if (typewriterEl) {
    const phrases = [
        'Founder & CEO — Cyronix Dev & Security',
        'Cybersecurity Professional — Dubai, UAE',
        'Penetration Tester & Security Researcher',
        'CEH Certified · OWASP · Red Teamer',
        'Building what I can defend.',
    ];
    let pIdx = 0, cIdx = 0, deleting = false, delay = 75;
    function tick() {
        const phrase = phrases[pIdx];
        typewriterEl.textContent = deleting ? phrase.substring(0, cIdx - 1) : phrase.substring(0, cIdx + 1);
        deleting ? cIdx-- : cIdx++;
        if (!deleting && cIdx === phrase.length)      { delay = 2400; deleting = true; }
        else if (deleting && cIdx === 0)              { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 350; }
        else                                          { delay = deleting ? 32 : 72; }
        setTimeout(tick, delay);
    }
    setTimeout(tick, 800);
}

// ── Download CV button ────────────────────────────────────────────────────
const downloadBtn = document.getElementById('download-cv-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        downloadBtn.style.pointerEvents = 'none';
        const originalHTML = downloadBtn.innerHTML;
        try {
            const check = await fetch('assets/resume.pdf', { method: 'HEAD' });
            if (!check.ok) throw new Error('Not found');
        } catch {
            downloadBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> CV coming soon — email me';
            setTimeout(() => { downloadBtn.innerHTML = originalHTML; downloadBtn.style.pointerEvents = 'auto'; }, 3000);
            return;
        }
        const stages = [
            '<i class="fa-solid fa-unlock-keyhole"></i> [||        ] Preparing...',
            '<i class="fa-solid fa-unlock-keyhole"></i> [|||||     ] Verifying...',
            '<i class="fa-solid fa-unlock-keyhole"></i> [||||||||| ] Almost...',
            '<i class="fa-solid fa-lock-open"></i> [||||||||||] Done!',
        ];
        let i = 0;
        const interval = setInterval(() => {
            downloadBtn.innerHTML = stages[i];
            i++;
            if (i >= stages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = 'assets/resume.pdf';
                    a.download = 'Akbar_MA_Cyronix_Resume.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => { downloadBtn.innerHTML = originalHTML; downloadBtn.style.pointerEvents = 'auto'; }, 2000);
                }, 500);
            }
        }, 300);
    });
}

// ── Career Evolution: staggered scroll activation ─────────────────────────
const evolutionTrack = document.querySelector('.evolution-track');
if (evolutionTrack) {
    const evoStages = evolutionTrack.querySelectorAll('.evo-stage');
    new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            evolutionTrack.classList.add('evo-animated');
            evoStages.forEach((stage, i) => setTimeout(() => stage.classList.add('stage-live'), i * 450));
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1 }).observe(evolutionTrack);
}

// ── Scroll progress bar ───────────────────────────────────────────────────
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const st = document.documentElement.scrollTop;
        const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = ((st / sh) * 100) + '%';
    }, { passive: true });
}

// ── Hero stats counter ────────────────────────────────────────────────────
document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let started  = false;
    new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / 1600, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        })(performance.now());
    }, { threshold: 0.5 }).observe(el);
});

// ── Skill bar fill ────────────────────────────────────────────────────────
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        bar.classList.add('filled');
    }, { threshold: 0.2 }).observe(bar);
});

// ── Skill badge stagger entrance ──────────────────────────────────────────
document.querySelectorAll('.soc-badge-list').forEach(list => {
    list.classList.add('js-stagger');
    const badges = list.querySelectorAll('.soc-badge');
    new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        badges.forEach((b, i) => setTimeout(() => b.classList.add('badge-visible'), i * 55));
    }, { threshold: 0.2 }).observe(list);
});

// ── 3D card tilt ──────────────────────────────────────────────────────────
document.querySelectorAll('.soc-card, .bento-card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease'; });
    card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        card.style.transform = `perspective(700px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
});

// ── Magnetic CTA buttons ──────────────────────────────────────────────────
document.querySelectorAll('.soc-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.15s ease'; });
    btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
        btn.style.transform  = 'translate(0, 0)';
    });
});

// ── Back to top ───────────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', scrollY > 400), { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Contact form (Formspree) ──────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');
if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn  = contactForm.querySelector('[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled  = true;
        try {
            const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error();
            formStatus.textContent = '✓ Sent! I\'ll reply within 24h.';
            formStatus.style.color = 'var(--green)';
            contactForm.reset();
        } catch {
            formStatus.textContent = '✗ Failed — email me directly.';
            formStatus.style.color = 'var(--red)';
        }
        formStatus.classList.add('visible');
        btn.innerHTML = orig;
        btn.disabled  = false;
        setTimeout(() => formStatus.classList.remove('visible'), 7000);
    });
}

// ── Mobile hamburger ──────────────────────────────────────────────────────
const hamburger    = document.getElementById('nav-hamburger');
const navLinksList = document.getElementById('nav-links');
if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        navLinksList.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });
    navLinksList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksList.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }));
}

// ── Theme picker ──────────────────────────────────────────────────────────
document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const root = document.documentElement;
        const a = swatch.dataset.a, a2 = swatch.dataset.a2;
        root.style.setProperty('--accent',      a);
        root.style.setProperty('--accent-2',    a2);
        root.style.setProperty('--accent-grad', `linear-gradient(135deg, ${a} 0%, ${a2} 100%)`);
        root.style.setProperty('--border-focus',`${a}66`);
        root.style.setProperty('--neon-glow',   `0 0 15px ${a}33`);
    });
});

// ── Hero mouse parallax ───────────────────────────────────────────────────
(function() {
    const hero  = document.getElementById('home');
    const hText = hero?.querySelector('.hero-text-col');
    if (!hero || !hText) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hero.addEventListener('mousemove', e => {
        const { width, height, left, top } = hero.getBoundingClientRect();
        const nx = (e.clientX - left - width  / 2) / (width  / 2);
        const ny = (e.clientY - top  - height / 2) / (height / 2);
        hText.style.transform = `translate(${nx * 5}px, ${ny * 3}px)`;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
        hText.style.transform = 'translate(0,0)';
    });
})();

// ── Rich tooltips on skill badges ─────────────────────────────────────────
document.querySelectorAll('.soc-badge[title]').forEach(badge => {
    const tipText = badge.getAttribute('title');
    badge.removeAttribute('title');
    const tip = document.createElement('span');
    tip.className   = 'custom-tooltip';
    tip.textContent = tipText;
    badge.appendChild(tip);
});

// ── GSAP: Hero entrance + ScrollTrigger batches ───────────────────────────
(function() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hero entrance — split layout
    // gsap.set() fires synchronously before any CSS transition can interfere,
    // then .to() animates to an explicit target — no mid-transition opacity-read bug.
    if (!reduced) {
        gsap.set('.hero-photo-col',   { opacity: 0, x: -80 });
        gsap.set('.hero-photo-badge', { opacity: 0, y: 18 });
        gsap.set('.founder-badge',    { opacity: 0, y: 20 });
        gsap.set('.soc-subtitle',     { opacity: 0, y: 16 });
        gsap.set('#scramble-text',    { opacity: 0, y: 28 });
        gsap.set('.hero-desc',        { opacity: 0, y: 16 });
        gsap.set('.motto-row',        { opacity: 0, y: 14 });
        gsap.set('.soc-cta-group',    { opacity: 0, y: 14 });
        gsap.set('.hero-stats',       { opacity: 0, y: 12 });
        gsap.set('.hero-scroll-hint', { opacity: 0, y: 8 });

        const heroTL = gsap.timeline({
            delay: 0.15,
            onComplete() {
                // Clear transform so badge-float CSS animation can take effect
                gsap.set('.hero-photo-badge', { clearProps: 'transform' });
                gsap.set('.hero-photo-col',   { clearProps: 'x' });
            }
        });
        heroTL
            .to('.hero-photo-col',   { opacity: 1, x: 0, duration: 1.1,  ease: 'power3.out' })
            .to('.hero-photo-badge', { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
            .to('.founder-badge',    { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.65')
            .to('.soc-subtitle',     { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
            .to('#scramble-text',    { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.25')
            .to('.hero-desc',        { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
            .to('.motto-row',        { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
            .to('.soc-cta-group',    { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.2')
            .to('.hero-stats',       { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.15')
            .to('.hero-scroll-hint', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1');
    }

    if (!reduced) {
        // Experience timeline: alternating L/R entrance
        ScrollTrigger.batch('.timeline-node', {
            onEnter: batch => {
                const allNodes = gsap.utils.toArray('.timeline-node');
                batch.forEach((el, i) => {
                    el.classList.add('visible');
                    el.style.setProperty('transition', 'none', 'important');
                    const idx = allNodes.indexOf(el);
                    gsap.fromTo(el,
                        { opacity: 0, x: idx % 2 === 0 ? -38 : 38, scale: 0.97 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay: i * 0.08,
                          onComplete() { el.style.removeProperty('transition'); } }
                    );
                });
            },
            start: 'top 80%', once: true,
        });

        // Tool cards cascade in accordion
        ScrollTrigger.batch('.tool-card', {
            onEnter: batch => gsap.fromTo(batch,
                { opacity: 0, y: 22, scale: 0.93 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.45, ease: 'back.out(1.4)' }
            ),
            start: 'top 88%', once: true,
        });

        // Bento/cert cards: 3D flip entrance
        ScrollTrigger.batch('.bento-card', {
            onEnter: batch => {
                const certSection = document.getElementById('certifications');
                batch.forEach((el, i) => {
                    el.classList.add('visible');
                    el.style.setProperty('transition', 'none', 'important');
                    const isCert = certSection?.contains(el);
                    gsap.fromTo(el,
                        isCert
                            ? { opacity: 0, rotateY: -80, scale: 0.95, transformOrigin: 'center center' }
                            : { opacity: 0, y: 20, scale: 0.95 },
                        {
                            opacity: 1, rotateY: 0, y: 0, scale: 1,
                            duration: 0.48, ease: 'power2.out', delay: i * 0.07,
                            onComplete() { el.style.removeProperty('transition'); }
                        }
                    );
                });
            },
            start: 'top 85%', once: true,
        });

        // Career Evolution: pinned scroll-driven reveal
        (function() {
            const evoStages = gsap.utils.toArray('.evo-stage');
            const origin    = document.querySelector('#origin');
            if (!evoStages.length || !origin) return;
            const isMobile  = window.innerWidth < 768;
            gsap.set(evoStages, { opacity: 0, y: isMobile ? 40 : 65, scale: 0.84 });
            const connFill  = document.querySelector('.evo-connector-fill');
            if (connFill) gsap.set(connFill, { scaleX: 0, transformOrigin: 'left center' });

            if (isMobile) {
                const mobTL = gsap.timeline({ scrollTrigger: { trigger: origin, start: 'top 62%', toggleActions: 'play none none reverse' } });
                if (connFill) mobTL.to(connFill, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 0);
                evoStages.forEach((stage, i) => mobTL.to(stage, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 0.1 + i * 0.22));
                return;
            }

            const pinTL = gsap.timeline({
                scrollTrigger: { trigger: origin, start: 'top top', end: '+=900', pin: true, scrub: 0.5, anticipatePin: 1 }
            });
            if (connFill) pinTL.to(connFill, { scaleX: 1, duration: 2.8, ease: 'none' }, 0);
            evoStages.forEach((stage, i) => {
                pinTL.fromTo(stage,
                    { opacity: 0, y: 50, scale: 0.85 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)' },
                    i * 0.7
                );
                pinTL.call(() => stage.classList.add('stage-live'), [], i * 0.7 + 0.4);
            });
        })();

        // Section headings: clip-path wipe reveal
        document.querySelectorAll('.soc-section-title').forEach(titleEl => {
            if (titleEl.closest('#home')) return;
            titleEl.classList.add('gsap-clip-init');
            gsap.fromTo(titleEl,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.inOut',
                  scrollTrigger: { trigger: titleEl, start: 'top 84%', once: true } }
            );
        });

        // Timeline vertical line draw
        (function() {
            const lineEl = document.querySelector('.timeline-draw-line');
            if (!lineEl) return;
            gsap.fromTo(lineEl,
                { scaleY: 0 },
                { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.soc-timeline', start: 'top 65%', end: 'bottom 35%', scrub: 1 } }
            );
        })();

        // About cards: depth stagger
        ScrollTrigger.batch('#about .soc-card', {
            onEnter: batch => {
                batch.forEach(el => { el.classList.add('visible'); el.style.setProperty('transition', 'none', 'important'); });
                gsap.fromTo(batch,
                    { opacity: 0, y: 40, rotateX: 12 },
                    { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
                      onComplete() { batch.forEach(el => el.style.removeProperty('transition')); } }
                );
            },
            start: 'top 80%', once: true,
        });

        // Scroll velocity tilt
        (function() {
            const tiltTargets = gsap.utils.toArray('.soc-card, .bento-card, .tool-card');
            if (!tiltTargets.length) return;
            let lastTilt = 0;
            ScrollTrigger.create({
                trigger: document.body,
                start: 'top top', end: 'bottom bottom',
                onUpdate: self => {
                    const vel  = self.getVelocity();
                    const tilt = gsap.utils.clamp(-3.5, 3.5, vel * 0.0025);
                    if (Math.abs(tilt - lastTilt) < 0.08) return;
                    lastTilt = tilt;
                    gsap.to(tiltTargets, { rotateX: -tilt * 0.45, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                }
            });
            ScrollTrigger.addEventListener('scrollEnd', () => {
                gsap.to(tiltTargets, { rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
            });
        })();
    }
})();

// ── H1 periodic glitch ────────────────────────────────────────────────────
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const h1 = document.querySelector('#home h1');
    if (!h1) return;
    h1.classList.add('hero-h1-glitch');
    h1.dataset.text = h1.textContent;
    function glitch()   { h1.classList.add('glitching'); setTimeout(() => h1.classList.remove('glitching'), 340); }
    function schedule() { setTimeout(() => { glitch(); schedule(); }, 6500 + Math.random() * 7000); }
    setTimeout(schedule, 5000);
    h1.addEventListener('mouseenter', () => { if (!h1.classList.contains('glitching')) glitch(); });
})();

// ── Button ripple ─────────────────────────────────────────────────────────
document.querySelectorAll('.soc-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const wave = document.createElement('span');
        wave.className = 'btn-ripple-wave';
        wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
        this.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    });
});

// ── Timeline line draw-in ─────────────────────────────────────────────────
const socTimeline = document.querySelector('.soc-timeline');
if (socTimeline) {
    new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        socTimeline.classList.add('line-drawn');
    }, { threshold: 0.1 }).observe(socTimeline);
}

// ── Accordion toolkit ─────────────────────────────────────────────────────
(function() {
    const accordion = document.getElementById('tools-accordion');
    if (!accordion) return;

    accordion.querySelectorAll('.acc-panel').forEach(panel => {
        const header  = panel.querySelector('.acc-header');
        const body    = panel.querySelector('.acc-body');
        if (!header || !body) return;

        header.addEventListener('click', () => {
            const isOpen = panel.classList.contains('open');

            // Close all
            accordion.querySelectorAll('.acc-panel.open').forEach(p => {
                p.classList.remove('open');
                p.querySelector('.acc-header')?.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked panel
            if (!isOpen) {
                panel.classList.add('open');
                header.setAttribute('aria-expanded', 'true');

                // Animate newly visible tool cards
                if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    const cards = body.querySelectorAll('.tool-card');
                    gsap.fromTo(cards,
                        { opacity: 0, y: 16, scale: 0.94 },
                        { opacity: 1, y: 0, scale: 1, stagger: 0.055, duration: 0.4, ease: 'back.out(1.4)' }
                    );
                }
            }
        });
    });
})();

// ── Context menu ──────────────────────────────────────────────────────────
(function() {
    const menu = document.getElementById('ctx-menu');
    if (!menu) return;
    function show(x, y) {
        const vw = window.innerWidth, vh = window.innerHeight;
        menu.style.left = Math.min(x, vw - 234) + 'px';
        menu.style.top  = Math.min(y, vh - 230) + 'px';
        menu.classList.add('visible');
    }
    function hide() { menu.classList.remove('visible'); }
    document.addEventListener('contextmenu', e => { e.preventDefault(); show(e.clientX, e.clientY); });
    document.addEventListener('click',  hide);
    document.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    document.getElementById('ctx-copy-url')?.addEventListener('click', () => { navigator.clipboard.writeText(window.location.href).catch(()=>{}); hide(); });
    document.getElementById('ctx-download-cv')?.addEventListener('click', () => { document.getElementById('download-cv-btn')?.click(); hide(); });
    document.getElementById('ctx-view-source')?.addEventListener('click', () => { window.open('view-source:' + window.location.href, '_blank'); hide(); });
    document.getElementById('ctx-shortcuts')?.addEventListener('click', () => { document.getElementById('shortcuts-modal')?.classList.add('visible'); hide(); });
    document.getElementById('ctx-contact')?.addEventListener('click', () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); hide(); });
})();

// ── Keyboard shortcuts modal ──────────────────────────────────────────────
(function() {
    const modal    = document.getElementById('shortcuts-modal');
    const closeBtn = document.getElementById('close-shortcuts');
    if (!modal) return;
    const open  = () => modal.classList.add('visible');
    const close = () => modal.classList.remove('visible');
    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    let gPressed = false, gTimer;
    document.addEventListener('keydown', e => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === '?')  { modal.classList.toggle('visible'); return; }
        if (e.key === 'Escape') { close(); return; }
        if (e.key.toLowerCase() === 'g') {
            gPressed = true;
            clearTimeout(gTimer);
            gTimer = setTimeout(() => { gPressed = false; }, 1000);
            return;
        }
        if (gPressed) {
            gPressed = false;
            const map = { h: 'home', p: 'projects', e: 'experience', c: 'contact', t: 'tools', a: 'about', s: 'freelance' };
            const target = map[e.key.toLowerCase()];
            if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
})();

// ── Expandable experience bullet lists ────────────────────────────────────
document.querySelectorAll('.experience-card .soc-list').forEach(list => {
    const items = Array.from(list.querySelectorAll(':scope > li'));
    if (items.length <= 2) return;
    const group = document.createElement('div');
    group.className = 'expand-group';
    items.slice(2).forEach(li => group.appendChild(li));
    list.appendChild(group);
    const toggle = document.createElement('button');
    toggle.className = 'expand-toggle';
    toggle.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Show more';
    toggle.addEventListener('click', () => {
        const isOpen = group.classList.toggle('expanded');
        toggle.classList.toggle('open', isOpen);
        toggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-chevron-up"></i> Show less'
            : '<i class="fa-solid fa-chevron-down"></i> Show more';
        if (isOpen && window.gsap) {
            gsap.fromTo(Array.from(group.querySelectorAll('li')),
                { opacity: 0, x: -12 },
                { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
            );
        }
    });
    list.appendChild(toggle);
});

// ── Profile image: scan-on-click ──────────────────────────────────────────
(function() {
    const pic = document.querySelector('#profile-pic .profile-img');
    if (!pic || !window.gsap) return;
    document.getElementById('profile-pic')?.addEventListener('click', () => {
        gsap.fromTo(pic,
            { filter: 'brightness(2) saturate(0)' },
            { filter: 'brightness(1) saturate(1)', duration: 1.6, ease: 'power2.out' }
        );
    });
})();

// ── Konami Code easter egg ────────────────────────────────────────────────
(function() {
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    document.addEventListener('keydown', e => {
        idx = (e.key === SEQ[idx]) ? idx + 1 : (e.key === SEQ[0] ? 1 : 0);
        if (idx < SEQ.length) return;
        idx = 0;
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;cursor:pointer;';
        const msg = document.createElement('div');
        msg.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;color:#C9A84C;text-align:center;padding:20px">
            <div style="font-size:2.8rem;font-weight:800;letter-spacing:-1px;text-shadow:0 0 25px #C9A84C">ACCESS GRANTED</div>
            <div style="font-size:0.9rem;opacity:0.6;margin-top:10px">↑↑↓↓←→←→BA — nice one.</div>
            <div style="font-size:0.75rem;opacity:0.4;margin-top:6px">Click to dismiss.</div>
        </div>`;
        overlay.appendChild(msg);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 420);
        });
        setTimeout(() => { overlay.style.transition = 'opacity 0.4s'; overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 420); }, 5000);
    });
})();

// ── Hero background ambient particles (gold) ──────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const NUM = 55;
    const pts = [];

    function resize() {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    function newPt() {
        return {
            x:  Math.random() * canvas.width,
            y:  canvas.height + 8,
            r:  Math.random() * 1.3 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -(Math.random() * 0.35 + 0.1),
            a:  Math.random() * 0.22 + 0.04,
        };
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    for (let i = 0; i < NUM; i++) { const p = newPt(); p.y = Math.random() * canvas.height; pts.push(p); }

    (function tick() {
        requestAnimationFrame(tick);
        if (!canvas.width) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pts.forEach((p, i) => {
            p.y += p.vy; p.x += p.vx;
            p.a -= 0.00055;
            if (p.y < -8 || p.a <= 0) pts[i] = newPt();
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,168,76,${p.a})`;
            ctx.fill();
        });
    })();
})();

// ── Cursor Spotlight ─────────────────────────────────────────────────────────
(function () {
    const el = document.getElementById('cursor-spotlight');
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) { el.style.display = 'none'; return; }

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        el.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('mouseleave', () => { el.style.opacity = '0'; });

    (function lerp() {
        cx += (mx - cx) * 0.09;
        cy += (my - cy) * 0.09;
        el.style.left = cx + 'px';
        el.style.top  = cy + 'px';
        requestAnimationFrame(lerp);
    })();
})();

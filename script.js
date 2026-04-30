// Vercel Web Analytics & Speed Insights — must run before deferred analytics scripts
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };

// SOC Easter Egg
console.log("%c [!] Intrusion Detected... Just kidding, welcome to my portfolio! Let's build something secure.", "color: #00FF41; font-size: 16px; font-weight: bold; background: #0D1117; padding: 10px; border: 1px solid #00FF41;");

// [!] FORCED_REBOOT: Ensure the page starts at the top on reload for animation impact
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Immediate scroll to top
window.scrollTo(0, 0);

// Double-down on window load to override browser hash jumping
window.addEventListener('load', () => {
    // Aggressive timeout to ensure the browser's native restoration completes first
    setTimeout(() => {
        window.scrollTo(0, 0);
        // Optional: Clear hash to prevent accidental jumps on back-navigation
        if (window.location.hash) {
            history.replaceState('', document.title, window.location.pathname + window.location.search);
        }
    }, 100);
});

// Navigation active state on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const nav = document.querySelector('.soc-nav');

window.addEventListener('scroll', () => {
    let current = '';
    
    // Determine active section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    // Handle Active Link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Frosted Glass Shrink Effect on Scroll
    if (scrollY > 50) {
        nav.style.background = 'rgba(7, 9, 15, 0.95)';
        nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.5)';
    } else {
        nav.style.background = 'rgba(7, 9, 15, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// Copy to Clipboard Utility
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btnElement.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fa-solid fa-check';
        icon.style.color = 'var(--accent)';
        setTimeout(() => {
            icon.className = originalClass;
            icon.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Copy button event delegation (replaces HTML onclick attributes)
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        copyToClipboard(this.dataset.copy, this);
    });
});

// GitHub Threat Feed (Live Data) — cached in sessionStorage to avoid 60 req/hr rate limit
async function fetchLatestGitHubActivity() {
    const threatText = document.getElementById('threat-text');
    if (!threatText) return;

    const CACHE_KEY = 'gh_activity_cache';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    // Show loading state
    threatText.innerHTML = `<span class="blink">_</span> [CONNECTING] Fetching live telemetry...`;

    // Return cached result if still fresh
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { html, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) {
                threatText.innerHTML = html;
                return;
            }
        }
    } catch (_) {}

    try {
        const response = await fetch('https://api.github.com/users/akbarma/events/public');
        if (!response.ok) throw new Error('API Rate Limited');

        const data = await response.json();
        const latestActivity = data.find(event =>
            event.type === 'PushEvent' || event.type === 'CreateEvent' || event.type === 'WatchEvent'
        );

        let html;
        if (latestActivity) {
            let repoName = latestActivity.repo.name.split('/')[1] || latestActivity.repo.name;
            let actionType = 'Modified infrastructure in';
            if (latestActivity.type === 'WatchEvent') actionType = 'Currently auditing';
            if (latestActivity.type === 'CreateEvent') actionType = 'Deployed new payload in';
            html = `[LIVE FEED] ${actionType}: <span class="soc-accent">${repoName}</span>`;
        } else {
            throw new Error('No recent activity');
        }

        threatText.innerHTML = html;
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ html, timestamp: Date.now() }));
        } catch (_) {}
    } catch (error) {
        threatText.innerHTML = `[STATUS] Currently practicing: <span class="soc-accent">Active Directory Exploitation on HTB.</span>`;
    }
}

fetchLatestGitHubActivity();

// Interactive SOC Terminal Engine
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

if (termInput && termOutput) {
    // Keep focus on input when clicking terminal
    document.getElementById('soc-terminal').addEventListener('click', () => {
        termInput.focus();
    });

    let lastCommandTime = 0;
    termInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const now = Date.now();
            if (now - lastCommandTime < 200) return;
            lastCommandTime = now;
            const command = termInput.value.trim().toLowerCase();
            termInput.value = '';
            
            // Print user command
            printToTerminal(`<span class="prompt">akbar@soc-hub:~$</span> ${command}`);

            // Process command
            switch(command) {
                case 'help':
                    printToTerminal(`<span class="soc-accent">Available commands:</span>
  <span class="soc-accent">ls</span>             — List security projects
  <span class="soc-accent">whoami</span>         — Current operator identity
  <span class="soc-accent">skills</span>         — Proficiency breakdown
  <span class="soc-accent">certs</span>          — Credentials & certifications
  <span class="soc-accent">cat contact.txt</span> — Contact information
  <span class="soc-accent">github</span>         — Open GitHub profile
  <span class="soc-accent">hire</span>           — Availability & hiring info
  <span class="soc-accent">nmap</span>           — Network scan demo
  <span class="soc-accent">scan</span>           — Security surface scan
  <span class="soc-accent">ping</span>           — Connectivity check
  <span class="soc-accent">uname -a</span>       — System information
  <span class="soc-accent">date</span>           — Current timestamp
  <span class="soc-accent">clear</span>          — Clear terminal`);
                    break;

                case 'ls':
                    printToTerminal(`<ul class="term-list" style="margin-top: 8px; margin-bottom: 0;">
                        <li><i class="fa-solid fa-file-pdf file-icon" style="min-width: 25px;"></i> <a href="assets/vulnerability-assessment-report.pdf" target="_blank" class="term-link">vulnerability-assessment-report.pdf</a></li>
                        <li><i class="devicon-nextjs-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">secure-ecommerce-platform.v1</span> <span style="color: #58a6ff; font-size: 0.8rem;">[ JWT Auth · OWASP-Hardened ]</span></li>
                        <li><i class="devicon-react-original file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">banking-dashboard-ui</span> <span style="color: #f85149; font-size: 0.8rem;">[ OWASP Top 10 Protected ]</span></li>
                        <li><i class="devicon-python-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">automated-osint-framework.py</span></li>
                        <li><i class="devicon-bash-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">firewall_audit_log_analyzer.sh</span></li>
                    </ul>`);
                    break;

                case 'whoami':
                    printToTerminal(`uid=0(akbar) gid=0(root) groups=0(root),1000(pentesters)
<span class="soc-accent">Akbar M A</span> — IT & Cybersecurity Professional
Location: Dubai, UAE  |  Clearance: <span style="color:var(--green)">ACTIVE</span>
Role: Penetration Tester · Security Researcher · Full-Stack Dev`);
                    break;

                case 'skills':
                    printToTerminal(`<span class="soc-accent">Proficiency Matrix:</span>
  Web App Pen Testing     ████████████████████  92%
  OSINT & Threat Intel    ██████████████████░░  88%
  Network Security        █████████████████░░░  85%
  Python Automation       ████████████████░░░░  78%
  Cloud & Enterprise Sec  ██████████████░░░░░░  70%`);
                    break;

                case 'certs':
                    printToTerminal(`<span class="soc-accent">Verified Credentials:</span>
  [✓] Certified Ethical Hacker (CEH) — EC-Council
  [✓] Advanced Diploma in Cyber Defence — RedTeam Academy
  [✓] Threat Intelligence Foundation — arcX
  [✓] Security Expert — Offenso Academy
  [✓] GRC Foundations — LinkedIn Learning
  [~] TryHackMe: Top 30% Global  ·  HackTheBox: Active`);
                    break;

                case 'cat contact.txt':
                    printToTerminal(`Email:    <span class="soc-accent">akbarmayakkat11@gmail.com</span>
Phone:    <span class="soc-accent">+971-506167230</span>
LinkedIn: <span class="soc-accent">linkedin.com/in/akbarma</span>
GitHub:   <span class="soc-accent">github.com/akbarma</span>`);
                    break;

                case 'github':
                    printToTerminal(`Opening <span class="soc-accent">github.com/akbarma</span>...`);
                    setTimeout(() => window.open('https://github.com/akbarma', '_blank'), 400);
                    break;

                case 'hire':
                    printToTerminal(`<span style="color:var(--green)">[ AVAILABLE FOR HIRE ]</span>
Status: Open to full-time, contract & freelance roles
Skills: Pen Testing · Security Audits · Secure Full-Stack Dev
Base:   Dubai, UAE  (remote-friendly)
Email:  <span class="soc-accent">akbarmayakkat11@gmail.com</span>`);
                    break;

                case 'nmap': {
                    printToTerminal(`Starting Nmap 7.94 — Scanning akbarma.dev ...`);
                    const nmapLines = [
                        { d: 400,  t: `PORT     STATE   SERVICE   VERSION` },
                        { d: 750,  t: `<span style="color:var(--green)">443/tcp  open    https     nginx 1.24</span>` },
                        { d: 1000, t: `<span style="color:var(--green)">80/tcp   open    http      → 301 to 443</span>` },
                        { d: 1250, t: `<span style="color:var(--red)">22/tcp   closed  ssh</span>` },
                        { d: 1600, t: `<span class="soc-accent">Done: 2 open · 1 closed · CSP headers active · Score: A+</span>` },
                    ];
                    nmapLines.forEach(({d, t}) => setTimeout(() => { printToTerminal(t); terminalBody.scrollTop = 99999; }, d));
                    break;
                }

                case 'scan': {
                    printToTerminal(`Scanning surface: <span class="soc-accent">akbarma.dev</span>`);
                    const scanLines = [
                        { d: 300,  t: `[>] HTTP security headers ...    <span style="color:var(--green)">PASS</span>` },
                        { d: 600,  t: `[>] HSTS (max-age=63072000) ...  <span style="color:var(--green)">PASS</span>` },
                        { d: 850,  t: `[>] Content-Security-Policy ...  <span style="color:var(--green)">PASS</span>` },
                        { d: 1100, t: `[>] X-Frame-Options: DENY ...    <span style="color:var(--green)">PASS</span>` },
                        { d: 1350, t: `[>] Open redirect check ...      <span style="color:var(--green)">NONE FOUND</span>` },
                        { d: 1650, t: `<span class="soc-accent">Complete — Security score: A+ · 0 critical findings.</span>` },
                    ];
                    scanLines.forEach(({d, t}) => setTimeout(() => { printToTerminal(t); terminalBody.scrollTop = 99999; }, d));
                    break;
                }

                case 'ping':
                    printToTerminal(`PING akbarma.dev: 56 bytes of data.
64 bytes: icmp_seq=0 ttl=64 time=<span class="soc-accent">2.1 ms</span>
64 bytes: icmp_seq=1 ttl=64 time=<span class="soc-accent">1.8 ms</span>
64 bytes: icmp_seq=2 ttl=64 time=<span class="soc-accent">2.0 ms</span>
3 packets tx · 3 received · <span style="color:var(--green)">0% packet loss</span>`);
                    break;

                case 'uname -a':
                case 'uname':
                    printToTerminal(`Linux akbar-soc 6.1.0-kali #1 SMP PREEMPT x86_64 GNU/Linux
Shell: zsh 5.9  ·  Kernel: Kali Rolling  ·  Status: <span style="color:var(--green)">online</span>`);
                    break;

                case 'date':
                    printToTerminal(`<span class="soc-accent">${new Date().toUTCString()}</span>`);
                    break;

                case 'clear':
                    termOutput.innerHTML = '';
                    break;

                case '':
                    break;

                default:
                    printToTerminal(`bash: <span style="color:var(--red)">${command}</span>: command not found — try <span class="soc-accent">'help'</span>`);
            }
            // Auto scroll to bottom
            const terminalBody = document.getElementById('soc-terminal');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function printToTerminal(textHTML) {
        const p = document.createElement('div');
        p.className = 'term-line';
        p.style.whiteSpace = 'pre-wrap';
        p.style.marginBottom = '15px';
        p.innerHTML = textHTML;
        termOutput.appendChild(p);
    }
}

// Kinetic Scramble Text Engine
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\\\/[]{}—=+*^?#_0123456789ABCDEF';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="soc-accent">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const scrambleEl = document.getElementById('scramble-text');
if (scrambleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fx = new TextScramble(scrambleEl);
    const finalString = scrambleEl.getAttribute('data-value');
    // Start scramble slightly after typing effect begins
    setTimeout(() => {
        fx.setText(finalString);
    }, 800);
}

// Hero Typewriter — cycles through multiple taglines
const typewriterEl = document.getElementById('typewriter-text');
if (typewriterEl) {
    const phrases = [
        'Cybersecurity Professional — Dubai, UAE',
        'Penetration Tester & Security Researcher',
        'CEH Certified · OWASP · Red Teamer',
        'Building what I can defend.',
    ];
    let pIdx = 0, cIdx = 0, deleting = false, delay = 75;

    function tick() {
        const phrase = phrases[pIdx];
        typewriterEl.textContent = deleting
            ? phrase.substring(0, cIdx - 1)
            : phrase.substring(0, cIdx + 1);
        deleting ? cIdx-- : cIdx++;

        if (!deleting && cIdx === phrase.length) { delay = 2400; deleting = true; }
        else if (deleting && cIdx === 0)         { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 350; }
        else                                      { delay = deleting ? 32 : 72; }

        setTimeout(tick, delay);
    }
    setTimeout(tick, 800);
}

// Access Granted Decryption Mock
const downloadBtn = document.getElementById('download-cv-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        downloadBtn.style.pointerEvents = 'none';
        const originalHTML = downloadBtn.innerHTML;

        // Check the file exists before running the animation
        try {
            const check = await fetch('assets/resume.pdf', { method: 'HEAD' });
            if (!check.ok) throw new Error('Not found');
        } catch {
            downloadBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> [CV_PENDING — contact via email]';
            setTimeout(() => {
                downloadBtn.innerHTML = originalHTML;
                downloadBtn.style.pointerEvents = 'auto';
            }, 3000);
            return;
        }

        const stages = [
            '<i class="fa-solid fa-unlock-keyhole"></i> [||        ] DECRYPTING...',
            '<i class="fa-solid fa-unlock-keyhole"></i> [|||||     ] DECRYPTING...',
            '<i class="fa-solid fa-unlock-keyhole"></i> [||||||||| ] DECRYPTING...',
            '<i class="fa-solid fa-lock-open"></i> [||||||||||] ACCESS GRANTED'
        ];

        let i = 0;
        const decryptInterval = setInterval(() => {
            downloadBtn.innerHTML = stages[i];
            i++;
            if (i >= stages.length) {
                clearInterval(decryptInterval);
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = 'assets/resume.pdf';
                    a.download = 'Akbar_M_A_Resume.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalHTML;
                        downloadBtn.style.pointerEvents = 'auto';
                    }, 2000);
                }, 500);
            }
        }, 300);
    });
}

// Canvas Data Node Network Topology
const canvas = document.getElementById('network-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let particles = [];
    const mouse = { x: null, y: null };
    
    // Config
    const maxParticles = 80;
    const connectionDistance = 150;
    const mouseConnectionDistance = 200;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    // For mobile, clear mouse so it doesn't stay dragged at bottom
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = 1.5;
        }
        
        update() {
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
            this.x += this.vx;
            this.y += this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    let networkAnimId = null;

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 - (dist / connectionDistance) * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            if (mouse.x != null) {
                const dxm = particles[i].x - mouse.x;
                const dym = particles[i].y - mouse.y;
                const distm = Math.sqrt(dxm * dxm + dym * dym);

                if (distm < mouseConnectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - (distm / mouseConnectionDistance) * 0.1})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        networkAnimId = requestAnimationFrame(animate);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (networkAnimId) { cancelAnimationFrame(networkAnimId); networkAnimId = null; }
        } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animate();
        }
    });

    animate();
}

// Hexadecimal Margin Stream
const hexCanvas = document.getElementById('hex-stream');
if (hexCanvas) {
    const hCtx = hexCanvas.getContext('2d');
    let hWidth = hexCanvas.width = window.innerWidth;
    let hHeight = hexCanvas.height = window.innerHeight;
    
    const hexChars = "0123456789ABCDEF".split("");
    const fontSize = 16;
    let columns = Math.floor(hWidth / fontSize);
    let drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    window.addEventListener('resize', () => {
        hWidth = hexCanvas.width = window.innerWidth;
        hHeight = hexCanvas.height = window.innerHeight;
        columns = Math.floor(hWidth / fontSize);
        drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;
    });

    function drawHexBlock() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        // Very subtle erase to keep trails faint
        hCtx.fillStyle = 'rgba(7, 9, 15, 0.15)';
        hCtx.fillRect(0, 0, hWidth, hHeight);
        
        hCtx.fillStyle = 'rgba(0, 255, 65, 0.05)'; // 5% opacity matrix text
        hCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const xPos = i * fontSize;
            // Math constraint: Only draw in the outer 12% margins.
            if (xPos < hWidth * 0.12 || xPos > hWidth * 0.88) {
                const text = hexChars[Math.floor(Math.random() * hexChars.length)];
                hCtx.fillText(text, xPos, drops[i] * fontSize);
                
                if (drops[i] * fontSize > hHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
    }
    let hexIntervalId = setInterval(drawHexBlock, 65);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(hexIntervalId);
            hexIntervalId = null;
        } else if (!hexIntervalId) {
            hexIntervalId = setInterval(drawHexBlock, 65);
        }
    });
}

// Client Portal Micro-Interaction
const clientTriggers = [
    document.getElementById('client-portal-trigger'),
    document.getElementById('footer-client-trigger')
];

clientTriggers.forEach(trigger => {
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to Terminal Section
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
                
                // Trigger Terminal Warning
                setTimeout(() => {
                    if (typeof printToTerminal === 'function') {
                        printToTerminal(`<span style="color: #f85149; font-weight: bold;">[!] ACCESS_DENIED: Multi-Factor Authentication Required.</span>`);
                        printToTerminal(`<span style="color: #8b949e;">[SYSTEM] Secure session handshake failed. Target: CLIENT_PORTAL v2.4</span>`);
                        printToTerminal(`<span style="color: #8b949e;">[SYSTEM] Intrusion attempt logged from source IP: 127.0.0.1</span>`);
                    }
                }, 800);
            }
        });
    }
});

// === AEGIS // SOC Bot Implementation ===
const botTerminal = document.getElementById('bot-terminal');
const botHeader = document.getElementById('bot-header');
const botOutput = document.getElementById('bot-output');
const botInput = document.getElementById('bot-input');
const botMin = document.querySelector('.bot-min');

// AEGIS Conversation State Machine
let aegisFlow = {
    active: false,
    currentStep: 'INIT',
    userData: { name: '', email: '', phone: '', purpose: '' }
};

const sanitizeInput = (input) => {
    const maliciousPatterns = [
        /<script.*?>/gi,
        /javascript:/gi,
        /onload=/gi,
        /onerror=/gi,
        /SELECT\s+\*\s+FROM/gi,
        /DROP\s+TABLE/gi,
        /OR\s+1=1/gi,
        /--/g
    ];
    return maliciousPatterns.some(pattern => pattern.test(input));
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

if (botTerminal && botHeader && typeof gsap !== 'undefined') {
    // Initialize Draggable
    if (typeof Draggable !== 'undefined') {
        Draggable.create(botTerminal, {
            handle: botHeader,
            bounds: window,
            inertia: true
        });
    }

    // Minimize Toggle
    botMin.addEventListener('click', () => {
        botTerminal.classList.toggle('minimized');
        botMin.innerText = botTerminal.classList.contains('minimized') ? '+' : '-';
    });

    // Mechanical Typing Utility
    async function printToBot(text, type = 'INFO', isHTML = false) {
        const line = document.createElement('div');
        line.className = 'bot-line';
        const prefix = `<span class="soc-accent">[${type}]</span> `;
        line.innerHTML = prefix;
        botOutput.appendChild(line);

        // Auto-scroll bot body
        const botBody = document.querySelector('.bot-body');
        
        let i = 0;
        return new Promise((resolve) => {
            if (isHTML) {
                line.innerHTML = prefix + text;
                botBody.scrollTop = botBody.scrollHeight;
                resolve();
                return;
            }

            function typeChar() {
                if (i < text.length) {
                    line.innerHTML = prefix + text.substring(0, i + 1);
                    i++;
                    botBody.scrollTop = botBody.scrollHeight;
                    const delay = Math.random() * 30 + 15;
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            }
            typeChar();
        });
    }

    // AEGIS Interaction Engine
    const advanceAegisFlow = async (input = '') => {
        if (input && sanitizeInput(input)) {
            await printToBot('WARNING: Sanitization failure. Malicious payload detected. Input rejected. Try again, human.', '!');
            return;
        }

        switch(aegisFlow.currentStep) {
            case 'INIT':
                aegisFlow.active = true;
                aegisFlow.currentStep = 'NAME';
                await printToBot('[!] SECURE_UPLINK_ESTABLISHED. Initializing Identity Verification Protocol...', 'SYS');
                await printToBot('Declare your identity (Full Name/Organization):', 'INPUT');
                break;

            case 'NAME':
                aegisFlow.userData.name = input;
                aegisFlow.currentStep = 'EMAIL';
                await printToBot(`Identity Confirmed: ${input}`, 'LOG');
                await printToBot('Provide a secure comms channel (Email):', 'INPUT');
                break;

            case 'EMAIL':
                if (!validateEmail(input)) {
                    await printToBot('ERROR: Invalid data format. Provide a valid email address.', 'ERR');
                    return;
                }
                aegisFlow.userData.email = input;
                aegisFlow.currentStep = 'PHONE';
                await printToBot(`Comms established: ${input}`, 'LOG');
                await printToBot('Direct line (Phone Number) [Optional - Type "SKIP"]:', 'INPUT');
                break;

            case 'PHONE':
                aegisFlow.userData.phone = input;
                aegisFlow.currentStep = 'PURPOSE';
                await printToBot(`Contact logged.`, 'LOG');
                await printToBot('Define Mission Objective (Purpose of Visit):', 'SELECT');
                
                // Inject Buttons
                const btnContainer = document.createElement('div');
                btnContainer.className = 'bot-btn-container';
                const missions = [
                    { id: 'OP_RECRUIT', label: '[OP_RECRUIT]' },
                    { id: 'OP_FREELANCE', label: '[OP_FREELANCE]' },
                    { id: 'OP_NETWORKING', label: '[OP_NETWORKING]' },
                    { id: 'OP_OTHER', label: '[OP_OTHER]' }
                ];
                
                missions.forEach(m => {
                    const btn = document.createElement('button');
                    btn.className = 'bot-btn';
                    btn.innerText = m.label;
                    btn.onclick = () => {
                        aegisFlow.userData.purpose = m.id;
                        finalizeAegisFlow();
                    };
                    btnContainer.appendChild(btn);
                });
                botOutput.appendChild(btnContainer);
                document.querySelector('.bot-body').scrollTop = document.querySelector('.bot-body').scrollHeight;
                break;
        }
    };

    const finalizeAegisFlow = async () => {
        aegisFlow.currentStep = 'COMPLETE';
        botInput.disabled = true;
        botInput.placeholder = "Session Terminating...";
        
        await printToBot(`Mission Code Locked: ${aegisFlow.userData.purpose}`, 'SYS');
        await printToBot('ENCRYPTING DATA_PACKET...', 'LOG');
        await printToBot('TRANSMITTING TO AKBAR_MA... SUCCESS.', 'LOG');
        await printToBot('[SUCCESS] Secure session terminated. Standby for follow-up.', 'INFO');
        
        // Reset after delay
        setTimeout(() => {
            aegisFlow.active = false;
            aegisFlow.currentStep = 'INIT';
            aegisFlow.userData = { name: '', email: '', phone: '', purpose: '' };
            botInput.disabled = false;
            botOutput.innerHTML = '';
            botInput.placeholder = "Type command...";
            printToBot('AEGIS // SOC_ASSISTANT: System Ready. Type "hire" to start onboarding.', 'INFO');
        }, 5000);
    };

    // Passive Mode: Scroll Tracking
    let lastSection = '';
    const sectionLogs = {
        'home': 'System standby. Monitoring initial handshake...',
        'about': 'Verifying professional identity signatures...',
        'projects': 'Accessing secure project_metadata repository...',
        'experience': 'Scanning professional_history.log for metrics...',
        'freelance': 'Analyzing freelance_ops and service_tiers...',
        'certifications': 'Validating EC-Council credentials... [MATCH FOUND]',
        'contact': 'Initializing secure_comms channel 80/443...'
    };

    // Throttled Scroll Listener for Bot Logs
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (aegisFlow.active) return; // Don't interrupt the flow
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            let current = '';
            const scrollPos = window.scrollY;
            document.querySelectorAll('section').forEach(section => {
                const top = section.offsetTop - 300;
                const bottom = top + section.offsetHeight;
                if (scrollPos >= top && scrollPos < bottom) {
                    current = section.id;
                }
            });

            if (current && current !== lastSection && sectionLogs[current]) {
                lastSection = current;
                printToBot(sectionLogs[current], 'LOG');
            }
        }, 500);
    });

    // Active Mode: Interaction Handler
    botInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && botInput.value.trim() !== '') {
            const cmd = botInput.value.trim();
            botInput.value = '';
            
            // Print user input in flow style
            const userLine = document.createElement('div');
            userLine.className = 'bot-line';
            userLine.innerHTML = `<span style="color: #8b949e;">> ${cmd}</span>`;
            botOutput.appendChild(userLine);

            if (aegisFlow.active) {
                advanceAegisFlow(cmd);
                return;
            }

            const cleanCmd = cmd.toLowerCase();
            // Logic Switch: Easter Egg vs Assistant
            if (cleanCmd === 'sudo access' || cleanCmd === 'nmap localhost' || cleanCmd === 'system breach') {
                await printToBot('UNAUTHORIZED ACCESS ATTEMPT DETECTED.', 'WARNING');
                await printToBot('Input bypass key [0xAkbar] to continue.', 'SYS');
            } else if (cleanCmd.includes('service') || cleanCmd.includes('freelance') || cleanCmd.includes('hire') || cleanCmd.includes('contact')) {
                advanceAegisFlow();
            } else if (cleanCmd.includes('tech') || cleanCmd.includes('stack') || cleanCmd.includes('tool')) {
                await printToBot('Primary Stack: Next.js, Node.js, Python, Burp Suite, and Kali Linux. Built for production-ready security.', 'AI');
            } else if (cleanCmd === 'help') {
                await printToBot('Available: [status], [hire], [portfolio_summary], [clear].', 'SYS');
            } else if (cleanCmd === 'clear') {
                botOutput.innerHTML = '';
                await printToBot('Terminal cleared. System standing by.', 'INFO');
            } else {
                await printToBot("Processing query... I am Akbar's SOC Assistant. Would you like to view his [services] or [certifications]? Type 'hire' to connect.", 'AI');
            }
        }
    });

    // === Cyber-Ops Visual Interactions ===
const dossier = document.getElementById('dossier-preview');
const profilePic = document.getElementById('profile-pic');

// Dossier Hover Logic (Event Delegation)
if (termOutput && dossier) {
    termOutput.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('term-link') || 
            e.target.parentElement.classList.contains('term-link') || 
            (e.target.tagName === 'SPAN' && e.target.style.textDecoration === 'underline')) {
            dossier.style.display = 'block';
        }
    });

    termOutput.addEventListener('mousemove', (e) => {
        if (dossier.style.display === 'block') {
            dossier.style.left = (e.clientX + 20) + 'px';
            dossier.style.top = (e.clientY + 20) + 'px';
        }
    });

    termOutput.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('term-link') || 
            e.target.parentElement.classList.contains('term-link') || 
            (e.target.tagName === 'SPAN' && e.target.style.textDecoration === 'underline')) {
            dossier.style.display = 'none';
        }
    });
}

// Profile image fallback (replaces removed onerror= attribute)
if (profilePic) {
    const fallbackSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='%23161b22'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%238b949e' font-family='monospace' font-size='14'>profile.jpg</text></svg>";
    profilePic.addEventListener('error', function() {
        this.src = fallbackSrc;
        this.onerror = null;
    });
    if (profilePic.complete && profilePic.naturalHeight === 0) {
        profilePic.src = fallbackSrc;
    }
}

// Hero Profile Glitch Animation
if (profilePic && typeof gsap !== 'undefined') {
    const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });
    
    glitchTimeline
        .to(profilePic, { duration: 0.1, skewX: 20, ease: "power4.inOut" })
        .to(profilePic, { duration: 0.1, skewX: 0, ease: "power4.inOut" })
        .to(profilePic, { duration: 0.1, opacity: 0.5, x: 10 })
        .to(profilePic, { duration: 0.1, opacity: 1, x: 0 })
        .to(profilePic, { duration: 0.1, filter: "hue-rotate(90deg) brightness(1.5)" })
        .to(profilePic, { duration: 0.1, filter: "none" });

    // Initial load flicker
    gsap.fromTo(profilePic, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5, ease: "steps(5)" });
}

    // Initial Greeting
    setTimeout(() => {
        printToBot('AEGIS // SOC_ASSISTANT: Connection Established. Welcome, Visitor.', 'INFO');
    }, 2000);

    // Auto-Expand at Page Bottom
    let hasExpandedAtBottom = false;
    window.addEventListener('scroll', () => {
        if (!hasExpandedAtBottom && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
            hasExpandedAtBottom = true;
            if (botTerminal.classList.contains('minimized')) {
                botTerminal.classList.remove('minimized');
                botMin.innerText = '-';
                printToBot('COMPLETE_SCAN: Visitor read entire profile. AEGIS monitoring engaged.', 'LOG');
            }
        }
    });
}
// End of Bot Logic

// Career Evolution Timeline — staggered activation on scroll into view
const evolutionTrack = document.querySelector('.evolution-track');
if (evolutionTrack) {
    const evoStages = evolutionTrack.querySelectorAll('.evo-stage');

    const evoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            evolutionTrack.classList.add('evo-animated');
            evoStages.forEach((stage, i) => {
                setTimeout(() => stage.classList.add('stage-live'), i * 450);
            });
            evoObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    evoObserver.observe(evolutionTrack);
}

// ============================================================
// ENHANCED INTERACTIVE FEATURES
// ============================================================

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const st = document.documentElement.scrollTop;
        const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = ((st / sh) * 100) + '%';
    }, { passive: true });
}

// Custom Cursor (mouse-only)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top  = my + 'px';
            cursorDot.style.opacity  = '1';
            cursorRing.style.opacity = '1';
        }, { passive: true });

        (function animateRing() {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top  = ry + 'px';
            requestAnimationFrame(animateRing);
        })();

        document.querySelectorAll('a, button, .soc-btn, .soc-card, .bento-card, .evo-stage, .social-btn, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
        });

        document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
    }
}

// Hero Stats Counter Animation
document.querySelectorAll('.stat-number').forEach(el => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    let started    = false;

    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        })(performance.now());
        io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
});

// Skill Bar Fill Animation
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        bar.classList.add('filled');
        io.disconnect();
    }, { threshold: 0.2 });
    io.observe(bar);
});

// Skill Badge Stagger Entrance
document.querySelectorAll('.soc-badge-list').forEach(list => {
    list.classList.add('js-stagger');
    const badges = list.querySelectorAll('.soc-badge');
    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        badges.forEach((b, i) => setTimeout(() => b.classList.add('badge-visible'), i * 55));
        io.disconnect();
    }, { threshold: 0.2 });
    io.observe(list);
});

// 3D Card Tilt
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

// Magnetic CTA Buttons
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

// Back to Top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Contact Form (Formspree)
const contactForm   = document.getElementById('contact-form');
const formStatus    = document.getElementById('form-status');
if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = contactForm.querySelector('[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled  = true;

        try {
            const res = await fetch(contactForm.action, {
                method:  'POST',
                body:    new FormData(contactForm),
                headers: { Accept: 'application/json' },
            });
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

// ============================================================
// NEW FEATURES BATCH 2
// ============================================================

// 1 ── Mobile hamburger menu
const hamburger   = document.getElementById('nav-hamburger');
const navLinksList = document.getElementById('nav-links');
if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        navLinksList.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });
    navLinksList.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinksList.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// 2 ── Accent colour / theme picker
document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const a  = swatch.dataset.a;
        const a2 = swatch.dataset.a2;
        const root = document.documentElement;
        root.style.setProperty('--accent',       a);
        root.style.setProperty('--accent-2',     a2);
        root.style.setProperty('--accent-grad',  `linear-gradient(135deg, ${a} 0%, ${a2} 100%)`);
        root.style.setProperty('--border-focus', `${a}66`);
        root.style.setProperty('--neon-glow',    `0 0 15px ${a}33`);
    });
});

// 3 ── Live Dubai time clock
function updateClock() {
    const el = document.getElementById('clock-time');
    if (!el) return;
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
    el.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');
}
updateClock();
setInterval(updateClock, 1000);

// 4 ── Mouse parallax on hero
(function() {
    const hero    = document.getElementById('home');
    const hContent = hero?.querySelector('.hero-content');
    const hImage   = hero?.querySelector('.hero-image-wrapper');
    if (!hero || !hContent || !hImage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.addEventListener('mousemove', e => {
        const { width, height, left, top } = hero.getBoundingClientRect();
        const nx = (e.clientX - left - width  / 2) / (width  / 2);
        const ny = (e.clientY - top  - height / 2) / (height / 2);
        hContent.style.transform = `translate(${nx * -10}px, ${ny * -6}px)`;
        hImage.style.transform   = `translate(${nx *  14}px, ${ny *  9}px)`;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        hContent.style.transform = 'translate(0,0)';
        hImage.style.transform   = 'translate(0,0)';
    });
})();

// 5 ── Cursor trail particles
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const trailCanvas = document.getElementById('cursor-trail');
    if (trailCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const tCtx = trailCanvas.getContext('2d');
        let tw = trailCanvas.width  = window.innerWidth;
        let th = trailCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            tw = trailCanvas.width  = window.innerWidth;
            th = trailCanvas.height = window.innerHeight;
        }, { passive: true });

        const trail = [];
        let tmx = 0, tmy = 0;
        document.addEventListener('mousemove', e => {
            tmx = e.clientX; tmy = e.clientY;
            for (let i = 0; i < 2; i++) {
                trail.push({
                    x: tmx + (Math.random() - 0.5) * 6,
                    y: tmy + (Math.random() - 0.5) * 6,
                    r: Math.random() * 2.5 + 0.8,
                    a: 0.55,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2 - 0.4,
                    col: Math.random() > 0.45 ? '59,130,246' : '6,182,212',
                });
            }
        }, { passive: true });

        (function drawTrail() {
            tCtx.clearRect(0, 0, tw, th);
            for (let i = trail.length - 1; i >= 0; i--) {
                const p = trail[i];
                p.x += p.vx; p.y += p.vy;
                p.a -= 0.022; p.r *= 0.97;
                if (p.a <= 0) { trail.splice(i, 1); continue; }
                tCtx.beginPath();
                tCtx.arc(p.x, p.y, Math.max(p.r, 0.1), 0, Math.PI * 2);
                tCtx.fillStyle = `rgba(${p.col},${p.a.toFixed(2)})`;
                tCtx.fill();
            }
            requestAnimationFrame(drawTrail);
        })();
    }
}

// 6 ── Floating "Available for Hire" badge
const availBadge = document.getElementById('availability-badge');
if (availBadge) {
    setTimeout(() => availBadge.classList.add('visible'), 3500);
    const scrollToContact = () =>
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    availBadge.addEventListener('click',  scrollToContact);
    availBadge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') scrollToContact(); });
}

// 7 ── Text split-reveal on section headings
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.soc-section-title h2').forEach(h2 => {
        const raw = h2.textContent;
        h2.innerHTML = raw.split('').map((ch, i) =>
            ch === ' '
                ? '<span class="char" style="display:inline-block"> </span>'
                : `<span class="char" style="transition-delay:${i * 28}ms">${ch}</span>`
        ).join('');
        h2.classList.add('text-split');
        const io = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            h2.classList.add('revealed');
            io.disconnect();
        }, { threshold: 0.6 });
        io.observe(h2);
    });
}

// 8 ── Rich custom tooltips on skill badges
document.querySelectorAll('.soc-badge[title]').forEach(badge => {
    const tipText = badge.getAttribute('title');
    badge.removeAttribute('title');
    const tip = document.createElement('span');
    tip.className = 'custom-tooltip';
    tip.textContent = tipText;
    badge.appendChild(tip);
});

// 9 ── Konami Code easter egg  (↑↑↓↓←→←→BA)
(function() {
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    document.addEventListener('keydown', e => {
        idx = (e.key === SEQ[idx]) ? idx + 1 : (e.key === SEQ[0] ? 1 : 0);
        if (idx < SEQ.length) return;
        idx = 0;

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.96);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;';

        const rain = document.createElement('canvas');
        rain.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.25;';
        rain.width = window.innerWidth; rain.height = window.innerHeight;
        overlay.appendChild(rain);

        const rCtx = rain.getContext('2d');
        const cols  = Math.floor(rain.width / 14);
        const drops = Array.from({ length: cols }, () => Math.random() * rain.height / 14 | 0);
        const matrixId = setInterval(() => {
            rCtx.fillStyle = 'rgba(0,0,0,0.06)';
            rCtx.fillRect(0, 0, rain.width, rain.height);
            rCtx.fillStyle = '#00FF41'; rCtx.font = '13px monospace';
            drops.forEach((y, i) => {
                rCtx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 14, y * 14);
                if (y * 14 > rain.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }, 38);

        const msg = document.createElement('div');
        msg.innerHTML = `
            <div style="font-family:'JetBrains Mono',monospace;color:#00FF41;text-align:center;position:relative;z-index:1;padding:20px">
                <div style="font-size:2.8rem;font-weight:800;text-shadow:0 0 25px #00FF41;letter-spacing:-1px">ACCESS GRANTED</div>
                <div style="font-size:0.9rem;opacity:0.65;margin-top:10px">↑↑↓↓←→←→BA — nice one, you found it.</div>
                <div style="font-size:0.75rem;opacity:0.4;margin-top:6px">Real hackers always check the source.</div>
            </div>`;
        overlay.appendChild(msg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            clearInterval(matrixId);
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 420);
        });
        setTimeout(() => {
            clearInterval(matrixId);
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 420);
        }, 5000);
    });
})();

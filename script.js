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
        nav.style.background = 'rgba(13, 17, 23, 0.95)';
        nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.5)';
    } else {
        nav.style.background = 'rgba(13, 17, 23, 0.9)';
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
                    printToTerminal(`Available commands:
  <span class="soc-accent">ls</span>       - List security projects
  <span class="soc-accent">whoami</span>   - View current user identity
  <span class="soc-accent">cat contact.txt</span> - View contact information
  <span class="soc-accent">clear</span>    - Clear terminal output`);
                    break;
                case 'ls':
                    printToTerminal(`<ul class="term-list" style="margin-top: 10px; margin-bottom: 0;">
                        <li><i class="fa-solid fa-file-pdf file-icon" style="min-width: 25px;"></i> <a href="assets/vulnerability-assessment-report.pdf" target="_blank" class="term-link">vulnerability-assessment-report.pdf</a></li>
                        <li><i class="devicon-nextjs-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">secure-ecommerce-platform.v1</span> <span style="color: #58a6ff; font-size: 0.8rem;">[ Integrated JWT Auth ]</span></li>
                        <li><i class="devicon-react-original file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">banking-dashboard-ui</span> <span style="color: #f85149; font-size: 0.8rem;">[ OWASP Top 10 Protected ]</span></li>
                        <li><i class="devicon-python-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">automated-osint-framework.py</span></li>
                        <li><i class="devicon-bash-plain file-icon" style="min-width: 25px;"></i> <span style="text-decoration: underline;">firewall_audit_log_analyzer.sh</span></li>
                    </ul>`);
                    break;
                case 'whoami':
                    printToTerminal(`akbar_admin
Privileges: <span class="soc-accent">root</span>
Status: Penetration Tester & Security Researcher ready for deployment.`);
                    break;
                case 'cat contact.txt':
                    printToTerminal(`[TARGET COMMS LOCATED]:
Email: <span class="soc-accent">akbarmayakkat11@gmail.com</span>
Phone: <span class="soc-accent">+971-506167230</span>`);
                    break;
                case 'clear':
                    termOutput.innerHTML = '';
                    break;
                case '':
                    break;
                default:
                    printToTerminal(`bash: ${command}: command not found. Type 'help'.`);
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

// Hero Typewriter Effect
const typeText = "> Initializing System_Scan... [DONE]";
const typeElement = document.getElementById("typewriter-text");

if (typeElement) {
    let typeIndex = 0;
    typeElement.innerHTML = '';
    
    function typeWriter() {
        if (typeIndex < typeText.length) {
            typeElement.innerHTML += typeText.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
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
            ctx.fillStyle = 'rgba(0, 255, 65, 0.15)';
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
                    ctx.strokeStyle = `rgba(0, 255, 65, ${0.05 - (dist / connectionDistance) * 0.05})`;
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
                    ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 - (distm / mouseConnectionDistance) * 0.1})`;
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
        hCtx.fillStyle = 'rgba(13, 17, 23, 0.15)';
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

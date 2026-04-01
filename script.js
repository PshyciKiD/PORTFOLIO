// SOC Easter Egg
console.log("%c [!] Intrusion Detected... Just kidding, welcome to my portfolio! Let's build something secure.", "color: #00FF41; font-size: 16px; font-weight: bold; background: #0D1117; padding: 10px; border: 1px solid #00FF41;");

// [!] FORCED_REBOOT: Ensure the page starts at the top on reload for animation impact
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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
        // Change icon to checkmark momentarily
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

// GitHub Threat Feed (Live Data)
async function fetchLatestGitHubActivity() {
    const threatText = document.getElementById('threat-text');
    if (!threatText) return;
    
    try {
        const response = await fetch('https://api.github.com/users/akbarma/events/public');
        if (!response.ok) throw new Error('API Rate Limited');
        
        const data = await response.json();
        
        // Find the latest Push/Create event to show activity
        const latestActivity = data.find(event => event.type === 'PushEvent' || event.type === 'CreateEvent' || event.type === 'WatchEvent');
        
        if (latestActivity) {
            let repoName = latestActivity.repo.name.split('/')[1] || latestActivity.repo.name;
            let actionType = "Modified infrastructure in";
            
            if(latestActivity.type === 'WatchEvent') actionType = "Currently auditing";
            if(latestActivity.type === 'CreateEvent') actionType = "Deployed new payload in";
            
            threatText.innerHTML = `[LIVE FEED] ${actionType}: <span class="soc-accent">${repoName}</span>`;
        } else {
            throw new Error('No recent activity');
        }
    } catch (error) {
        // Fallback text if the API limits out or user has no recent events
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

    termInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
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
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Disable temporarily
        downloadBtn.style.pointerEvents = 'none';
        
        const originalHTML = downloadBtn.innerHTML;
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
                
                // Trigger Actual Download
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = 'assets/resume.pdf';
                    a.download = 'Akbar_M_A_Resume.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // Reset Button
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
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Only run if user prefers motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
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
            
            // Mouse Interaction Connector
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
        requestAnimationFrame(animate);
    }
    
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
    // Execution interval slow intentionally
    setInterval(drawHexBlock, 65);
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


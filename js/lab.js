/* =========================================================
   lab.js — experiments only. Does not touch script.js.
   ========================================================= */

/* ---------- 01: canvas particles, mouse-reactive ---------- */

function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    const COLORS = ["#7AA2F7", "#ff7a9c", "#8bd450", "#f7c948"];
    const mouse = { x: -999, y: -999 };

    function resize() {
        w = canvas.width = canvas.clientWidth;
        h = canvas.height = canvas.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });

    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    function tick() {
        ctx.clearRect(0, 0, w, h);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 70) {
                p.x += (dx / dist) * 1.2;
                p.y += (dy / dist) * 1.2;
            }

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 90) {
                    ctx.strokeStyle = `rgba(122,162,247,${1 - d / 90})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(tick);
    }
    tick();
}

/* ---------- 02: 3D tilt cards ---------- */

function initTiltCards() {
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 18}deg) scale(1.03)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateY(0) rotateX(0) scale(1)";
        });
    });
}

/* ---------- 03: pixel-dissolve page transition demo ---------- */

function initTransitionDemo() {
    const grid = document.getElementById("transition-grid");
    const panel = document.getElementById("transition-panel");
    const btnA = document.getElementById("transition-btn-a");
    const btnB = document.getElementById("transition-btn-b");
    if (!grid || !panel) return;

    const CELLS = 60;
    for (let i = 0; i < CELLS; i++) {
        const span = document.createElement("span");
        grid.appendChild(span);
    }
    const cells = Array.from(grid.children);

    function dissolve(nextHtml) {
        const order = cells.slice().sort(() => Math.random() - 0.5);
        order.forEach((cell, i) => {
            cell.style.transition = "none";
            cell.style.transform = "scale(0)";
            setTimeout(() => {
                cell.style.transition = "transform 140ms steps(3)";
                cell.style.transform = "scale(1)";
            }, i * 6);
        });

        setTimeout(() => { panel.innerHTML = nextHtml; }, CELLS * 6 * 0.55);

        setTimeout(() => {
            order.forEach((cell, i) => {
                setTimeout(() => {
                    cell.style.transition = "transform 140ms steps(3)";
                    cell.style.transform = "scale(0)";
                }, i * 5);
            });
        }, CELLS * 6 * 0.65);
    }

    btnA?.addEventListener("click", () => dissolve('<div class="transition-demo__panel"><b>view A</b>this is the panel you started on</div>'));
    btnB?.addEventListener("click", () => dissolve('<div class="transition-demo__panel"><b>view B</b>pixel-dissolved into a new one</div>'));
}

/* ---------- 05: fake terminal ---------- */

function initTerminal() {
    const log = document.getElementById("lab-terminal-log");
    const input = document.getElementById("lab-terminal-input");
    if (!log || !input) return;

    const RESPONSES = {
        help: "commands: whoami, projects, meow, clear, sudo",
        whoami: "nekozami — building small tools, mostly for Discord.",
        projects: "pageify, snippetvault, qr generator, age calculator. see /#projects",
        meow: "🐾 meow.",
        sudo: "nice try.",
        clear: null // handled specially
    };

    function print(text, isCmd = false) {
        const line = document.createElement("div");
        line.className = "lab-terminal__line" + (isCmd ? " lab-terminal__line--cmd" : "");
        line.textContent = text;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }

    input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        const raw = input.value.trim();
        if (!raw) return;
        print(raw, true);
        input.value = "";

        const cmd = raw.toLowerCase();
        if (cmd === "clear") {
            log.innerHTML = "";
            return;
        }
        print(RESPONSES[cmd] || `command not found: ${raw} — try "help"`);
    });
}

/* ---------- 06: konami-code easter egg ---------- */

function initEasterEgg() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];
    let pos = 0;

    window.addEventListener("keydown", (e) => {
        pos = (e.key === seq[pos]) ? pos + 1 : 0;
        if (pos === seq.length) {
            pos = 0;
            catRain();
        }
    });

    function catRain() {
        const wrap = document.createElement("div");
        wrap.className = "cat-rain";
        document.body.appendChild(wrap);
        for (let i = 0; i < 24; i++) {
            const cat = document.createElement("span");
            cat.textContent = "🐱";
            cat.style.left = Math.random() * 100 + "vw";
            cat.style.animationDuration = 2 + Math.random() * 1.5 + "s";
            cat.style.animationDelay = Math.random() * 0.6 + "s";
            wrap.appendChild(cat);
        }
        setTimeout(() => wrap.remove(), 4000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    initTiltCards();
    initTransitionDemo();
    initTerminal();
    initEasterEgg();
});
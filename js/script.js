const GITHUB_USERNAME = "NEKOZAM-I";

// subtle cursor-tracking spotlight per card — a soft glow that follows
// the mouse, instead of the numbered badges.
function initSpotlight() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--y", `${e.clientY - rect.top}px`);
        });
    });
}

async function loadGitHub() {
    const graph = document.getElementById("gh-graph");
    if (!graph) return;

    const chartUrl = `https://ghchart.rshah.org/7AA2F7/${GITHUB_USERNAME}`;

    try {
        const res = await fetch(chartUrl);
        if (!res.ok) throw new Error("chart fetch failed");
        let svgText = await res.text();

        svgText = svgText.replace(/fill="(#fff(?:fff)?|white)"/gi, 'fill="#161616"');

        const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
        graph.src = dataUrl;
    } catch (err) {
        console.warn("Couldn't recolor GitHub graph directly, using CSS fallback.", err);
        graph.src = chartUrl;
        graph.style.filter = "invert(0.92) hue-rotate(180deg) saturate(1.4)";
    }

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error("fetch failed");
        const user = await res.json();
        document.getElementById("stat-repos").textContent = user.public_repos ?? "—";
        document.getElementById("stat-followers").textContent = user.followers ?? "—";
    } catch (err) {
        console.warn("GitHub live stats unavailable, showing placeholders.", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initSpotlight();
    loadGitHub();
});

const pet = document.querySelector(".pet");

// Create custom cursor
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let catX = mouseX;
let catY = mouseY;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

function animate() {
    // Smooth follow, offset further from the cursor so it doesn't sit on top of it
    catX += (mouseX - catX) * 0.1;
    catY += (mouseY - catY) * 0.1;

    // Face mouse direction — trails behind at a real distance instead of hugging the pointer
    const offsetX = mouseX > catX ? 46 : -46;
    pet.style.transform = `translate(${catX - 24 + offsetX}px, ${catY + 40}px) scaleX(${mouseX > catX ? 1 : -1})`;

    requestAnimationFrame(animate);
}

animate();

// Make custom cursor grow over interactive elements
const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, [role='button'], .project, .card, .social-link"
);

interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(2.2)";
    });

    el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
});
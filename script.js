const GITHUB_USERNAME = "NEKOZAM-I";

// subtle cursor-tracking spotlight per card — a soft glow that follows
// the mouse, instead of the numbered badges.
function initSpotlight(){
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });
}

async function loadGitHub(){
  const graph = document.getElementById("gh-graph");
  graph.src = `https://ghchart.rshah.org/7AA2F7/${GITHUB_USERNAME}`;

  try{
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) throw new Error("fetch failed");
    const user = await res.json();
    document.getElementById("stat-repos").textContent = user.public_repos ?? "—";
    document.getElementById("stat-followers").textContent = user.followers ?? "—";
  }catch(err){
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
    // Smooth follow
    catX += (mouseX - catX) * 0.1;
    catY += (mouseY - catY) * 0.1;

    // Face mouse direction
    pet.style.transform = `translate(${catX - 24}px, ${catY - 20}px) scaleX(${mouseX > catX ? 1 : -1})`;

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
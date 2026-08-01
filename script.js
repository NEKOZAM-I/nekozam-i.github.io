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
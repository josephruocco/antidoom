const DEMO_ADS = [
  {
    kicker: "Mood Market Alert",
    message: "This spiral is not sponsored.",
    subtext: "A walk, a glass of water, or one decisive email would outperform this feed."
  },
  {
    kicker: "Paid Placement",
    message: "You do not need another opinion. Start.",
    subtext: "Momentum is still available. It has not gone out of stock."
  },
  {
    kicker: "Limited-Time Offer",
    message: "Your mood is being auctioned off. Close the tab.",
    subtext: "Someone is making money from your nervous system. You can leave."
  },
  {
    kicker: "Promoted by Future You",
    message: "A walk would outperform this feed.",
    subtext: "Fresh air remains embarrassingly overpowered."
  },
  {
    kicker: "Behavioral Ad",
    message: "You are 3 tabs away from feeling worse.",
    subtext: "This is your reminder that stopping counts as a skill."
  },
  {
    kicker: "Sponsored Calm",
    message: "You can log off before this gets bleak.",
    subtext: "No grand reinvention required. Just close one thing."
  },
  {
    kicker: "Attention Buyback",
    message: "Your brain has better uses than refresh-refresh-refresh.",
    subtext: "Try one small real-world action before the next scroll."
  },
  {
    kicker: "Special Offer",
    message: "Leave now and call it discipline.",
    subtext: "You do not need to consume your way into clarity."
  },
  {
    kicker: "Executive Decision",
    message: "You can stop harvesting vibes and choose a task.",
    subtext: "A tiny boring action is often the premium version of relief."
  },
  {
    kicker: "Breaking Promotion",
    message: "Close one tab and call it growth.",
    subtext: "Your nervous system does not require twelve open loops for enrichment."
  },
  {
    kicker: "Urgent Reminder",
    message: "Rest is more productive than this refresh cycle.",
    subtext: "Nobody wins the endurance contest for consuming ambient panic."
  },
  {
    kicker: "Premium Placement",
    message: "Your attention deserves a less embarrassing landlord.",
    subtext: "Reclaim five minutes and spend them somewhere with oxygen."
  },
  {
    kicker: "Family Plan Upgrade",
    message: "Call your Mom.",
    subtext: "It is a better use of your phone than whatever this is."
  }
];

const billboardRow = document.getElementById("billboardRow");
const adGrid = document.getElementById("adGrid");
const spawnOneButton = document.getElementById("spawnOne");
const shuffleGridButton = document.getElementById("shuffleGrid");
const popupTemplate = document.getElementById("popupTemplate");
const celebrationOverlay = document.getElementById("celebrationOverlay");
const celebrationReel = document.getElementById("celebrationReel");
const celebrationClose = document.getElementById("celebrationClose");

const CELEBRATION_LINES = [
  "Congratulations. You briefly defeated the machine.",
  "Your future self just regained a little leverage.",
  "Attention has been successfully rescued from nonsense.",
  "This counts as a tiny act of self-respect."
];

const POSITION_OPTIONS = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
  "center"
];

const EDUCATIONAL_URLS = [
  "https://en.wikipedia.org/wiki/Special:Random",
  "https://www.khanacademy.org/",
  "https://www.nationalgeographic.com/",
  "https://www.smithsonianmag.com/",
  "https://oyc.yale.edu/"
];

function shuffledAds() {
  return [...DEMO_ADS].sort(() => Math.random() - 0.5);
}

function randomAd() {
  return DEMO_ADS[Math.floor(Math.random() * DEMO_ADS.length)];
}

function educationalUrl() {
  return EDUCATIONAL_URLS[Math.floor(Math.random() * EDUCATIONAL_URLS.length)];
}

function renderBillboards() {
  const billboards = shuffledAds().slice(0, 4);
  billboardRow.innerHTML = "";

  for (const ad of billboards) {
    const article = document.createElement("article");
    article.className = "billboard-card";

    const tag = document.createElement("span");
    tag.className = "ad-tag";
    tag.textContent = ad.kicker;

    const h3 = document.createElement("h3");
    h3.textContent = ad.message;

    const p = document.createElement("p");
    p.textContent = ad.subtext;

    article.appendChild(tag);
    article.appendChild(h3);
    article.appendChild(p);
    billboardRow.appendChild(article);
  }
}

// One card per real extension style, so the grid showcases the actual variety.
// (Some styles override the copy with their own baked-in text via CSS.)
const STYLE_SAMPLES = [
  { style: "win98", sponsor: "Paid for by Friends of Sleep", kicker: "Sponsored Calm", message: "You can log off before this gets bleak.", subtext: "No grand reinvention required. Just close one thing." },
  { style: "neon", sponsor: "Sponsored by Going Outside", kicker: "Limited-Time Offer", message: "Your mood is being auctioned off. Close the tab.", subtext: "Someone is making money from your nervous system." },
  { style: "dos", sponsor: "Sponsored by your future self", kicker: "Promoted by Future You", message: "A walk would outperform this feed.", subtext: "Fresh air remains embarrassingly overpowered." },
  { style: "toolbar", sponsor: "A message from the Department of Enough", kicker: "Behavioral Ad", message: "You are 3 tabs away from feeling worse.", subtext: "Stopping counts as a skill." },
  { style: "bubble", sponsor: "Brought to you by Tomorrow Morning You", kicker: "Family Plan Upgrade", message: "Call your Mom.", subtext: "It is a better use of your phone than this." },
  { style: "star", sponsor: "Sponsored by your future self", kicker: "Promoted by Future You", message: "A walk would outperform this feed.", subtext: "Fresh air remains overpowered." },
  { style: "sunburst", sponsor: "Sponsored by your future self", kicker: "Paid Placement", message: "This is a highlight reel. Yours is not worse.", subtext: "You're comparing your Tuesday to someone's best day." },
  { style: "closedsign", sponsor: "Sponsored by your future self", kicker: "Notice", message: "The feed is closed. Go be a person.", subtext: "" },
  { style: "warning3d", sponsor: "Sponsored by your future self", kicker: "Alert", message: "Something is mining your focus right now.", subtext: "" },
  { style: "surgeon", sponsor: "Sponsored by your future self", kicker: "Notice", message: "", subtext: "" },
  { style: "clock", sponsor: "Sponsored by your future self", kicker: "Reminder", message: "", subtext: "" }
];

// --- overlay ads shown statically in the gallery ---
function ensureTurbulenceDefs() {
  if (document.getElementById("antidoom-turb-defs")) return;
  const holder = document.createElement("div");
  holder.id = "antidoom-turb-defs";
  holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  holder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><defs>
    <filter id="antidoom-turb-text" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" seed="0">
        <animate attributeName="seed" from="0" to="8" dur="1.4s" repeatCount="indefinite"/></feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="antidoom-turb-bg" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise" seed="0"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs></svg>`;
  document.documentElement.appendChild(holder);
}

function galleryWavy() {
  ensureTurbulenceDefs();
  const word = "FREE YOURSELF";
  const pal = ["#ed0a3f", "#ff8833", "#af593e", "#01a638", "#0066ff", "#8359a3", "#f7468a"];
  let ci = 0;
  const fill = [...word].map((ch) => ch === " " ? '<span class="antidoom-wavy-space"> </span>' : `<span style="color:${pal[ci++ % pal.length]}">${ch}</span>`).join("");
  const outline = [...word].map((ch) => ch === " " ? '<span class="antidoom-wavy-space"> </span>' : `<span>${ch}</span>`).join("");
  return `<div class="antidoom-wavy"><div class="antidoom-wavy-card"><div class="antidoom-wavy-inner"><div class="antidoom-wavy-fill">${fill}</div><div class="antidoom-wavy-outline">${outline}</div></div></div></div>`;
}
function galleryFlip() {
  const p = "LOG OFF";
  return `<div class="antidoom-flip"><div class="antidoom-flip-inner"><div class="antidoom-flip-front"><span class="antidoom-flip-text">${p}</span></div><div class="antidoom-flip-back"><span class="antidoom-flip-text">${p}</span></div></div></div>`;
}
function galleryGhost() {
  return `<div class="antidoom-ghost">YOUR ATTENTION IS FADING</div>`;
}

function renderGrid() {
  adGrid.innerHTML = "";

  for (const s of [...STYLE_SAMPLES].sort(() => Math.random() - 0.5)) {
    const card = document.createElement("div");
    card.className = "antidoom-card";
    card.setAttribute("data-style", s.style);
    card.setAttribute("role", "img");
    card.setAttribute("aria-label", `${s.style} ad style`);
    card.innerHTML = `
      <div class="antidoom-header"><span>${s.sponsor}</span><button class="antidoom-close" type="button" aria-hidden="true">&times;</button></div>
      <div class="antidoom-body">
        <div class="antidoom-kicker">${s.kicker}</div>
        <p class="antidoom-message">${s.message || "A walk would outperform this feed."}</p>
        <p class="antidoom-subtext">${s.subtext}</p>
      </div>
      <div class="antidoom-footer">
        <button class="antidoom-button antidoom-button-primary" type="button">Close this tab</button>
        <button class="antidoom-button antidoom-button-secondary" type="button">Go learn something</button>
        <button class="antidoom-button antidoom-button-snooze" type="button">Snooze 10 min</button>
      </div>`;
    // Fixed-width cell so shape cards' percentage padding resolves against the
    // card width (not the wide gallery), otherwise their text collapses.
    const cell = document.createElement("div");
    cell.className = "gallery-item";
    cell.appendChild(card);
    adGrid.appendChild(cell);
  }
}

function repositionStacks() {
  const popups = [...document.querySelectorAll(".floating-root")];
  popups.forEach((popup, index) => {
    for (let i = 0; i < 12; i += 1) {
      popup.classList.remove(`stack-${i}`);
    }
    popup.classList.add(`stack-${Math.min(index, 11)}`);
  });
}

function closePopup(root) {
  root.remove();
  repositionStacks();
}

// Spawn a REAL styled popup (random style), pinned bottom-right so it never
// covers the hero/buttons.
function spawnPopup() {
  const s = STYLE_SAMPLES[Math.floor(Math.random() * STYLE_SAMPLES.length)];
  document.querySelectorAll(".antidoom-root").forEach((p) => p.remove());

  const root = document.createElement("section");
  root.className = "antidoom-root";
  root.style.setProperty("--antidoom-rotate", `${(Math.random() * 5 - 2.5).toFixed(2)}deg`);
  root.innerHTML = `
    <div class="antidoom-card" data-style="${s.style}" role="dialog" aria-label="Example popup">
      <div class="antidoom-header"><span>${s.sponsor}</span><button class="antidoom-close" type="button" aria-label="Dismiss">&times;</button></div>
      <div class="antidoom-body">
        <div class="antidoom-kicker">${s.kicker}</div>
        <p class="antidoom-message">${s.message || "A walk would outperform this feed."}</p>
        <p class="antidoom-subtext">${s.subtext}</p>
      </div>
      <div class="antidoom-footer">
        <button class="antidoom-button antidoom-button-primary" type="button">Close this tab</button>
        <button class="antidoom-button antidoom-button-secondary" type="button">Go learn something</button>
        <button class="antidoom-button antidoom-button-snooze" type="button">Snooze 10 min</button>
      </div>
    </div>`;

  root.querySelector(".antidoom-close").addEventListener("click", () => root.remove());
  root.querySelector(".antidoom-button-snooze").addEventListener("click", () => root.remove());
  root.querySelector(".antidoom-button-primary").addEventListener("click", () => {
    root.remove();
    showCelebration();
  });
  root.querySelector(".antidoom-button-secondary").addEventListener("click", () => {
    window.location.href = educationalUrl();
  });

  document.body.appendChild(root);

  // Pin it below the hero buttons (right side) so it never covers them.
  const actions = document.querySelector(".hero-actions");
  const topY = actions ? Math.max(70, actions.getBoundingClientRect().bottom + 16) : 90;
  root.style.top = `${topY}px`;
  root.style.right = "28px";
  root.style.left = "auto";
  root.style.bottom = "auto";
}

function showCelebration() {
  celebrationReel.innerHTML = "";
  for (const line of CELEBRATION_LINES) {
    const item = document.createElement("div");
    item.className = "celebration-line";
    item.textContent = line;
    celebrationReel.appendChild(item);
  }
  celebrationOverlay.classList.remove("is-hidden");
}

function hideCelebration() {
  celebrationOverlay.classList.add("is-hidden");
}

spawnOneButton.addEventListener("click", () => spawnPopup());
shuffleGridButton.addEventListener("click", () => {
  renderGrid();
});

celebrationClose.addEventListener("click", hideCelebration);
celebrationOverlay.addEventListener("click", (event) => {
  if (event.target === celebrationOverlay) hideCelebration();
});

renderGrid();

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

// --- mockup carousel ---
(function () {
  const track = document.getElementById("carouselTrack");
  const dotsEl = document.getElementById("carouselDots");
  if (!track || !dotsEl) return;
  const count = track.children.length;
  let idx = 0;
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsEl.appendChild(dot);
  }
  function go(n) {
    idx = (n + count) % count;
    track.style.transform = `translateX(-${idx * 100}%)`;
    [...dotsEl.children].forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }
  document.getElementById("carouselNext").addEventListener("click", () => go(idx + 1));
  document.getElementById("carouselPrev").addEventListener("click", () => go(idx - 1));
  go(0);
  let timer = window.setInterval(() => go(idx + 1), 5000);
  track.parentElement.addEventListener("mouseenter", () => window.clearInterval(timer));
  track.parentElement.addEventListener("mouseleave", () => { timer = window.setInterval(() => go(idx + 1), 5000); });
})();

// Flip the AntiDoom title + tagline every couple seconds, revealing the next
// font (Comic Sans -> Georgia -> Impact) at the edge-on midpoint.
(function () {
  const logo = document.querySelector(".logo");
  const lede = document.querySelector(".lede");
  if (!logo && !lede) return;
  const fonts = [
    '"Comic Sans MS", "Comic Sans", cursive',
    'Georgia, "Times New Roman", serif',
    'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif'
  ];
  const targets = [logo, lede].filter(Boolean);
  targets.forEach((el) => { el.style.transition = "opacity 0.45s ease"; });
  let i = 0;
  function swap() {
    i = (i + 1) % fonts.length;
    targets.forEach((el) => { el.style.opacity = "0"; });
    window.setTimeout(() => {
      targets.forEach((el) => { el.style.fontFamily = fonts[i]; el.style.opacity = "1"; });
    }, 450); // swap while faded out, then fade back in
  }
  window.setInterval(swap, 2600);
})();

// Intro: bombard the page with ads on load, land on a message, one button clears.
(function () {
  function introCardHTML(s) {
    return `<div class="antidoom-card" data-style="${s.style}" role="img" aria-label="${s.style} ad">
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
      </div></div>`;
  }

  // Only the self-contained card styles: the wavy/flip/ghost overlays are far
  // wider than a scatter slot and overflow over the page chrome.
  const pool = STYLE_SAMPLES.map(introCardHTML).sort(() => Math.random() - 0.5);

  const vw = window.innerWidth, vh = window.innerHeight;
  const cols = Math.max(3, Math.round(vw / 300));
  const rows = Math.max(3, Math.round(vh / 240));
  const cellW = vw / cols, cellH = vh / rows;
  const slots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) slots.push([c, r]);
  }
  slots.sort(() => Math.random() - 0.5);
  const count = Math.min(slots.length, 20, pool.length);

  const overlay = document.createElement("div");
  overlay.id = "introSpam";
  document.body.appendChild(overlay);
  document.body.classList.add("intro-lock");

  for (let i = 0; i < count; i += 1) {
    const [c, r] = slots[i];
    const ad = document.createElement("div");
    ad.className = "intro-ad";
    ad.style.setProperty("--r", `${(Math.random() * 12 - 6).toFixed(1)}deg`);
    const left = Math.max(6, Math.min(vw - 306, c * cellW + (cellW - 300) * Math.random()));
    const top = Math.max(6, Math.min(vh - 120, r * cellH + (cellH - 160) * Math.random()));
    ad.style.left = `${left}px`;
    ad.style.top = `${top}px`;
    ad.style.animationDelay = `${i * 90}ms`;
    ad.innerHTML = pool[i % pool.length];
    overlay.appendChild(ad);
  }

  const final = document.createElement("div");
  final.className = "intro-final";
  final.innerHTML = `
    <h2>You get bombarded with ads every day</h2>
    <p>AntiDoom floods you with ones that are rooting <em>for</em> you &mdash; not against you.</p>
    <button class="intro-clear-btn" type="button">Clear the ads &rarr;</button>`;
  overlay.appendChild(final);

  function reveal() {
    overlay.classList.add("is-clearing");
    document.body.classList.remove("intro-lock");
    window.setTimeout(() => overlay.remove(), 550);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") reveal(); }
  final.querySelector(".intro-clear-btn").addEventListener("click", reveal);
  document.addEventListener("keydown", onKey);

  // Show the message once the last ad has popped in.
  window.setTimeout(() => final.classList.add("is-shown"), count * 90 + 400);
})();

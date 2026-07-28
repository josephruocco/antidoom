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

function renderGrid() {
  adGrid.innerHTML = "";

  for (const s of STYLE_SAMPLES) {
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
    adGrid.appendChild(card);
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

function spawnPopup(forcedAd) {
  const ad = forcedAd || randomAd();
  const fragment = popupTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".floating-root");
  const imageWrap = fragment.querySelector(".floating-image-wrap");
  const kicker = fragment.querySelector(".floating-kicker");
  const message = fragment.querySelector(".floating-message");
  const subtext = fragment.querySelector(".floating-subtext");
  const close = fragment.querySelector(".floating-close");
  const buttons = fragment.querySelectorAll(".floating-button");

  kicker.textContent = ad.kicker;
  message.textContent = ad.message;
  subtext.textContent = ad.subtext;

  const position = POSITION_OPTIONS[Math.floor(Math.random() * POSITION_OPTIONS.length)];
  if (position !== "bottom-right") {
    root.classList.add(`position-${position}`);
  }

  close.addEventListener("click", () => closePopup(root));
  buttons[0].addEventListener("click", () => {
    closePopup(root);
    showCelebration();
  });
  buttons[1].addEventListener("click", () => {
    window.location.href = educationalUrl();
  });

  document.querySelectorAll(".floating-root").forEach((p) => p.remove());
  document.body.appendChild(root);
  repositionStacks();
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

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
    message: "Your mood is being auctioned off. Close the app.",
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

function renderGrid() {
  adGrid.innerHTML = "";

  for (const ad of shuffledAds()) {
    const article = document.createElement("article");
    article.className = "demo-ad";

    const header = document.createElement("div");
    header.className = "demo-ad-header";
    const sponsorSpan = document.createElement("span");
    sponsorSpan.textContent = "Sponsored by your future self";
    const adLabel = document.createElement("span");
    adLabel.textContent = "Ad";
    header.appendChild(sponsorSpan);
    header.appendChild(adLabel);
    article.appendChild(header);

    const tag = document.createElement("span");
    tag.className = "ad-tag";
    tag.textContent = ad.kicker;

    const title = document.createElement("h3");
    title.className = "demo-ad-title";
    title.textContent = ad.message;

    const copy = document.createElement("p");
    copy.className = "demo-ad-copy";
    copy.textContent = ad.subtext;

    const footer = document.createElement("div");
    footer.className = "demo-ad-footer";
    const primaryBtn = document.createElement("button");
    primaryBtn.className = "demo-ad-button demo-ad-button-primary";
    primaryBtn.type = "button";
    primaryBtn.textContent = "Fair point";
    const secondaryBtn = document.createElement("button");
    secondaryBtn.className = "demo-ad-button demo-ad-button-secondary";
    secondaryBtn.type = "button";
    secondaryBtn.textContent = "Keep scrolling, I guess";
    footer.appendChild(primaryBtn);
    footer.appendChild(secondaryBtn);

    article.appendChild(tag);
    article.appendChild(title);
    article.appendChild(copy);
    article.appendChild(footer);
    adGrid.appendChild(article);
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
  renderBillboards();
  renderGrid();
});

celebrationClose.addEventListener("click", hideCelebration);
celebrationOverlay.addEventListener("click", (event) => {
  if (event.target === celebrationOverlay) hideCelebration();
});

renderBillboards();
renderGrid();
spawnPopup();

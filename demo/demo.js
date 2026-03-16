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
const positionSelect = document.getElementById("positionSelect");
const floatToggle = document.getElementById("floatToggle");
const spamToggle = document.getElementById("spamToggle");
const spamSpeed = document.getElementById("spamSpeed");
const spamSpeedValue = document.getElementById("spamSpeedValue");
const spamCount = document.getElementById("spamCount");
const spamCountValue = document.getElementById("spamCountValue");
const customKicker = document.getElementById("customKicker");
const customMessage = document.getElementById("customMessage");
const customSubtext = document.getElementById("customSubtext");
const customPhoto = document.getElementById("customPhoto");
const previewCustomButton = document.getElementById("previewCustom");
const addCustomButton = document.getElementById("addCustom");
const customStatus = document.getElementById("customStatus");
const celebrationOverlay = document.getElementById("celebrationOverlay");
const celebrationReel = document.getElementById("celebrationReel");
const celebrationClose = document.getElementById("celebrationClose");

const state = {
  position: "random",
  isFloating: false,
  spamEnabled: false,
  spamSpeed: Number(spamSpeed.value),
  spamCount: Number(spamCount.value),
  customAds: [],
  customImage: ""
};

let spamIntervalId = null;

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
  return [...allAds()].sort(() => Math.random() - 0.5);
}

function allAds() {
  return [...DEMO_ADS, ...state.customAds];
}

function renderBillboards() {
  const billboards = shuffledAds().slice(0, 4);
  billboardRow.innerHTML = "";

  for (const ad of billboards) {
    const article = document.createElement("article");
    article.className = "billboard-card";
    article.innerHTML = `
      <span class="ad-tag">${ad.kicker}</span>
      <h3>${ad.message}</h3>
      <p>${ad.subtext}</p>
    `;
    billboardRow.appendChild(article);
  }
}

function renderGrid() {
  adGrid.innerHTML = "";

  for (const ad of shuffledAds()) {
    const article = document.createElement("article");
    article.className = `demo-ad${ad.imageUrl ? " has-image" : ""}`;
    article.innerHTML = `
      <div class="demo-ad-header">
        <span>Sponsored by your future self</span>
        <span>Ad</span>
      </div>
      ${ad.imageUrl ? `<div class="demo-ad-image-wrap"><img class="demo-ad-image" src="${ad.imageUrl}" alt="Custom ad visual"></div>` : ""}
      <span class="ad-tag">${ad.kicker}</span>
      <h3 class="demo-ad-title">${ad.message}</h3>
      <p class="demo-ad-copy">${ad.subtext}</p>
      <div class="demo-ad-footer">
        <button class="demo-ad-button demo-ad-button-primary" type="button">Fair point</button>
        <button class="demo-ad-button demo-ad-button-secondary" type="button">Keep scrolling, I guess</button>
      </div>
    `;
    adGrid.appendChild(article);
  }
}

function randomAd() {
  const ads = allAds();
  return ads[Math.floor(Math.random() * ads.length)];
}

function educationalUrl() {
  return EDUCATIONAL_URLS[Math.floor(Math.random() * EDUCATIONAL_URLS.length)];
}

function applyPopupControls(root) {
  const chosenPosition =
    state.position === "random"
      ? POSITION_OPTIONS[Math.floor(Math.random() * POSITION_OPTIONS.length)]
      : state.position;

  root.classList.remove(
    "position-bottom-left",
    "position-top-right",
    "position-top-left",
    "position-center",
    "is-floating"
  );

  if (chosenPosition !== "bottom-right") {
    root.classList.add(`position-${chosenPosition}`);
  }

  if (state.isFloating) {
    root.classList.add("is-floating");
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

function openPopupCount() {
  return document.querySelectorAll(".floating-root").length;
}

function spawnPopup(forcedAd, options = {}) {
  const ad = forcedAd || randomAd();
  const fragment = popupTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".floating-root");
  const imageWrap = fragment.querySelector(".floating-image-wrap");
  const image = fragment.querySelector(".floating-image");
  const kicker = fragment.querySelector(".floating-kicker");
  const message = fragment.querySelector(".floating-message");
  const subtext = fragment.querySelector(".floating-subtext");
  const close = fragment.querySelector(".floating-close");
  const buttons = fragment.querySelectorAll(".floating-button");

  kicker.textContent = ad.kicker;
  message.textContent = ad.message;
  subtext.textContent = ad.subtext;

  if (ad.imageUrl) {
    image.src = ad.imageUrl;
    imageWrap.classList.remove("is-hidden");
  }

  close.addEventListener("click", () => closePopup(root));
  buttons[0].addEventListener("click", () => {
    closePopup(root);
    showCelebration();
  });
  buttons[1].addEventListener("click", () => {
    window.location.href = educationalUrl();
  });

  applyPopupControls(root);
  if (!options.allowMultiple) {
    document.querySelectorAll(".floating-root").forEach((popup) => popup.remove());
  }
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

function updateSpamLoop() {
  if (spamIntervalId) {
    window.clearInterval(spamIntervalId);
    spamIntervalId = null;
  }

  if (!state.spamEnabled) {
    return;
  }

  spamIntervalId = window.setInterval(() => {
    if (openPopupCount() < state.spamCount) {
      spawnPopup(null, { allowMultiple: true });
    }
  }, state.spamSpeed);
}

function readCustomAdFromForm() {
  const kicker = customKicker.value.trim() || "Custom Placement";
  const message = customMessage.value.trim();
  const subtext = customSubtext.value.trim() || "You made this ad, which is already a strong sign.";

  if (!message) {
    customStatus.textContent = "Add a headline first.";
    return null;
  }

  return {
    kicker,
    message,
    subtext,
    imageUrl: state.customImage
  };
}

function refreshShowcase() {
  renderBillboards();
  renderGrid();
}

spamSpeedValue.textContent = String(state.spamSpeed);
spamCountValue.textContent = String(state.spamCount);
positionSelect.value = state.position;

spawnOneButton.addEventListener("click", () => {
  spawnPopup();
});
shuffleGridButton.addEventListener("click", () => {
  refreshShowcase();
});

positionSelect.addEventListener("change", () => {
  state.position = positionSelect.value;
  const popup = document.querySelector(".floating-root");
  if (popup) {
    applyPopupControls(popup);
  }
});

floatToggle.addEventListener("change", () => {
  state.isFloating = floatToggle.checked;
  const popup = document.querySelector(".floating-root");
  if (popup) {
    applyPopupControls(popup);
  }
});

spamToggle.addEventListener("change", () => {
  state.spamEnabled = spamToggle.checked;
  updateSpamLoop();
});

spamSpeed.addEventListener("input", () => {
  state.spamSpeed = Number(spamSpeed.value);
  spamSpeedValue.textContent = spamSpeed.value;
  updateSpamLoop();
});

spamCount.addEventListener("input", () => {
  state.spamCount = Number(spamCount.value);
  spamCountValue.textContent = spamCount.value;
});

customPhoto.addEventListener("change", () => {
  const [file] = customPhoto.files || [];
  if (!file) {
    state.customImage = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.customImage = typeof reader.result === "string" ? reader.result : "";
    customStatus.textContent = "Photo loaded.";
  });
  reader.readAsDataURL(file);
});

previewCustomButton.addEventListener("click", () => {
  const ad = readCustomAdFromForm();
  if (!ad) {
    return;
  }

  customStatus.textContent = "Previewing custom popup.";
  spawnPopup(ad);
});

addCustomButton.addEventListener("click", () => {
  const ad = readCustomAdFromForm();
  if (!ad) {
    return;
  }

  state.customAds.unshift(ad);
  customStatus.textContent = "Custom ad added to the mix.";
  refreshShowcase();
  spawnPopup(ad);
});

celebrationClose.addEventListener("click", hideCelebration);
celebrationOverlay.addEventListener("click", (event) => {
  if (event.target === celebrationOverlay) {
    hideCelebration();
  }
});

refreshShowcase();
spawnPopup();

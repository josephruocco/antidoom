const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 2,
  maxPopupsPerPage: 4
};

const FIRST_POPUP_SCROLL_DISTANCE = 900;
const REPEAT_POPUP_SCROLL_DISTANCE = 2400;
const DISTRACTING_HOST_PATTERNS = [
  "reddit.com",
  "youtube.com",
  "x.com",
  "twitter.com",
  "instagram.com",
  "tiktok.com",
  "facebook.com",
  "news.ycombinator.com"
];

const ADS = [
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
    kicker: "Family Plan Upgrade",
    message: "Call your Mom.",
    subtext: "It is a better use of your phone than whatever this is."
  }
];

let settings = { ...DEFAULT_SETTINGS };
let popupCount = 0;
let scrollDistance = 0;
let lastScrollY = window.scrollY;
let lastPopupAt = Date.now() - DEFAULT_SETTINGS.intervalMinutes * 60 * 1000;
let snoozedUntil = 0;
let activeRoot = null;

function isDistractingSite() {
  const hostname = window.location.hostname.toLowerCase();
  return DISTRACTING_HOST_PATTERNS.some(
    (pattern) => hostname === pattern || hostname.endsWith(`.${pattern}`)
  );
}

function pickEducationalUrl() {
  const urls = [
    "https://en.wikipedia.org/wiki/Special:Random",
    "https://www.khanacademy.org/",
    "https://www.nationalgeographic.com/",
    "https://www.smithsonianmag.com/",
    "https://oyc.yale.edu/"
  ];
  return urls[Math.floor(Math.random() * urls.length)];
}

function readSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    settings = stored;
  });
}

function shouldShowPopup() {
  if (!settings.enabled) {
    return false;
  }

  if (document.visibilityState !== "visible") {
    return false;
  }

  if (Date.now() < snoozedUntil) {
    return false;
  }

  if (popupCount >= settings.maxPopupsPerPage) {
    return false;
  }

  if (activeRoot) {
    return false;
  }

  const intervalMs = settings.intervalMinutes * 60 * 1000;
  const enoughTimePassed = Date.now() - lastPopupAt >= intervalMs;
  const requiredScrollDistance =
    popupCount === 0 ? FIRST_POPUP_SCROLL_DISTANCE : REPEAT_POPUP_SCROLL_DISTANCE;
  const enoughScrolling = scrollDistance >= requiredScrollDistance;

  return enoughTimePassed && enoughScrolling;
}

function pickAd() {
  const index = Math.floor(Math.random() * ADS.length);
  return ADS[index];
}

function destroyPopup() {
  if (!activeRoot) {
    return;
  }

  activeRoot.remove();
  activeRoot = null;
}

function snoozePopups() {
  snoozedUntil = Date.now() + 10 * 60 * 1000;
  destroyPopup();
}

function requestCloseTab() {
  chrome.runtime.sendMessage({ type: "antidoom:close-current-tab" }, () => {
    if (chrome.runtime.lastError) {
      window.location.replace("about:blank");
    }
  });
}

function goLearnSomething() {
  chrome.runtime.sendMessage({ type: "antidoom:open-educational-site" }, () => {
    if (chrome.runtime.lastError) {
      window.location.href = pickEducationalUrl();
    }
  });
}

function showPopup() {
  const ad = pickAd();
  const root = document.createElement("section");
  root.className = "antidoom-root";

  root.innerHTML = `
    <div class="antidoom-card" role="dialog" aria-live="polite" aria-label="Positive interruption">
      <div class="antidoom-header">
        <span>Sponsored by your future self</span>
        <button class="antidoom-close" type="button" aria-label="Dismiss">&times;</button>
      </div>
      <div class="antidoom-body">
        <div class="antidoom-kicker">${ad.kicker}</div>
        <p class="antidoom-message">${ad.message}</p>
        <p class="antidoom-subtext">${ad.subtext}</p>
      </div>
      <div class="antidoom-footer">
        <button class="antidoom-button antidoom-button-primary" type="button" data-action="close-tab">Close this tab</button>
        <button class="antidoom-button antidoom-button-secondary" type="button" data-action="learn">Go learn something</button>
      </div>
    </div>
  `;

  const closeButton = root.querySelector(".antidoom-close");
  const closeTabButton = root.querySelector('[data-action="close-tab"]');
  const learnButton = root.querySelector('[data-action="learn"]');

  closeButton.addEventListener("click", destroyPopup);
  closeTabButton.addEventListener("click", requestCloseTab);
  learnButton.addEventListener("click", goLearnSomething);

  document.documentElement.appendChild(root);
  activeRoot = root;
  popupCount += 1;
  lastPopupAt = Date.now();
  scrollDistance = 0;

  window.setTimeout(() => {
    if (activeRoot === root) {
      destroyPopup();
    }
  }, 12000);
}

function forceShowPopup() {
  snoozedUntil = 0;
  destroyPopup();
  showPopup();
}

function onScroll() {
  const currentScrollY = window.scrollY;
  scrollDistance += Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;

  if (shouldShowPopup()) {
    showPopup();
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") {
    return;
  }

  for (const [key, change] of Object.entries(changes)) {
    settings[key] = change.newValue;
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "antidoom:show-test-popup") {
    forceShowPopup();
  }
});

window.antidoomForceShowPopup = forceShowPopup;

readSettings();

if (isDistractingSite()) {
  window.addEventListener("scroll", onScroll, { passive: true });
}

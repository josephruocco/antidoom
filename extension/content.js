const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 2,
  maxPopupsPerPage: 4,
  disabledAds: []
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

// ADS and SPONSOR_LINES come from ads.js, loaded before this script.

// Retro spam-ad style variants; one is picked at random per popup.
const AD_STYLES = ["win98", "neon", "dos", "toolbar", "star", "sunburst", "closedsign", "bubble", "warning3d", "surgeon", "clock"];

// Big ghost phrases that fade in over the page and vanish.
const FADING_PHRASES = [
  "YOUR ATTENTION IS FADING",
  "YOU ARE STILL SCROLLING",
  "TIME IS PASSING",
  "COME BACK TO YOUR LIFE",
  "THIS ISN'T REST",
  "THE FEED DOES NOT LOVE YOU"
];

const DISMISS_DELAY_MS = 3000;      // delay tax: close X + snooze locked this long
const RECEIPT_EVERY = 3;            // every Nth swarm is a time-receipt instead of ads
const RECEIPT_MIN_SECONDS = 60;     // ...only once real feed time has piled up
const WIN_WINDOW_MS = 30 * 1000;    // leave within 30s of the day's first popup = a win

let settings = { ...DEFAULT_SETTINGS };
let popupCount = 0;
let swarmCount = 0;
let scrollDistance = 0;
let lastAdMessage = "";
let lastScrollY = window.scrollY;
let lastScrollTime = 0;
let lastPopupAt = Date.now() - DEFAULT_SETTINGS.intervalMinutes * 60 * 1000;
let snoozedUntil = 0;
let doomTimerSet = false;
const activeRoots = new Set();

// Per-day counters live in storage.local (frequent writes, no sync quota needed).
const STATS_DEFAULT = { date: "", feedSeconds: 0, streak: 0, lastWinDate: "" };
let stats = { ...STATS_DEFAULT };
let lastStatsSave = 0;

function dayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function loadStats() {
  chrome.storage.local.get({ stats: STATS_DEFAULT }, ({ stats: stored }) => {
    stats = stored;
    if (stats.date !== dayStr()) {
      stats.date = dayStr();
      stats.feedSeconds = 0; // streak is intentionally NOT reset here — see recordDoom
      saveStats();
    }
    updateBadge();
  });
}

// ponytail: last-writer-wins across tabs, so two doom tabs scrolled at once
// undercount feed time. Move the counter to the service worker if that matters.
function saveStats() {
  lastStatsSave = Date.now();
  chrome.storage.local.set({ stats });
}

function updateBadge() {
  chrome.runtime.sendMessage(
    { type: "antidoom:set-badge", streak: stats.streak },
    () => void chrome.runtime.lastError
  );
}

// Left within the win window: extend the streak (once per day).
function recordWin() {
  if (stats.lastWinDate === dayStr()) {
    return;
  }
  stats.streak = stats.lastWinDate === dayStr(-1) ? stats.streak + 1 : 1;
  stats.lastWinDate = dayStr();
  saveStats();
  updateBadge();
}

// Ignored the first popup past the win window: today is a doom day, streak breaks.
function recordDoom() {
  if (stats.lastWinDate === dayStr() || stats.streak === 0) {
    return;
  }
  stats.streak = 0;
  saveStats();
  updateBadge();
}

function isDistractingSite() {
  const hostname = window.location.hostname.toLowerCase();
  return DISTRACTING_HOST_PATTERNS.some(
    (pattern) => hostname === pattern || hostname.endsWith(`.${pattern}`)
  );
}

// Fallback URL used if the background service worker is unavailable.
const FALLBACK_EDUCATIONAL_URL = "https://en.wikipedia.org/wiki/Special:Random";

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

  // Only start a new swarm once the previous one is cleared.
  if (activeRoots.size > 0) {
    return false;
  }

  const intervalMs = settings.intervalMinutes * 60 * 1000;
  const enoughTimePassed = Date.now() - lastPopupAt >= intervalMs;
  const requiredScrollDistance =
    popupCount === 0 ? FIRST_POPUP_SCROLL_DISTANCE : REPEAT_POPUP_SCROLL_DISTANCE;
  const enoughScrolling = scrollDistance >= requiredScrollDistance;

  return enoughTimePassed && enoughScrolling;
}

function hostMatches(host, pattern) {
  return host === pattern || host.endsWith(`.${pattern}`);
}

// [start, end) in local 24h time, wrapping past midnight when start > end.
function inHourRange(hour, [start, end]) {
  return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
}

function isContextual(ad) {
  return Boolean(ad.hosts || ad.hours);
}

function matchesContext(
  ad,
  hour = new Date().getHours(),
  host = window.location.hostname.toLowerCase()
) {
  if (ad.hours && !inHourRange(hour, ad.hours)) return false;
  if (ad.hosts && !ad.hosts.some((pattern) => hostMatches(host, pattern))) return false;
  return true;
}

function chooseAd(pool) {
  let ad;
  do {
    ad = pool[Math.floor(Math.random() * pool.length)];
  } while (ad.message === lastAdMessage && pool.length > 1);
  lastAdMessage = ad.message;
  return ad;
}

const CONTEXTUAL_AD_CHANCE = 0.5;

function pickAd(tier) {
  const disabled = settings.disabledAds || [];
  const usable = ADS.filter((ad) => !disabled.includes(ad.message) && matchesContext(ad));

  // Site- and time-specific ads sit outside the tier ladder: when one applies,
  // it gets a coin flip of priority over the generic escalation copy.
  const contextual = usable.filter(isContextual);
  if (contextual.length > 0 && Math.random() < CONTEXTUAL_AD_CHANCE) {
    return chooseAd(contextual);
  }

  // Otherwise prefer this tier exactly; fall back to anything at/below it.
  const generic = usable.filter((ad) => !isContextual(ad));
  let pool = generic.filter((ad) => ad.tier === tier);
  if (pool.length === 0) pool = generic.filter((ad) => ad.tier <= tier);
  if (pool.length === 0) pool = usable.length > 0 ? usable : ADS;

  return chooseAd(pool);
}

function receiptAd() {
  const mins = Math.max(1, Math.round(stats.feedSeconds / 60));
  return {
    kicker: "Itemized Receipt",
    message: `You've scrolled ~${mins} min of feed today.`,
    subtext: "That's the real number. No refund on the time — but you can stop the charge now."
  };
}

function destroyPopup(root) {
  if (!root || !activeRoots.has(root)) {
    return;
  }
  root.remove();
  activeRoots.delete(root);
}

function destroyAllPopups() {
  for (const root of [...activeRoots]) {
    destroyPopup(root);
  }
}

function snoozePopups() {
  snoozedUntil = Date.now() + 10 * 60 * 1000;
  destroyAllPopups();
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
      window.location.href = FALLBACK_EDUCATIONAL_URL;
    }
  });
}

// Short WordArt words for the spinning flip card.
const FLIP_PHRASES = ["LOG OFF", "GO OUTSIDE", "TOUCH GRASS", "WAKE UP", "BE HERE NOW", "ENOUGH"];

// Spin a 3D WordArt card over the page; it fades out and removes itself.
function showFlipCard() {
  const phrase =
    FLIP_PHRASES[Math.floor(Math.random() * FLIP_PHRASES.length)];
  const el = document.createElement("div");
  el.className = "antidoom-flip";
  el.innerHTML = `
    <div class="antidoom-flip-inner">
      <div class="antidoom-flip-front"><span class="antidoom-flip-text">${phrase}</span></div>
      <div class="antidoom-flip-back"><span class="antidoom-flip-text">${phrase}</span></div>
    </div>`;
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

// Inject the SVG turbulence filters used by the wavy WordArt (once per page).
function ensureTurbulenceDefs() {
  if (document.getElementById("antidoom-turb-defs")) {
    return;
  }
  const holder = document.createElement("div");
  holder.id = "antidoom-turb-defs";
  holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  holder.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="antidoom-turb-text" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" seed="0">
            <animate attributeName="seed" from="0" to="8" dur="1.4s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="antidoom-turb-bg" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise" seed="0" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>`;
  document.documentElement.appendChild(holder);
}

// Wavy rainbow WordArt "FREE YOURSELF" that wobbles, fades out, and self-removes.
const WAVY_PALETTE = ["#ed0a3f", "#ff8833", "#af593e", "#01a638", "#0066ff", "#8359a3", "#f7468a"];
function showWavyArt() {
  ensureTurbulenceDefs();
  const word = "FREE YOURSELF";
  const chars = [...word];
  let ci = 0;
  // Fill and outline must share identical per-letter markup so they line up
  // exactly (plain text kerns differently and the space width would drift).
  const fillSpans = chars
    .map((ch) =>
      ch === " "
        ? '<span class="antidoom-wavy-space"> </span>'
        : `<span style="color:${WAVY_PALETTE[ci++ % WAVY_PALETTE.length]}">${ch}</span>`
    )
    .join("");
  const outlineSpans = chars
    .map((ch) =>
      ch === " " ? '<span class="antidoom-wavy-space"> </span>' : `<span>${ch}</span>`
    )
    .join("");
  const el = document.createElement("div");
  el.className = "antidoom-wavy";
  el.innerHTML = `
    <div class="antidoom-wavy-card">
      <div class="antidoom-wavy-inner">
        <div class="antidoom-wavy-fill">${fillSpans}</div>
        <div class="antidoom-wavy-outline">${outlineSpans}</div>
      </div>
    </div>`;
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

// Flash a large phrase over the page that fades in and out, then removes itself.
function showFadingText() {
  const el = document.createElement("div");
  el.className = "antidoom-ghost";
  el.textContent =
    FADING_PHRASES[Math.floor(Math.random() * FADING_PHRASES.length)];
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

// Spread a burst across a shuffled 3x2 grid so popups don't pile up in one spot.
function spreadPositions(count) {
  const cols = 3;
  const rows = 2;
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push([c, r]);
    }
  }
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const hSpan = Math.max(0, window.innerWidth - 340);
  const vSpan = Math.max(0, window.innerHeight - 260);
  // Keep the swarm in the central ~55% of the viewport so it clusters near center.
  const hRegion = hSpan * 0.55;
  const vRegion = vSpan * 0.55;
  const hOffset = (hSpan - hRegion) / 2;
  const vOffset = (vSpan - vRegion) / 2;
  const hStep = hRegion / (cols - 1);
  const vStep = vRegion / (rows - 1);
  const hJitter = hStep * 0.2;
  const vJitter = vStep * 0.2;

  return cells.slice(0, count).map(([c, r]) => {
    const left = hOffset + c * hStep + (Math.random() * 2 - 1) * hJitter;
    const top = vOffset + r * vStep + (Math.random() * 2 - 1) * vJitter;
    return {
      left: Math.round(Math.min(hSpan, Math.max(8, left))),
      top: Math.round(Math.min(vSpan, Math.max(8, top))),
      rotate: (Math.random() * 6 - 3).toFixed(2)
    };
  });
}

// Classic spam behaviour: the X darts away a few times before it lets you click it.
// canClose() gates both dodging and the actual close so the delay tax can hold it shut.
function armDodgingClose(closeButton, card, onClose, canClose) {
  let dodges = 0;
  closeButton.addEventListener("mouseenter", () => {
    if (!canClose() || dodges >= 3) {
      return;
    }
    dodges += 1;
    closeButton.style.position = "absolute";
    closeButton.style.top = `${Math.floor(Math.random() * 70) + 8}%`;
    closeButton.style.left = `${Math.floor(Math.random() * 70) + 8}%`;
  });
  closeButton.addEventListener("click", () => {
    if (canClose()) onClose();
  });
}

// Drag the popup around by its title bar.
function makeDraggable(root, handle) {
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".antidoom-close")) {
      return;
    }
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parseFloat(root.style.left) || 0;
    const startTop = parseFloat(root.style.top) || 0;

    const move = (e) => {
      root.style.left = `${startLeft + e.clientX - startX}px`;
      root.style.top = `${startTop + e.clientY - startY}px`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });
}

function createPopup(pos, tier, isReceipt) {
  const ad = isReceipt ? receiptAd() : pickAd(tier);
  const style = AD_STYLES[Math.floor(Math.random() * AD_STYLES.length)];

  const root = document.createElement("section");
  root.className = "antidoom-root";
  root.style.top = `${pos.top}px`;
  root.style.left = `${pos.left}px`;
  root.style.setProperty("--antidoom-rotate", `${pos.rotate}deg`);

  root.innerHTML = `
    <div class="antidoom-card" data-style="${style}" role="dialog" aria-live="polite" aria-label="Positive interruption">
      <div class="antidoom-header">
        <span>${SPONSOR_LINES[Math.floor(Math.random() * SPONSOR_LINES.length)]}</span>
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
        <button class="antidoom-button antidoom-button-snooze" type="button" data-action="snooze">Snooze 10 min</button>
      </div>
    </div>
  `;

  const card = root.querySelector(".antidoom-card");
  const closeButton = root.querySelector(".antidoom-close");
  const closeTabButton = root.querySelector('[data-action="close-tab"]');
  const learnButton = root.querySelector('[data-action="learn"]');
  const snoozeButton = root.querySelector('[data-action="snooze"]');

  // Delay tax: the escape hatches (X + snooze) stay locked for a few seconds.
  // The good actions (close tab / go learn) work immediately.
  let dismissible = false;
  snoozeButton.disabled = true;
  closeButton.classList.add("antidoom-close-locked");
  let remaining = Math.round(DISMISS_DELAY_MS / 1000);
  closeButton.textContent = String(remaining);
  // ponytail: interval keeps ticking if popup is destroyed early; it self-clears at 0
  // and writes to a detached node harmlessly. Not worth tracking per-popup teardown.
  const countdown = window.setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      closeButton.textContent = String(remaining);
    } else {
      window.clearInterval(countdown);
      closeButton.innerHTML = "&times;";
      closeButton.classList.remove("antidoom-close-locked");
      snoozeButton.disabled = false;
      dismissible = true;
    }
  }, 1000);

  makeDraggable(root, root.querySelector(".antidoom-header"));
  armDodgingClose(closeButton, card, () => destroyPopup(root), () => dismissible);
  closeTabButton.addEventListener("click", () => { recordWin(); requestCloseTab(); }, { once: true });
  learnButton.addEventListener("click", () => { recordWin(); goLearnSomething(); }, { once: true });
  snoozeButton.addEventListener("click", snoozePopups, { once: true });

  document.documentElement.appendChild(root);
  activeRoots.add(root);
  popupCount += 1;
}

// Spawn a swarm: several popups at once, up to the max-concurrent setting.
function showPopup() {
  swarmCount += 1;
  const tier = Math.min(3, swarmCount); // gentle -> blunt as swarms accumulate this session

  // Every few swarms, drop a single time-receipt instead of the usual ad burst.
  const isReceipt =
    swarmCount % RECEIPT_EVERY === 0 && stats.feedSeconds >= RECEIPT_MIN_SECONDS;
  const remaining = settings.maxPopupsPerPage - activeRoots.size;
  const burst = isReceipt ? 1 : Math.min(remaining, 2 + Math.floor(Math.random() * 4));
  const positions = spreadPositions(burst);
  positions.forEach((pos, i) => {
    window.setTimeout(() => createPopup(pos, tier, isReceipt), i * 160);
  });
  const roll = Math.random();
  if (roll < 0.34) {
    showFadingText();
  } else if (roll < 0.67) {
    showFlipCard();
  } else {
    showWavyArt();
  }
  lastPopupAt = Date.now();
  scrollDistance = 0;

  // Streak clock: from the day's first popup, you have WIN_WINDOW_MS to leave.
  if (!doomTimerSet) {
    doomTimerSet = true;
    window.setTimeout(recordDoom, WIN_WINDOW_MS);
  }
}

function forceShowPopup() {
  snoozedUntil = 0;
  destroyAllPopups();
  popupCount = 0;
  showPopup();
}

function onScroll() {
  // Count time only while actively scrolling (gaps < 2s = one continuous session).
  const now = Date.now();
  if (lastScrollTime && now - lastScrollTime < 2000) {
    stats.feedSeconds += (now - lastScrollTime) / 1000;
    if (now - lastStatsSave > 10000) {
      saveStats();
    }
  }
  lastScrollTime = now;

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
loadStats();

if (isDistractingSite()) {
  window.addEventListener("scroll", onScroll, { passive: true });
  // Persist accumulated feed time when the tab is backgrounded or closed.
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveStats();
  });
}

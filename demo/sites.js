// Demo-only: renders mock site feeds and drops the REAL extension ad styles on top.
// Ad markup + content.css classes mirror the extension so the demo matches production.

const STYLES = [
  "win98", "neon", "dos", "toolbar", "star", "sunburst",
  "closedsign", "bubble", "warning3d", "surgeon", "clock"
];

const SPONSOR_LINES = [
  "Sponsored by your future self",
  "Brought to you by Touching Grass™",
  "Sponsored by Going Outside",
  "Paid for by Friends of Sleep",
  "Brought to you by Tomorrow Morning You"
];

// Site-appropriate copy (matches the extension's contextual ads).
const SITE_ADS = {
  facebook: {
    kicker: "On Your Mind?",
    message: "The people who matter aren't in this feed. They're a text away.",
    subtext: "Message one person you actually miss. Close this after."
  },
  reddit: {
    kicker: "Hot Posts",
    message: "You're reading strangers argue instead of living your day.",
    subtext: "None of these opinions will still matter to you by dinner."
  },
  instagram: {
    kicker: "Suggested For You",
    message: "Everyone here is performing. You're the only one watching alone.",
    subtext: "Nobody's real life looks like their grid. Not even theirs."
  },
  hn: {
    kicker: "New Comments",
    message: "Reading about building things is not building things.",
    subtext: "The tab you were supposed to be in is still open. Go back to it."
  }
};

const GENERAL_ADS = [
  { kicker: "Behavioral Ad", message: "You are 3 tabs away from feeling worse.", subtext: "This is your reminder that stopping counts as a skill." },
  { kicker: "Promoted by Future You", message: "A walk would outperform this feed.", subtext: "Fresh air remains embarrassingly overpowered." },
  { kicker: "Limited-Time Offer", message: "Your mood is being auctioned off. Close the tab.", subtext: "Someone is making money from your nervous system. You can leave." },
  { kicker: "Family Plan Upgrade", message: "Call your Mom.", subtext: "It is a better use of your phone than whatever this is." },
  { kicker: "Mood Market Alert", message: "This spiral is not sponsored.", subtext: "A walk, a glass of water, or one decisive email would outperform this feed." },
  { kicker: "Attention Buyback", message: "Your brain has better uses than refresh-refresh-refresh.", subtext: "Try one small real-world action before the next scroll." },
  { kicker: "Special Offer", message: "Leave now and call it discipline.", subtext: "You do not need to consume your way into clarity." },
  { kicker: "Sponsored Calm", message: "You can log off before this gets bleak.", subtext: "No grand reinvention required. Just close one thing." },
  { kicker: "Final Notice", message: "Still scrolling. The feed is winning.", subtext: "It does not get better further down. It never has." }
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const sponsor = () => rand(SPONSOR_LINES);

// ---------------- mock feeds ----------------
function fbPost(name, avatar, time, text, withImg) {
  return `<article class="post">
    <div class="row"><div class="avatar ${avatar}"></div>
      <div><div class="strong">${name}</div><div class="muted">${time} · 🌍</div></div></div>
    <p style="margin:10px 0 0">${text}</p>
    ${withImg ? '<div class="ph-img fb-postimg"></div>' : ""}
    <div class="fb-bar"><span>👍 Like</span><span>💬 Comment</span><span>↪ Share</span></div>
  </article>`;
}
function facebookFeed() {
  return `<div class="fb-top">
      <div class="fb-logo">Fakebook</div>
      <div class="fb-search">Search Fakebook</div>
      <div class="fb-actions"><div class="fb-pill"></div><div class="fb-pill"></div><div class="fb-pill"></div></div>
    </div>
    <div class="feed">
      ${fbPost("Mindfulness Coach 🧘", "a5", "2h", "Remember to be PRESENT today! (posted from the couch, 4th hour)", true)}
      ${fbPost("Definitely Working Rn", "a2", "3h", "10 things you won't BELIEVE are still legal to sell...", false)}
      ${fbPost("Digital Detox, Day 1", "a4", "5h", "Hot take that will definitely start an argument in the comments 🔥", true)}
      ${fbPost("Touch Grass Enthusiast", "a3", "6h", "Tag someone who needs to see this!", false)}
    </div>`;
}

function rdPost(sub, user, time, title, votes, text) {
  return `<article class="post rd-post">
    <div class="rd-vote"><div class="rd-arrow rd-up"></div>${votes}<div class="rd-arrow rd-down"></div></div>
    <div class="rd-body">
      <div class="rd-meta"><b>r/${sub}</b> · Posted by u/${user} · ${time}h ago</div>
      <div class="rd-title">${title}</div>
      <div class="muted">${text}</div>
    </div>
  </article>`;
}
function redditFeed() {
  return `<div class="rd-top"><div class="rd-snoo"></div><div class="rd-logo">Deaddit</div>
      <div class="rd-search">Search Deaddit</div></div>
    <div class="feed">
      ${rdPost("AmITheProblem", "just_5_more_min", 4, "AITA for having an opinion about something that does not affect me at all?", "4.2k", "So this happened three weeks ago and I'm still thinking about it...")}
      ${rdPost("todayiwasted", "i_should_be_working", 7, "TIW a fact that is technically true but presented to feel more surprising than it is", "18.9k", "Source: a blog that cites another blog.")}
      ${rdPost("mildlyinfuriating", "logging_off_soon", 2, "The way this thread is going to make you feel exactly nothing tomorrow", "912", "Every username is different. The argument is always the same.")}
    </div>`;
}

function igPost(user, avatar, cap) {
  return `<article class="ig-post">
    <div class="ig-head"><div class="ig-ring"><div class="avatar ${avatar}"></div></div>
      <div class="strong">${user}</div><div class="muted" style="margin-left:auto">•••</div></div>
    <div class="ig-img"></div>
    <div class="ig-actions"><span>❤️</span><span>💬</span><span>✈️</span></div>
    <div class="ig-cap"><span class="strong">${user}</span> ${cap}</div>
  </article>`;
}
function instagramFeed() {
  return `<div class="ig-top"><div class="ig-logo">Instagrim</div>
      <div class="fb-search" style="max-width:200px">Search</div></div>
    <div class="feed ig-feed">
      ${igPost("present.over.everything", "a4", "living in the moment ✨🌴 (34 min of trying to get this shot) #blessed #nofilter")}
      ${igPost("off.the.grid.4real", "a6", "digital detox retreat!! posting from the retreat. constantly. #mindful #unplugged")}
    </div>`;
}

function hnItem(rank, title, points, user, time, comments) {
  return `<div class="hn-item"><span class="hn-rank">${rank}.</span>
      <span class="hn-title"><a href="#">${title}</a></span></div>
    <div class="hn-sub">${points} points by ${user} ${time} hours ago | ${comments} comments</div>`;
}
function hnFeed() {
  return `<div class="hn-top"><div class="hn-mark">S</div>
      <div class="hn-nav"><b>Slacker News</b> new | past | comments | ask | show | jobs</div></div>
    <div class="hn-feed">
      ${hnItem(1, "Show SN: I rewrote a thing that already worked, in Rust", 412, "shipping_tomorrow", 3, 289)}
      ${hnItem(2, "Ask SN: How do you stay focused? (asks the person on Slacker News)", 233, "deepwork_daily", 5, 174)}
      ${hnItem(3, "The framework you are using is bad, actually (2019)", 908, "inbox_zero_hero", 7, 640)}
      ${hnItem(4, "A 4,000-word blog post that could have been one sentence", 156, "focused_dev", 2, 88)}
      ${hnItem(5, "Someone is wrong on the internet and it's ruining my afternoon", 77, "definitely_working", 1, 31)}
    </div>`;
}

const FEEDS = { facebook: facebookFeed, reddit: redditFeed, instagram: instagramFeed, hn: hnFeed };

let currentSite = "facebook";
const siteEl = document.getElementById("site");
function renderSite(site) {
  currentSite = site;
  siteEl.className = `site site--${site}`;
  siteEl.innerHTML = FEEDS[site]();
}

// ---------------- the real ad card ----------------
// Lay cards out on a grid sized to the ACTUAL viewport so they never overlap.
// Cell = card size + gap; we only use as many columns/rows as truly fit, and
// return at most that many positions (so the burst count is capped to fit).
function spreadPositions(count) {
  const cellW = 476, cellH = 452, topBar = 56, mX = 12, mY = 12;
  const availW = window.innerWidth - mX * 2;
  const availH = window.innerHeight - topBar - mY;
  const cols = Math.max(1, Math.floor(availW / cellW));
  const rows = Math.max(1, Math.floor(availH / cellH));
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) cells.push({ c, r });
  }
  // Center the whole block of used cells in the available area.
  const offX = mX + Math.max(0, (availW - cols * cellW) / 2);
  const offY = topBar + Math.max(0, (availH - rows * cellH) / 2);
  return shuffle(cells)
    .slice(0, count)
    .map(({ c, r }) => ({
      left: Math.round(offX + c * cellW),
      top: Math.round(offY + r * cellH),
      rotate: (Math.random() * 3 - 1.5).toFixed(2)
    }));
}

function spawnCard(style, ad, pos) {
  const root = document.createElement("section");
  root.className = "antidoom-root";
  if (pos) {
    root.style.top = `${pos.top}px`;
    root.style.left = `${pos.left}px`;
    root.style.setProperty("--antidoom-rotate", `${pos.rotate}deg`);
  }
  root.innerHTML = `
    <div class="antidoom-card" data-style="${style}" role="dialog" aria-label="Example popup">
      <div class="antidoom-header"><span>${sponsor()}</span>
        <button class="antidoom-close" type="button" aria-label="Dismiss">&times;</button></div>
      <div class="antidoom-body">
        <div class="antidoom-kicker">${ad.kicker}</div>
        <p class="antidoom-message">${ad.message}</p>
        <p class="antidoom-subtext">${ad.subtext}</p>
      </div>
      <div class="antidoom-footer">
        <button class="antidoom-button antidoom-button-primary" type="button">Close this tab</button>
        <button class="antidoom-button antidoom-button-secondary" type="button">Go learn something</button>
        <button class="antidoom-button antidoom-button-snooze" type="button">Snooze 10 min</button>
      </div>
    </div>`;
  const kill = () => root.remove();
  root.querySelector(".antidoom-close").addEventListener("click", kill);
  root.querySelectorAll(".antidoom-button").forEach((b) => b.addEventListener("click", kill));
  makeDraggable(root);
  document.body.appendChild(root);
  return root;
}

// Demo: drag a popup anywhere (grab the card, but not its buttons).
function makeDraggable(root) {
  root.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button, a")) return;
    e.preventDefault();
    const r = root.getBoundingClientRect();
    const startL = r.left;
    const startT = r.top;
    const startX = e.clientX;
    const startY = e.clientY;
    root.style.left = `${startL}px`;
    root.style.top = `${startT}px`;
    const move = (ev) => {
      root.style.left = `${startL + ev.clientX - startX}px`;
      root.style.top = `${startT + ev.clientY - startY}px`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });
}

function pickStyle() {
  const sel = document.getElementById("styleSelect").value;
  return sel === "random" ? rand(STYLES) : sel;
}
function pickAd() {
  // Favor the site's own contextual ad, else a general one.
  return Math.random() < 0.6 ? SITE_ADS[currentSite] : rand(GENERAL_ADS);
}

// ---------------- overlays (copied from the extension) ----------------
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

const FADING_PHRASES = ["YOUR ATTENTION IS FADING", "YOU ARE STILL SCROLLING", "TIME IS PASSING", "THE FEED DOES NOT LOVE YOU"];
function showGhost() {
  const el = document.createElement("div");
  el.className = "antidoom-ghost";
  el.textContent = rand(FADING_PHRASES);
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

const FLIP_PHRASES = ["LOG OFF", "GO OUTSIDE", "TOUCH GRASS", "WAKE UP", "BE HERE NOW", "ENOUGH"];
function showFlip() {
  const p = rand(FLIP_PHRASES);
  const el = document.createElement("div");
  el.className = "antidoom-flip";
  el.innerHTML = `<div class="antidoom-flip-inner">
    <div class="antidoom-flip-front"><span class="antidoom-flip-text">${p}</span></div>
    <div class="antidoom-flip-back"><span class="antidoom-flip-text">${p}</span></div></div>`;
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

const WAVY_PALETTE = ["#ed0a3f", "#ff8833", "#af593e", "#01a638", "#0066ff", "#8359a3", "#f7468a"];
function showWavy() {
  ensureTurbulenceDefs();
  const word = "FREE YOURSELF";
  const chars = [...word];
  let ci = 0;
  const fill = chars.map((ch) => ch === " " ? '<span class="antidoom-wavy-space"> </span>' : `<span style="color:${WAVY_PALETTE[ci++ % WAVY_PALETTE.length]}">${ch}</span>`).join("");
  const outline = chars.map((ch) => ch === " " ? '<span class="antidoom-wavy-space"> </span>' : `<span>${ch}</span>`).join("");
  const el = document.createElement("div");
  el.className = "antidoom-wavy";
  el.innerHTML = `<div class="antidoom-wavy-card"><div class="antidoom-wavy-inner">
    <div class="antidoom-wavy-fill">${fill}</div><div class="antidoom-wavy-outline">${outline}</div></div></div>`;
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.documentElement.appendChild(el);
}

function clearAll() {
  document.querySelectorAll(".antidoom-root, .antidoom-ghost, .antidoom-flip, .antidoom-wavy").forEach((n) => n.remove());
}

// ---------------- controls ----------------
const styleSelect = document.getElementById("styleSelect");
styleSelect.innerHTML = `<option value="random">Random</option>` + STYLES.map((s) => `<option value="${s}">${s}</option>`).join("");

document.querySelectorAll(".ctrl-group .ctrl-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ctrl-group .ctrl-btn").forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    renderSite(btn.dataset.site);
  });
});

document.getElementById("dropAd").addEventListener("click", () => {
  clearAll();
  spawnCard(pickStyle(), pickAd(), spreadPositions(1)[0]);
});
document.getElementById("swarm").addEventListener("click", () => {
  clearAll();
  const sel = styleSelect.value;
  // Unique messages: shuffle the site ad + general pool and take one each.
  const adPool = shuffle([SITE_ADS[currentSite], ...GENERAL_ADS]);
  // Grid has 6 cells; cap the burst by cells, ads, and (in random mode) styles.
  const cap = Math.min(6, adPool.length, sel === "random" ? STYLES.length : 6);
  const count = Math.min(cap, 3 + Math.floor(Math.random() * 3)); // 3–5
  // Unique styles in random mode; the chosen style repeated otherwise.
  const styles = sel === "random" ? shuffle(STYLES).slice(0, count) : Array(count).fill(sel);
  const positions = spreadPositions(count);
  positions.forEach((pos, i) =>
    window.setTimeout(() => spawnCard(styles[i], adPool[i], pos), i * 130)
  );
  window.setTimeout(() => rand([showGhost, showFlip, showWavy])(), 220);
});
document.getElementById("overlayGhost").addEventListener("click", showGhost);
document.getElementById("overlayFlip").addEventListener("click", showFlip);
document.getElementById("overlayWavy").addEventListener("click", showWavy);
document.getElementById("clearAll").addEventListener("click", clearAll);

document.getElementById("hideCtrl").addEventListener("change", (e) => {
  document.getElementById("ctrl").classList.toggle("is-hidden", e.target.checked);
});
// Press "h" to toggle the control bar (handy for clean screenshots)
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    const cb = document.getElementById("hideCtrl");
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event("change"));
  }
});

renderSite("facebook");
spawnCard("surgeon", SITE_ADS.facebook, spreadPositions(1)[0]);

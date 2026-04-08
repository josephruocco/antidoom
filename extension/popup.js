const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 2,
  maxPopupsPerPage: 4,
  disabledAds: []
};

const AD_MESSAGES = [
  "This spiral is not sponsored.",
  "You do not need another opinion. Start.",
  "Your mood is being auctioned off. Close the app.",
  "A walk would outperform this feed.",
  "You are 3 tabs away from feeling worse.",
  "You can log off before this gets bleak.",
  "Your brain has better uses than refresh-refresh-refresh.",
  "Leave now and call it discipline.",
  "Call your Mom."
];

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

const enabledInput = document.getElementById("enabled");
const intervalInput = document.getElementById("interval");
const maxPopupsInput = document.getElementById("maxPopups");
const intervalValue = document.getElementById("intervalValue");
const maxPopupsValue = document.getElementById("maxPopupsValue");
const testPopupButton = document.getElementById("testPopup");
const statusText = document.getElementById("status");
const adList = document.getElementById("adList");

function setStatus(message) {
  statusText.textContent = message;
}

function syncLabels() {
  intervalValue.textContent = intervalInput.value;
  maxPopupsValue.textContent = maxPopupsInput.value;
}

function saveSettings() {
  const disabledAds = AD_MESSAGES.filter((_, i) => {
    const cb = adList.querySelector(`input[data-index="${i}"]`);
    return cb && !cb.checked;
  });
  chrome.storage.sync.set({
    enabled: enabledInput.checked,
    intervalMinutes: Number(intervalInput.value),
    maxPopupsPerPage: Number(maxPopupsInput.value),
    disabledAds
  });
  syncLabels();
}

function renderAdList(disabledAds) {
  adList.innerHTML = "";
  AD_MESSAGES.forEach((msg, i) => {
    const isDisabled = disabledAds.includes(msg);
    const li = document.createElement("li");
    if (isDisabled) li.classList.add("disabled");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !isDisabled;
    cb.dataset.index = String(i);
    cb.id = `ad-${i}`;
    cb.addEventListener("change", () => {
      li.classList.toggle("disabled", !cb.checked);
      saveSettings();
    });

    const label = document.createElement("label");
    label.htmlFor = `ad-${i}`;
    label.textContent = msg;

    li.appendChild(cb);
    li.appendChild(label);
    adList.appendChild(li);
  });
}

function isDistractingUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return DISTRACTING_HOST_PATTERNS.some(
      (pattern) => hostname === pattern || hostname.endsWith(`.${pattern}`)
    );
  } catch {
    return false;
  }
}

function checkAlreadyInjected(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => typeof window.antidoomForceShowPopup === "function"
      },
      (results) => {
        resolve(!chrome.runtime.lastError && results?.[0]?.result === true);
      }
    );
  });
}

function injectContentAssets(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.insertCSS(
      {
        target: { tabId },
        files: ["content.css"]
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        chrome.scripting.executeScript(
          {
            target: { tabId },
            files: ["content.js"]
          },
          () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }

            resolve();
          }
        );
      }
    );
  });
}

function runTestPopup(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          if (typeof window.antidoomForceShowPopup !== "function") {
            throw new Error("AntiDoom is not ready on this tab yet.");
          }

          window.antidoomForceShowPopup();
        }
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        resolve();
      }
    );
  });
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  enabledInput.checked = stored.enabled;
  intervalInput.value = String(stored.intervalMinutes);
  maxPopupsInput.value = String(stored.maxPopupsPerPage);
  syncLabels();
  renderAdList(stored.disabledAds || []);
});

enabledInput.addEventListener("change", saveSettings);
intervalInput.addEventListener("input", saveSettings);
maxPopupsInput.addEventListener("input", saveSettings);

testPopupButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    setStatus("No active tab found.");
    return;
  }

  if (!tab.url || /^chrome:|^chrome-extension:|^edge:|^about:/.test(tab.url)) {
    setStatus("Open a normal website tab first.");
    return;
  }

  if (!isDistractingUrl(tab.url)) {
    setStatus("Test popup only works on distracting sites.");
    return;
  }

  try {
    const alreadyInjected = await checkAlreadyInjected(tab.id);
    if (!alreadyInjected) {
      await injectContentAssets(tab.id);
    }
    await runTestPopup(tab.id);
    setStatus("Popup sent.");
  } catch (error) {
    setStatus("Refresh the page, then click again.");
  }
});

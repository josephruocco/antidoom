const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 2,
  maxPopupsPerPage: 4
};

const enabledInput = document.getElementById("enabled");
const intervalInput = document.getElementById("interval");
const maxPopupsInput = document.getElementById("maxPopups");
const intervalValue = document.getElementById("intervalValue");
const maxPopupsValue = document.getElementById("maxPopupsValue");
const testPopupButton = document.getElementById("testPopup");
const openDemoButton = document.getElementById("openDemo");
const statusText = document.getElementById("status");

function setStatus(message) {
  statusText.textContent = message;
}

function syncLabels() {
  intervalValue.textContent = intervalInput.value;
  maxPopupsValue.textContent = maxPopupsInput.value;
}

function saveSettings() {
  chrome.storage.sync.set({
    enabled: enabledInput.checked,
    intervalMinutes: Number(intervalInput.value),
    maxPopupsPerPage: Number(maxPopupsInput.value)
  });
  syncLabels();
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

  try {
    await runTestPopup(tab.id);
    setStatus("Popup sent.");
  } catch (error) {
    try {
      await injectContentAssets(tab.id);
      await runTestPopup(tab.id);
      setStatus("Tab needed a refresh. Test popup sent.");
    } catch (retryError) {
      setStatus("Refresh the page, then click again.");
    }
  }
});

openDemoButton.addEventListener("click", async () => {
  await chrome.tabs.create({ url: chrome.runtime.getURL("demo.html") });
});

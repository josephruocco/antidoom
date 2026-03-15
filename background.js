const EDUCATIONAL_URLS = [
  "https://en.wikipedia.org/wiki/Special:Random",
  "https://www.khanacademy.org/",
  "https://www.nationalgeographic.com/",
  "https://www.smithsonianmag.com/",
  "https://oyc.yale.edu/"
];

function pickEducationalUrl() {
  const index = Math.floor(Math.random() * EDUCATIONAL_URLS.length);
  return EDUCATIONAL_URLS[index];
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "antidoom:close-current-tab") {
    if (sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id, () => {
        sendResponse({ ok: !chrome.runtime.lastError });
      });
      return true;
    }

    sendResponse({ ok: false });
    return false;
  }

  if (message?.type === "antidoom:open-educational-site") {
    const url = pickEducationalUrl();

    if (sender.tab?.id) {
      chrome.tabs.update(sender.tab.id, { url }, () => {
        sendResponse({ ok: !chrome.runtime.lastError, url });
      });
      return true;
    }

    chrome.tabs.create({ url }, () => {
      sendResponse({ ok: !chrome.runtime.lastError, url });
    });
    return true;
  }

  return false;
});

const popupTemplate = document.getElementById("popupTemplate");
const customKicker = document.getElementById("customKicker");
const customMessage = document.getElementById("customMessage");
const customSubtext = document.getElementById("customSubtext");
const customPhoto = document.getElementById("customPhoto");
const previewCustomButton = document.getElementById("previewCustom");
const customStatus = document.getElementById("customStatus");

const EDUCATIONAL_URLS = [
  "https://en.wikipedia.org/wiki/Special:Random",
  "https://www.khanacademy.org/",
  "https://www.nationalgeographic.com/",
  "https://www.smithsonianmag.com/",
  "https://oyc.yale.edu/"
];

let customImage = "";

function educationalUrl() {
  return EDUCATIONAL_URLS[Math.floor(Math.random() * EDUCATIONAL_URLS.length)];
}

function closePopup(root) {
  root.remove();
}

function spawnPopup(ad) {
  document.querySelectorAll(".floating-root").forEach((p) => p.remove());

  const fragment = popupTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".floating-root");
  const imageWrap = fragment.querySelector(".floating-image-wrap");
  const image = fragment.querySelector(".floating-image");
  const kicker = fragment.querySelector(".floating-kicker");
  const message = fragment.querySelector(".floating-message");
  const subtext = fragment.querySelector(".floating-subtext");
  const closeBtn = fragment.querySelector(".floating-close");
  const buttons = fragment.querySelectorAll(".floating-button");

  kicker.textContent = ad.kicker;
  message.textContent = ad.message;
  subtext.textContent = ad.subtext;

  if (ad.imageUrl) {
    image.src = ad.imageUrl;
    imageWrap.classList.remove("is-hidden");
  }

  closeBtn.addEventListener("click", () => closePopup(root));
  buttons[0].addEventListener("click", () => closePopup(root));
  buttons[1].addEventListener("click", () => {
    window.location.href = educationalUrl();
  });

  document.body.appendChild(root);
}

function readForm() {
  const kicker = customKicker.value.trim() || "Custom Placement";
  const message = customMessage.value.trim();
  const subtext = customSubtext.value.trim() || "You made this ad, which is already a strong sign.";

  if (!message) {
    customStatus.textContent = "Add a headline first.";
    return null;
  }

  return { kicker, message, subtext, imageUrl: customImage };
}

customPhoto.addEventListener("change", () => {
  const [file] = customPhoto.files || [];
  if (!file) {
    customImage = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    customStatus.textContent = "Image too large (max 5 MB).";
    customPhoto.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    customImage = typeof reader.result === "string" ? reader.result : "";
    customStatus.textContent = "Photo loaded.";
  });
  reader.readAsDataURL(file);
});

previewCustomButton.addEventListener("click", () => {
  const ad = readForm();
  if (!ad) return;
  customStatus.textContent = "";
  spawnPopup(ad);
});

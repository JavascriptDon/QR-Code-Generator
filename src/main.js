import QRCode from "qrcode";

const input = document.getElementById("text-input");
const btn = document.getElementById("generate-btn");
const container = document.getElementById("qr-container");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");

const HISTORY_STORAGE_KEY = "qr-generator-history";
const THEME_STORAGE_KEY = "qr-generator-theme";
const MAX_HISTORY_ITEMS = 8;
let currentGeneratedText = "";

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getQRCodeColors() {
  return document.body.dataset.theme === "dark"
    ? { dark: "#f5f7ff", light: "#111827" }
    : { dark: "#111111", light: "#ffffff" };
}

function updateThemeToggleLabel(theme) {
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  updateThemeToggleLabel(theme);
}

function loadHistory() {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Unable to read QR history", error);
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function removeFromHistory(text) {
  const updatedHistory = loadHistory().filter((entry) => entry !== text);
  saveHistory(updatedHistory);
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();

  if (history.length === 0) {
    historyList.innerHTML = '<li class="history-empty">No QR codes generated yet.</li>';
    return;
  }

  historyList.innerHTML = "";

  history.forEach((entry) => {
    const item = document.createElement("li");
    const historyRow = document.createElement("div");
    const historyButton = document.createElement("button");
    const removeButton = document.createElement("button");

    historyRow.className = "history-row";
    historyButton.type = "button";
    historyButton.className = "history-item";
    historyButton.textContent = entry;
    historyButton.addEventListener("click", () => {
      input.value = entry;
      generateQRCode(entry);
    });

    removeButton.type = "button";
    removeButton.className = "history-remove";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${entry} from recent history`);
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      removeFromHistory(entry);
    });

    historyRow.appendChild(historyButton);
    historyRow.appendChild(removeButton);
    item.appendChild(historyRow);
    historyList.appendChild(item);
  });
}

function addToHistory(text) {
  const history = loadHistory().filter((entry) => entry !== text);
  history.unshift(text);

  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  saveHistory(trimmedHistory);
  renderHistory();
}

function generateQRCode(text) {
  const colors = getQRCodeColors();

  QRCode.toCanvas(text, { width: 200, color: colors }, (err, canvas) => {
    if (err) {
      console.error(err);
      return;
    }
    container.innerHTML = "";
    container.appendChild(canvas);
    currentGeneratedText = text;
    addToHistory(text);
  });
}

btn.addEventListener("click", () => {
  const text = input.value.trim();

  if (!text) {
    container.innerHTML = "<p>Please enter something</p>";
    return;
  }

  generateQRCode(text);
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveTheme(nextTheme);

  if (currentGeneratedText) {
    generateQRCode(currentGeneratedText);
  }
});

applyTheme(loadTheme());
renderHistory();

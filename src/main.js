import QRCode from "qrcode";

const input = document.getElementById("text-input");
const btn = document.getElementById("generate-btn");
const container = document.getElementById("qr-container");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");
const styleSelect = document.getElementById("style-select");

const HISTORY_STORAGE_KEY = "qr-generator-history";
const THEME_STORAGE_KEY = "qr-generator-theme";
const STYLE_STORAGE_KEY = "qr-generator-style";
const MAX_HISTORY_ITEMS = 8;
let currentGeneratedText = "";

const QR_STYLE_PRESETS = {
  classic: {
    light: { dark: "#111111", light: "#ffffff" },
    dark: { dark: "#f5f7ff", light: "#111827" },
  },
  ocean: {
    light: { dark: "#005f73", light: "#e6fcff" },
    dark: { dark: "#90e0ef", light: "#102a43" },
  },
  sunset: {
    light: { dark: "#c2410c", light: "#fff7ed" },
    dark: { dark: "#fdba74", light: "#431407" },
  },
  forest: {
    light: { dark: "#166534", light: "#f0fdf4" },
    dark: { dark: "#86efac", light: "#052e16" },
  },
  berry: {
    light: { dark: "#9d174d", light: "#fdf2f8" },
    dark: { dark: "#f9a8d4", light: "#4a044e" },
  },
};

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function loadStyle() {
  const savedStyle = localStorage.getItem(STYLE_STORAGE_KEY);
  return QR_STYLE_PRESETS[savedStyle] ? savedStyle : "classic";
}

function saveStyle(style) {
  localStorage.setItem(STYLE_STORAGE_KEY, style);
}

function getQRCodeColors() {
  const theme = document.body.dataset.theme === "dark" ? "dark" : "light";
  const selectedStyle = QR_STYLE_PRESETS[styleSelect.value] ? styleSelect.value : "classic";
  return QR_STYLE_PRESETS[selectedStyle][theme];
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

function generateQRCode(text, options = {}) {
  const { saveToHistory = true } = options;
  const colors = getQRCodeColors();

  QRCode.toCanvas(text, { width: 200, color: colors }, (err, canvas) => {
    if (err) {
      console.error(err);
      return;
    }
    container.innerHTML = "";
    container.appendChild(canvas);
    currentGeneratedText = text;
    if (saveToHistory) {
      addToHistory(text);
    }
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
    generateQRCode(currentGeneratedText, { saveToHistory: false });
  }
});

styleSelect.addEventListener("change", () => {
  saveStyle(styleSelect.value);

  if (currentGeneratedText) {
    generateQRCode(currentGeneratedText, { saveToHistory: false });
  }
});

styleSelect.value = loadStyle();
applyTheme(loadTheme());
renderHistory();

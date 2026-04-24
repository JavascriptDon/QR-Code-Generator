## QR Code Generator

A simple and fast QR Code Generator built with HTML, CSS, JavaScript, and Vite.

Users can enter any text or URL and instantly generate a QR code rendered on a <canvas> element using the qrcode npm package.

*What is a QR Code?*

A QR code is just a grid of black and white squares (called modules) that encode data using a specific set of rules.

This project will do the following:

1. Take input text
2. Convert it into a QR‑compatible binary format
3. Arrange those bits into a square pattern
4. Render that pattern as an image (canvas, PNG, SVG, etc.)

## Features

- ⚡ Instant QR code generation
- 🎨 Clean and responsive UI
- 🖼️ Canvas‑based QR rendering
- 📦 Powered by Vite for fast development
- 🔧 Zero backend — fully client‑side
- 🧩 Easy to customize and extend

## Installation & Setup

1. Clone the repository

```
git clone https://github.com/JavascriptDon/QR-Code-Generator.git
cd qr-generator

```

2. Install dependencies

```
npm install
```

3. Start Development Server

```
npm run dev
```

Vite will give you a local URL (usually http://localhost:5173) where the app runs.

## Preview

<img width="1920" height="951" alt="qr-code" src="https://github.com/user-attachments/assets/13176def-fe4e-4f4a-a512-82b2e2f12b8b" />


## Notes
This project is meant for learning and prototyping. It uses Vite for fast local development and bundling.

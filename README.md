# Brim Browser 🌐✨

**Brim Browser** is a lightweight, privacy-focused web browser built with Tauri and Rust, featuring an Arc-inspired interface with smooth animations and intuitive controls. Designed for developers and power users who value performance and customization.

---

## 🔥 Features

- 🖥️ **Native Performance** – Rust backend with WebView2/WKWebView  
- 🎨 **Arc-Inspired UI** – Sleek sidebar and minimalist design  
- 🗂️ **Tab Management** – Vertical tabs with favicons and loading indicators  
- 🔄 **Instant Navigation** – Smart URL parsing (supports search queries)  
- 🛡️ **Privacy Focused** – No telemetry or data collection  
- 🎚️ **Customizable** – Easy-to-modify CSS and JavaScript  

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript  
- **Backend**: Rust (Tauri)  
- **Web Engine**: WebView2 (Windows) / WKWebView (macOS)  
- **Packaging**: Tauri Bundler  
- **Cross-Platform**: Windows, macOS, Linux  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/idevanshrai/brim-browser.git
cd brim-browser
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run in Development Mode

```bash
pnpm tauri dev
```

### 4. Build for Production

```bash
pnpm tauri build
```

---

## 📁 Project Structure

```
brim-browser/
│
├── src/
│   ├── main.js              # Core browser logic
│   ├── index.html           # Main UI structure
│   └── styles/
│       └── main.css         # Arc-inspired styles
│
├── src-tauri/
│   ├── icons/               # App icons for all platforms
│   ├── src/
│   │   └── main.rs          # Rust backend
│   └── tauri.conf.json      # App configuration
│
├── package.json
└── README.md
```

---

## 🌈 UI Components

1. **Sidebar**  
   - Vertical tab strip with favicons  
   - Animated expand/collapse  
   - Drag-and-drop tab reordering  

2. **Toolbar**  
   - macOS-style window controls  
   - Navigation buttons with disabled states  
   - Smart URL bar with loading indicator  

3. **WebView**  
   - Hardware-accelerated rendering  
   - Isolated process architecture  
   - Custom context menu  

---

## 🛠️ Building from Source

### Prerequisites:
- Node.js v18+
- Rust v1.70+
- pnpm

```bash
# Install Tauri CLI
cargo install tauri-cli

# Build and install
pnpm install
pnpm tauri build
```

---

## 🐛 Troubleshooting

**Issue**: Window not appearing  
**Fix**: 
```bash
rm -rf src-tauri/target && pnpm tauri dev
```

**Issue**: Blank screen  
**Fix**: Check console logs with:
```bash
RUST_LOG=tao=debug pnpm tauri dev
```

---

## 🚧 Roadmap

- [ ] Add extensions support  
- [ ] Implement bookmarks system  
- [ ] Dark/light mode toggle  
- [ ] Built-in ad blocker  
- [ ] Session restore  


---

## 🙌 Acknowledgments

- Tauri team for the amazing framework  
- Arc Browser for design inspiration  
- WebView2/WKWebView maintainers  

---

💡 **Tip**: Press `F12` to open developer tools for debugging!

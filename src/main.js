const { appWindow, WebviewWindow } = require('@tauri-apps/api/window');
const { invoke } = require('@tauri-apps/api/tauri');

// State management
let activeTabId = null;
const tabs = new Map();
const faviconCache = new Map();

// DOM elements
const webviewContainer = document.getElementById('webview-container');
const tabStrip = document.getElementById('tab-strip');
const urlbar = document.getElementById('urlbar');
const loadingIndicator = document.getElementById('loading-indicator');
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');
const refreshButton = document.getElementById('refresh');

// Initialize browser
async function initBrowser() {
  // Ensure window is visible
  await appWindow.show();
  await appWindow.setFocus();
  await appWindow.center();

  // Set up event listeners
  setupEventListeners();

  // Create initial tab
  createNewTab('https://www.google.com');
}

// Create new tab
function createNewTab(url) {
  const tabId = `tab-${Date.now()}`;
  const webview = document.createElement('webview');
  
  // Configure webview
  webview.id = `webview-${tabId}`;
  webview.src = url;
  webview.style.width = '100%';
  webview.style.height = '100%';
  webview.style.display = 'none';
  webviewContainer.appendChild(webview);

  // Create tab element
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.id = tabId;
  tab.innerHTML = `
    <img class="tab-favicon" src="https://www.google.com/favicon.ico">
    <span class="tab-title">Loading...</span>
  `;
  tabStrip.appendChild(tab);

  // Store references
  tabs.set(tabId, {
    webview,
    tabElement: tab,
    url,
    title: 'New Tab',
    favicon: 'https://www.google.com/favicon.ico'
  });

  // Set as active tab
  setActiveTab(tabId);

  // Webview events
  webview.addEventListener('did-start-loading', () => {
    updateTabLoading(tabId, true);
  });

  webview.addEventListener('did-stop-loading', () => {
    updateTabLoading(tabId, false);
  });

  webview.addEventListener('did-navigate', (e) => {
    updateTabUrl(tabId, e.url);
  });

  webview.addEventListener('page-title-updated', (e) => {
    updateTabTitle(tabId, e.title);
  });

  webview.addEventListener('did-navigate-in-page', (e) => {
    if (e.isMainFrame) {
      updateTabUrl(tabId, e.url);
    }
  });

  webview.addEventListener('dom-ready', () => {
    webview.style.display = 'block';
    setTimeout(() => {
      webview.classList.add('visible');
    }, 100);
  });

  return tabId;
}

// Tab management
function setActiveTab(tabId) {
  // Hide all webviews
  tabs.forEach((tab, id) => {
    tab.webview.style.display = 'none';
    tab.tabElement.classList.remove('active');
  });

  // Show selected tab
  const tab = tabs.get(tabId);
  if (tab) {
    tab.webview.style.display = 'block';
    tab.tabElement.classList.add('active');
    urlbar.value = tab.url;
    updateNavigationButtons(tab.webview);
    activeTabId = tabId;
  }
}

function updateTabLoading(tabId, isLoading) {
  const tab = tabs.get(tabId);
  if (tab) {
    if (isLoading) {
      tab.tabElement.querySelector('.tab-title').textContent = 'Loading...';
      loadingIndicator.style.width = '50%';
    } else {
      loadingIndicator.style.width = '0%';
    }

    if (tabId === activeTabId) {
      backButton.disabled = !tab.webview.canGoBack();
      forwardButton.disabled = !tab.webview.canGoForward();
    }
  }
}

function updateTabUrl(tabId, url) {
  const tab = tabs.get(tabId);
  if (tab) {
    tab.url = url;
    if (tabId === activeTabId) {
      urlbar.value = url;
    }
    updateFavicon(tabId, url);
  }
}

function updateTabTitle(tabId, title) {
  const tab = tabs.get(tabId);
  if (tab) {
    tab.title = title;
    tab.tabElement.querySelector('.tab-title').textContent = title || 'New Tab';
  }
}

function updateFavicon(tabId, url) {
  const domain = new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
  
  const tab = tabs.get(tabId);
  if (tab) {
    tab.favicon = faviconUrl;
    tab.tabElement.querySelector('.tab-favicon').src = faviconUrl;
  }
}

function updateNavigationButtons(webview) {
  backButton.disabled = !webview.canGoBack();
  forwardButton.disabled = !webview.canGoForward();
}

// Event listeners
function setupEventListeners() {
  // Tab click events
  tabStrip.addEventListener('click', (e) => {
    const tabElement = e.target.closest('.tab');
    if (tabElement) {
      setActiveTab(tabElement.id);
    }
  });

  // URL bar navigation
  urlbar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateTo(urlbar.value);
    }
  });

  // Navigation buttons
  backButton.addEventListener('click', () => {
    const tab = tabs.get(activeTabId);
    if (tab) tab.webview.goBack();
  });

  forwardButton.addEventListener('click', () => {
    const tab = tabs.get(activeTabId);
    if (tab) tab.webview.goForward();
  });

  refreshButton.addEventListener('click', () => {
    const tab = tabs.get(activeTabId);
    if (tab) tab.webview.reload();
  });

  // New tab button
  document.getElementById('new-tab').addEventListener('click', () => {
    createNewTab('https://www.google.com');
  });

  // Window controls
  document.getElementById('minimize').addEventListener('click', () => appWindow.minimize());
  document.getElementById('maximize').addEventListener('click', () => appWindow.toggleMaximize());
  document.getElementById('close').addEventListener('click', () => appWindow.close());
}

// Navigation function
function navigateTo(url) {
  if (!url) return;

  let finalUrl = url;
  
  // Add https:// if missing
  if (!url.match(/^https?:\/\//)) {
    // Check if it's a domain (contains dot) or search query
    if (url.includes('.') && !url.includes(' ')) {
      finalUrl = `https://${url}`;
    } else {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }
  }

  const tab = tabs.get(activeTabId);
  if (tab) {
    tab.webview.src = finalUrl;
  }
}

// Start the browser
initBrowser().catch(console.error);
// Core App Logic for Ayurvedic Home Remedy Chatbot

document.addEventListener("DOMContentLoaded", () => {
  // State variables
  let currentSessionId = null;
  let chatSessions = [];
  let isDarkMode = false;
  let geminiApiKey = "";
  let isAiMode = true;

  // DOM Elements
  const chatWindow = document.getElementById("chat-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const charCounter = document.getElementById("char-counter");
  const appContainer = document.querySelector(".app-container");
  const sidebar = document.getElementById("sidebar");
  const newChatBtn = document.getElementById("new-chat-btn");
  const historyList = document.getElementById("history-list");
  
  // Header Elements
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const statusIndicatorText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");
  
  // Settings Drawer Elements
  const settingsBtn = document.getElementById("settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const settingsDrawer = document.getElementById("settings-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  
  // Settings Form Elements
  const aiModeToggle = document.getElementById("ai-mode-toggle");
  const apiKeyInput = document.getElementById("api-key-input");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const exportTxtBtn = document.getElementById("export-txt-btn");
  const exportJsonBtn = document.getElementById("export-json-btn");
  
  // Suggestion Chips
  const suggestionChips = document.querySelectorAll(".symptom-chip");

  // --- Initial Load Configuration ---
  function init() {
    // Load Settings from LocalStorage
    isDarkMode = localStorage.getItem("ayur_dark_mode") === "true";
    isAiMode = localStorage.getItem("ayur_ai_mode") !== "false";
    geminiApiKey = localStorage.getItem("ayur_gemini_key") || "";
    
    // Apply theme
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      themeToggleBtn.innerHTML = "☀️";
    } else {
      themeToggleBtn.innerHTML = "🌙";
    }

    // Apply Settings to UI
    if (aiModeToggle) aiModeToggle.checked = isAiMode;
    if (apiKeyInput) apiKeyInput.value = geminiApiKey;
    updateStatusIndicator();
    
    // Attempt to load API Key from local environment file
    loadApiKeyFromEnv();

    // Load Chat Sessions
    loadChatSessions();

    // Event Listeners
    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    chatInput.addEventListener("input", updateCharCount);
    
    newChatBtn.addEventListener("click", () => startNewSession());
    menuToggleBtn.addEventListener("click", toggleSidebar);
    themeToggleBtn.addEventListener("click", toggleTheme);
    
    // Settings Drawer Toggles
    settingsBtn.addEventListener("click", openSettings);
    closeSettingsBtn.addEventListener("click", closeSettings);
    drawerOverlay.addEventListener("click", closeSettings);
    
    // Settings Actions
    if (aiModeToggle) aiModeToggle.addEventListener("change", handleAiModeChange);
    if (apiKeyInput) apiKeyInput.addEventListener("input", handleApiKeyInput);
    clearHistoryBtn.addEventListener("click", handleClearAllHistory);
    exportTxtBtn.addEventListener("click", () => exportConversation("txt"));
    exportJsonBtn.addEventListener("click", () => exportConversation("json"));
    
    // Suggestion Chips Click
    suggestionChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const symptom = chip.getAttribute("data-symptom");
        chatInput.value = symptom;
        chatInput.focus();
        updateCharCount();
        handleSend(); // Send immediately
      });
    });

    // Handle viewport resize to reset mobile classes
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove("open");
      }
    });
  }

  // --- UI Update Utilities ---
  function updateCharCount() {
    const len = chatInput.value.length;
    charCounter.textContent = `${len}/500`;
    sendBtn.disabled = len === 0;
  }

  function toggleSidebar() {
    sidebar.classList.toggle("open");
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("ayur_dark_mode", isDarkMode);
    document.body.classList.toggle("dark-theme", isDarkMode);
    themeToggleBtn.innerHTML = isDarkMode ? "☀️" : "🌙";
    showToast(isDarkMode ? "Dark theme enabled" : "Light theme enabled");
  }

  function openSettings() {
    drawerOverlay.style.display = "block";
    // Force reflow
    drawerOverlay.offsetHeight;
    drawerOverlay.style.opacity = "1";
    settingsDrawer.classList.add("open");
    if (sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  }

  function closeSettings() {
    drawerOverlay.style.opacity = "0";
    settingsDrawer.classList.remove("open");
    setTimeout(() => {
      drawerOverlay.style.display = "none";
    }, 300);
  }

  async function loadApiKeyFromEnv() {
    try {
      const response = await fetch(".env");
      if (response.ok) {
        const text = await response.text();
        const match = text.match(/API_KEY\s*=\s*([^\s#]+)/);
        if (match) {
          const key = match[1].trim();
          if (key) {
            geminiApiKey = key;
            localStorage.setItem("ayur_gemini_key", geminiApiKey);
            if (apiKeyInput) apiKeyInput.value = geminiApiKey;
            updateStatusIndicator();
            return true;
          }
        }
      }
    } catch (e) {
      console.warn("Could not load API key from .env file:", e);
    }
    return false;
  }

  function updateStatusIndicator() {
    if (isAiMode && geminiApiKey) {
      statusIndicatorText.textContent = "Connected to Gemini";
      statusDot.className = "status-dot live";
      statusDot.style.backgroundColor = "";
    } else if (isAiMode) {
      statusIndicatorText.textContent = "No API Key";
      statusDot.className = "status-dot local";
      statusDot.style.backgroundColor = "var(--danger-color)";
    } else {
      statusIndicatorText.textContent = "Local Mode";
      statusDot.className = "status-dot local";
      statusDot.style.backgroundColor = "";
    }
  }

  function showToast(message) {
    // Remove existing toasts
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger slide-in
    setTimeout(() => toast.classList.add("show"), 50);
    
    // Fade out
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- Settings Handlers ---
  function handleAiModeChange(e) {
    isAiMode = e.target.checked;
    localStorage.setItem("ayur_ai_mode", isAiMode);
    updateStatusIndicator();
    if (isAiMode && !geminiApiKey) {
      showToast("Please input a valid Gemini API Key to use dynamic AI.");
    } else {
      showToast(isAiMode ? "Dynamic AI enabled" : "Local Database Mode enabled");
    }
  }

  function handleApiKeyInput(e) {
    geminiApiKey = e.target.value.trim();
    localStorage.setItem("ayur_gemini_key", geminiApiKey);
    updateStatusIndicator();
  }

  // --- Session Management ---
  function loadChatSessions() {
    const saved = localStorage.getItem("ayur_sessions");
    if (saved) {
      chatSessions = JSON.parse(saved);
    } else {
      chatSessions = [];
    }
    
    renderHistoryList();

    if (chatSessions.length > 0) {
      // Load the first or last active session
      currentSessionId = chatSessions[0].id;
      loadSessionMessages(currentSessionId);
    } else {
      startNewSession();
    }
  }

  function saveSessionsToStorage() {
    localStorage.setItem("ayur_sessions", JSON.stringify(chatSessions));
  }

  function startNewSession() {
    currentSessionId = "session_" + Date.now();
    const newSession = {
      id: currentSessionId,
      title: "New Chat",
      timestamp: new Date().toLocaleString(),
      messages: []
    };
    chatSessions.unshift(newSession);
    saveSessionsToStorage();
    renderHistoryList();
    loadSessionMessages(currentSessionId);
    
    // Close sidebar on mobile
    sidebar.classList.remove("open");
  }

  function loadSessionMessages(sessionId) {
    currentSessionId = sessionId;
    
    // Update active class in sidebar list
    const items = historyList.querySelectorAll(".history-item");
    items.forEach(item => {
      if (item.getAttribute("data-id") === sessionId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    const session = chatSessions.find(s => s.id === sessionId);
    if (!session || session.messages.length === 0) {
      renderWelcomeScreen();
    } else {
      chatWindow.innerHTML = "";
      session.messages.forEach(msg => {
        appendMessageUI(msg.role, msg.content, false);
      });
      scrollToBottom();
    }
  }

  function renderHistoryList() {
    historyList.innerHTML = "";
    if (chatSessions.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "history-title";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.padding = "20px 0";
      emptyMsg.textContent = "No history";
      historyList.appendChild(emptyMsg);
      return;
    }

    chatSessions.forEach(session => {
      const item = document.createElement("div");
      item.className = `history-item ${session.id === currentSessionId ? 'active' : ''}`;
      item.setAttribute("data-id", session.id);
      
      const textSpan = document.createElement("span");
      textSpan.className = "history-item-text";
      textSpan.textContent = session.title;
      textSpan.addEventListener("click", () => loadSessionMessages(session.id));
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-history-btn";
      deleteBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      `;
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleDeleteSession(session.id);
      });

      item.appendChild(textSpan);
      item.appendChild(deleteBtn);
      historyList.appendChild(item);
    });
  }

  function handleDeleteSession(sessionId) {
    chatSessions = chatSessions.filter(s => s.id !== sessionId);
    saveSessionsToStorage();
    renderHistoryList();

    if (currentSessionId === sessionId) {
      if (chatSessions.length > 0) {
        currentSessionId = chatSessions[0].id;
        loadSessionMessages(currentSessionId);
      } else {
        startNewSession();
      }
    }
  }

  function handleClearAllHistory() {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      chatSessions = [];
      saveSessionsToStorage();
      startNewSession();
      closeSettings();
      showToast("History cleared successfully.");
    }
  }

  function renderWelcomeScreen() {
    chatWindow.innerHTML = `
      <div class="chat-welcome">
        <div class="welcome-logo">🌿</div>
        <h2 class="welcome-title">Ayurvedic Remedy Assistant</h2>
        <p class="welcome-text">Describe your minor symptoms to find verified traditional home remedies using everyday kitchen ingredients.</p>
        
        <div class="welcome-features">
          <div class="feature-card">
            <div class="feature-card-icon">🍃</div>
            <div class="feature-card-title">Pure Remedies</div>
            <div class="feature-card-text">Uses 13 kitchen ingredients: Ginger, Turmeric, Honey, Tulsi, Fennel, Aloe Vera, etc.</div>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon">🛡️</div>
            <div class="feature-card-title">Safety Checked</div>
            <div class="feature-card-text">Recognizes serious red-flag symptoms and directs you to a medical professional.</div>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon">⚡</div>
            <div class="feature-card-title">Dynamic AI</div>
            <div class="feature-card-text">Answers are generated live using Google's Gemini AI with built-in safety guardrails.</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Message UI Rendering ---
  function appendMessageUI(role, content, animate = true) {
    const welcome = chatWindow.querySelector(".chat-welcome");
    if (welcome) welcome.remove();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if the content is a safety warning card text
    const isSafetyWarning = content.includes("⚠️ Please consult a doctor immediately.");

    const row = document.createElement("div");
    row.className = `message-row ${role === 'user' ? 'user-row' : 'bot-row'}`;
    if (!animate) row.style.animation = "none";

    let innerHTMLContent = "";
    if (role === 'user') {
      innerHTMLContent = `
        <div class="message-bubble">
          <div class="message-meta">You • ${timestamp}</div>
          <div class="message-text">${escapeHtml(content)}</div>
        </div>
      `;
    } else {
      // Bot response
      let parsedBody = "";
      if (isSafetyWarning) {
        parsedBody = `
          <div class="safety-warning-card">
            <div class="safety-warning-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Medical Alert: Urgent Care Required
            </div>
            <div class="safety-warning-text">${content}</div>
            <div class="safety-warning-footer">Disclaimer: This bot does not diagnose, treat, or offer remedies for emergency conditions. Please proceed to the nearest emergency clinic.</div>
          </div>
        `;
      } else {
        parsedBody = `
          <div class="remedy-output">
            ${processLineByLine(content)}
          </div>
          <div class="message-actions">
            <button class="msg-action-btn copy-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
        `;
      }

      innerHTMLContent = `
        <div class="message-bubble" style="${isSafetyWarning ? 'background: transparent; border: none; box-shadow: none; padding: 0;' : ''}">
          ${!isSafetyWarning ? `<div class="message-meta">🌿 Ayurvedic Assistant • ${timestamp}</div>` : ''}
          ${parsedBody}
        </div>
      `;
    }

    row.innerHTML = innerHTMLContent;
    chatWindow.appendChild(row);

    // Setup Copy button listener
    if (role === 'bot' && !isSafetyWarning) {
      const copyBtn = row.querySelector(".copy-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(content).then(() => {
            showToast("Response copied to clipboard.");
          });
        });
      }
    }

    scrollToBottom();
  }

  function appendTypingIndicator() {
    const row = document.createElement("div");
    row.className = "message-row bot-row typing-row";
    row.innerHTML = `
      <div class="message-bubble">
        <div class="message-meta">🌿 Ayurvedic Assistant is thinking...</div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatWindow.appendChild(row);
    scrollToBottom();
    return row;
  }

  function removeTypingIndicator(indicatorRow) {
    if (indicatorRow && indicatorRow.parentNode) {
      indicatorRow.remove();
    }
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // --- Safety Scanning Engine ---
  function checkSafetyConditions(text) {
    const normalized = text.toLowerCase();
    for (const trigger of SAFETY_TRIGGERS) {
      for (const kw of trigger.keywords) {
        // Regex word boundary matching for keywords to prevent false positives
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(normalized)) {
          return { safe: false, reason: trigger.reason };
        }
      }
    }
    return { safe: true };
  }

  // --- Local Database Matcher ---
  function matchLocalRemedies(query) {
    const normalized = query.toLowerCase();
    
    // We will assign a match score to each ailment
    let bestMatch = null;
    let highestScore = 0;

    // Define search terms map for accurate local mapping
    const keywordMap = {
      "Common Cold": ["cold", "sneezing", "cough", "runny nose", "blocked nose", "congestion", "sniffles", "flu"],
      "Sore Throat": ["throat", "sore throat", "pain swallowing", "strep", "scratchy throat", "hoarseness"],
      "Tension Headache": ["headache", "head pain", "temple pain", "tension", "migraine", "forehead pain"],
      "Acidity": ["acidity", "acid reflux", "heartburn", "sour burps", "gerd", "burning stomach"],
      "Gas/Bloating": ["gas", "bloating", "flatulence", "bloated abdomen", "trapped gas"],
      "Indigestion": ["indigestion", "digestion", "stomach fullness", "heaviness", "constipation", "sluggish appetite"],
      "Dry Cough": ["dry cough", "tickly cough", "cough dry"],
      "Wet Cough": ["wet cough", "mucus cough", "phlegm", "productive cough", "chest congestion"],
      "Nausea": ["nausea", "vomiting", "nauseous", "motion sickness", "queasy"],
      "Hiccups": ["hiccup", "hiccups", "hiccough"],
      "Mouth Ulcers": ["ulcer", "mouth ulcers", "canker sore", "canker sores", "tongue sore"],
      "Minor Burns": ["burn", "minor burn", "scald", "heat burn"],
      "Mosquito Bites": ["mosquito", "bite", "bug bite", "insect bite", "itchy bite"],
      "Dandruff": ["dandruff", "flaky scalp", "itchy scalp", "scalp flakes"],
      "Dry Skin": ["dry skin", "rough skin", "scaling skin", "chapped skin"],
      "Dark Circles": ["dark circles", "under eye", "eye bags", "eye puffiness"],
      "Minor Joint Pain": ["joint pain", "knee pain", "joint stiffness", "body ache", "bone pain"],
      "Mild Constipation": ["constipation", "hard stool", "irregular bowel", "cannot pass stool"],
      "Chapped Lips": ["chapped lips", "dry lips", "cracked lips", "lip dry"],
      "Mild Seasonal Congestion": ["congestion", "seasonal congestion", "sinus pressure", "stuffy nose", "stuffed nose"]
    };

    REMEDY_DATABASE.forEach(item => {
      let score = 0;
      const terms = keywordMap[item.ailment] || [];
      
      // Check for whole phrase match of ailment name
      if (normalized.includes(item.ailment.toLowerCase())) {
        score += 10;
      }

      // Check keyword occurrences
      terms.forEach(term => {
        if (normalized.includes(term)) {
          score += 3;
        }
      });

      // Special checks for distinguishing Dry Cough vs Wet Cough
      if (item.ailment === "Dry Cough" && normalized.includes("dry") && normalized.includes("cough")) {
        score += 8;
      }
      if (item.ailment === "Wet Cough" && (normalized.includes("wet") || normalized.includes("mucus") || normalized.includes("phlegm")) && normalized.includes("cough")) {
        score += 8;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore > 0 && bestMatch) {
      return formatAilmentMarkdown(bestMatch);
    }
    
    return "I don't have verified information about that symptom. Please consult a doctor.";
  }

  function formatAilmentMarkdown(item) {
    let markdown = `🌿 ${item.ailment}\n\n`;
    
    item.remedies.forEach((rem, index) => {
      markdown += `### Remedy ${index + 1}: ${rem.name}\n\n`;
      markdown += `Ingredients:\n`;
      rem.ingredients.forEach(ing => {
        markdown += `* ${ing}\n`;
      });
      markdown += `\nPreparation:\n${rem.preparation}\n\n`;
      markdown += `Usage:\n${rem.usage}\n\n`;
    });
    
    markdown += `### When Not To Use\n${item.when_not_to_use}\n\n`;
    markdown += `### When To See A Doctor\n`;
    item.see_doctor_if.forEach(cond => {
      markdown += `* ${cond}\n`;
    });
    markdown += `\n⚠️ Disclaimer:\nFor informational purposes only. Not a substitute for medical advice.`;
    
    return markdown;
  }

  // --- Gemini API Handler ---
  async function generateGeminiResponse(userMessage) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`;
    
    const systemInstruction = `You are an Ayurvedic Home Remedy Assistant.
Your task is to suggest traditional, safe, and natural home remedies for minor ailments using common kitchen/household ingredients (e.g. Turmeric, Ginger, Honey, Tulsi, Ajwain, Jeera, Fennel, Aloe Vera, Coconut Oil, Salt, Lemon, Clove, Black Pepper).

Adhere strictly to these safety rules:
1. If the user mentions any emergency or red-flag conditions (e.g. chest pain, breathing difficulty, severe/third-degree burns, sudden vision changes, severe pain, symptoms in children under 5, allergic reactions), immediately advise consulting a doctor.
2. Never provide a clinical medical diagnosis.
3. Every remedy response must follow this structured markdown layout exactly. Do not include introductory notes, conversational banter, or greetings:

🌿 [Ailment/Symptom Name]

### Remedy 1: [Name of Remedy]
Ingredients:
* [Ingredient 1]
* [Ingredient 2]

Preparation:
[Detailed preparation step]

Usage:
[Detailed usage instructions]

### Remedy 2: [Name of Remedy]
Ingredients:
* [Ingredient 1]

Preparation:
...

Usage:
...

### When Not To Use
[Explain situations or contraindications where this remedy should be avoided]

### When To See A Doctor
* [Specific condition or duration after which they must consult a doctor]
* [Another red flag condition]

⚠️ Disclaimer:
For informational purposes only. Not a substitute for medical advice.`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error details:", errorData);
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Gemini API Connection Error:", err);
      throw new Error(`Failed to connect to AI server (${err.message || err}). If you are running the app by double-clicking index.html (file:// protocol), browser security restrictions (CORS) may block API requests. Please run the local server using 'run_server.bat' in the project directory, or check your internet connection and API key.`);
    }
  }

  // --- Send Message Processing Flow ---
  async function handleSend() {
    const inputMsg = chatInput.value.trim();
    if (!inputMsg) return;

    // Clear input
    chatInput.value = "";
    updateCharCount();

    // 1. Add User Message to UI & Session
    appendMessageUI("user", inputMsg);
    saveMessageToSession("user", inputMsg);

    // 2. Perform Client-side Safety Check
    const safetyCheck = checkSafetyConditions(inputMsg);
    if (!safetyCheck.safe) {
      const warningText = "⚠️ Please consult a doctor immediately. This chatbot does not provide remedies for serious medical conditions.";
      
      // Delay slightly for natural feel
      const typingRow = appendTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator(typingRow);
        appendMessageUI("bot", warningText);
        saveMessageToSession("bot", warningText);
      }, 800);
      return;
    }

    // 3. Bot Response Execution
    const typingRow = appendTypingIndicator();
    let botReply = "";

    try {
      if (isAiMode && geminiApiKey) {
        botReply = await generateGeminiResponse(inputMsg);
      } else {
        // Offline Local Matching Mode
        // Simulate a small thinking delay for natural conversational rhythm
        await new Promise(resolve => setTimeout(resolve, 800));
        botReply = matchLocalRemedies(inputMsg);
      }
    } catch (error) {
      botReply = `⚠️ API Error: ${error.message}\n\n*Falling back to local database...*\n\n` + matchLocalRemedies(inputMsg);
    } finally {
      removeTypingIndicator(typingRow);
      appendMessageUI("bot", botReply);
      saveMessageToSession("bot", botReply);
      
      // Update session title in history list based on first user query
      updateSessionTitle(inputMsg);
    }
  }

  function saveMessageToSession(role, content) {
    const sessionIndex = chatSessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1) {
      chatSessions[sessionIndex].messages.push({ role, content });
      saveSessionsToStorage();
    }
  }

  function updateSessionTitle(firstQuery) {
    const sessionIndex = chatSessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1 && chatSessions[sessionIndex].title === "New Chat") {
      // Cut title to 20 chars
      let cleanTitle = firstQuery.replace(/[🌿⚠️]/g, '').trim();
      if (cleanTitle.length > 22) {
        cleanTitle = cleanTitle.substring(0, 20) + "...";
      }
      chatSessions[sessionIndex].title = cleanTitle || "Ayurvedic remedies";
      saveSessionsToStorage();
      renderHistoryList();
    }
  }

  // --- Export Conversations ---
  function exportConversation(format) {
    const session = chatSessions.find(s => s.id === currentSessionId);
    if (!session || session.messages.length === 0) {
      showToast("Nothing to export.");
      return;
    }

    let fileContent = "";
    let mimeType = "text/plain";
    let filename = `ayurveda_chat_${session.title.replace(/\s+/g, "_").toLowerCase()}`;

    if (format === "json") {
      fileContent = JSON.stringify(session, null, 2);
      mimeType = "application/json";
      filename += ".json";
    } else {
      // Plain text export
      fileContent = `=========================================\n`;
      fileContent += `Ayurvedic Home Remedy Chatbot Export\n`;
      fileContent += `Session: ${session.title}\n`;
      fileContent += `Date: ${session.timestamp}\n`;
      fileContent += `=========================================\n\n`;

      session.messages.forEach(msg => {
        const sender = msg.role === "user" ? "YOU" : "BOT";
        fileContent += `[${sender}]:\n${msg.content}\n\n-----------------------------------------\n\n`;
      });
      
      filename += ".txt";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Conversation exported as ${format.toUpperCase()}`);
  }

  // --- Markdown Parser implementation ---
  function processLineByLine(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) {
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        continue;
      }
      
      // Symptom header
      if (line.startsWith('🌿')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h2 class="symptom-header">${line}</h2>\n`;
      } 
      // Headings
      else if (line.startsWith('###')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h3 class="remedy-subtitle">${line.substring(3).trim()}</h3>\n`;
      } else if (line.startsWith('##')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h2 class="remedy-title">${line.substring(2).trim()}</h2>\n`;
      } 
      // Lists (Unordered)
      else if (line.startsWith('*') || line.startsWith('-')) {
        if (!inList) {
          html += '<ul>\n';
          inList = true;
        }
        const liContent = line.substring(1).trim();
        html += `<li>${parseInlineMarkdown(liContent)}</li>\n`;
      } 
      // Disclaimer block
      else if (line.startsWith('⚠️ Disclaimer:')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<div class="remedy-disclaimer"><strong>Disclaimer:</strong> `;
        let discContent = line.replace('⚠️ Disclaimer:', '').trim();
        // Read subsequent lines that are part of the disclaimer
        while (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].startsWith('#') && !lines[i + 1].startsWith('🌿')) {
          i++;
          discContent += ' ' + lines[i].trim();
        }
        html += `${parseInlineMarkdown(discContent)}</div>\n`;
      } 
      // Standard Paragraph
      else {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<p>${parseInlineMarkdown(line)}</p>\n`;
      }
    }
    
    if (inList) {
      html += '</ul>\n';
    }
    
    return html;
  }

  function parseInlineMarkdown(text) {
    let escaped = escapeHtml(text);
    // Replace **text** with <strong>text</strong>
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return escaped;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Launch Initial Setup
  init();
});

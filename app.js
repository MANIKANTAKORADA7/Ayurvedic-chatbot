// Core App Logic for Ayurvedic Home Remedy Chatbot

document.addEventListener("DOMContentLoaded", () => {
  // State variables
  let currentSessionId = null;
  let chatSessions = [];
  let isDarkMode = false;
  let geminiApiKey = "";
  let groqApiKey = "";
  let isAiMode = true;
  let aiProvider = "groq";

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
  const geminiKeyInput = document.getElementById("gemini-key-input");
  const groqKeyInput = document.getElementById("groq-key-input");
  const aiProviderSelect = document.getElementById("ai-provider-select");
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
    groqApiKey = localStorage.getItem("ayur_groq_key") || "";
    aiProvider = localStorage.getItem("ayur_ai_provider") || "groq";

    // Load keys from config.js if available (allows file:// offline protocol loading)
    if (typeof CONFIG !== "undefined") {
      if (CONFIG.GEMINI_API_KEY) {
        geminiApiKey = CONFIG.GEMINI_API_KEY;
        localStorage.setItem("ayur_gemini_key", geminiApiKey);
      }
      if (CONFIG.GROQ_API_KEY) {
        groqApiKey = CONFIG.GROQ_API_KEY;
        localStorage.setItem("ayur_groq_key", groqApiKey);
      }
    }

    // Apply theme
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      themeToggleBtn.innerHTML = "☀️";
    } else {
      themeToggleBtn.innerHTML = "🌙";
    }

    // Apply Settings to UI
    if (aiModeToggle) aiModeToggle.checked = isAiMode;
    if (geminiKeyInput) geminiKeyInput.value = geminiApiKey;
    if (groqKeyInput) groqKeyInput.value = groqApiKey;
    if (aiProviderSelect) aiProviderSelect.value = aiProvider;
    updateStatusIndicator();

    // Attempt to load API Key from local environment file
    loadApiKeyFromEnv();

    // Load Chat Sessions
    loadChatSessions();

    // Event Listeners
    if (sendBtn) sendBtn.addEventListener("click", () => handleSend());
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
      chatInput.addEventListener("input", updateCharCount);
    }

    newChatBtn.addEventListener("click", () => startNewSession());
    menuToggleBtn.addEventListener("click", toggleSidebar);
    themeToggleBtn.addEventListener("click", toggleTheme);

    // Settings Drawer Toggles
    settingsBtn.addEventListener("click", openSettings);
    closeSettingsBtn.addEventListener("click", closeSettings);
    drawerOverlay.addEventListener("click", closeSettings);

    // Settings Actions
    if (aiModeToggle) aiModeToggle.addEventListener("change", handleAiModeChange);
    if (geminiKeyInput) geminiKeyInput.addEventListener("input", handleGeminiKeyInput);
    if (groqKeyInput) groqKeyInput.addEventListener("input", handleGroqKeyInput);
    if (aiProviderSelect) aiProviderSelect.addEventListener("change", handleAiProviderChange);
    clearHistoryBtn.addEventListener("click", handleClearAllHistory);
    exportTxtBtn.addEventListener("click", () => exportConversation("txt"));
    exportJsonBtn.addEventListener("click", () => exportConversation("json"));

    // Suggestion Chips Click
    suggestionChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const symptom = chip.getAttribute("data-symptom");
        if (chatInput) {
          chatInput.value = symptom;
          updateCharCount();
        }
        handleSend(symptom); // Send immediately
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
    if (!chatInput || !sendBtn) return;
    const len = chatInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${len}/500`;
    }
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
        
        const geminiMatch = text.match(/API_KEY\s*=\s*([^\s#]+)/);
        if (geminiMatch) {
          const key = geminiMatch[1].trim();
          if (key) {
            geminiApiKey = key;
            localStorage.setItem("ayur_gemini_key", geminiApiKey);
            if (geminiKeyInput) geminiKeyInput.value = geminiApiKey;
          }
        }

        const groqMatch = text.match(/GROQ_API_KEY\s*=\s*([^\s#]+)/);
        if (groqMatch) {
          const key = groqMatch[1].trim();
          if (key) {
            groqApiKey = key;
            localStorage.setItem("ayur_groq_key", groqApiKey);
            if (groqKeyInput) groqKeyInput.value = groqApiKey;
          }
        }

        updateStatusIndicator();
        return true;
      }
    } catch (e) {
      console.warn("Could not load API keys from .env file:", e);
    }
    return false;
  }

  function updateStatusIndicator() {
    if (!statusIndicatorText || !statusDot) return;
    if (aiProvider === "groq" && groqApiKey) {
      statusIndicatorText.textContent = "Connected to Groq";
      statusDot.className = "status-dot live";
      statusDot.style.backgroundColor = "";
    } else if (aiProvider === "gemini" && geminiApiKey) {
      statusIndicatorText.textContent = "Connected to Gemini";
      statusDot.className = "status-dot live";
      statusDot.style.backgroundColor = "";
    } else if (aiProvider === "local") {
      statusIndicatorText.textContent = "Local Mode";
      statusDot.className = "status-dot local";
      statusDot.style.backgroundColor = "";
    } else {
      statusIndicatorText.textContent = "No API Key Set";
      statusDot.className = "status-dot local";
      statusDot.style.backgroundColor = "var(--danger-color)";
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
    if (isAiMode && !geminiApiKey && !groqApiKey) {
      showToast("Please input a valid API Key to use dynamic AI.");
    } else {
      showToast(isAiMode ? "Dynamic AI enabled" : "Local Database Mode enabled");
    }
  }

  function handleAiProviderChange(e) {
    aiProvider = e.target.value;
    localStorage.setItem("ayur_ai_provider", aiProvider);
    updateStatusIndicator();
    showToast(`AI Provider set to ${aiProvider === "gemini" ? "Gemini" : "Groq"}`);
  }

  function handleGeminiKeyInput(e) {
    geminiApiKey = e.target.value.trim();
    localStorage.setItem("ayur_gemini_key", geminiApiKey);
    updateStatusIndicator();
  }

  function handleGroqKeyInput(e) {
    groqApiKey = e.target.value.trim();
    localStorage.setItem("ayur_groq_key", groqApiKey);
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
        appendMessageUI(msg.role, msg.content, false, msg.source);
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
  function appendMessageUI(role, content, animate = true, source = null) {
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

      const assistantTitle = source ? `🌿 Ayurvedic Assistant (${source})` : `🌿 Ayurvedic Assistant`;
      innerHTMLContent = `
        <div class="message-bubble" style="${isSafetyWarning ? 'background: transparent; border: none; box-shadow: none; padding: 0;' : ''}">
          ${!isSafetyWarning ? `<div class="message-meta">${assistantTitle} • ${timestamp}</div>` : ''}
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
  function findBestLocalMatch(query) {
    const normalized = query.toLowerCase();

    // We will assign a match score to each ailment
    let bestMatch = null;
    let highestScore = 0;

    // Comprehensive keyword map for all 40 ailments
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
      "Dry Skin": ["dry skin", "rough skin", "scaling skin", "chapped skin", "skil", "skin", "dryness"],
      "Dark Circles": ["dark circles", "under eye", "eye bags", "eye puffiness"],
      "Minor Joint Pain": ["joint pain", "knee pain", "joint stiffness", "body ache", "bone pain"],
      "Mild Constipation": ["constipation", "hard stool", "irregular bowel", "cannot pass stool"],
      "Chapped Lips": ["chapped lips", "dry lips", "cracked lips", "lip dry"],
      "Mild Seasonal Congestion": ["congestion", "seasonal congestion", "sinus pressure", "stuffy nose", "stuffed nose"],
      "Mild Sunburn": ["sunburn", "sun burn", "sun-exposed", "red skin sun"],
      "Heat Rash": ["heat rash", "rash", "itchy bumps", "sweat bumps"],
      "Mild Dehydration": ["dehydration", "dehydrated", "thirsty", "dry mouth hydration"],
      "Motion Sickness": ["motion sickness", "travel sickness", "car sick", "sea sick"],
      "Mild Stress": ["stress", "anxiety", "anxious", "mental fatigue", "restless"],
      "Occasional Sleep Difficulty": ["sleep", "insomnia", "sleepless", "trouble sleeping", "night awake"],
      "Tired Eyes from Screen Time": ["tired eyes", "screen time", "eye strain", "burning eyes"],
      "Foot Odor": ["foot odor", "smelly feet", "foot smell", "stinky feet"],
      "Cracked Heels": ["cracked heels", "heel crack", "dry heels", "rough feet"],
      "Mild Itchy Scalp": ["itchy scalp", "scalp itch", "scratch scalp"],
      "Mild Seasonal Dry Nose": ["dry nose", "nasal dryness", "dry nostril"],
      "Mild Hand Dryness": ["hand dryness", "dry hands", "rough hands"],
      "Mild Muscle Soreness After Exercise": ["muscle soreness", "sore muscle", "muscle stiffness", "exercise ache"],
      "Mild Menstrual Cramps": ["menstrual cramps", "period pain", "menstrual pain", "period cramps"],
      "Mild Travel Fatigue": ["travel fatigue", "jet lag", "exhaustion travel"],
      "Mild Bad Breath": ["bad breath", "breath smell", "mouth odor"],
      "Mild Hoarseness of Voice": ["hoarseness", "hoarse voice", "voice strain", "voice loss"],
      "Mild Neck Stiffness": ["neck stiffness", "stiff neck", "neck pain"],
      "Mild Leg Cramps": ["leg cramps", "calf cramps", "muscle spasm leg"],
      "Mild Loss of Appetite": ["appetite", "loss of appetite", "not hungry"]
    };

    REMEDY_DATABASE.forEach(item => {
      let score = 0;
      const terms = keywordMap[item.ailment] || [];

      // 1. Direct match on ailment name
      if (normalized.includes(item.ailment.toLowerCase())) {
        score += 15;
      }

      // 2. Match on keywords list
      terms.forEach(term => {
        if (normalized.includes(term)) {
          score += 3;
        }
      });

      // 3. Dynamic match of words in the ailment name (skipping short common words)
      const stopWords = ["the", "and", "for", "you", "are", "not", "but", "with", "from", "after", "time", "mild", "mildly", "some", "your", "this", "that"];
      const ailmentWords = item.ailment.toLowerCase().split(/[\s/]+/);
      ailmentWords.forEach(word => {
        if (word.length >= 3 && !stopWords.includes(word) && normalized.includes(word)) {
          score += 5;
        }
      });

      // 4. Special checks for distinguishing Dry Cough vs Wet Cough
      if (item.ailment === "Dry Cough" && normalized.includes("dry") && normalized.includes("cough")) {
        score += 10;
      }
      if (item.ailment === "Wet Cough" && (normalized.includes("wet") || normalized.includes("mucus") || normalized.includes("phlegm")) && normalized.includes("cough")) {
        score += 10;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore > 0 && bestMatch) {
      return bestMatch;
    }
    return null;
  }

  function matchLocalRemedies(query) {
    const match = findBestLocalMatch(query);
    if (match) {
      return formatAilmentMarkdown(match);
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
  // --- Prompt Builder with RAG context ---
  function getSystemInstruction(localMatch) {
    let context = "";
    if (localMatch) {
      context = `You have access to the following verified remedy from the local database:
Ailment: ${localMatch.ailment}
Remedies:
${localMatch.remedies.map((r, i) => `Remedy ${i+1}: ${r.name}
Ingredients:
${r.ingredients.map(ing => `* ${ing}`).join("\n")}
Preparation:
${r.preparation}
Usage:
${r.usage}`).join("\n\n")}
When Not To Use:
${localMatch.when_not_to_use}
When To See A Doctor:
${localMatch.see_doctor_if.map(c => `* ${c}`).join("\n")}

YOUR TASK is to review this data and answer the user's specific query.
- If the user is asking a SPECIFIC question (for example: "How long should I boil fennel seeds?", "Can I chew fennel directly?", "Is cumin water good for acid reflux?", etc.), analyze the remedy database context and answer their question directly, simply, and conversationally in an easy-to-understand manner. You do NOT need to dump the entire layout structure. Just focus on answering their exact question accurately and include relevant precautions (When Not to Use or When to See a Doctor) only if it pertains to their question.
- If the user is asking a GENERAL question, describing a general symptom (like "I have acidity", "remedies for acidity", "what to do for common cold"), or explicitly requests the full remedy list/data, present the structured remedy details following the layout below. Do not add any new ingredients or modify the core preparation/usage steps. Do not invent remedies.`;
    } else {
      context = `The user is asking about a symptom or topic that is NOT verified in the local database.
If the query is related to health, symptoms, or traditional home remedies, you must state clearly and politely that you do not have verified home remedies for this symptom in your database and advise them to consult a qualified healthcare professional. Do not recommend any home remedies.

If the query is off-topic (for example: programming/coding questions, software development, math, history, science, pop culture, geography, writing general scripts/essays, or other non-health subjects), you MUST refuse to answer. Politely state that you are an Ayurvedic Home Remedy Assistant and can only assist with minor symptoms and home remedies, and cannot help with unrelated topics.`;
    }

    return `You are an Ayurvedic Home Remedy Assistant.
Your task is to suggest traditional, safe, and natural home remedies for minor ailments using common kitchen/household ingredients.

CRITICAL POLICY FOR OFF-TOPIC QUERIES:
If the user's query is not related to health, minor medical symptoms, Ayurveda, home remedies, or the 13 approved kitchen ingredients (e.g., programming, writing code, software development, math, general science, translation of non-health texts, history, etc.), you MUST decline to answer.
Politely state: "I am an Ayurvedic Home Remedy Assistant. I can only assist with minor health symptoms and traditional home remedies, and cannot answer questions on other topics."

Adhere strictly to these safety rules:
1. If the user mentions any emergency or red-flag conditions (e.g. chest pain, breathing difficulty, severe/third-degree burns, sudden vision changes, severe pain, symptoms in children under 5, allergic reactions), immediately advise consulting a doctor.
2. Never provide a clinical medical diagnosis.
3. Present the remedy instructions in a very clear, supportive, and easy-to-understand layout.
   - For SPECIFIC queries/questions, answer them directly, friendly, and conversationally.
   - For GENERAL symptom queries or full list requests, follow this structured layout exactly:

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
...

### When Not To Use
[Explain situations or contraindications where this remedy should be avoided]

### When To See A Doctor
* [Specific condition or duration after which they must consult a doctor]
* [Another red flag condition]

⚠️ Disclaimer:
For informational purposes only. Not a substitute for medical advice.

${context}`;
  }

  // --- Gemini API Handler ---
  async function generateGeminiResponse(userMessage, localMatch) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`;
    const systemInstruction = getSystemInstruction(localMatch);

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
      throw new Error(`Failed to connect to AI server (${err.message || err}).`);
    }
  }

  // --- Groq API Handler ---
  async function generateGroqResponse(userMessage, localMatch) {
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const systemInstruction = getSystemInstruction(localMatch);

    const requestBody = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemInstruction
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error details:", errorData);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Invalid Groq API response format");
    }
  }

  // --- Off-topic Query Checker ---
  function isOffTopicQuery(query) {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return false;

    // Direct off-topic keywords (programming, math, tech, general knowledge)
    const offTopicKeywords = [
      "python", "javascript", "js", "html", "css", "c++", "c#", "java", "rust", "golang", "sql", "ruby", "php",
      "programming", "code", "coding", "software", "developer", "script", "compile", "algorithm", "database",
      "write a program", "write a code", "write code", "solve", "math", "algebra", "calculus", "equation",
      "history", "president", "capital of", "geography", "who is", "weather in", "movie", "song", "lyrics",
      "how to build a website", "git clone", "npm install", "pip install", "github", "docker", "kubernetes"
    ];

    if (offTopicKeywords.some(kw => normalized.includes(kw))) {
      return true;
    }

    // List of approved ingredients & related health/remedy keywords
    const healthKeywords = [
      "turmeric", "ginger", "honey", "tulsi", "ajwain", "jeera", "cumin", "fennel", "saunf", 
      "aloe", "coconut", "salt", "lemon", "clove", "pepper", "symptom", "remedy", "cure", 
      "treatment", "pain", "ache", "sore", "cough", "cold", "fever", "burn", "bite", "rash", 
      "skin", "headache", "stomach", "throat", "digestion", "nausea", "vomit", 
      "constipation", "bloat", "gas", "hiccup", "ulcer", "insomnia", "sleep", "appetite", 
      "fatigue", "tired", "spasm", "cramp", "breath", "eye", "lips", "nose", "heel", "sickness",
      "ailment", "health", "doctor", "medicine", "ayur", "herb", "natural"
    ];

    const hasHealthKeyword = healthKeywords.some(kw => normalized.includes(kw));

    // Common greetings/conversations that are acceptable to start/maintain chat
    const greetings = [
      "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", 
      "how are you", "who are you", "what are you", "help", "thank you", "thanks"
    ];
    const isGreeting = greetings.some(g => normalized.includes(g));

    // If it has no health keywords, is not a greeting/common conversation, and is moderately long, classify it as off-topic
    if (!hasHealthKeyword && !isGreeting && normalized.length > 15) {
      return true;
    }

    return false;
  }

  // --- Greeting Checker ---
  function isGreetingQuery(query) {
    const normalized = query.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    const simpleGreetings = [
      "hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", 
      "namaste", "yo", "hi there", "hello there"
    ];
    if (simpleGreetings.includes(normalized)) {
      return true;
    }
    if (normalized === "how are you" || normalized === "who are you" || normalized === "what are you") {
      return true;
    }
    return false;
  }

  // --- Send Message Processing Flow ---
  async function handleSend(msgText) {
    const inputMsg = (msgText || (chatInput ? chatInput.value : "")).trim();
    if (!inputMsg) return;

    // Clear input
    if (chatInput) {
      chatInput.value = "";
      updateCharCount();
    }

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
        appendMessageUI("bot", warningText, true, "Safety Checker");
        saveMessageToSession("bot", warningText, "Safety Checker");
      }, 800);
      return;
    }

    // 3. Bot Response Execution
    const typingRow = appendTypingIndicator();
    let botReply = "";
    let replySource = "";

    const localMatch = findBestLocalMatch(inputMsg);
    const offTopic = isOffTopicQuery(inputMsg);
    const isGreeting = isGreetingQuery(inputMsg);

    try {
      if (isGreeting) {
        await new Promise(resolve => setTimeout(resolve, 500));
        botReply = "Hello! 🌿 I am your Ayurvedic Home Remedy Assistant. How can I help you today? Describe your minor symptoms or ask about common kitchen remedies.";
        replySource = "Assistant";
      } else if (offTopic) {
        await new Promise(resolve => setTimeout(resolve, 600));
        botReply = "I am an Ayurvedic Home Remedy Assistant. I can only assist with minor health symptoms and traditional home remedies, and cannot answer questions on other topics.";
        replySource = "Off-topic Guard";
      } else if (aiProvider === "groq" && groqApiKey) {
        try {
          // Try Groq first
          botReply = await generateGroqResponse(inputMsg, localMatch);
          replySource = "Groq";
        } catch (groqError) {
          console.warn("Groq API failed, falling back to Gemini...", groqError);
          if (geminiApiKey) {
            botReply = await generateGeminiResponse(inputMsg, localMatch);
            replySource = "Gemini";
          } else {
            throw groqError;
          }
        }
      } else if (aiProvider === "gemini" && geminiApiKey) {
        try {
          // Try Gemini first
          botReply = await generateGeminiResponse(inputMsg, localMatch);
          replySource = "Gemini";
        } catch (geminiError) {
          console.warn("Gemini API failed, falling back to Groq...", geminiError);
          if (groqApiKey) {
            botReply = await generateGroqResponse(inputMsg, localMatch);
            replySource = "Groq";
          } else {
            throw geminiError;
          }
        }
      } else if (aiProvider !== "local" && groqApiKey) {
        botReply = await generateGroqResponse(inputMsg, localMatch);
        replySource = "Groq";
      } else if (aiProvider !== "local" && geminiApiKey) {
        botReply = await generateGeminiResponse(inputMsg, localMatch);
        replySource = "Gemini";
      } else {
        // Offline Local Matching Mode
        await new Promise(resolve => setTimeout(resolve, 800));
        botReply = localMatch ? formatAilmentMarkdown(localMatch) : "I don't have verified information about that symptom. Please consult a doctor.";
        replySource = "Local Database";
      }
    } catch (error) {
      console.warn("All LLM connections failed or unavailable, falling back to local DB:", error);
      botReply = `⚠️ API Error: ${error.message}\n\n*Falling back to local database...*\n\n` + 
                 (localMatch ? formatAilmentMarkdown(localMatch) : "I don't have verified information about that symptom. Please consult a doctor.");
      replySource = "Local Database";
    } finally {
      removeTypingIndicator(typingRow);
      appendMessageUI("bot", botReply, true, replySource);
      saveMessageToSession("bot", botReply, replySource);

      // Update session title in history list based on first user query
      updateSessionTitle(inputMsg);
    }
  }

  function saveMessageToSession(role, content, source = null) {
    const sessionIndex = chatSessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1) {
      chatSessions[sessionIndex].messages.push({ role, content, source });
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

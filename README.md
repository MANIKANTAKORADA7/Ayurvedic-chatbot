# 🌿 Ayurvedic Home Remedy Chatbot

A professional, premium-grade single-page web application designed to help users find safe, traditional Indian home remedies for 20 common minor ailments using 13 everyday kitchen ingredients.

---

## 📖 Table of Contents
1. [Core Features](#-core-features)
2. [Safety Controls (Critical Priority)](#%EF%B8%8F-safety-controls-critical-priority)
3. [Technology Stack](#-technology-stack)
4. [Supported Ailments & Approved Ingredients](#-supported-ailments--approved-ingredients)
5. [Installation & How to Run](#-installation--how-to-run)
6. [Mode of Operation](#-mode-of-operation)
7. [App Configuration & Settings](#-app-configuration--settings)

---

## 🍃 Core Features

- **ChatGPT-Style Chat Interface:** Smooth, responsive conversation flow with message history, typing indicators, and clean layout animations.
- **Natural Health Aesthetics:** Curated color palette featuring forest green, turmeric amber, soft stone cream, and sand clay accents with a beautiful Dark Mode option.
- **Disclaimer Banner:** Prominent persistent warning reminding users that remedies are for informational purposes only.
- **Interactive Symptom Chips:** Clickable quick symptom suggestions (Common Cold, Indigestion, Dry Skin, etc.) for instant search.
- **Copy & Export Functionality:** Copy responses to the clipboard, and export conversation history in `.txt` or `.json` formats.
- **Persistent Chat History:** Automatically saves chats in the browser’s `localStorage`, allowing users to resume previous sessions or delete them.

---

## ⚠️ Safety Controls (Critical Priority)

The chatbot prioritizes safety above all else. **Client-side pattern-matching engines** scan user inputs before any remedy is processed. If any of the following symptoms/conditions are detected, remedies are blocked, and a red medical warning card is presented immediately:

* Chest pain
* Breathing difficulty / Shortness of breath
* High fever (above 102°F)
* Severe, persistent, or unbearable pain
* Third-degree/severe burns
* Eye injuries or vision issues
* Allergic reactions (e.g., hives, anaphylaxis)
* Seizures or convulsions
* Uncontrolled bleeding
* Loss of consciousness / Fainting
* Symptoms in infants/children under 5 years old (e.g., "baby", "toddler", "1 year old", etc.)

**Emergency Output Wording:**
> *"⚠️ Please consult a doctor immediately. This chatbot does not provide remedies for serious medical conditions."*

---

## 🛠️ Technology Stack

- **Frontend:** Semantic HTML5, CSS Custom Properties (CSS variables), Vanilla ES6 JavaScript (No frameworks, pure and lightning-fast).
- **Typography:** Google Fonts ("Outfit" for header typography, "Plus Jakarta Sans" for body elements).
- **Storage:** Browser `localStorage` for sessions and theme.

---

## 📦 Supported Ailments & Approved Ingredients

The application provides 2-3 verified traditional remedies for **20 specific minor ailments**:

1. Common Cold
2. Sore Throat
3. Tension Headache
4. Acidity
5. Gas/Bloating
6. Indigestion
7. Dry Cough
8. Wet Cough
9. Nausea
10. Hiccups
11. Mouth Ulcers
12. Minor Burns
13. Mosquito Bites
14. Dandruff
15. Dry Skin
16. Dark Circles
17. Minor Joint Pain
18. Mild Constipation
19. Chapped Lips
20. Mild Seasonal Congestion

All remedies use **ONLY** these 13 kitchen ingredients:
* Turmeric, Ginger, Honey, Tulsi, Ajwain, Jeera, Fennel, Aloe Vera, Coconut Oil, Salt, Lemon, Clove, Black Pepper.

---

## 🚀 Installation & How to Run

1. Clone or download the folder into your local environment.
2. The folder structure contains:
   - `index.html` - App markup
   - `styles.css` - UI styling variables & layout rules
   - `database.js` - Remedy JSON database & safety definitions
   - `app.js` - Client controllers and API connections
3. Open `index.html` directly in any web browser (Chrome, Firefox, Safari, Edge) — no build steps or local servers are required!

---

## 🤖 Mode of Operation

The application runs entirely locally and offline inside your browser. It parses queries and matches key terms to find the closest match in the remedy database. If no match is found, it safely replies that the symptom is not recognized and advises seeing a physician.

---

## ⚙️ App Configuration & Settings

Click on **"Settings & Options"** in the sidebar to:
- **Export conversations** as a readable text transcript or structured JSON file.
- **Wipe** your saved browser chat history.
- Switch between **Light Mode** (Warm Stone & Cream) and **Dark Mode** (Deep Night Forest) via the theme toggle button in the header.

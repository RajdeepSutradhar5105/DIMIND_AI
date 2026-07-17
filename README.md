<div align="center">

<img src="./assets/logo.jpg" alt="Dimind AI Logo" width="180"/>

# 🧠 DIMIND
### ARTIFICIAL INTELLIGENCE

*Think Less. Build More.*

An intelligent **Agentic AI Assistant** that automatically understands your request, chooses the right tool, and responds naturally — without exposing internal tool calls.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-6C5CE7?style=for-the-badge)](https://dimind-1.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/📁_GitHub_Repository-View_Code-1a1a2e?style=for-the-badge&logo=github)](https://github.com/RajdeepSutradhar5105/DIMIND_AI)
[![Star on GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-Support_Us-1a1a2e?style=for-the-badge)](https://github.com/RajdeepSutradhar5105/DIMIND_AI)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-T6-blue?style=flat-square&logo=typescript)
![Groq AI](https://img.shields.io/badge/Groq-AI-orange?style=flat-square)
[![GitHub Stars](https://img.shields.io/github/stars/RajdeepSutradhar5105/DIMIND_AI?style=flat-square&color=6C5CE7)](https://github.com/RajdeepSutradhar5105/DIMIND_AI)
[![GitHub Forks](https://img.shields.io/github/forks/RajdeepSutradhar5105/DIMIND_AI?style=flat-square&color=6C5CE7)](https://github.com/RajdeepSutradhar5105/DIMIND_AI/fork)

🌍 **Live Application:** [https://dimind-1.vercel.app/](https://dimind-1.vercel.app/)

</div>

---

## ✨ About

Dimind AI is a modern **Agentic AI Assistant** designed to provide a seamless conversational experience. Instead of making users choose between different tools, Dimind intelligently analyzes every request, automatically selects the appropriate tool, executes it in the background, and returns a clean, human-like response.

`No technical jargon` · `No tool names` · `Just intelligent conversations`

---

## 🚀 Features

- ✅ Natural AI Conversations
- ✅ Automatic Tool Selection
- ✅ PDF Generation
- ✅ QR Code Generator
- ✅ Calculator
- ✅ Live Weather
- ✅ Dictionary
- ✅ Unit Converter
- ✅ Code Explanation
- ✅ Downloadable Files
- ✅ Chat History
- ✅ Fast & Responsive UI
- ✅ Modern Design

---

## 🧬 Tech Stack

| Layer      | Technology                  |
|------------|------------------------------|
| Frontend   | Next.js, React, TypeScript   |
| Styling    | Tailwind CSS                 |
| AI         | Groq API, Llama Models       |
| Backend    | Next.js API Routes           |
| PDF        | pdf-lib                      |
| Weather    | Open-Meteo API                |
| Dictionary | Free Dictionary API           |
| QR Code    | QR Server API                 |

---

## ⚙️ How It Works

```
User Query
    ↓
AI Understands Intent
    ↓
Selects Appropriate Tool
    ↓
Executes Tool
    ↓
Generates Natural Response
    ↓
Returns Final Answer
```

---

## 🧰 Available Tools

| Tool             | Description                        |
|-------------------|-------------------------------------|
| 🧮 Calculator      | Perform mathematical calculations, including multi-step word problems |
| ⏱️ Time            | Get current date & time for any location |
| 🌤️ Weather         | Get real-time weather information   |
| 📖 Dictionary      | Find meanings, synonyms & definitions |
| 📐 Unit Converter  | Convert measurement units (length, weight, temperature, etc.) |
| 📄 PDF Generator   | Generate structured, downloadable PDF documents |
| ▦ QR Generator    | Generate QR codes instantly from text or links |
| 💻 Code Explainer  | Explain programming code in plain English |

Dimind can also **chain multiple tools automatically** in a single response — for example, a weather + time query, or a multi-step calculator problem, resolves as one natural answer instead of separate tool calls.

---

## 📁 Project Structure

```
app/
├── api/
│   └── chat/
├── components/
├── lib/
│   └── tools/
│       ├── calculator.ts
│       ├── dictionary.ts
│       ├── weather.ts
│       ├── unit.ts
│       ├── pdf.ts
│       ├── qr.ts
│       └── codeExplain.ts
└── public/
```

---

## 🏁 Getting Started

**1. Clone Repository**
```bash
git clone https://github.com/RajdeepSutradhar5105/DIMIND_AI.git
```

**2. Navigate**
```bash
cd DIMIND_AI
```

**3. Install Dependencies**
```bash
npm install
```

**4. Configure Environment**

Create a `.env.local` file:
```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
MODEL_NAME=llama-3.3-70b-versatile
```

**5. Run**
```bash
npm run dev
```

**6. Visit**
```
http://localhost:3000
```

---

## 🖼️ Project Gallery

### 🏠 Home Interface
Clean chat UI with a sidebar listing all available Neural Modules (tools), live session tracking, and a modern dark theme.

<img src="./assets/HOME.png" alt="Dimind Home Interface" width="800"/>

### 🧮 Calculator
Handles multi-step, real-world word problems — discounts, GST, change calculation — end to end, chaining multiple calculator calls automatically.

<img src="./assets/Calculator.png" alt="Calculator Tool" width="700"/>

### 🌤️ Weather & Time
Fetches live date, time, and weather conditions (temperature, wind speed) for any city in a single natural query.

<img src="./assets/Wheather Date Time.png" alt="Weather and Time Tool" width="700"/>

### 📖 Dictionary
Returns clear, natural-language definitions instead of raw dictionary API output.

<img src="./assets/dictionary.png" alt="Dictionary Tool" width="700"/>

### 📐 Unit Converter
Converts between measurement units (temperature, length, weight, etc.) with a direct, human-readable answer.

<img src="./assets/converter.png" alt="Unit Converter Tool" width="700"/>

### 💻 Code Explainer
Explains what a snippet of code does in plain English — great for beginners and quick code reviews.

<img src="./assets/CODE.png" alt="Code Explainer Tool" width="700"/>

### 📄 PDF Generator
Generates fully structured, professional PDF documents — headers, section headings, bullet points, numbered lists, tables, quotes, and conclusions — from a single natural-language request.

<img src="./assets/PDF1.png" alt="PDF Generator Request" width="700"/>
<img src="./assets/PDF2.png" alt="PDF Generator Output" width="700"/>

### ▦ QR Code Generator
Instantly generates a downloadable QR code for any link or text provided.

<img src="./assets/QR.png" alt="QR Code Generator Tool" width="700"/>

---

## 💡 Why Dimind?

- 🎯 Automatic Tool Selection
- 🧹 Clean Natural Responses
- ⚡ Fast Performance
- 🎨 Modern UI/UX
- 📥 Downloadable Files
- 🔧 Easy to Extend
- 🤖 Agentic Workflow

---

## 🔮 Upcoming Features

- 🎙️ Voice Assistant
- 🖼️ Image Generation
- 📎 File Upload
- 📄 Document Chat
- 🗣️ Speech-to-Text
- 🔊 Text-to-Speech
- 🧠 Long-Term Memory
- 🌐 Multi-language Support
- 🔐 Authentication
- ☁️ Cloud Sync

---

## 🤝 Contributing

Contributions are always welcome!

1. 🍴 Fork the Repository
2. 🌿 Create a Feature Branch
3. 💾 Commit your Changes
4. 📤 Push to GitHub
5. 🔃 Open a Pull Request

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

It really helps! 🙂

---

## 👨‍💻 Developer

**Rajdeep Sutradhar**
B.Tech CSE (Data Science)
AI · Machine Learning · Agentic AI · Full Stack Dev

🔗 [github.com/RajdeepSutradhar5105](https://github.com/RajdeepSutradhar5105)
🌐 Live Demo: [dimind-1.vercel.app](https://dimind-1.vercel.app/)

---

<div align="center">

⭐ **If you like this project, don't forget to star the repository!**

Made with ❤️ by Rajdeep Sutradhar | Happy Coding! 🚀

</div>

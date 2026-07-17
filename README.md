# 🧠 Dimind AI

> **An Agentic AI Assistant built with Next.js, TypeScript, and Groq AI**

Dimind AI is a modern AI assistant that combines multiple utility tools into a single intelligent chat interface. Instead of manually selecting tools, the AI automatically decides which tool to use based on the user's request and returns a clean, conversational response.

---

## ✨ Features

- 🤖 AI-powered conversational assistant
- 🧮 Calculator
- 🌦️ Live Weather Information
- 📖 Dictionary & Word Meanings
- 📏 Unit Converter
- 📱 QR Code Generator
- 📄 PDF Generator
- 💻 Code Explainer
- 💬 Chat History
- ⚡ Fast Next.js Frontend
- 🎨 Clean and Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS

### AI
- Groq API
- Llama 3.3 70B Versatile

### Libraries
- pdf-lib
- Open-Meteo API
- DictionaryAPI
- QR Server API

---

## 📂 Project Structure

```
app/
│
├── api/
│   └── chat/
│
├── components/
│
├── lib/
│   ├── tools/
│   │   ├── calculator.ts
│   │   ├── dictionary.ts
│   │   ├── weather.ts
│   │   ├── unit.ts
│   │   ├── pdf.ts
│   │   ├── qr.ts
│   │   └── explainer.ts
│   │
│   ├── groq.ts
│   ├── storage.ts
│   └── systemPrompt.ts
│
└── public/
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/your-username/dimind-ai.git
```

Move into the project

```bash
cd dimind-ai
```

Install dependencies

```bash
npm install
```

Create an environment file

```bash
cp .env.example .env.local
```

Add your Groq API key

```env
GROQ_API_KEY=your_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
```

Run the development server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

## 💡 How It Works

1. User enters a query.
2. The AI analyzes the request.
3. If a tool is required, the appropriate tool is selected automatically.
4. The tool executes.
5. The AI returns a natural language response without exposing internal tool details.

---

## 🔧 Available AI Tools

| Tool | Description |
|------|-------------|
| Calculator | Performs mathematical calculations |
| Weather | Fetches live weather information |
| Dictionary | Provides word meanings |
| Unit Converter | Converts measurement units |
| QR Generator | Creates downloadable QR codes |
| PDF Generator | Generates PDF documents |
| Code Explainer | Explains programming code using AI |

---

## 🎯 Highlights

- Automatic tool selection
- Clean conversational responses
- Responsive UI
- Downloadable PDFs
- Downloadable QR Codes
- Browser-based chat history
- Fast serverless architecture
- Easy deployment on Vercel

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
├── home.png
├── chat.png
├── pdf.png
└── qr.png
```

---

## 🌐 Deployment

Deploy instantly using **Vercel**

```bash
npm run build
```

Then import your GitHub repository into Vercel and add:

```env
GROQ_API_KEY=your_key
MODEL_NAME=llama-3.3-70b-versatile
```

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| GROQ_API_KEY | Groq API Key |
| MODEL_NAME | Groq Model Name |

---

## 📈 Future Improvements

- Voice Assistant
- Image Generation
- Speech-to-Text
- Text-to-Speech
- Authentication
- Cloud Chat History
- File Upload & Analysis
- Multi-language Support
- AI Memory
- RAG Integration

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Rajdeep Sutradhar**

B.Tech CSE (Data Science)

If you found this project helpful, don't forget to ⭐ the repository!

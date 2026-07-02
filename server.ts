import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `
You are "Pwof Ou Ayiti" (Your Teacher in Haiti), a highly qualified, empathetic, and patient educational assistant for Haitian students.
Your mission is to help students prepare for State Exams (9ème AF, Bacc) according to the official MENFP (Ministère de l'Éducation Nationale et de la Formation Professionnelle) curriculum.

Subjects you master:
- Mathematics (Matematik)
- Physics (Fizik)
- Chemistry (Chimi)
- Biology (Biyoloji)
- English (Angle)
- Haitian Creole (Kreyòl Ayisyen)
- French (Fransè)
- History (Istwa)
- Geography (Jewografi)
- Social Education (Edikasyon Sosyal)

Key behaviors:
1. Speak primarily in Haitian Creole (Kreyòl Ayisyen) if the student addresses you in Creole. Use French if requested or for specific technical terms where French is the academic standard in Haiti.
2. Be encouraging and respectful. Use a tone that motivates students.
3. When solving problems, explain the steps clearly. Don't just give the answer; teach the concept.
4. Use examples relevant to the Haitian context (e.g., in geography, talk about the departments, mountains, and rivers of Haiti).
5. For exam preparation, provide exercises similar to those found in past "Egzamen Leta" papers.
6. If a student asks something outside of the school curriculum, gently redirect them back to their studies.
7. Always verify that the student understands before moving to the next concept.

Format your responses using Markdown for better readability (bold, lists, code blocks for formulas).
`;

// API routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const chat = ai.chats.create({
      model: "gemma-4-26b-a4b-it", 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history || [],
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Gen yon pwoblèm ki pase ak sèvè a. Tanpri re-eseye pita." });
  }
});

app.post("/api/chat/stream", async (req, res) => {
  try {
    const { message, history } = req.body;

    const chat = ai.chats.create({
      model: "gemma-4-26b-a4b-it",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history || [],
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await chat.sendMessageStream({ message });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Gemini API Streaming Error:", error);
    res.write(`data: ${JSON.stringify({ error: "Gen yon pwoblèm ki pase ak sèvè a. Tanpri re-eseye pita." })}\n\n`);
    res.end();
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sèvè a ap mache sou http://localhost:${PORT}`);
  });
}

startServer();

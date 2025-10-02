require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // request logging
const { askRAG } = require("./rag");

const app = express();

// ** config **
const PORT = process.env.PORT || 3001;
const ALLOW_ORIGINS = [
  "http://localhost:9000", // webpack-dev-server default
  "http://127.0.0.1:9000",
  "http://localhost:5173", // Vite default, in case of switch
  "http://127.0.0.1:5173",
];

// ** Middleware **
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow curl / Postman
      if (ALLOW_ORIGINS.includes(origin)) return cb(null, true);
      // Relax for dev: comment the next line to allow all origins
      // return cb(new Error("Not allowed by CORS"), false);
      return cb(null, true);
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ** env sanity check **
function checkEnv() {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!process.env.SUPABASE_ANON_KEY && !process.env.SUPABASE_SERVICE_ROLE) {
    missing.push("SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE");
  }
  if (!process.env.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
  return missing;
}

// ** Routes **
app.get("/health", (req, res) => {
  const missing = checkEnv();
  res.json({
    ok: missing.length === 0,
    missingEnv: missing,
    message:
      missing.length === 0
        ? "Server healthy. Env looks good."
        : "Server running, but missing env vars.",
  });
});

/**
 * POST /api/ask
 * body: { question: string }
 * Returns: { answer: string, sources: [{path, chunk, similarity}], usedRPC, degraded? }
 */
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body || {};
    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length < 3
    ) {
      return res.status(400).json({
        error: "Please provide a 'question' (string, length >= 3).",
      });
    }

    // call RAG pipeline
    const response = await askRAG(question.trim());

    // ref list
    const references = [
      ...new Set(response.sources?.map((s) => s.path) || []),
    ].map((p, i) => `${i + 1}. ${p}`);

    res.json({
      ok: true,
      answer: response.answer,
      sources: response.sources || [],
      references,
      usedRPC: response.usedRPC || false,
      degraded: !!response.degraded,
    });
  } catch (err) {
    console.error("Error in /api/ask:", err?.message || err);
    res.status(500).json({
      ok: false,
      error: "Server error composing answer. Check server logs.",
    });
  }
});

app.post("/api/rag/chat", async (req, res) => {
  try {
    const payload = req.body ?? {};
    const rawMessage =
      typeof payload.message === "string" ? payload.message : "";
    const message = rawMessage.trim();

    const chatHistory = Array.isArray(payload.history) ? payload.history : [];

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const response = await askRAG(message, chatHistory);

    // normalizr sources for UI chips
    const uniquePaths = [
      ...new Set((response.sources || []).map((s) => s.path)),
    ];
    const sources = uniquePaths.slice(0, 5).map((p) => ({
      title: p.split("/").pop() || p,
      url: null,
      quote: null,
    }));

    return res.json({
      answer: response.answer,
      sources,
      meta: { usedRPC: !!response.usedRPC, degraded: !!response.degraded },
    });
  } catch (err) {
    console.error("Error in /api/rag/chat:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// ** Start **
const missing = checkEnv();
if (missing.length) {
  console.warn(
    `[server] ⚠️ Missing env vars: ${missing.join(
      ", "
    )} — some features may fail.`
  );
}
app.listen(PORT, () => {
  console.log(
    `[server] ✅ API listening on http://localhost:${PORT}  (try: POST /api/ask)`
  );
});

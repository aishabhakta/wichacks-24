require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");

const supabase = createClient(
  process.env.SUPABASE_URL,
  // Safe on the server. If RLS is off, ANON is fine for reads; SERVICE_ROLE also works.
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims
const CHAT_MODEL = "gpt-4o-mini";

async function embedQuery(text) {
  console.log("📝 Embedding query:", text);
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  console.log(
    "✅ Embedding generated (first 5 dims):",
    resp.data[0].embedding.slice(0, 5)
  );
  return resp.data[0].embedding;
}

function formatSources(rows) {
  const uniq = [];
  const seen = new Set();
  for (const r of rows) {
    if (!seen.has(r.path)) {
      uniq.push(r.path);
      seen.add(r.path);
    }
    if (uniq.length >= 5) break;
  }
  return uniq.map((p, i) => `${i + 1}. ${p}`).join("\n");
}

async function askRAG(question, history = []) {
  console.log("❓ Incoming question:", question);

  // 1) embed user question
  const qEmbedding = await embedQuery(question);

  // 2) call RPC (vector search)
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: qEmbedding,
    match_count: 8, // tune
    similarity_threshold: 0.0, // allow everything for now
  });

  if (error) {
    console.error("❌ RPC error:", error);
    throw new Error(error.message || "match_documents RPC failed");
  }

  console.log(`🔎 Supabase returned ${data?.length || 0} rows`);
  if (data && data.length) {
    data.forEach((row, i) => {
      console.log(
        `  Result ${i + 1}: sim=${row.similarity.toFixed(3)} | ${
          row.path
        } (chunk ${row.chunk_index})`
      );
    });
  }

  const top = data || [];

  // 3) build  context
  const contextBlocks = top
    .map(
      (c, i) =>
        `### Source ${i + 1}: ${c.path} (chunk ${
          c.chunk_index
        }, sim=${c.similarity.toFixed(3)})\n${c.content}`
    )
    .join("\n\n");

  console.log(
    "📚 Context sent to GPT (first 500 chars):\n",
    contextBlocks.slice(0, 500)
  );

  // build history string
  const historyStr =
    Array.isArray(history) && history.length
      ? history
          .map((h) => `${(h.role || "user").toUpperCase()}: ${h.content || ""}`)
          .slice(-8)
          .join("\n")
      : "(no prior messages)";

  const systemPrompt = `
You are a maternal health assistant. Answer using ONLY the provided context.
If the answer isn't present, say so. Be concise, supportive, and include a short "References" list with filenames.
  `.trim();

  const userPrompt = `
Chat History:
${historyStr}

Question:
${question}

Context:
${contextBlocks}
  `.trim();

  // 4) compose answer
  try {
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate an answer right now.";

    console.log("🤖 GPT Answer:", answer);

    return {
      answer,
      sources: top.map((t) => ({
        path: t.path,
        chunk: t.chunk_index,
        similarity: t.similarity,
      })),
      usedRPC: true,
    };
  } catch (err) {
    console.error("❌ OpenAI chat error:", err?.message);
    const fallback =
      "AI composer unavailable. Here are the most relevant passages:\n\n" +
      top.map((t) => t.content).join("\n\n") +
      "\n\nReferences:\n" +
      formatSources(top);

    return {
      answer: fallback,
      sources: top.map((t) => ({
        path: t.path,
        chunk: t.chunk_index,
        similarity: t.similarity,
      })),
      usedRPC: true,
      degraded: true,
    };
  }
}

module.exports = { askRAG };

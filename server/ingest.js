require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");

const DOCS_DIR = path.join(process.cwd(), "docs");

const supabase = createClient(
  process.env.SUPABASE_URL,
  // Use SERVICE_ROLE for ingest
  process.env.SUPABASE_SERVICE_ROLE
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Chunker logic (by ~1100 chars with 200 overlap) */
function chunkText(text, chunkSize = 1100, overlap = 200) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const slice = text.slice(start, end);
    // don't cut mid word
    const lastNewline = slice.lastIndexOf("\n");
    const lastSpace = slice.lastIndexOf(" ");
    const cut = Math.max(lastNewline, lastSpace, -1);
    const chunk = cut > 300 ? slice.slice(0, cut) : slice;
    chunks.push(chunk.trim());
    if (end === text.length) break;
    start += chunk.length - overlap;
    if (start < 0) start = 0;
  }
  // filter out tiny/empty chunks
  return chunks.filter((c) => c && c.length > 30);
}

async function embed(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

async function ingestFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const chunks = chunkText(content);

  console.log(
    `\n📄 Ingesting ${path.relative(process.cwd(), filePath)} (${
      chunks.length
    } chunks)`
  );

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];

    // get embedding
    const embedding = await embed(chunkText);

    // upsert row
    const { error } = await supabase.from("documents").upsert(
      {
        path: path.relative(process.cwd(), filePath),
        chunk_index: i,
        content: chunkText,
        embedding,
      },
      { onConflict: "path,chunk_index" }
    );

    if (error) {
      console.error("❌ Upsert error:", error);
      process.exit(1);
    } else {
      process.stdout.write(`  ✓ chunk ${i + 1}/${chunks.length}\r`);
    }
  }
  console.log(`\n✅ Done: ${filePath}`);
}

async function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Docs dir not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(DOCS_DIR, f));

  if (files.length === 0) {
    console.log("No .md files found in docs/.");
    return;
  }

  for (const f of files) {
    await ingestFile(f);
  }

  console.log("\n🎉 Ingest complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

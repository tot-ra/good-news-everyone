import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import https from "node:https";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const booksDir = path.join(rootDir, "src", "data", "books");
const outputPath = path.join(rootDir, "src", "lexicon-fallbacks.js");
const batchSeparator = "\n[[[BATCH_BREAK_91F4C2]]]\n";
const fieldSeparator = "\n[[[FIELD_BREAK_A17D55]]]\n";
const variantSeparator = "\n[[[VARIANT_BREAK_65BC11]]]\n";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeGreek(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}]+/gu, "")
    .toLowerCase()
    .replace(/ς/g, "σ");
}

function requestText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "user-agent": "Mozilla/5.0"
          }
        },
        (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Request failed with status ${response.statusCode} for ${url}`));
            return;
          }

          let data = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => {
            data += chunk;
          });
          response.on("end", () => resolve(data));
        }
      )
      .on("error", reject);
  });
}

async function translateText(value) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "ru");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", value);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const payload = JSON.parse(await requestText(url));
      return payload?.[0]?.map((part) => part?.[0] ?? "").join("").trim() || value;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      await sleep(400 * (attempt + 1));
    }
  }

  return value;
}

async function translateBatch(values) {
  const translated = await translateText(values.join(batchSeparator));
  const parts = translated.split(batchSeparator);

  if (parts.length === values.length) {
    return parts.map((item) => item.trim());
  }

  const output = [];
  for (const value of values) {
    output.push(await translateText(value));
  }
  return output;
}

function collectLemmaSet() {
  const lemmas = new Set();

  for (const bookId of ["matthew", "mark", "luke", "john"]) {
    const book = JSON.parse(
      readFileSync(path.join(booksDir, `${bookId}.json`), "utf8")
    );

    for (const chapter of book.chapters) {
      for (const scene of chapter.scenes) {
        for (const verse of scene.verses ?? []) {
          for (const token of verse.greekTokens ?? []) {
            if (token.lemma) {
              lemmas.add(token.lemma);
            }
          }
        }
      }
    }
  }

  return lemmas;
}

function parseStrongsDictionary(source) {
  const start = source.indexOf("{");
  const end = source.lastIndexOf("};");
  return Function(`return (${source.slice(start, end + 1)});`)();
}

function cleanGloss(value = "") {
  return value
    .replace(/\s+/g, " ")
    .replace(/^[Tt]o\s+/g, "")
    .replace(/^properly,\s*/i, "")
    .replace(/^i\.e\.\s*/i, "")
    .trim()
    .replace(/\.$/, "");
}

function splitVariants(value = "") {
  return [...new Set(
    value
      .replace(/^\+\s*/, "")
      .split(/,(?![^()]*\))/)
      .map((item) => item.replace(/\s+/g, " ").trim())
      .filter(Boolean)
  )];
}

function cleanRussianVariant(value = "") {
  return value
    .replace(/^\+\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

const lemmaSet = collectLemmaSet();
const strongsSource = await requestText(
  "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js"
);
const strongs = parseStrongsDictionary(strongsSource);
const strongsEntries = Object.values(strongs);
const strongsByLemma = new Map();

for (const entry of strongsEntries) {
  if (!entry.lemma) {
    continue;
  }

  const normalizedLemma = normalizeGreek(entry.lemma);
  if (!strongsByLemma.has(normalizedLemma)) {
    strongsByLemma.set(normalizedLemma, entry);
  }
}

const queue = [];
for (const lemma of lemmaSet) {
  const entry = strongsByLemma.get(normalizeGreek(lemma));
  if (!entry?.strongs_def && !entry?.kjv_def) {
    continue;
  }

  queue.push({
    lemma,
    strongsDef: cleanGloss(entry.strongs_def ?? ""),
    kjvVariants: splitVariants(entry.kjv_def?.trim() ?? "")
  });
}

const translatedEntries = [];
for (let index = 0; index < queue.length; index += 24) {
  const chunk = queue.slice(index, index + 24);
  const texts = chunk.map(
    ({ strongsDef, kjvVariants }) => `${strongsDef}${fieldSeparator}${kjvVariants.join(variantSeparator)}`
  );
  const translated = await translateBatch(texts);

  translated.forEach((value, offset) => {
    const [gloss = "", variantsSource = ""] = value.split(fieldSeparator);
    translatedEntries.push({
      lemma: chunk[offset].lemma,
      gloss: cleanRussianVariant(gloss),
      variants: variantsSource
        .split(variantSeparator)
        .map(cleanRussianVariant)
        .filter(Boolean)
    });
  });

  console.log(`Translated ${Math.min(index + chunk.length, queue.length)} / ${queue.length}`);
}

const output = Object.fromEntries(
  translatedEntries.map((entry) => [
    entry.lemma,
    {
      gloss: entry.gloss,
      variants: entry.variants
    }
  ])
);

await fs.writeFile(
  outputPath,
  `export const greekLemmaFallbackLexicon = ${JSON.stringify(output, null, 2)};\n`
);

console.log(`Wrote ${Object.keys(output).length} lemma fallbacks to ${outputPath}`);

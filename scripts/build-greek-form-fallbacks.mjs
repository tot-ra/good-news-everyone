import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const booksDir = path.join(rootDir, "src", "data", "books");
const outputPath = path.join(rootDir, "src", "greek-form-fallbacks.js");

const MORPH_SOURCES = {
  matthew: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/61-Mt-morphgnt.txt",
  mark: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/62-Mk-morphgnt.txt",
  luke: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/63-Lk-morphgnt.txt",
  john: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/64-Jn-morphgnt.txt"
};

const MANUAL_FORM_OVERRIDES = {
  // John 8 in the current Greek source includes forms that are absent from SBLGNT/MorphGNT.
  ανακυψασ: {
    lemma: "ἀνακύπτω",
    pos: "V-",
    parsing: "-AAPNSM-"
  }
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
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
      })
      .on("error", reject);
  });
}

function normalizeGreek(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}]+/gu, "")
    .toLowerCase()
    .replace(/ς/g, "σ");
}

async function collectMissingForms() {
  const forms = new Set();

  for (const bookId of Object.keys(MORPH_SOURCES)) {
    const book = JSON.parse(await fs.readFile(path.join(booksDir, `${bookId}.json`), "utf8"));

    for (const chapter of book.chapters ?? []) {
      for (const scene of chapter.scenes ?? []) {
        for (const verse of scene.verses ?? []) {
          for (const token of verse.greekTokens ?? []) {
            if (!token.lemma && token.text) {
              forms.add(normalizeGreek(token.text));
            }
          }
        }
      }
    }
  }

  return forms;
}

function buildMorphFormMap(raw) {
  const formMap = new Map();

  raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split(/\s+/);
      if (parts.length < 7) {
        return;
      }

      const form = normalizeGreek(parts[5]);
      const lemma = parts[6];
      const pos = parts[1];
      const parsing = parts[2];
      if (!form || !lemma) {
        return;
      }

      if (!formMap.has(form)) {
        formMap.set(form, []);
      }

      formMap.get(form).push({ lemma, pos, parsing });
    });

  return formMap;
}

function pickBestMorphMatch(matches = []) {
  const counts = new Map();

  matches.forEach(({ lemma, pos, parsing }) => {
    const key = `${lemma}\t${pos}\t${parsing}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const [bestKey] =
    [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0] ?? [];

  if (!bestKey) {
    return null;
  }

  const [lemma, pos, parsing] = bestKey.split("\t");
  return { lemma, pos, parsing };
}

const missingForms = await collectMissingForms();
const sourcePayloads = await Promise.all(
  Object.values(MORPH_SOURCES).map((url) => fetchText(url))
);
const combinedFormMap = new Map();

sourcePayloads.forEach((raw) => {
  const formMap = buildMorphFormMap(raw);
  formMap.forEach((matches, form) => {
    if (!combinedFormMap.has(form)) {
      combinedFormMap.set(form, []);
    }
    combinedFormMap.get(form).push(...matches);
  });
});

const output = {};
missingForms.forEach((form) => {
  const bestMatch = pickBestMorphMatch(combinedFormMap.get(form));
  if (bestMatch) {
    output[form] = bestMatch;
  }
});

Object.assign(output, MANUAL_FORM_OVERRIDES);

await fs.writeFile(
  outputPath,
  `export const greekFormFallbacks = ${JSON.stringify(output, null, 2)};\n`
);

console.log(`Wrote ${Object.keys(output).length} Greek form fallbacks to ${outputPath}`);

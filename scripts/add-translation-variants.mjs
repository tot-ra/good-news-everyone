import fs from "fs/promises";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const BOOKS = {
  matthew: { siteId: "mat" },
  mark: { siteId: "mrk" },
  luke: { siteId: "luk" },
  john: { siteId: "jhn" }
};

const TRANSLATIONS = {
  russianCassian: {
    siteId: "cas",
    title: "Перевод епископа Кассиана"
  },
  russianBti: {
    siteId: "bti",
    title: "Современный русский перевод (ИПБ им. М. П. Кулакова)"
  }
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          resolve(fetchText(response.headers.location));
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Unexpected response ${response.statusCode} for ${url}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        response.on("error", reject);
      })
      .on("error", reject);
  });
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

function buildChapterUrl(translationId, bookId, chapterNumber) {
  const chapterSuffix = chapterNumber === 1 ? "" : `-${chapterNumber}`;
  return `https://only.bible/bible/${translationId}/${bookId}${chapterSuffix}/`;
}

function decodeHtmlEntities(text) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    laquo: "«",
    lt: "<",
    mdash: "—",
    ndash: "–",
    nbsp: " ",
    quot: "\"",
    shy: ""
  };

  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return named[entity.toLowerCase()] ?? match;
  });
}

function cleanupVerseText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?»)\]])/g, "$1")
    .replace(/([«([\u201c])\s+/g, "$1")
    .replace(/\s+—/g, " —")
    .replace(/\]\]$/u, "]")
    .trim();
}

/** End index of an HTML tag starting at `start`, respecting quotes inside attributes. */
function findTagEnd(html, start) {
  let quote = null;

  for (let index = start; index < html.length; index += 1) {
    const char = html[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === ">") {
      return index;
    }
  }

  return -1;
}

function extractQuotedAttr(tag, attrName) {
  const match = tag.match(new RegExp(`\\b${attrName}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return match ? (match[2] ?? match[3] ?? "") : null;
}

function tagHasClass(tag, className) {
  const classAttr = extractQuotedAttr(tag, "class") ?? "";
  return classAttr.split(/\s+/).includes(className);
}

function appendToVerses(verseMap, verseNumbers, chunk) {
  for (const verseNumber of verseNumbers) {
    verseMap.set(verseNumber, `${verseMap.get(verseNumber) ?? ""}${chunk}`);
  }
}

function parseVerseNumbers(tag) {
  const primary = extractQuotedAttr(tag, "vers");
  if (!primary || !/^\d+$/.test(primary) || Number(primary) <= 0) {
    return null;
  }

  // BTI sometimes merges verses: vers="7" vers-alt="8"
  const alt = extractQuotedAttr(tag, "vers-alt");
  const numbers = [Number(primary)];
  if (alt && /^\d+$/.test(alt) && Number(alt) > 0 && Number(alt) !== Number(primary)) {
    numbers.push(Number(alt));
  }
  return numbers;
}

/**
 * Walk the chapter HTML and collect verse text.
 *
 * Why not a simple regex: only.bible BTI footnotes put raw `</span>` inside the
 * `title` attribute of empty `fn-tip` markers. Non-greedy `...</span>` patterns
 * stop there, so verses were truncated and leftover "Букв.:" leaked into russianBti.
 * Some chapter tails also open a continuation `vers` span around the footnotes
 * panel without closing it, so parsing must stop at `.footnotes`.
 */
function extractVerseTexts(html) {
  const bibleMatch = html.match(
    /<div class="row equal" id="bible">([\s\S]*?)<div class="hidden-print mt-5 btn-toolbar show-all">/
  );

  if (!bibleMatch) {
    throw new Error("Could not locate bible text block");
  }

  const footnotesAt = bibleMatch[1].search(
    /<div\b[^>]*\bclass="[^"]*\bfootnotes\b[^"]*"/i
  );
  const block = footnotesAt === -1 ? bibleMatch[1] : bibleMatch[1].slice(0, footnotesAt);
  const verseMap = new Map();
  let index = 0;
  let activeVerses = null;
  let depthInActive = 0;
  let skipDepth = 0;

  while (index < block.length) {
    if (block[index] !== "<") {
      if (activeVerses && skipDepth === 0) {
        const nextTag = block.indexOf("<", index);
        const chunk = nextTag === -1 ? block.slice(index) : block.slice(index, nextTag);
        appendToVerses(verseMap, activeVerses, chunk);
        index = nextTag === -1 ? block.length : nextTag;
        continue;
      }

      index += 1;
      continue;
    }

    if (block.startsWith("<!--", index)) {
      const commentEnd = block.indexOf("-->", index + 4);
      index = commentEnd === -1 ? block.length : commentEnd + 3;
      continue;
    }

    const tagEnd = findTagEnd(block, index);
    if (tagEnd === -1) {
      break;
    }

    const tag = block.slice(index, tagEnd + 1);
    const isClose = /^<\//.test(tag);
    const name = tag.match(/^<\/?\s*([a-zA-Z0-9:-]+)/)?.[1]?.toLowerCase() ?? "";
    const selfClosing =
      /\/>$/.test(tag) || ["br", "hr", "img", "input", "meta", "link"].includes(name);

    if (name === "span") {
      if (!isClose) {
        if (skipDepth > 0) {
          skipDepth += 1;
        } else if (tagHasClass(tag, "fn-tip")) {
          // Drop translator footnotes ("Букв.: …") entirely from reading text.
          skipDepth = 1;
        } else {
          const verseNumbers = parseVerseNumbers(tag);
          if (verseNumbers) {
            activeVerses = verseNumbers;
            depthInActive = 1;
          } else if (activeVerses) {
            depthInActive += 1;
          }
        }
      } else if (skipDepth > 0) {
        skipDepth -= 1;
      } else if (activeVerses) {
        depthInActive -= 1;
        if (depthInActive <= 0) {
          activeVerses = null;
          depthInActive = 0;
        }
      }
    } else if (
      activeVerses &&
      skipDepth === 0 &&
      ((isClose && /^(p|div|h\d)$/.test(name)) ||
        (!isClose && name === "br") ||
        (selfClosing && name === "br"))
    ) {
      appendToVerses(verseMap, activeVerses, " ");
    }

    index = tagEnd + 1;
  }

  for (const [verseNumber, raw] of verseMap) {
    verseMap.set(verseNumber, cleanupVerseText(decodeHtmlEntities(raw.replace(/<[^>]+>/g, ""))));
  }

  return verseMap;
}

async function fetchBookTranslation(translationId, bookId, chapterCount) {
  const chapterNumbers = Array.from({ length: chapterCount }, (_, index) => index + 1);
  const chapters = await mapWithConcurrency(chapterNumbers, 8, async (chapterNumber) => {
    const url = buildChapterUrl(translationId, bookId, chapterNumber);
    const html = await fetchText(url);
    const verses = extractVerseTexts(html);

    return {
      chapterNumber,
      verses
    };
  });

  return chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
}

function enrichVerses(verses, chapterTranslationData) {
  verses.forEach((verse) => {
    const verseNumber = Number(verse.number);
    verse.translations = {
      ...verse.translations,
      russianSynodal: verse.translations.russian ?? verse.translations.russianSynodal ?? ""
    };

    Object.entries(chapterTranslationData).forEach(([translationKey, verseMap]) => {
      verse.translations[translationKey] = verseMap.get(verseNumber) ?? "";
    });
  });
}

async function enrichBookFile(filePath, translationCache) {
  const book = JSON.parse(await fs.readFile(filePath, "utf8"));
  const bookSource = BOOKS[book.id];

  if (!bookSource) {
    return;
  }

  book.chapters.forEach((chapter) => {
    const chapterTranslationData = Object.fromEntries(
      Object.keys(TRANSLATIONS).map((translationKey) => [
        translationKey,
        translationCache[translationKey][book.id][chapter.number - 1]?.verses ?? new Map()
      ])
    );

    chapter.scenes.forEach((scene) => {
      enrichVerses(scene.verses ?? [], chapterTranslationData);
    });
  });

  await fs.writeFile(filePath, `${JSON.stringify(book, null, 2)}\n`, "utf8");
}

async function enrichLibraryIndex(filePath, translationCache) {
  const library = JSON.parse(await fs.readFile(filePath, "utf8"));

  library.forEach((book) => {
    book.chapters.forEach((chapter) => {
      const chapterTranslationData = Object.fromEntries(
        Object.keys(TRANSLATIONS).map((translationKey) => [
          translationKey,
          translationCache[translationKey][book.id][chapter.number - 1]?.verses ?? new Map()
        ])
      );

      chapter.scenes.forEach((scene) => {
        enrichVerses(scene.verses ?? [], chapterTranslationData);
      });
    });
  });

  await fs.writeFile(filePath, `${JSON.stringify(library, null, 2)}\n`, "utf8");
}

async function main() {
  const translationCache = {};

  for (const [translationKey, translationConfig] of Object.entries(TRANSLATIONS)) {
    translationCache[translationKey] = {};

    for (const [bookId, bookConfig] of Object.entries(BOOKS)) {
      const filePath = path.join(rootDir, "src", "data", "books", `${bookId}.json`);
      const book = JSON.parse(await fs.readFile(filePath, "utf8"));
      translationCache[translationKey][bookId] = await fetchBookTranslation(
        translationConfig.siteId,
        bookConfig.siteId,
        book.chapters.length
      );
      console.log(`Fetched ${translationConfig.title}: ${bookId}`);
    }
  }

  await enrichLibraryIndex(
    path.join(rootDir, "src", "data", "library-index.json"),
    translationCache
  );

  await Promise.all(
    Object.keys(BOOKS).map((bookId) =>
      enrichBookFile(path.join(rootDir, "src", "data", "books", `${bookId}.json`), translationCache)
    )
  );

  console.log("Added Russian translation variants to library data.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

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

function htmlToText(html) {
  const withoutFootnotes = html.replace(/<span[^>]*class="fn-tip"[\s\S]*?<\/span>/g, "");
  const withLineBreakSpaces = withoutFootnotes.replace(/<\/(?:p|div|h\d|br)>/gi, " ");
  const withoutTags = withLineBreakSpaces.replace(/<[^>]+>/g, "");
  return cleanupVerseText(decodeHtmlEntities(withoutTags));
}

function extractVerseTexts(html) {
  const bibleMatch = html.match(
    /<div class="row equal" id="bible">([\s\S]*?)<div class="hidden-print mt-5 btn-toolbar show-all">/
  );

  if (!bibleMatch) {
    throw new Error("Could not locate bible text block");
  }

  const verseMap = new Map();
  const spanRegex = /<span[^>]*\bvers="(\d+)"[^>]*>([\s\S]*?)<\/span>/g;
  let match;

  while ((match = spanRegex.exec(bibleMatch[1]))) {
    const verseNumber = Number(match[1]);
    if (!verseNumber) {
      continue;
    }

    const segment = htmlToText(match[2]);
    if (!segment) {
      continue;
    }

    const current = verseMap.get(verseNumber) ?? "";
    verseMap.set(verseNumber, cleanupVerseText(`${current} ${segment}`));
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

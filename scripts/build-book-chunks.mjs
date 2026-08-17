import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const booksDir = path.join(rootDir, "src", "data", "books");
const chunksDir = path.join(rootDir, "src", "data", "book-chunks");
const translationIds = [
  "greek",
  "russianSynodal",
  "russianCassian",
  "russianBti",
  "english"
];

function buildBaseBook(book) {
  return {
    ...book,
    chapters: book.chapters.map((chapter) => ({
      ...chapter,
      scenes: chapter.scenes.map((scene) => ({
        ...scene,
        verses: scene.verses.map(({ translations, greekTokens, alignments, ...verse }) => verse)
      }))
    }))
  };
}

function buildTranslationChunk(book, translationId) {
  return {
    bookId: book.id,
    translationId,
    // These arrays intentionally mirror the base book. Avoiding repeated chapter,
    // scene, and verse identifiers keeps every network chunk as small as possible.
    chapters: book.chapters.map((chapter) =>
      chapter.scenes.map((scene) =>
        scene.verses.map((verse) => {
          const entry = {
            text: verse.translations?.[translationId] ?? ""
          };

          if (translationId === "greek" && verse.greekTokens) {
            entry.greekTokens = verse.greekTokens;
          }

          const alignmentId = translationId === "russianSynodal" ? "russian" : translationId;
          if (verse.alignments?.[alignmentId]) {
            entry.alignment = verse.alignments[alignmentId];
          }

          return entry;
        })
      )
    )
  };
}

async function main() {
  const filenames = ["matthew.json", "mark.json", "luke.json", "john.json"];

  await fs.rm(chunksDir, { recursive: true, force: true });

  for (const filename of filenames) {
    const book = JSON.parse(await fs.readFile(path.join(booksDir, filename), "utf8"));
    const bookDir = path.join(chunksDir, book.id);
    const translationsDir = path.join(bookDir, "translations");

    await fs.mkdir(translationsDir, { recursive: true });
    await fs.writeFile(
      path.join(bookDir, "base.json"),
      `${JSON.stringify(buildBaseBook(book))}\n`,
      "utf8"
    );

    await Promise.all(
      translationIds.map((translationId) =>
        fs.writeFile(
          path.join(translationsDir, `${translationId}.json`),
          `${JSON.stringify(buildTranslationChunk(book, translationId))}\n`,
          "utf8"
        )
      )
    );
  }

  console.log(`Wrote lazy-loadable book chunks to ${chunksDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

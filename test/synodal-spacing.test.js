import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const bookIds = ["matthew", "mark", "luke", "john"];
const suspiciousSpacing = /[а-яё][А-ЯЁ]|\s+[,.!?;:]|[,!?;:][А-Яа-яЁё]/u;

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

for (const bookId of bookIds) {
  test(`${bookId} Synodal text has clean spacing and matches its runtime chunk`, async () => {
    const book = await readJson(`../src/data/books/${bookId}.json`);
    const chunk = await readJson(
      `../src/data/book-chunks/${bookId}/translations/russianSynodal.json`
    );

    for (const [chapterIndex, chapter] of book.chapters.entries()) {
      const verses = chapter.scenes.flatMap((scene) => scene.verses);
      assert.deepEqual(
        verses.map((verse) => Number(verse.number)),
        Array.from({ length: verses.length }, (_, index) => index + 1),
        `${bookId} ${chapter.number} must not skip or shift verse numbers`
      );

      const chunkVerses = chunk.chapters[chapterIndex].flat();
      assert.equal(chunkVerses.length, verses.length);

      for (const [verseIndex, verse] of verses.entries()) {
        const text = verse.translations.russianSynodal;
        assert.equal(
          suspiciousSpacing.test(text),
          false,
          `${bookId} ${chapter.number}:${verse.number} has suspicious spacing: ${text}`
        );
        assert.equal(chunkVerses[verseIndex].text, text);
      }
    }
  });
}

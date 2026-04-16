# Good News Everyone

A design-first Node/Vite prototype for reading the four Gospels as literature, language, geography, and visual culture.

## What this first version includes

- A Node-based frontend powered by Vite
- A spacious web experience focused on Matthew, Mark, Luke, and John
- A structured Gospel > chapter > scene content model
- Deep-linkable passage routes using URL hashes
- Large serif typography for verse reading
- Parallel Koine Greek, English, and Russian comparison
- Word-study notes for difficult terms
- Translation-difference commentary
- Context cards for people and places
- A stylized regional map with scene highlights
- Public-domain sacred artwork loaded from Wikimedia Commons

## Structure

- [index.html](/Users/artjom/git/good-news-everyone/index.html)
- [package.json](/Users/artjom/git/good-news-everyone/package.json)
- [Justfile](/Users/artjom/git/good-news-everyone/Justfile)
- [src/main.js](/Users/artjom/git/good-news-everyone/src/main.js)
- [src/content.js](/Users/artjom/git/good-news-everyone/src/content.js)
- [scripts/build-gospels-data.mjs](/Users/artjom/git/good-news-everyone/scripts/build-gospels-data.mjs)
- [src/data/library-index.json](/Users/artjom/git/good-news-everyone/src/data/library-index.json)
- [src/data/books/matthew.json](/Users/artjom/git/good-news-everyone/src/data/books/matthew.json)
- [src/styles.css](/Users/artjom/git/good-news-everyone/src/styles.css)

## Current app behavior

- Each passage is addressable by route fragments like `#/john/4/at-the-well`
- The left rail lets you switch Gospels and chapters
- The reading room switches scenes within a chapter and supports previous/next passage flow
- The Gospel corpus now lives in JSON data so content can expand without growing the app logic

## Run locally

The repo now pins Node locally via [`.tool-versions`](/Users/artjom/git/good-news-everyone/.tool-versions).

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Or use the shortcut command:

```bash
just start
```

Refresh the local Gospel corpus with:

```bash
npm run build:texts
```

Create a production build with:

```bash
npm run build
```

## Content notes

- The New Testament was written primarily in Koine Greek, with important Aramaic and Hebrew background in names, quotations, and spoken expressions.
- This prototype uses short sample passages rather than a full Bible corpus.
- The next step should be wiring in a structured text source for all four Gospels and expanding the map, glossary, artwork, and translation apparatus chapter by chapter.

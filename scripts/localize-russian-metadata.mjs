import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const dataDir = path.join(rootDir, "src", "data");
const booksDir = path.join(dataDir, "books");

const bookNames = {
  matthew: { nominative: "Матфей", genitive: "Матфея" },
  mark: { nominative: "Марк", genitive: "Марка" },
  luke: { nominative: "Лука", genitive: "Луки" },
  john: { nominative: "Иоанн", genitive: "Иоанна" }
};

const bookNameByEnglish = {
  Matthew: "Матфея",
  Mark: "Марка",
  Luke: "Луки",
  John: "Иоанна"
};

const cache = new Map();
const pendingTexts = new Set();

function normalizeRussianText(text) {
  if (!text) {
    return text;
  }

  const exactReplacements = new Map([
    ["король", "царь"],
    ["Эндрю, Джеймс, Джон", "Андрей, Иаков, Иоанн"],
    ["Партнеры по диалогу", "Собеседники"],
    ["Учитель, целитель, главный оратор", "Учитель, целитель, главный персонаж"],
    ["Учащиеся втянуты в строй", "Ученики на пути обучения"],
    ["Характерное выражение лица Мэтью", "Характерное выражение Матфея"],
    ["Характерное выражение лица Матфей", "Характерное выражение Матфея"],
    ["Эммануэль и исполнение желаний", "Эммануил и исполнение"],
    ["Символ, медлительность, богословская глубина", "Символ, созерцательность, богословская глубина"],
    [
      "Джон задерживается в сценах до тех пор, пока физические образы не переходят в духовные утверждения, делая диалог и символизм центральными в процессе чтения.",
      "Иоанн подолгу задерживается на сценах, пока физические образы не переходят в духовные утверждения, делая диалог и символизм центральными для чтения."
    ],
    [
      "Джон замедляется и позволяет смыслу собраться в диалоге. Вода, жажда, дар, поклонение и идентичность раскрываются слой за слоем в глубоко локальном месте.",
      "Иоанн замедляет повествование и позволяет смыслу собраться в диалоге. Вода, жажда, дар, поклонение и личность раскрываются слой за слоем в предельно конкретном месте."
    ],
    [
      "Глава 6 Евангелия от Матфея обращается от общественной праведности к тайне, молитве, посту, сокровищам и свободе от беспокойства перед Богом.",
      "В шестой главе Евангелия от Матфея внимание смещается от показной праведности к тайне, молитве, посту, сокровищу и свободе от тревоги перед Богом."
    ],
    [
      "Проповедь продолжается, двигаясь внутрь. Иисус предостерегает от религиозных действий, учит своих учеников молиться и перенаправляет желания с показа напоказ на заботу Отца.",
      "Проповедь продолжается и обращается к внутренней жизни. Иисус предостерегает от религиозной показности, учит учеников молиться и перенаправляет желание от внешнего впечатления к заботе Отца."
    ],
    ["Один глаз и разделенная лояльность", "Цельный взгляд и разделённая верность"],
    [
      "Поговорку о звуке или единственном глазу можно превратить в современную метафору, однако в контексте она указывает на безраздельное желание, а не только на зрение.",
      "Образ здорового или цельного глаза легко свести к современной метафоре, но в контексте он говорит о нераздвоенном стремлении, а не просто о зрении."
    ],
    [
      "Образы возникают здесь быстро: щепки и балки, ворота и дороги, деревья и фрукты, камни и песок. Эта глава побуждает слушателей к распознаванию и реагированию.",
      "Образы здесь следуют быстро: сучок и бревно, ворота и путь, дерево и плод, камень и песок. Глава подталкивает слушателя к различению и ответу."
    ],
    [
      "Последний контраст происходит не между слушанием и неведением, а между слушанием, которое остается вербальным, и слушанием, которое становится воплощенным послушанием.",
      "Последний контраст проходит не между слушанием и неведением, а между слушанием, которое остаётся только на словах, и слушанием, которое становится послушанием."
    ],
    [
      "Эта глава спускается от горного учения к воплощенной нужде. Прокаженные, сотник, разгоряченная семья, напуганные ученики и бесноватые – все они показывают, какую власть несет Иисус.",
      "Глава спускается от горного учения к живой человеческой нужде. Прокажённый, сотник, дом Петра, испуганные ученики и бесноватые показывают, какую власть несёт Иисус."
    ],
    [
      "Мэтью сохраняет слух, связанный с принятием и плодотворностью. Вопрос не в чистом звучании, а в том, укоренится ли слово достаточно глубоко, чтобы выжить.",
      "Матфей сохраняет связь слуха с принятием и плодом. Вопрос не в самом звучании слова, а в том, укоренится ли оно достаточно глубоко, чтобы устоять."
    ],
    [
      "Потопление Петра не является отдельной моральной историей из этой главы. Мэтью использует его, чтобы показать, как страх подрывает доверие даже в разгар реальной встречи.",
      "Тонущий Пётр здесь не отдельная нравоучительная сцена. Матфей использует этот эпизод, чтобы показать, как страх подрывает доверие даже посреди реальной встречи."
    ],
    [
      "Разговор с хананеянкой намеренно резкий. Мэтью сохраняет напряжение, чтобы ее настойчивость и последняя похвала Иисуса приземлились с полной силой.",
      "Разговор с хананеянкой намеренно звучит резко. Матфей сохраняет это напряжение, чтобы её настойчивость и заключительная похвала Иисуса прозвучали во всей силе."
    ],
    [
      "Слово «жизнь» также может означать душу или «я». Мэтью сжимает личность, судьбу и воплощенное существование в один сложный парадокс.",
      "Слово «жизнь» здесь может означать и душу, и самого человека. Матфей сжимает личность, судьбу и само существование в один напряжённый парадокс."
    ],
    [
      "Дело не только в магической силе крошечного количества. Мэтью сочетает малость с искренним доверием, которое действует из зависимости, а не из зрелища.",
      "Смысл не в магической силе малого количества. Матфей соединяет малость с подлинным доверием, которое действует из зависимости от Бога, а не ради зрелища."
    ],
    [
      "Эта поговорка не является четким разделением религии и политики. Иисус отвечает, разоблачая конкурирующие претензии на имидж, лояльность и принадлежность.",
      "Эта фраза не проводит аккуратной границы между религией и политикой. Иисус отвечает так, что вскрывает соперничающие притязания на образ, верность и принадлежность."
    ],
    ["Дискурс Оливет", "Елеонская речь"],
    [
      "В 24-й главе Евангелия от Матфея ученики предстают перед продолжительной беседой Иисуса о храме, скорби, бдительности и пришествии Сына Человеческого.",
      "В 24-й главе Евангелия от Матфея ученики слышат долгую речь Иисуса о храме, скорби, бодрствовании и пришествии Сына Человеческого."
    ],
    [
      "В этой главе рассказывается о потрясениях, обмане, терпении и запоздалом ожидании. Изображения коллапса неоднократно присоединяются к командам насторожить пациента.",
      "Глава движется через потрясения, обман, терпение и отсроченное ожидание. Образы крушения снова и снова сопровождаются призывом к трезвой бодрствующей готовности."
    ],
    [
      "Читатели долго спорили о том, насколько узко или широко следует понимать эту фразу. Мэтью оставляет это высказывание близким к исторической актуальности, но в то же время встраивает его в более широкий апокалиптический горизонт.",
      "Читатели давно спорят о том, насколько узко или широко нужно понимать эту фразу. Матфей оставляет это высказывание вблизи исторической остроты, но одновременно вписывает его в более широкий апокалиптический горизонт."
    ]
  ]);

  let value = exactReplacements.get(text) ?? text;

  value = value
    .replace(/Мэтью/g, "Матфей")
    .replace(/Джон/g, "Иоанн")
    .replace(/Дэвид/g, "Давид")
    .replace(/Эммануэль/g, "Эммануил")
    .replace(/Сцены Иоанна часто вращаются вокруг/g, "Сцены Иоанна часто строятся вокруг")
    .replace(/^судья$/g, "судить")
    .replace(/^спросить$/g, "просить")
    .replace(/^фрукты$/g, "плод")
    .replace(/^рок$/g, "камень")
    .replace(/ребенка/g, "ребёнка")
    .replace(/ребенок/g, "ребёнок")
    .replace(/ребенке/g, "ребёнке")
    .replace(/ребенком/g, "ребёнком")
    .replace(/имен/g, "имён");

  return value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTranslation(value) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "ru");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", value);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const payload = await new Promise((resolve, reject) => {
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
                reject(new Error(`Translation request failed with status ${response.statusCode}`));
                return;
              }

              let data = "";
              response.setEncoding("utf8");
              response.on("data", (chunk) => {
                data += chunk;
              });
              response.on("end", () => {
                try {
                  resolve(JSON.parse(data));
                } catch (error) {
                  reject(error);
                }
              });
            }
          )
          .on("error", reject);
      });

      return normalizeRussianText(payload?.[0]?.map((part) => part?.[0] ?? "").join("").trim() || value);
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
    }

    await sleep(400 * (attempt + 1));
  }

  throw new Error(`Translation request failed for: ${value}`);
}

async function translateBatch(values) {
  const separator = "\n[[[SEP_91F4C2]]]\n";
  const joined = values.join(separator);
  const translated = await fetchTranslation(joined);
  const parts = translated.split(separator);

  if (parts.length === values.length) {
    return parts.map((item) => item.trim());
  }

  return Promise.all(values.map((value) => fetchTranslation(value)));
}

async function flushTranslations() {
  const values = [...pendingTexts].filter((value) => value && !cache.has(value));
  pendingTexts.clear();

  const chunkSize = 24;
  for (let index = 0; index < values.length; index += chunkSize) {
    const chunk = values.slice(index, index + chunkSize);
    const translated = await translateBatch(chunk);
    chunk.forEach((source, offset) => {
      cache.set(source, translated[offset] ?? source);
    });
  }
}

function queueTranslation(text) {
  const value = String(text ?? "").trim();
  if (value && !cache.has(value)) {
    pendingTexts.add(value);
  }
}

async function translateText(text) {
  const value = String(text ?? "").trim();
  if (!value) {
    return text;
  }

  if (!cache.has(value)) {
    cache.set(value, await fetchTranslation(value));
  }

  return cache.get(value) ?? value;
}

function translateReference(reference) {
  return reference.replace(/\b(Matthew|Mark|Luke|John)\b/g, (match) => bookNameByEnglish[match] ?? match);
}

function maybeLocalizeChapterTitle(title, chapterNumber) {
  if (/^Chapter \d+$/i.test(title)) {
    return `Глава ${chapterNumber}`;
  }

  return null;
}

function maybeLocalizeChapterSummary(summary, bookId, chapterNumber) {
  if (!summary) {
    return null;
  }

  const book = bookNames[bookId];

  if (/^A full-chapter reading view for /i.test(summary)) {
    return normalizeRussianText(
      `Полный просмотр ${chapterNumber}-й главы Евангелия от ${book.genitive}, подготовленный для медленного сравнения трёх текстовых традиций в приложении.`
    );
  }

  return null;
}

function maybeLocalizeSceneSummary(summary, bookId, chapterNumber) {
  if (!summary) {
    return null;
  }

  if (/^Read the full text of /i.test(summary)) {
    const verseMatch = summary.match(/This chapter contains (\d+) verses/i);
    const verseCount = verseMatch?.[1];
    const verseText = verseCount ? ` Эта глава содержит ${verseCount} стихов в сгенерированном корпусном представлении.` : "";
    return normalizeRussianText(
      `Прочитайте полный текст ${chapterNumber}-й главы Евангелия от ${bookNames[bookId].genitive} параллельно на греческом, английском и русском.${verseText}`
    );
  }

  return null;
}

function maybeLocalizeDifferenceTitle(title) {
  if (!title) {
    return null;
  }

  if (/^Parallel reading helps surface translation choices$/i.test(title)) {
    return "Параллельное чтение помогает замечать переводческие решения";
  }

  return null;
}

function maybeLocalizeDifferenceBody(body, bookId) {
  if (!body) {
    return null;
  }

  if (/can be compared here line by line across Greek, English, and Russian/i.test(body)) {
    return normalizeRussianText(
      `${bookNames[bookId].nominative} можно сопоставлять здесь строка за строкой на греческом, английском и русском, поэтому различия в формулировках заметнее, чем при чтении только на одном языке.`
    );
  }

  return null;
}

function maybeLocalizeCredit(credit) {
  if (!credit) {
    return null;
  }

  if (/public-domain image via Wikimedia Commons/i.test(credit)) {
    return credit.replace(/public-domain image via Wikimedia Commons/gi, "изображение из общественного достояния через Wikimedia Commons");
  }

  if (/via Wikimedia Commons/i.test(credit)) {
    return credit.replace(/via Wikimedia Commons/gi, "через Wikimedia Commons");
  }

  return null;
}

function needsTranslation(value) {
  return /[A-Za-z]/.test(value);
}

async function localizeLooseMetadata(node, bookId) {
  if (!node || typeof node !== "object") {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      await localizeLooseMetadata(item, bookId);
    }
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (value == null) {
      continue;
    }

    if (key === "translations" || key === "greekTokens" || key === "tokenAlignments") {
      continue;
    }

    if (typeof value === "object") {
      await localizeLooseMetadata(value, bookId);
      continue;
    }

    if (typeof value !== "string" || !needsTranslation(value)) {
      continue;
    }

    if (key === "reference") {
      node[key] = translateReference(value);
      continue;
    }

    if (key === "credit") {
      node[key] = maybeLocalizeCredit(value) ?? await translateText(value);
      continue;
    }

    if (["title", "summary", "caption", "meta", "description", "body", "name"].includes(key)) {
      node[key] = await translateText(value);
    }
  }
}

async function localizeScene(scene, bookId, chapterNumber) {
  scene.reference = translateReference(scene.reference);

  scene.sceneTitle = maybeLocalizeChapterTitle(scene.sceneTitle, chapterNumber)
    ?? (needsTranslation(scene.sceneTitle) ? await translateText(scene.sceneTitle) : scene.sceneTitle);

  scene.sceneSummary = maybeLocalizeSceneSummary(scene.sceneSummary, bookId, chapterNumber)
    ?? (needsTranslation(scene.sceneSummary) ? await translateText(scene.sceneSummary) : scene.sceneSummary);

  if (scene.art?.caption && needsTranslation(scene.art.caption)) {
    scene.art.caption = await translateText(scene.art.caption);
  }

  if (scene.map?.title && needsTranslation(scene.map.title)) {
    scene.map.title = await translateText(scene.map.title);
  }

  if (scene.map?.summary && needsTranslation(scene.map.summary)) {
    scene.map.summary = await translateText(scene.map.summary);
  }

  if (Array.isArray(scene.entities)) {
    for (const entity of scene.entities) {
      if (entity.name && needsTranslation(entity.name)) {
        entity.name = await translateText(entity.name);
      }
      if (entity.meta && needsTranslation(entity.meta)) {
        entity.meta = await translateText(entity.meta);
      }
      if (entity.description && needsTranslation(entity.description)) {
        entity.description = await translateText(entity.description);
      }
    }
  }

  if (Array.isArray(scene.glossary)) {
    for (const entry of scene.glossary) {
      if (entry.term && needsTranslation(entry.term)) {
        entry.term = await translateText(entry.term);
      }
      if (entry.meta && needsTranslation(entry.meta)) {
        entry.meta = await translateText(entry.meta);
      }
      if (entry.description && needsTranslation(entry.description)) {
        entry.description = await translateText(entry.description);
      }
    }
  }

  if (Array.isArray(scene.focusWords)) {
    scene.focusWords = await Promise.all(
      scene.focusWords.map((word) => (needsTranslation(word) ? translateText(word) : word))
    );
  }

  if (Array.isArray(scene.differences)) {
    for (const difference of scene.differences) {
      difference.title = maybeLocalizeDifferenceTitle(difference.title)
        ?? (needsTranslation(difference.title) ? await translateText(difference.title) : difference.title);
      difference.body = maybeLocalizeDifferenceBody(difference.body, bookId)
        ?? (needsTranslation(difference.body) ? await translateText(difference.body) : difference.body);
    }
  }
}

function queueScene(scene) {
  queueTranslation(scene.sceneTitle);
  queueTranslation(scene.sceneSummary);
  queueTranslation(scene.art?.caption);
  queueTranslation(scene.map?.title);
  queueTranslation(scene.map?.summary);

  if (Array.isArray(scene.entities)) {
    for (const entity of scene.entities) {
      queueTranslation(entity.name);
      queueTranslation(entity.meta);
      queueTranslation(entity.description);
    }
  }

  if (Array.isArray(scene.glossary)) {
    for (const entry of scene.glossary) {
      queueTranslation(entry.term);
      queueTranslation(entry.meta);
      queueTranslation(entry.description);
    }
  }

  if (Array.isArray(scene.focusWords)) {
    for (const word of scene.focusWords) {
      queueTranslation(word);
    }
  }

  if (Array.isArray(scene.differences)) {
    for (const difference of scene.differences) {
      queueTranslation(difference.title);
      queueTranslation(difference.body);
    }
  }
}

function queueBook(book) {
  queueTranslation(book.subtitle);
  queueTranslation(book.accent);

  for (const chapter of book.chapters ?? []) {
    queueTranslation(chapter.title);
    queueTranslation(chapter.summary);

    for (const scene of chapter.scenes ?? []) {
      queueScene(scene);
    }
  }
}

async function localizeBook(book) {
  const names = bookNames[book.id];
  book.title = names.nominative;

  if (book.subtitle && needsTranslation(book.subtitle)) {
    book.subtitle = await translateText(book.subtitle);
  }

  if (book.accent && needsTranslation(book.accent)) {
    book.accent = await translateText(book.accent);
  }

  for (const chapter of book.chapters ?? []) {
    chapter.title = maybeLocalizeChapterTitle(chapter.title, chapter.number)
      ?? (needsTranslation(chapter.title) ? await translateText(chapter.title) : chapter.title);

    chapter.summary = maybeLocalizeChapterSummary(chapter.summary, book.id, chapter.number)
      ?? (needsTranslation(chapter.summary) ? await translateText(chapter.summary) : chapter.summary);

    for (const scene of chapter.scenes ?? []) {
      await localizeScene(scene, book.id, chapter.number);
      await localizeLooseMetadata(scene, book.id);
    }
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main() {
  const libraryPath = path.join(dataDir, "library-index.json");
  const library = JSON.parse(await fs.readFile(libraryPath, "utf8"));

  for (const book of library) {
    queueBook(book);
  }
  await flushTranslations();

  for (const book of library) {
    await localizeBook(book);
  }

  await writeJson(libraryPath, library);

  for (const book of library) {
    const filePath = path.join(booksDir, `${book.id}.json`);
    const bookData = JSON.parse(await fs.readFile(filePath, "utf8"));
    queueBook(bookData);
    await flushTranslations();
    await localizeBook(bookData);
    await writeJson(filePath, bookData);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

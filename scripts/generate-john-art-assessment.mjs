import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const johnPath = path.join(rootDir, "src", "data", "books", "john.json");
const outputDir = path.join(rootDir, "src", "data", "research");
const jsonOutputPath = path.join(outputDir, "john-verse-art-assessment.json");
const markdownOutputPath = path.join(outputDir, "john-verse-art-summary.md");

const ARTWORKS = {
  "wedding-at-cana": {
    title: "The Marriage at Cana",
    artist: "Paolo Veronese",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Veronese,_The_Marriage_at_Cana_(1563).jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Veronese%2C%20The%20Marriage%20at%20Cana%20%281563%29.jpg",
    note:
      "Классическая живописная традиция для Иоанна 2:1-10, но обычно она покрывает весь пир как сцену, а не отдельные микромоменты."
  },
  "cleansing-of-the-temple": {
    title: "Christ Cleansing the Temple",
    artist: "El Greco",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Christ_Cleansing_the_Temple_by_El_Greco_-_Q63117265.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Cleansing_the_Temple_by_El_Greco_-_Q63117265.jpg",
    note:
      "Для Иоанна 2:13-17 есть устойчивая и очень узнаваемая иконография очищения храма."
  },
  "nicodemus-at-night": {
    title: "Christ and Nicodemus",
    artist: "Henry Ossawa Tanner",
    pageUrl: 'https://commons.wikimedia.org/wiki/File:%22Christ_and_Nicodemus%22_-_NARA_-_559136.jpg',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/%22Christ%20and%20Nicodemus%22%20-%20NARA%20-%20559136.jpg',
    note:
      "Ночной визит Никодима имеет прямую живописную традицию, поэтому Иоанна 3:2 подходит особенно точно."
  },
  "samaritan-woman": {
    title: "Christ and the Samaritan Woman at the Well",
    artist: "Annibale Carracci",
    pageUrl:
      "https://commons.wikimedia.org/wiki/File:Annibale_Carracci_-_Christ_and_the_Samaritan_Woman_-_Google_Art_Project.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Annibale_Carracci_-_Christ_and_the_Samaritan_Woman_-_Google_Art_Project.jpg",
    note:
      "Сцена у колодца Самарии многократно изображалась, но обычно как продолжительный разговор, а не один точный стих."
  },
  bethesda: {
    title: "Christ healing the Paralytic at the Pool of Bethesda",
    artist: "Bartolome Esteban Murillo",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Curacion_del_paralitico_Murillo_1670.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Curacion%20del%20paralitico%20Murillo%201670.jpg",
    note:
      "У исцеления в Вифезде есть хорошая традиция именно как отдельного эпизода из Иоанна 5."
  },
  "feeding-five-thousand": {
    title: "Feeding the Five Thousand",
    artist: "John Martin",
    pageUrl:
      "https://commons.wikimedia.org/wiki/File:John_Martin_-_Feeding_the_Five_Thousand_-_B1977.14.4260_-_Yale_Center_for_British_Art.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/John_Martin_-_Feeding_the_Five_Thousand_-_B1977.14.4260_-_Yale_Center_for_British_Art.jpg",
    note:
      "Насыщение пяти тысяч хорошо обеспечено существующей живописной традицией; точнее всего она ложится на сам акт раздачи и собирания остатков."
  },
  "walking-on-water": {
    title: "Christ walking on the water",
    artist: "Henry Ossawa Tanner",
    pageUrl: "https://commons.wikimedia.org/wiki/Category:Christ_walking_on_the_water,_Henry_Ossawa_Tanner",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20walking%20on%20the%20water%2C%20Henry%20Ossawa%20Tanner.jpg",
    note:
      "Для Иоанна 6:16-21 есть явный корпус картин; они почти всегда изображают момент видения Иисуса на воде."
  },
  "healing-blind-man": {
    title: "Christ Healing the Blind",
    artist: "El Greco",
    pageUrl: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Healing_the_Blind_-_WGA10420.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/El_Greco_-_Christ_Healing_the_Blind_-_WGA10420.jpg",
    note:
      "Исцеление слепорождённого имеет сильную иконографию, хотя многие картины обобщают сцену и не всегда фиксируют отправление к Силоаму."
  },
  "raising-lazarus": {
    title: "The Raising of Lazarus",
    artist: "Sebastiano del Piombo",
    pageUrl:
      "https://commons.wikimedia.org/wiki/File:Carel_Fabritius_-_Raising_of_Lazarus_(John_11-41-44)_-_M.Ob.563_-_National_Museum_in_Warsaw.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sebastiano%20del%20Piombo%2C%20The%20Raising%20of%20Lazarus%20%28cropped3%29.jpg",
    note:
      "Воскрешение Лазаря - один из самых устойчивых и точных живописных эпизодов в Иоанне."
  },
  "entry-into-jerusalem": {
    title: "The Entry into Jerusalem",
    artist: "Pietro Lorenzetti",
    pageUrl: "https://commons.wikimedia.org/wiki/File:The_Entry_into_Jerusalem_P1995.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Entry%20into%20Jerusalem%20P1995.jpg",
    note:
      "Торжественный вход в Иерусалим хорошо покрыт в традиции, хотя обычно изображается как весь процесс входа."
  },
  "washing-of-feet": {
    title: "Christ Washing the Disciples' Feet",
    artist: "Jacopo Tintoretto",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Prado_washing_feet.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Prado%20washing%20feet.jpg",
    note:
      "Это один из редких эпизодов Иоанна, для которого есть очень точные картины именно под конкретное действие стиха."
  },
  "ecce-homo": {
    title: "Ecce Homo",
    artist: "Antonio Ciseri",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Eccehomo1.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Eccehomo1.jpg",
    note:
      "Иоанна 19:5 почти напрямую совпадает с названием и иконографией Ecce Homo."
  },
  crucifixion: {
    title: "Christ on the Cross with Mary and St John",
    artist: "Rogier van der Weyden",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Weyden_Christ_on_the_Cross_with_Mary_and_St_John.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Weyden%20Christ%20on%20the%20Cross%20with%20Mary%20and%20St%20John.jpg",
    note:
      "Для Иоанна 19 особенно важны сцены распятия с Марией и учеником, которого любил Иисус."
  },
  "noli-me-tangere": {
    title: "Noli Me Tangere",
    artist: "Perugino",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Perugino_-_Noli_Me_Tangere_-_1933.1026_-_Art_Institute_of_Chicago.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Perugino_-_Noli_Me_Tangere_-_1933.1026_-_Art_Institute_of_Chicago.jpg",
    note:
      "Явление Марии Магдалине имеет собственную классическую иконографию и хорошо ложится на Иоанна 20:14-17."
  },
  "doubting-thomas": {
    title: "Doubting Thomas",
    artist: "Caravaggio",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Caravaggio_Doubting_Thomas.jpg",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20Doubting%20Thomas.jpg",
    note:
      "Иоанна 20:27 - почти эталонный стих для этой картины."
  },
  "miraculous-draught": {
    title: "The Second Miraculous Draught of Fishes",
    artist: "James Tissot",
    pageUrl:
      "https://commons.wikimedia.org/wiki/File:Brooklyn_Museum_-_The_Second_Miraculous_Draught_of_Fishes_(La_seconde_p%C3%AAche_miraculeuse)_-_James_Tissot.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brooklyn%20Museum%20-%20The%20Second%20Miraculous%20Draught%20of%20Fishes%20%28La%20seconde%20p%C3%AAche%20miraculeuse%29%20-%20James%20Tissot.jpg",
    note:
      "Иоанна 21:1-8 хорошо покрывается живописной традицией чудесного улова."
  },
  "breakfast-by-sea": {
    title: "Meal of Our Lord and the Apostles",
    artist: "James Tissot",
    pageUrl:
      "https://commons.wikimedia.org/wiki/File:Brooklyn_Museum_-_Meal_of_Our_Lord_and_the_Apostles_(Repas_de_Notre-Seigneur_et_des_ap%C3%B4tres)_-_James_Tissot.jpg",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brooklyn%20Museum%20-%20Meal%20of%20Our%20Lord%20and%20the%20Apostles%20%28Repas%20de%20Notre-Seigneur%20et%20des%20ap%C3%B4tres%29%20-%20James%20Tissot.jpg",
    note:
      "Береговая трапеза в Иоанна 21:9-13 встречается реже, но хороший существующий образ всё же есть."
  }
};

const HIGHLIGHTS = [
  {
    chapter: 2,
    startVerse: 1,
    endVerse: 10,
    assessment: "scene",
    artworkId: "wedding-at-cana",
    note: "Есть сильная картина для события в целом, но не для каждого отдельного жеста внутри рассказа."
  },
  {
    chapter: 2,
    startVerse: 13,
    endVerse: 13,
    assessment: "scene",
    artworkId: "cleansing-of-the-temple",
    note: "Вход в эпизод очищения храма."
  },
  {
    chapter: 2,
    startVerse: 14,
    endVerse: 16,
    assessment: "specific",
    artworkId: "cleansing-of-the-temple",
    note: "Картины обычно фиксируют именно действие изгнания из храма."
  },
  {
    chapter: 2,
    startVerse: 17,
    endVerse: 17,
    assessment: "scene",
    artworkId: "cleansing-of-the-temple",
    note: "Стих толкует сцену, а не изображает новое действие."
  },
  {
    chapter: 3,
    startVerse: 1,
    endVerse: 2,
    assessment: "specific",
    artworkId: "nicodemus-at-night",
    note: "Ночной визит Никодима сам по себе является готовым живописным сюжетом."
  },
  {
    chapter: 3,
    startVerse: 3,
    endVerse: 12,
    assessment: "scene",
    artworkId: "nicodemus-at-night",
    note: "Картина подходит как фон для беседы, но не отражает буквальную формулировку каждого стиха."
  },
  {
    chapter: 4,
    startVerse: 5,
    endVerse: 26,
    assessment: "scene",
    artworkId: "samaritan-woman",
    note: "У встречи с самарянкой есть сильная визуальная традиция как у одной длинной сцены."
  },
  {
    chapter: 4,
    startVerse: 7,
    endVerse: 9,
    assessment: "specific",
    artworkId: "samaritan-woman",
    note: "Просьба о воде и первое столкновение - самые узнаваемые живописные моменты эпизода."
  },
  {
    chapter: 4,
    startVerse: 25,
    endVerse: 26,
    assessment: "scene",
    artworkId: "samaritan-woman",
    note: "Откровение о Мессии звучит внутри уже изображаемой сцены, но обычно не выделяется отдельно."
  },
  {
    chapter: 5,
    startVerse: 2,
    endVerse: 7,
    assessment: "scene",
    artworkId: "bethesda",
    note: "Подготовка к исцелению у купальни."
  },
  {
    chapter: 5,
    startVerse: 8,
    endVerse: 9,
    assessment: "specific",
    artworkId: "bethesda",
    note: "Команда встать и сам момент исцеления обычно изображаются наиболее прямо."
  },
  {
    chapter: 6,
    startVerse: 1,
    endVerse: 10,
    assessment: "scene",
    artworkId: "feeding-five-thousand",
    note: "Картины обычно охватывают чудо насыщения как широкую массовую сцену."
  },
  {
    chapter: 6,
    startVerse: 11,
    endVerse: 13,
    assessment: "specific",
    artworkId: "feeding-five-thousand",
    note: "Раздача хлеба и собирание кусков - самые наглядные стихи эпизода."
  },
  {
    chapter: 6,
    startVerse: 16,
    endVerse: 18,
    assessment: "scene",
    artworkId: "walking-on-water",
    note: "Подводка к ночной сцене на море."
  },
  {
    chapter: 6,
    startVerse: 19,
    endVerse: 21,
    assessment: "specific",
    artworkId: "walking-on-water",
    note: "Видение Иисуса на воде - классический и точный живописный мотив."
  },
  {
    chapter: 9,
    startVerse: 1,
    endVerse: 5,
    assessment: "scene",
    artworkId: "healing-blind-man",
    note: "Картины покрывают сцену исцеления слепорождённого как единый эпизод."
  },
  {
    chapter: 9,
    startVerse: 6,
    endVerse: 7,
    assessment: "specific",
    artworkId: "healing-blind-man",
    note: "Глина на глазах и посыл к Силоаму дают самый зримый момент этого рассказа."
  },
  {
    chapter: 11,
    startVerse: 38,
    endVerse: 42,
    assessment: "scene",
    artworkId: "raising-lazarus",
    note: "Подход к гробнице и молитва перед чудом часто включаются в композицию."
  },
  {
    chapter: 11,
    startVerse: 43,
    endVerse: 44,
    assessment: "specific",
    artworkId: "raising-lazarus",
    note: "Это самый точный стиховой матч во всей сцене Лазаря."
  },
  {
    chapter: 12,
    startVerse: 12,
    endVerse: 15,
    assessment: "scene",
    artworkId: "entry-into-jerusalem",
    note: "Торжественный вход обычно изображается как общий процесс шествия."
  },
  {
    chapter: 13,
    startVerse: 4,
    endVerse: 4,
    assessment: "scene",
    artworkId: "washing-of-feet",
    note: "Подготовка к омовению."
  },
  {
    chapter: 13,
    startVerse: 5,
    endVerse: 5,
    assessment: "specific",
    artworkId: "washing-of-feet",
    note: "Один из лучших точечных живописных матчей в Иоанне."
  },
  {
    chapter: 13,
    startVerse: 6,
    endVerse: 15,
    assessment: "scene",
    artworkId: "washing-of-feet",
    note: "Разговор с Петром и толкование омовения остаются внутри той же визуальной сцены."
  },
  {
    chapter: 19,
    startVerse: 1,
    endVerse: 4,
    assessment: "scene",
    artworkId: "ecce-homo",
    note: "Подводка к предъявлению Иисуса народу."
  },
  {
    chapter: 19,
    startVerse: 5,
    endVerse: 5,
    assessment: "specific",
    artworkId: "ecce-homo",
    note: "Фраза и образ совпадают почти буквально."
  },
  {
    chapter: 19,
    startVerse: 17,
    endVerse: 18,
    assessment: "scene",
    artworkId: "crucifixion",
    note: "Сюжет распятия имеет огромную традицию, хотя конкретно несение креста часто отделяется в другую сцену."
  },
  {
    chapter: 19,
    startVerse: 25,
    endVerse: 27,
    assessment: "specific",
    artworkId: "crucifixion",
    note: "Сцена у креста с Марией и Иоанном особенно хорошо совпадает именно с иоанновской версией."
  },
  {
    chapter: 20,
    startVerse: 11,
    endVerse: 13,
    assessment: "scene",
    artworkId: "noli-me-tangere",
    note: "Плач у гроба подводит к явлению воскресшего Иисуса."
  },
  {
    chapter: 20,
    startVerse: 14,
    endVerse: 17,
    assessment: "specific",
    artworkId: "noli-me-tangere",
    note: "Это точная зона для классической иконографии Noli me tangere."
  },
  {
    chapter: 20,
    startVerse: 24,
    endVerse: 26,
    assessment: "scene",
    artworkId: "doubting-thomas",
    note: "Подводка к встрече с Фомой."
  },
  {
    chapter: 20,
    startVerse: 27,
    endVerse: 27,
    assessment: "specific",
    artworkId: "doubting-thomas",
    note: "Самый точный стиховой матч для картины Караваджо."
  },
  {
    chapter: 20,
    startVerse: 28,
    endVerse: 29,
    assessment: "scene",
    artworkId: "doubting-thomas",
    note: "Исповедание Фомы следует за уже изображённым тактильным моментом."
  },
  {
    chapter: 21,
    startVerse: 1,
    endVerse: 5,
    assessment: "scene",
    artworkId: "miraculous-draught",
    note: "Начало сцены у Тивериадского моря."
  },
  {
    chapter: 21,
    startVerse: 6,
    endVerse: 8,
    assessment: "specific",
    artworkId: "miraculous-draught",
    note: "Чудесный улов и бросок Петра в воду изображаются особенно часто."
  },
  {
    chapter: 21,
    startVerse: 9,
    endVerse: 13,
    assessment: "scene",
    artworkId: "breakfast-by-sea",
    note: "Береговая трапеза встречается реже, но подходящая картина существует."
  }
];

function toReference(chapter, verse) {
  return `Иоанна ${chapter}:${verse}`;
}

function createVerseIndex(book) {
  const verses = [];

  for (const chapter of book.chapters) {
    const scene = chapter.scenes[0];
    for (const verse of scene.verses) {
      verses.push({
        chapter: chapter.number,
        verse: Number(verse.number),
        reference: toReference(chapter.number, verse.number),
        assessment: "none",
        artworkId: null,
        note: "Для этого стиха я не нашёл достаточно устойчивой живописной традиции, которая точно попадала бы именно в формулировку стиха."
      });
    }
  }

  return verses;
}

function applyHighlights(entries) {
  for (const highlight of HIGHLIGHTS) {
    for (const entry of entries) {
      if (
        entry.chapter === highlight.chapter &&
        entry.verse >= highlight.startVerse &&
        entry.verse <= highlight.endVerse
      ) {
        const shouldOverride =
          entry.assessment === "none" ||
          (entry.assessment === "scene" && highlight.assessment === "specific");

        if (shouldOverride) {
          entry.assessment = highlight.assessment;
          entry.artworkId = highlight.artworkId;
          entry.note = highlight.note;
        }
      }
    }
  }
}

function buildChapterSummary(entries) {
  const chapters = new Map();

  for (const entry of entries) {
    if (!chapters.has(entry.chapter)) {
      chapters.set(entry.chapter, { none: 0, scene: 0, specific: 0 });
    }

    chapters.get(entry.chapter)[entry.assessment] += 1;
  }

  return Array.from(chapters.entries()).map(([chapter, counts]) => ({
    chapter,
    ...counts
  }));
}

function buildMarkdown(chapterSummary, entries) {
  const highlighted = entries.filter((entry) => entry.assessment !== "none");
  const lines = [
    "# Оценка картин по Иоанну",
    "",
    "Шкала:",
    "- `specific` — есть существующая картина, которая довольно точно совпадает именно с данным стихом.",
    "- `scene` — есть хорошая картина для эпизода в целом, но не обязательно для микро-момента стиха.",
    "- `none` — я не отметил устойчивую картину, которая хорошо попадает именно в этот стих.",
    "",
    "## Сводка по главам",
    ""
  ];

  for (const row of chapterSummary) {
    lines.push(
      `- Иоанна ${row.chapter}: specific ${row.specific}, scene ${row.scene}, none ${row.none}`
    );
  }

  lines.push("", "## Выделенные стихи", "");

  for (const entry of highlighted) {
    const artwork = ARTWORKS[entry.artworkId];
    lines.push(
      `- ${entry.reference} — ${entry.assessment}; ${artwork.artist}, "${artwork.title}"; ${artwork.pageUrl}`
    );
  }

  lines.push("", "## Примечание", "");
  lines.push(
    "Неотмеченные стихи я сознательно оставил без кандидата: цель была не найти любую религиозную картину рядом по теме, а отметить только те места, где уже существует действительно уместная и устойчивая живописная сцена."
  );

  return `${lines.join("\n")}\n`;
}

const book = JSON.parse(await fs.readFile(johnPath, "utf8"));
const entries = createVerseIndex(book);
applyHighlights(entries);

const chapterSummary = buildChapterSummary(entries);
const counts = entries.reduce(
  (acc, entry) => {
    acc[entry.assessment] += 1;
    return acc;
  },
  { none: 0, scene: 0, specific: 0 }
);

const payload = {
  book: {
    id: book.id,
    title: book.title,
    chapters: book.chapters.length,
    verses: entries.length
  },
  methodology: {
    focus:
      "Оценивалась не просто тематическая близость, а наличие существующей картины, которая естественно подходит к конкретному стиху или к сцене вокруг него.",
    scale: {
      specific:
        "Есть картина, которая достаточно точно совпадает с действием или визуальным центром данного стиха.",
      scene:
        "Есть картина для эпизода в целом, но стих скорее принадлежит этой сцене, чем совпадает с ней буквально.",
      none:
        "Я не отметил устойчивую существующую картину, которая была бы достаточно точной именно для этого стиха."
    }
  },
  summary: {
    ...counts,
    chapterSummary
  },
  artworks: ARTWORKS,
  verses: entries
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(jsonOutputPath, JSON.stringify(payload, null, 2) + "\n");
await fs.writeFile(markdownOutputPath, buildMarkdown(chapterSummary, entries));

console.log(`Wrote ${path.relative(rootDir, jsonOutputPath)}`);
console.log(`Wrote ${path.relative(rootDir, markdownOutputPath)}`);

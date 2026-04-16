import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./styles.css";
import matthewVerseArtAssessment from "./data/assessments/matthew-art-assessment.json";
import lukeVerseArtAudit from "./data/books/luke-art-audit.json";
import johnVerseArtAssessment from "./data/research/john-verse-art-assessment.json";
import {
  commentarySourceLibrary,
  getVerseCommentaries
} from "./commentary.js";
import { greekFormFallbacks } from "./greek-form-fallbacks.js";
import { greekLemmaLexicon } from "./lexicon.js";
import { greekLemmaFallbackLexicon } from "./lexicon-fallbacks.js";
import {
  allScenes,
  findSceneByRoute,
  getBookById,
  getPlaceById,
  getSceneHref,
  gospelLibrary,
  loadBookData,
  translationInfo,
  places
} from "./content.js";

const translationOptions = [
  {
    id: "greek",
    label: "Греческий (Textus Receptus)",
    family: "greek"
  },
  {
    id: "russianSynodal",
    label: "Русский (Синодальный)",
    family: "russian",
    fallbackId: "russian"
  },
  {
    id: "russianCassian",
    label: "Русский (Кассиан)",
    family: "russian"
  },
  {
    id: "russianBti",
    label: "Русский (Заокский / Кулакова)",
    family: "russian"
  },
  {
    id: "english",
    label: "Английский (KJV)",
    family: "english"
  }
];

const translationOptionById = Object.fromEntries(
  translationOptions.map((item) => [item.id, item])
);
const translationDetailsById = Object.fromEntries(
  translationInfo.current.map((item) => [item.id, item])
);
const visibleLanguagesStorageKey = "good-news-everyone:visible-languages";
const defaultVisibleLanguages = ["greek", "russianSynodal", "russianCassian", "russianBti"];

function normalizeAssessmentBook(source) {
  if (!source) {
    return { verses: [], artworks: {} };
  }

  if (Array.isArray(source.verses) && source.artworks) {
    return source;
  }

  const verses = Array.isArray(source.assessments)
    ? source.assessments.map((entry) => ({
        chapter: entry.chapter,
        verse: entry.verse,
        reference: entry.reference,
        assessment:
          entry.rating === "exact"
            ? "specific"
            : entry.rating === "scene"
              ? "scene"
              : "none",
        artworkId: entry.artworkId,
        note: entry.note
      }))
    : [];

  const artworks = Object.fromEntries(
    (source.artworkLibrary ?? [])
      .filter((item) => item?.id)
      .map((item) => [
        item.id,
        {
          title: item.title,
          artist: item.artist,
          pageUrl: item.commonsPage,
          imageUrl: item.previewSrc,
          note: item.note ?? ""
        }
      ])
  );

  return { verses, artworks };
}

const assessmentDataByBook = {
  matthew: normalizeAssessmentBook(matthewVerseArtAssessment),
  john: normalizeAssessmentBook(johnVerseArtAssessment)
};

function buildUniqueAssessmentVerseMap(entries, getArtworkKey) {
  const counts = new Map();

  entries.forEach((entry) => {
    const artworkKey = getArtworkKey(entry);

    if (!artworkKey) {
      return;
    }

    const chapterKey = `${entry.chapter}:${artworkKey}`;
    counts.set(chapterKey, (counts.get(chapterKey) ?? 0) + 1);
  });

  return new Map(
    entries
      .filter((entry) => {
        const artworkKey = getArtworkKey(entry);

        if (!artworkKey) {
          return false;
        }

        return counts.get(`${entry.chapter}:${artworkKey}`) === 1;
      })
      .map((entry) => [`${entry.chapter}:${entry.verse}`, entry])
  );
}

const verseArtAssessmentByBook = {
  matthew: buildUniqueAssessmentVerseMap(
    assessmentDataByBook.matthew.verses
      .filter((entry) => entry.assessment !== "none" && entry.artworkId),
    (entry) => entry.artworkId
  ),
  john: buildUniqueAssessmentVerseMap(
    assessmentDataByBook.john.verses
      .filter((entry) => entry.assessment !== "none" && entry.artworkId),
    (entry) => entry.artworkId
  ),
  luke: buildUniqueAssessmentVerseMap(
    lukeVerseArtAudit.verses
      .filter((entry) => entry.art?.src),
    (entry) => entry.art?.src
  )
};

const chapterArtAssessmentByBook = {
  matthew: new Map(
    assessmentDataByBook.matthew.verses
      .filter((entry) => entry.assessment !== "none" && entry.artworkId)
      .reduce((chapters, entry) => {
        const current = chapters.get(entry.chapter);

        if (!current || (current.assessment === "scene" && entry.assessment === "specific")) {
          chapters.set(entry.chapter, entry);
        }

        return chapters;
      }, new Map())
  ),
  john: new Map(
    assessmentDataByBook.john.verses
      .filter((entry) => entry.assessment !== "none" && entry.artworkId)
      .reduce((chapters, entry) => {
        const current = chapters.get(entry.chapter);

        if (!current || (current.assessment === "scene" && entry.assessment === "specific")) {
          chapters.set(entry.chapter, entry);
        }

        return chapters;
      }, new Map())
  ),
  luke: new Map(
    lukeVerseArtAudit.verses
      .filter((entry) => entry.art?.src)
      .reduce((chapters, entry) => {
        const current = chapters.get(entry.chapter);
        const entryWeight = entry.assessment === "exact" ? 2 : 1;
        const currentWeight = current ? (current.assessment === "exact" ? 2 : 1) : 0;

        if (!current || entryWeight > currentWeight) {
          chapters.set(entry.chapter, entry);
        }

        return chapters;
      }, new Map())
  )
};

const bookLabels = {
  matthew: "Матфей",
  mark: "Марк",
  luke: "Лука",
  john: "Иоанн"
};

const bookSubtitles = {
  matthew: "Исполнение, учение, Царство",
  mark: "Скорость, движение, действие",
  luke: "Милость, телесность, близость",
  john: "Символ, глубина, откровение"
};

const bookAccents = {
  matthew:
    "Евангелие с сильным учительным ритмом: исполнение Писания, образ Царства и долгая школа ученичества.",
  mark:
    "Краткое и стремительное повествование, где действие, решение и телесная конкретность несут почти каждую сцену.",
  luke:
    "Евангелие внимания к людям, памяти, гостеприимству и спасению, входящему в обычную жизнь.",
  john:
    "Медленное, символическое Евангелие, в котором реальные места становятся пространством откровения."
};

const lifeJourney = {
  matthew: {
    startLabel: "Рождение",
    endLabel: "Смерть и воскресение",
    stages: [
      {
        id: "origins",
        title: "Ранние годы и явление",
        years: "ок. 6-4 до н.э. - ок. 27 г. н.э.",
        locations: ["bethlehem", "nazareth", "jerusalem", "sea-of-galilee"],
        summary: "От родословия и рождения до крещения и выхода к народу.",
        story: "Детство, скрытая жизнь и первое публичное явление Иисуса.",
        chapters: [1, 4]
      },
      {
        id: "galilee",
        title: "Учение и дела в Галилее",
        years: "ок. 27-29 г. н.э.",
        locations: ["capernaum", "sea-of-galilee"],
        summary: "Нагорная проповедь, чудеса, притчи и формирование учеников.",
        story: "Главный галилейский отрезок: проповедь, исцеления, конфликты и школа ученичества.",
        chapters: [5, 18]
      },
      {
        id: "jerusalem",
        title: "Поворот к Иерусалиму",
        years: "ок. 29-30 г. н.э.",
        locations: ["sea-of-galilee", "jerusalem"],
        summary: "Конфликты обостряются, путь сужается, приближается последняя неделя.",
        story: "Повествование темнеет: всё больше споров, всё явственнее курс на Иерусалим.",
        chapters: [19, 25]
      },
      {
        id: "passion",
        title: "Страсти, крест и победа",
        years: "ок. 30 г. н.э.",
        locations: ["jerusalem"],
        summary: "Тайная вечеря, суд, распятие, погребение и весть о воскресении.",
        story: "Последние дни в Иерусалиме, крест и утро воскресения.",
        chapters: [26, 28]
      }
    ],
    milestones: [
      { chapter: 1, title: "Рождение и имя", years: "ок. 6-4 до н.э.", location: "Вифлеем", text: "Начало истории и мессианская родословная." },
      { chapter: 3, title: "Крещение", years: "ок. 27 г. н.э.", location: "Иудея", text: "Публичное явление и голос с небес." },
      { chapter: 5, title: "Нагорная проповедь", years: "ок. 27-28 г. н.э.", location: "Галилея", text: "Первая большая вершина учения." },
      { chapter: 16, title: "Исповедание Петра", years: "ок. 29 г. н.э.", location: "Север Галилеи", text: "Переломный момент ученичества." },
      { chapter: 21, title: "Вход в Иерусалим", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Последний этап земного пути." },
      { chapter: 27, title: "Распятие", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Крест как центр повествования." },
      { chapter: 28, title: "Воскресение", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Финал, открывающий послание миру." }
    ]
  },
  mark: {
    startLabel: "Явление",
    endLabel: "Крест и пустая гробница",
    stages: [
      {
        id: "opening",
        title: "Явление и быстрый старт",
        years: "ок. 27 г. н.э.",
        locations: ["sea-of-galilee"],
        summary: "Крещение, искушение и первые сильные действия Иисуса.",
        story: "У Марка всё начинается резко: почти без детства, сразу в силу служения.",
        chapters: [1, 3]
      },
      {
        id: "galilee",
        title: "Галилейское движение",
        years: "ок. 27-29 г. н.э.",
        locations: ["capernaum", "sea-of-galilee"],
        summary: "Чудеса, споры, притчи и постоянное движение среди людей.",
        story: "Плотный, подвижный этап с толпами, лодками, спорами и исцелениями.",
        chapters: [4, 8]
      },
      {
        id: "turn",
        title: "Путь через откровение",
        years: "ок. 29-30 г. н.э.",
        locations: ["sea-of-galilee", "jerusalem"],
        summary: "Преображение, наставления ученикам и дорога к Иерусалиму.",
        story: "После исповедания Петра повествование всё заметнее движется к страстям.",
        chapters: [9, 13]
      },
      {
        id: "passion",
        title: "Последняя неделя",
        years: "ок. 30 г. н.э.",
        locations: ["jerusalem"],
        summary: "Конфликт, вечеря, суд, распятие и весть о воскресении.",
        story: "Короткий и резкий финальный отрезок, где темп только ускоряется.",
        chapters: [14, 16]
      }
    ],
    milestones: [
      { chapter: 1, title: "Крещение", years: "ок. 27 г. н.э.", location: "Иудея", text: "Евангелие Марка начинает путь сразу с действия." },
      { chapter: 4, title: "Притчи", years: "ок. 28 г. н.э.", location: "Галилея", text: "Скрытая логика Царства начинает раскрываться." },
      { chapter: 8, title: "Исповедание Петра", years: "ок. 29 г. н.э.", location: "Север Галилеи", text: "Повествование делает поворот к страстям." },
      { chapter: 9, title: "Преображение", years: "ок. 29 г. н.э.", location: "Галилея", text: "Краткая вспышка славы на пути вниз." },
      { chapter: 11, title: "Иерусалим", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Напряжение последней недели нарастает." },
      { chapter: 15, title: "Распятие", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Самая резкая и сжатая точка повествования." },
      { chapter: 16, title: "Пустая гробница", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Конец открыт, но путь уже изменил мир." }
    ]
  },
  luke: {
    startLabel: "Рождение",
    endLabel: "Крест, воскресение и вознесение",
    stages: [
      {
        id: "origins",
        title: "Рождения и подготовка",
        years: "ок. 6-4 до н.э. - ок. 27 г. н.э.",
        locations: ["nazareth", "bethlehem", "jerusalem"],
        summary: "Истории Иоанна и Иисуса, детство и вступление в служение.",
        story: "От Благовещения и песней младенчества к первым публичным словам Иисуса.",
        chapters: [1, 4]
      },
      {
        id: "galilee",
        title: "Милость среди людей",
        years: "ок. 27-29 г. н.э.",
        locations: ["capernaum", "sea-of-galilee"],
        summary: "Исцеления, притчи, трапезы и внимание к тем, кого обычно не видят.",
        story: "Галилейская часть у Луки особенно человечная: трапезы, исцеления и лица людей.",
        chapters: [5, 9]
      },
      {
        id: "journey",
        title: "Долгий путь к Иерусалиму",
        years: "ок. 29-30 г. н.э.",
        locations: ["sea-of-galilee", "sychar", "jerusalem"],
        summary: "Самый протяжённый дорожный отрезок с притчами и встречами.",
        story: "Большая дорожная секция, где путь становится способом рассказа и внутреннего созревания.",
        chapters: [10, 19]
      },
      {
        id: "passion",
        title: "Иерусалим, крест и утро воскресения",
        years: "ок. 30 г. н.э.",
        locations: ["jerusalem"],
        summary: "Последние дни, суд, распятие, пустая гробница и путь в Эммаус.",
        story: "Иерусалимская кульминация с крестом, пустой гробницей и дорогой в Эммаус.",
        chapters: [20, 24]
      }
    ],
    milestones: [
      { chapter: 1, title: "Благовещение", years: "ок. 6-5 до н.э.", location: "Назарет", text: "Повествование начинается с ожидания и песни." },
      { chapter: 2, title: "Рождение", years: "ок. 6-4 до н.э.", location: "Вифлеем", text: "Младенчество Иисуса вписано в историю мира." },
      { chapter: 4, title: "Назарет", years: "ок. 27 г. н.э.", location: "Назарет", text: "Программа служения впервые звучит вслух." },
      { chapter: 9, title: "Поворот к Иерусалиму", years: "ок. 29 г. н.э.", location: "Галилея", text: "Лука подчёркивает сознательный выбор пути." },
      { chapter: 15, title: "Притчи о потерянном", years: "ок. 29-30 г. н.э.", location: "По дороге", text: "Сердце лукианского образа милости." },
      { chapter: 22, title: "Тайная вечеря", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Последний переход перед страстями." },
      { chapter: 23, title: "Распятие", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Крест показан в интонации сострадания." },
      { chapter: 24, title: "Воскресение и Эммаус", years: "ок. 30 г. н.э.", location: "Иерусалим и Эммаус", text: "Путь заканчивается узнаванием и радостью." }
    ]
  },
  john: {
    startLabel: "Предвечное Слово и явление миру",
    endLabel: "Крест, воскресение и послесловие",
    stages: [
      {
        id: "manifestation",
        title: "Явление Слова",
        years: "вне времени - ок. 27-28 г. н.э.",
        locations: ["sea-of-galilee", "sychar"],
        summary: "Пролог, первые ученики и первые знамения.",
        story: "Иоанн начинает выше истории, а потом приземляет рассказ в конкретных встречах и местах.",
        chapters: [1, 4]
      },
      {
        id: "signs",
        title: "Книга знамений",
        years: "ок. 28-30 г. н.э.",
        locations: ["sea-of-galilee", "jerusalem", "sychar"],
        summary: "Чудеса и диалоги постепенно раскрывают, кто такой Иисус.",
        story: "Большие знамения становятся поводом для длинных разговоров о личности Иисуса.",
        chapters: [5, 12]
      },
      {
        id: "farewell",
        title: "Прощальные речи",
        years: "ок. 30 г. н.э.",
        locations: ["jerusalem"],
        summary: "Интимное пространство вечери, омовения ног и обещаний Духа.",
        story: "Время как будто замедляется: один вечер превращается в глубокую беседу.",
        chapters: [13, 17]
      },
      {
        id: "passion",
        title: "Страсти и новое утро",
        years: "ок. 30 г. н.э.",
        locations: ["jerusalem", "sea-of-galilee"],
        summary: "Арест, крест, воскресение и эпилог у моря.",
        story: "Крест, пустая гробница и завершающая сцена у моря Тивериадского.",
        chapters: [18, 21]
      }
    ],
    milestones: [
      { chapter: 1, title: "Пролог", years: "до времени / ок. 27 г. н.э.", location: "Космический пролог", text: "История начинается до рождения, в тайне Слова." },
      { chapter: 2, title: "Кана", years: "ок. 27-28 г. н.э.", location: "Кана Галилейская", text: "Первое знамение задаёт символический ритм." },
      { chapter: 4, title: "Самарянка", years: "ок. 28 г. н.э.", location: "Самария", text: "Откровение выходит за привычные границы." },
      { chapter: 6, title: "Хлеб жизни", years: "ок. 29 г. н.э.", location: "Галилея", text: "Знамение становится толкованием самого себя." },
      { chapter: 11, title: "Лазарь", years: "ок. 30 г. н.э.", location: "Вифания", text: "Последнее великое знамение перед Иерусалимом." },
      { chapter: 13, title: "Омовение ног", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Сила выражается как служение и близость." },
      { chapter: 19, title: "Распятие", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Крест у Иоанна звучит как исполнение." },
      { chapter: 20, title: "Воскресение", years: "ок. 30 г. н.э.", location: "Иерусалим", text: "Пустая гробница и встречи после утра." }
    ]
  }
};

const defaultScene = allScenes[0];
let activeMap = null;
let renderRequestId = 0;
let activeUtterance = null;
const lemmaReferencesCache = new Map();

const state = {
  visibleLanguages: getInitialVisibleLanguages(),
  loadedBooks: new Map(),
  selectedWord: null,
  selectedContext: {
    sceneKey: null,
    refId: null
  },
  activeArtwork: null,
  activeCommentary: {
    sceneKey: null,
    verseNumber: null,
    commentaryId: null
  },
  pronunciation: {
    sceneKey: null,
    verseNumber: null,
    greekIndex: null,
    status: "idle",
    error: ""
  },
  currentSceneKey: getSceneKey(defaultScene)
};

const app = document.querySelector("#app");

function sanitizeVisibleLanguages(languages) {
  if (!Array.isArray(languages)) {
    return [...defaultVisibleLanguages];
  }

  const uniqueLanguages = [...new Set(languages)].filter((language) => translationOptionById[language]);
  return uniqueLanguages.length > 0 ? uniqueLanguages : [...defaultVisibleLanguages];
}

function getInitialVisibleLanguages() {
  if (typeof window === "undefined") {
    return [...defaultVisibleLanguages];
  }

  try {
    const rawValue = window.localStorage.getItem(visibleLanguagesStorageKey);
    if (!rawValue) {
      return [...defaultVisibleLanguages];
    }

    return sanitizeVisibleLanguages(JSON.parse(rawValue));
  } catch {
    return [...defaultVisibleLanguages];
  }
}

function persistVisibleLanguages(languages) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      visibleLanguagesStorageKey,
      JSON.stringify(sanitizeVisibleLanguages(languages))
    );
  } catch {
    // Ignore storage failures so the reader still works in restricted browsers.
  }
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [bookId, chapterNumber, sceneId] = hash.split("/");

  if (!bookId || !chapterNumber || !sceneId) {
    return defaultScene;
  }

  return findSceneByRoute(bookId, chapterNumber, sceneId) ?? defaultScene;
}

function navigateToScene(scene) {
  const nextHash = getSceneHref(scene);
  if (window.location.hash === nextHash) {
    render();
    return;
  }

  window.location.hash = nextHash;
}

function renderLeafletMap(scene) {
  const container = document.querySelector("#context-map");
  const highlightPlaceIds = scene.map?.highlightPlaceIds?.length
    ? scene.map.highlightPlaceIds
    : scene.scenePlaceId
      ? [scene.scenePlaceId]
      : [];
  const highlightPlaces = highlightPlaceIds
    .map((placeId) => getPlaceById(placeId))
    .filter(Boolean);
  const activePlace = getPlaceById(scene.scenePlaceId) ?? highlightPlaces[0];

  if (!container || !activePlace || highlightPlaces.length === 0) {
    return;
  }

  if (activeMap) {
    activeMap.remove();
    activeMap = null;
  }

  activeMap = L.map(container, {
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(activeMap);

  if (highlightPlaces.length === 1) {
    activeMap.setView([activePlace.lat, activePlace.lng], scene.map?.zoom ?? 9);
  } else {
    const bounds = L.latLngBounds(highlightPlaces.map((place) => [place.lat, place.lng]));
    activeMap.fitBounds(bounds, { padding: [24, 24] });
  }

  if (highlightPlaces.length > 1) {
    L.polyline(
      highlightPlaces.map((place) => [place.lat, place.lng]),
      {
        color: "#a97832",
        weight: 3,
        opacity: 0.65,
        dashArray: "7 5"
      }
    ).addTo(activeMap);
  }

  highlightPlaces.forEach((place) => {
    const isActive = place.id === activePlace.id;
    const marker = L.circleMarker([place.lat, place.lng], {
      radius: isActive ? 9 : 6,
      color: isActive ? "#a97832" : "#8f5b3c",
      fillColor: isActive ? "#d3a95a" : "#8f5b3c",
      fillOpacity: 0.88,
      weight: isActive ? 3 : 2
    }).addTo(activeMap);

    marker.bindPopup(
      `<strong>${place.name}</strong><br>${place.description ?? ""}`
    );
    marker.bindTooltip(place.name, {
      permanent: true,
      direction: "top",
      offset: [0, -10],
      className: `map-label${isActive ? " map-label--active" : ""}`
    });

    if (isActive) {
      marker.openPopup();
    }
  });
}

function getSceneIndex(scene) {
  return allScenes.findIndex(
    (item) =>
      item.bookId === scene.bookId &&
      item.chapterNumber === scene.chapterNumber &&
      item.id === scene.id
  );
}

function getSceneKey(scene) {
  return `${scene.bookId}:${scene.chapterNumber}:${scene.id}`;
}

function splitDisplayTokens(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeContextLookupToken(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

const commonEntityHighlightTerms = new Set(
  [
    "Иисус",
    "Иисуса",
    "Иисусу",
    "Иисусом",
    "Иисусе",
    "Христос",
    "Бог",
    "Господь",
    "ученики"
  ].map((item) => normalizeContextLookupToken(item))
);

function getContextReferenceAliases(label = "", extraAliases = []) {
  const aliases = new Set();
  const cleanLabel = label.trim();
  if (cleanLabel) {
    aliases.add(cleanLabel);
  }

  extraAliases.forEach((alias) => {
    const cleanAlias = typeof alias === "string" ? alias.trim() : "";
    if (cleanAlias) {
      aliases.add(cleanAlias);
    }
  });

  const firstPart = cleanLabel.split(/[,(/:;]| — | – | - /)[0]?.trim();
  if (firstPart) {
    aliases.add(firstPart);
  }

  return [...aliases];
}

function getSceneContextReferences(scene) {
  const entities = (scene.entities ?? []).map((item, index) => ({
    id: `entity:${index}`,
    kind: "entity",
    title: item.name,
    meta: item.meta,
    description: item.description,
    aliases: getContextReferenceAliases(item.name, item.aliases),
    verseNumbers: item.verseNumbers ?? null
  }));
  const glossary = (scene.glossary ?? []).map((item, index) => ({
    id: `glossary:${index}`,
    kind: "glossary",
    title: item.term,
    meta: item.meta,
    description: item.description,
    aliases: getContextReferenceAliases(item.term, item.aliases),
    verseNumbers: item.verseNumbers ?? null
  }));

  return [...entities, ...glossary].map((item) => ({
    ...item,
    lookupPhrases: item.aliases
      .map((alias) =>
        splitDisplayTokens(alias)
          .map((token) => normalizeContextLookupToken(token))
          .filter(Boolean)
      )
      .filter((phrase) => phrase.length > 0)
      .sort((a, b) => b.length - a.length)
  }));
}

function getSelectedContextReference(scene) {
  if (state.selectedContext.sceneKey !== getSceneKey(scene) || !state.selectedContext.refId) {
    return null;
  }

  return getSceneContextReferences(scene).find((item) => item.id === state.selectedContext.refId) ?? null;
}

function getVerseContextMatches(scene, verse, language) {
  if (translationOptionById[language]?.family !== "russian") {
    return [];
  }

  const currentVerseNumber = String(verse?.number ?? "");
  const references = getSceneContextReferences(scene).filter((reference) => {
    if (
      Array.isArray(reference.verseNumbers) &&
      reference.verseNumbers.length > 0 &&
      !reference.verseNumbers.map((value) => String(value)).includes(currentVerseNumber)
    ) {
      return false;
    }

    if (reference.kind !== "entity") {
      return true;
    }

    return !commonEntityHighlightTerms.has(normalizeContextLookupToken(reference.title));
  });
  if (references.length === 0) {
    return [];
  }

  const tokens = splitDisplayTokens(getDisplayTranslationText(verse, language));
  const normalizedTokens = tokens.map((token) => normalizeContextLookupToken(token));
  const matches = [];

  for (let index = 0; index < normalizedTokens.length; index += 1) {
    let bestMatch = null;

    references.forEach((reference) => {
      reference.lookupPhrases.forEach((phrase) => {
        if (phrase.length === 0 || index + phrase.length > normalizedTokens.length) {
          return;
        }

        const isMatch = phrase.every((part, offset) => normalizedTokens[index + offset] === part);
        if (!isMatch) {
          return;
        }

        if (
          !bestMatch ||
          phrase.length > bestMatch.length ||
          (phrase.length === bestMatch.length &&
            bestMatch.reference.kind === "glossary" &&
            reference.kind === "entity")
        ) {
          bestMatch = {
            start: index,
            length: phrase.length,
            reference
          };
        }
      });
    });

    if (bestMatch) {
      matches.push(bestMatch);
      index += bestMatch.length - 1;
    }
  }

  return matches;
}

function getTranslationText(verse, translationId) {
  if (!verse?.translations) {
    return "";
  }

  const meta = translationOptionById[translationId];

  if (meta?.fallbackId) {
    return verse.translations[translationId] ?? verse.translations[meta.fallbackId] ?? "";
  }

  return verse.translations[translationId] ?? "";
}

function getDisplayTranslationText(verse, translationId) {
  return getTranslationText(verse, translationId) || "Стих отсутствует в этом переводе.";
}

function getAlignmentForTranslation(verse, translationId) {
  const meta = translationOptionById[translationId];

  if (meta?.fallbackId) {
    return verse.alignments?.[translationId] ?? verse.alignments?.[meta.fallbackId] ?? null;
  }

  return verse.alignments?.[translationId] ?? null;
}

function getPreferredRussianTranslationId() {
  return (
    state.visibleLanguages.find((translationId) => translationOptionById[translationId]?.family === "russian") ??
    "russianSynodal"
  );
}

function renderTranslationToggle(option) {
  const details = translationDetailsById[option.id];

  return `
    <button
      class="pill pill--translation${state.visibleLanguages.includes(option.id) ? " is-active" : ""}"
      type="button"
      data-language="${option.id}"
      ${details ? `aria-describedby="translation-tip-${option.id}"` : ""}
    >
      <span class="pill__label">${option.label}</span>
      ${details?.years ? `<span class="pill__meta">${details.years}</span>` : ""}
      ${
        details
          ? `
            <span class="translation-tooltip" id="translation-tip-${option.id}" role="tooltip">
              <strong>${details.title}</strong>
              <span>${details.body}</span>
            </span>
          `
          : ""
      }
    </button>
  `;
}

function getAlignedTokenIndex(sourceCount, targetCount, sourceIndex) {
  if (!sourceCount || !targetCount) {
    return -1;
  }

  if (sourceCount === 1) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      targetCount - 1,
      Math.round((sourceIndex / (sourceCount - 1)) * (targetCount - 1))
    )
  );
}

function hasSpeechSupport() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

function stopGreekPronunciation({ rerender = true } = {}) {
  if (hasSpeechSupport()) {
    window.speechSynthesis.cancel();
  }

  activeUtterance = null;
  state.pronunciation = {
    sceneKey: null,
    verseNumber: null,
    greekIndex: null,
    status: "idle",
    error: ""
  };

  if (rerender) {
    render();
  }
}

function isPronunciationActive(selection) {
  return (
    selection &&
    state.pronunciation.status === "playing" &&
    state.pronunciation.sceneKey === selection.sceneKey &&
    state.pronunciation.verseNumber === selection.verseNumber &&
    state.pronunciation.greekIndex === selection.greekIndex
  );
}

function pickGreekVoice() {
  if (!hasSpeechSupport()) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("el")) ??
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("gr")) ??
    null
  );
}

function playGreekPronunciation(selection) {
  if (!selection || !selection.token) {
    return;
  }

  if (!hasSpeechSupport()) {
    state.pronunciation = {
      sceneKey: selection.sceneKey,
      verseNumber: selection.verseNumber,
      greekIndex: selection.greekIndex,
      status: "error",
      error: "В этом браузере нет встроенного озвучивания."
    };
    render();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new window.SpeechSynthesisUtterance(selection.token);
  const voice = pickGreekVoice();
  utterance.lang = voice?.lang ?? "el-GR";
  if (voice) {
    utterance.voice = voice;
  }
  utterance.rate = 0.9;
  utterance.pitch = 1;

  activeUtterance = utterance;
  state.pronunciation = {
    sceneKey: selection.sceneKey,
    verseNumber: selection.verseNumber,
    greekIndex: selection.greekIndex,
    status: "playing",
    error: ""
  };

  utterance.onend = () => {
    if (activeUtterance !== utterance) {
      return;
    }

    activeUtterance = null;
    state.pronunciation = {
      sceneKey: selection.sceneKey,
      verseNumber: selection.verseNumber,
      greekIndex: selection.greekIndex,
      status: "idle",
      error: ""
    };
    render();
  };

  utterance.onerror = () => {
    if (activeUtterance !== utterance) {
      return;
    }

    activeUtterance = null;
    state.pronunciation = {
      sceneKey: selection.sceneKey,
      verseNumber: selection.verseNumber,
      greekIndex: selection.greekIndex,
      status: "error",
      error: "Не удалось воспроизвести слово. Проверьте, доступен ли греческий голос в системе."
    };
    render();
  };

  window.speechSynthesis.speak(utterance);
  render();
}

function selectGreekWord(scene, verse, tokenIndex) {
  stopGreekPronunciation({ rerender: false });

  const greekTokens =
    verse.greekTokens ?? splitDisplayTokens(getTranslationText(verse, "greek")).map((text) => ({ text }));
  const token = greekTokens[tokenIndex];
  if (!token) {
    return;
  }

  const formFallback = !token.lemma ? getGreekFormFallback(token) : null;
  const lexiconMatch =
    findLexiconMatch(token.lemma) ??
    findLexiconMatch(formFallback?.lemma) ??
    findLexiconMatch(token.text);
  const resolvedLemma = token.lemma || formFallback?.lemma || lexiconMatch?.key || "";
  const preferredRussianTranslationId = getPreferredRussianTranslationId();
  const contextualTranslation = getAlignedTranslationToken(verse, tokenIndex, preferredRussianTranslationId);
  const relatedVerses = getRelatedVersesForLemma(scene.bookId, resolvedLemma, {
    chapterNumber: scene.chapterNumber,
    verseNumber: verse.number
  });

  state.selectedWord = {
    sceneKey: getSceneKey(scene),
    bookId: scene.bookId,
    chapterNumber: scene.chapterNumber,
    verseNumber: verse.number,
    greekIndex: tokenIndex,
    token: token.text,
    lemma: resolvedLemma,
    originalLemma: token.lemma,
    pos: token.pos || formFallback?.pos || "",
    parsing: token.parsing || formFallback?.parsing || "",
    lexiconEntry: lexiconMatch?.entry ?? null,
    relatedVerses,
    contextualTranslation,
    contextualTranslationId: contextualTranslation ? preferredRussianTranslationId : null
  };

  playGreekPronunciation(state.selectedWord);
}

function renderVerseText(scene, verse, language) {
  const selection = state.selectedWord;
  const isSelectedVerse =
    selection &&
    selection.sceneKey === getSceneKey(scene) &&
    selection.verseNumber === verse.number;

  if (language === "greek") {
    const greekTokens =
      verse.greekTokens ?? splitDisplayTokens(getTranslationText(verse, "greek")).map((text) => ({ text }));

    return greekTokens
      .map((token, index) => {
        const isActive = isSelectedVerse && selection.greekIndex === index;
        return `<button class="word-chip word-chip--greek${isActive ? " is-active" : ""}" type="button" data-greek-word="${verse.number}:${index}">${token.text}</button>`;
      })
      .join(" ");
  }

  const tokens = splitDisplayTokens(getDisplayTranslationText(verse, language));
  const contextMatches = getVerseContextMatches(scene, verse, language);
  const contextMatchMap = new Map(contextMatches.map((item) => [item.start, item]));
  const activeContextRef = getSelectedContextReference(scene);
  const parts = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const contextMatch = contextMatchMap.get(index);
    if (contextMatch) {
      const phraseTokens = tokens.slice(index, index + contextMatch.length);
      const isActive = activeContextRef?.id === contextMatch.reference.id;
      parts.push(`
        <button
          class="word-chip word-chip--context${isActive ? " is-active" : ""}"
          type="button"
          data-context-ref="${verse.number}:${contextMatch.reference.id}"
          title="${contextMatch.reference.title}"
        >
          ${phraseTokens.join(" ")}
        </button>
      `);
      index += contextMatch.length - 1;
      continue;
    }

    parts.push(`<span class="word-chip">${tokens[index]}</span>`);
  }

  return parts.join(" ");
}

function renderWordPanel(scene, verse) {
  const selection = state.selectedWord;
  if (
    !selection ||
    selection.sceneKey !== getSceneKey(scene) ||
    selection.verseNumber !== verse.number
  ) {
    return "";
  }

  const speechSupported = hasSpeechSupport();
  const pronunciationActive = isPronunciationActive(selection);
  const pronunciationError =
    state.pronunciation.sceneKey === selection.sceneKey &&
    state.pronunciation.verseNumber === selection.verseNumber &&
    state.pronunciation.greekIndex === selection.greekIndex
      ? state.pronunciation.error
      : "";
  const pronunciationHint = speechSupported
    ? "Нажмите на греческое слово, чтобы сразу услышать его. Звучание зависит от доступного системного голоса для греческого."
    : "В этом браузере нет встроенного озвучивания.";
  const senseMarkup = renderLexiconSenses(selection);
  const relatedMarkup = renderRelatedVerses(selection);
  const lexiconSummary = selection.lexiconEntry?.summary
    ? `<p><strong>Смысловое поле:</strong> ${selection.lexiconEntry.summary}</p>`
    : `<p class="word-panel__subtle">Для этой леммы расширенная словарная заметка пока не добавлена, но ниже всё равно показаны другие стихи с тем же словом.</p>`;
  const contextualTranslationLabel = selection.contextualTranslationId
    ? translationOptionById[selection.contextualTranslationId]?.label ?? "русском переводе"
    : "";
  const contextualTranslationMarkup = selection.contextualTranslation
    ? `<p><strong>Перевод в ${contextualTranslationLabel}:</strong> ${selection.contextualTranslation}</p>`
    : "";
  const lexiconGloss = selection.lexiconEntry?.gloss
    ? `<p><strong>Перевод греческой леммы:</strong> ${selection.lexiconEntry.gloss}</p>`
    : "";
  const lexiconVariants = selection.lexiconEntry?.variants?.length
    ? `<p><strong>Другие возможные переводы:</strong> ${selection.lexiconEntry.variants.join(", ")}</p>`
    : "";

  return `
    <div class="word-panel">
      <div>
        <p class="word-panel__eyebrow">Выбранное греческое слово</p>
        <h4>${selection.token}</h4>
      </div>
      <p class="word-panel__hint">${pronunciationActive ? "Сейчас воспроизводится." : pronunciationError || pronunciationHint}</p>
      <p><strong>Лемма:</strong> ${selection.lemma || "не определена"}</p>
      ${contextualTranslationMarkup}
      ${lexiconGloss}
      ${lexiconVariants}
      ${lexiconSummary}
      ${senseMarkup}
      ${relatedMarkup}
    </div>
  `;
}

function normalizeGreekForLookup(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}]+/gu, "")
    .toLowerCase()
    .replace(/ς/g, "σ");
}

function cleanupLexiconText(value = "") {
  return String(value)
    .replace(/\[\[\[(?:FIELD|VARIANT)_BREAK_[A-Z0-9]+\]\]\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,;:\-\s]+/g, "")
    .replace(/[,;:\-\s]+$/g, "");
}

function normalizeLexiconEntry(entry) {
  if (!entry) {
    return null;
  }

  const rawGloss = String(entry.gloss ?? "");
  const rawVariants = Array.isArray(entry.variants) ? entry.variants : [];
  const fieldMatch = rawGloss.match(/\[\[\[FIELD_BREAK_[A-Z0-9]+\]\]\]/);
  const variantMatches = [...rawGloss.matchAll(/\[\[\[VARIANT_BREAK_[A-Z0-9]+\]\]\]/g)];

  let gloss = cleanupLexiconText(rawGloss);
  let variants = rawVariants.map(cleanupLexiconText).filter(Boolean);

  if (fieldMatch || variantMatches.length) {
    const fieldPattern = /\[\[\[FIELD_BREAK_[A-Z0-9]+\]\]\]/;
    const variantPattern = /\[\[\[VARIANT_BREAK_[A-Z0-9]+\]\]\]/;
    const [, afterField = rawGloss] = rawGloss.split(fieldPattern);
    const parts = afterField
      .split(variantPattern)
      .map(cleanupLexiconText)
      .filter(Boolean);

    gloss = parts[0] ?? gloss;
    variants = [...new Set([...parts.slice(1), ...variants])];
  }

  return {
    ...entry,
    gloss,
    variants
  };
}

function findLexiconMatch(term) {
  if (!term) {
    return null;
  }

  if (greekLemmaLexicon[term]) {
    return {
      key: term,
      entry: normalizeLexiconEntry(greekLemmaLexicon[term])
    };
  }

  if (greekLemmaFallbackLexicon[term]) {
    return {
      key: term,
      entry: normalizeLexiconEntry(greekLemmaFallbackLexicon[term])
    };
  }

  const normalizedTerm = normalizeGreekForLookup(term);
  const match = [greekLemmaLexicon, greekLemmaFallbackLexicon]
    .map(
      (lexicon) =>
        Object.entries(lexicon).find(([key]) => normalizeGreekForLookup(key) === normalizedTerm) ?? null
    )
    .find(Boolean);

  if (!match) {
    return null;
  }

  const [key, entry] = match;
  return {
    key,
    entry: normalizeLexiconEntry(entry)
  };
}

function getGreekFormFallback(token) {
  if (!token?.text) {
    return null;
  }

  return greekFormFallbacks[normalizeGreekForLookup(token.text)] ?? null;
}

function getAlignedTranslationToken(verse, greekIndex, translationId) {
  if (!verse || greekIndex == null || greekIndex < 0 || !translationId) {
    return "";
  }

  const alignment = getAlignmentForTranslation(verse, translationId);
  if (!Array.isArray(alignment) || greekIndex >= alignment.length) {
    return "";
  }

  const targetIndex = alignment[greekIndex];
  if (!Number.isInteger(targetIndex) || targetIndex < 0) {
    return "";
  }

  const translationText = getTranslationText(verse, translationId);
  if (!translationText) {
    return "";
  }

  const tokens = splitDisplayTokens(translationText);
  return tokens[targetIndex] ?? "";
}

function renderLexiconSenses(selection) {
  const entry = selection.lexiconEntry;
  if (!entry?.senses?.length) {
    return "";
  }

  return `
    <div class="word-panel__section">
      <p class="word-panel__section-title">Возможные смыслы</p>
      <div class="word-sense-list">
        ${entry.senses
          .map(
            (sense) => `
              <article class="word-sense">
                <p><strong>${sense.label}</strong> <span class="word-panel__meta">· ${sense.weight}</span></p>
                <p>${sense.description}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildLemmaReferenceIndex(bookId) {
  const cached = lemmaReferencesCache.get(bookId);
  if (cached) {
    return cached;
  }

  const book = getLoadedBook(bookId);
  if (!book) {
    return new Map();
  }

  const index = new Map();

  book.chapters.forEach((chapter) => {
    chapter.scenes.forEach((scene) => {
      scene.verses.forEach((verse) => {
        const verseLemmaSet = new Set(
          (verse.greekTokens ?? [])
            .map((token) => normalizeGreekForLookup(token.lemma))
            .filter(Boolean)
        );

        verseLemmaSet.forEach((lemma) => {
          if (!index.has(lemma)) {
            index.set(lemma, []);
          }

          index.get(lemma).push({
            chapterNumber: chapter.number,
            verseNumber: verse.number,
            reference: `${bookLabels[bookId] ?? book.title} ${chapter.number}:${verse.number}`,
            snippet: getTranslationText(verse, "russianSynodal")
          });
        });
      });
    });
  });

  lemmaReferencesCache.set(bookId, index);
  return index;
}

function getRelatedVersesForLemma(bookId, lemma, currentReference) {
  if (!bookId || !lemma) {
    return [];
  }

  const index = buildLemmaReferenceIndex(bookId);
  const matches = index.get(normalizeGreekForLookup(lemma)) ?? [];

  return matches
    .filter(
      (item) =>
        !(
          item.chapterNumber === currentReference.chapterNumber &&
          item.verseNumber === currentReference.verseNumber
        )
    )
    .sort((a, b) => {
      const aDistance = Math.abs(a.chapterNumber - currentReference.chapterNumber) * 100 + Math.abs(a.verseNumber - currentReference.verseNumber);
      const bDistance = Math.abs(b.chapterNumber - currentReference.chapterNumber) * 100 + Math.abs(b.verseNumber - currentReference.verseNumber);
      return aDistance - bDistance;
    })
    .slice(0, 4);
}

function renderRelatedVerses(selection) {
  if (!selection.relatedVerses?.length) {
    return "";
  }

  return `
    <div class="word-panel__section">
      <p class="word-panel__section-title">Где ещё встречается эта лемма</p>
      <div class="word-related-list">
        ${selection.relatedVerses
          .map(
            (item) => `
              <article class="word-related">
                <p><strong>${item.reference}</strong></p>
                <p>${item.snippet}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function getActiveCommentary(scene, verse) {
  const entries = getVerseCommentaries(scene.bookId, scene.chapterNumber, verse.number);
  if (entries.length === 0) {
    return null;
  }

  const selection = state.activeCommentary;
  const isSameVerse =
    selection.sceneKey === getSceneKey(scene) && selection.verseNumber === verse.number;
  if (!isSameVerse) {
    return null;
  }

  return entries.find((item) => item.id === selection.commentaryId) ?? entries[0];
}

function renderCommentaryRail(scene, verse) {
  const entries = getVerseCommentaries(scene.bookId, scene.chapterNumber, verse.number);
  if (entries.length === 0) {
    return `<div class="commentary-rail commentary-rail--empty" aria-hidden="true"></div>`;
  }

  const activeCommentary = getActiveCommentary(scene, verse);

  return `
    <div class="commentary-rail">
      <p class="commentary-rail__label">Толкования</p>
      <div class="commentary-rail__avatars">
        ${entries
          .map((entry) => {
            const source = commentarySourceLibrary[entry.sourceId];
            const isActive = activeCommentary?.id === entry.id;

            return `
              <button
                class="commentary-avatar${isActive ? " is-active" : ""}"
                type="button"
                data-commentary-toggle="${verse.number}:${entry.id}"
                title="${entry.author} · ${entry.role}"
                style="--commentary-accent:${source?.accent ?? "var(--gold)"}"
              >
                <span>${entry.authorShort}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderVerseAside(scene, verse, verseIndex) {
  return `
    <aside class="verse-side">
      <div class="verse-number">Стих ${verse.number}</div>
      ${renderVerseArtwork(scene, verse, verseIndex)}
      ${renderCommentaryRail(scene, verse)}
    </aside>
  `;
}

function renderCommentaryPanel(scene, verse) {
  const entries = getVerseCommentaries(scene.bookId, scene.chapterNumber, verse.number);
  const activeCommentary = getActiveCommentary(scene, verse);

  if (entries.length === 0 || !activeCommentary) {
    return "";
  }

  const source = commentarySourceLibrary[activeCommentary.sourceId];

  return `
    <section class="commentary-panel">
      <div class="commentary-panel__header">
        <div>
          <p class="commentary-panel__eyebrow">Голос к этому стиху</p>
          <h4>${activeCommentary.author}</h4>
        </div>
        <a class="commentary-panel__link" href="${activeCommentary.href}" target="_blank" rel="noreferrer">
          Читать источник
        </a>
      </div>
      <p class="commentary-panel__meta">${activeCommentary.era} · ${activeCommentary.role} · ${source?.title ?? ""}</p>
      <p class="commentary-panel__summary">${activeCommentary.summary}</p>
      ${
        entries.length > 1
          ? `
            <div class="commentary-panel__related">
              ${entries
                .map(
                  (entry) => `
                    <button
                      class="commentary-mini${entry.id === activeCommentary.id ? " is-active" : ""}"
                      type="button"
                      data-commentary-toggle="${verse.number}:${entry.id}"
                    >
                      ${entry.author}
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
    </section>
  `;
}

function getAssessedArtwork(bookId, assessmentEntry, { mode }) {
  const genericAssessmentNotes = [
    "Есть устоявшаяся картина или иконографическая сцена, которая хорошо ложится именно на этот стих.",
    "Есть подходящая картина всей сцены, но обычно она относится к эпизоду целиком, а не строго к одной строке."
  ];

  function getAssessmentCaption({ note, title }) {
    const trimmedNote = typeof note === "string" ? note.trim() : "";

    if (trimmedNote && !genericAssessmentNotes.includes(trimmedNote)) {
      return trimmedNote;
    }

    return title ?? "";
  }

  if (assessmentEntry?.art?.src) {
    return {
      src: assessmentEntry.art.src,
      credit: assessmentEntry.art.credit ?? "",
      caption: getAssessmentCaption({
        note: assessmentEntry.note,
        title: assessmentEntry.art.title
      })
    };
  }

  if (!assessmentEntry?.artworkId) {
    return null;
  }

  const assessmentBook = assessmentDataByBook[bookId] ?? null;
  const artwork = assessmentBook?.artworks?.[assessmentEntry.artworkId];
  if (!artwork?.imageUrl) {
    return null;
  }

  const credit = `${artwork.artist}, через Wikimedia Commons`;

  return {
    src: artwork.imageUrl,
    credit,
    caption: getAssessmentCaption({
      note: assessmentEntry.note,
      title: artwork.title
    })
  };
}

function getSceneArt(scene) {
  const chapterAssessment = chapterArtAssessmentByBook[scene.bookId]?.get(scene.chapterNumber);
  const assessedArtwork = getAssessedArtwork(scene.bookId, chapterAssessment, { mode: "chapter" });

  if (assessedArtwork) {
    return assessedArtwork;
  }

  return scene.art ?? null;
}

function getVerseArt(scene, verse) {
  if (verse.art) {
    return verse.art;
  }

  const assessmentEntry = verseArtAssessmentByBook[scene.bookId]?.get(
    `${scene.chapterNumber}:${verse.number}`
  );
  const assessedArtwork = getAssessedArtwork(scene.bookId, assessmentEntry, { mode: "verse" });

  if (assessedArtwork) {
    return assessedArtwork;
  }

  return null;
}

function renderVerseArtwork(scene, verse, verseIndex) {
  const artwork = getVerseArt(scene, verse);
  if (!artwork) {
    return `<div class="verse-visual verse-visual--empty" aria-hidden="true"></div>`;
  }

  return `
    <figure class="verse-visual">
      <button
        class="verse-visual__button"
        type="button"
        data-artwork-open="true"
        data-art-src="${artwork.src}"
        data-art-title="${encodeURIComponent(artwork.caption ?? `Стих ${verse.number}`)}"
        data-art-credit="${encodeURIComponent(artwork.credit ?? "")}"
        aria-label="Увеличить иллюстрацию к стиху ${verse.number}"
      >
        <div class="verse-visual__frame">
          <img src="${artwork.src}" alt="Иллюстрация к стиху ${verse.number}" loading="lazy" />
        </div>
      </button>
      <figcaption class="verse-visual__meta">
        <strong>Стих ${verse.number}</strong>
        ${artwork.caption ? `<span>${artwork.caption}</span>` : ""}
        <span>${artwork.credit}</span>
      </figcaption>
    </figure>
  `;
}

function renderArtworkLightbox() {
  if (!state.activeArtwork) {
    return "";
  }

  return `
    <div class="artwork-lightbox" data-artwork-overlay="true" role="dialog" aria-modal="true" aria-label="Увеличенная иллюстрация">
      <div class="artwork-lightbox__panel">
        <button class="artwork-lightbox__close" type="button" data-artwork-close="true" aria-label="Закрыть просмотр">
          Закрыть
        </button>
        <figure class="artwork-lightbox__figure">
          <img src="${state.activeArtwork.src}" alt="${state.activeArtwork.title}" />
          <figcaption class="artwork-lightbox__meta">
            <strong>${state.activeArtwork.title}</strong>
            ${state.activeArtwork.credit ? `<span>${state.activeArtwork.credit}</span>` : ""}
          </figcaption>
        </figure>
      </div>
    </div>
  `;
}

function getLocalizedChapterTitle(chapter) {
  if (/^Chapter \d+$/i.test(chapter.title)) {
    return `Глава ${chapter.number}`;
  }

  return chapter.title;
}

function getJourneyConfig(bookId, chapters) {
  const fallback = {
    startLabel: "Начало",
    endLabel: "Завершение",
    stages: [
      {
        id: "all",
        title: "Весь путь",
        summary: "Непрерывное чтение книги по главам.",
        chapters: [1, chapters.length]
      }
    ],
    milestones: []
  };

  return lifeJourney[bookId] ?? fallback;
}

function chapterInRange(chapterNumber, range) {
  return chapterNumber >= range[0] && chapterNumber <= range[1];
}

function getMilestonePosition(chapterNumber, totalChapters) {
  if (totalChapters <= 1) {
    return 0;
  }

  return ((chapterNumber - 1) / (totalChapters - 1)) * 100;
}

function getRangePosition(range, totalChapters) {
  if (totalChapters <= 1) {
    return { left: 0, width: 100 };
  }

  const start = ((range[0] - 1) / totalChapters) * 100;
  const width = ((range[1] - range[0] + 1) / totalChapters) * 100;

  return { left: start, width };
}

function getLocationLabel(location) {
  if (!location) {
    return "";
  }

  const localizedPlaceLabels = {
    nazareth: "Назарет",
    capernaum: "Капернаум",
    "sea-of-galilee": "Галилейское море",
    sychar: "Сихарь",
    jerusalem: "Иерусалим",
    bethlehem: "Вифлеем"
  };

  if (localizedPlaceLabels[location]) {
    return localizedPlaceLabels[location];
  }

  const place = getPlaceById(location);
  return place?.name ?? location;
}

function getLocationsLabel(locations = []) {
  return locations.map((location) => getLocationLabel(location)).join(" · ");
}

function renderContextFocusPanel(scene) {
  const activeReference = getSelectedContextReference(scene);
  if (!activeReference) {
    return "";
  }

  return `
    <section class="context-card context-card--focus">
      <p class="eyebrow">Справка по тексту</p>
      <div class="context-focus">
        <p class="context-focus__kind">${activeReference.kind === "entity" ? "Люди и места" : "Пояснение термина"}</p>
        <h3>${activeReference.title}</h3>
        <p class="context-focus__meta">${activeReference.meta}</p>
        <p>${activeReference.description}</p>
      </div>
    </section>
  `;
}

function getLoadedBook(bookId) {
  return state.loadedBooks.get(bookId) ?? null;
}

async function ensureBookLoaded(bookId) {
  if (state.loadedBooks.has(bookId)) {
    return state.loadedBooks.get(bookId);
  }

  const book = await loadBookData(bookId);
  if (book) {
    state.loadedBooks.set(bookId, book);
  }
  return book;
}

function renderLoading(scene) {
  const activeBook = getBookById(scene.bookId) ?? gospelLibrary[0];

  app.innerHTML = `
    <div class="page-shell">
      <section class="library-shell">
        <div class="library-head">
          <p class="eyebrow">Загрузка</p>
          <h2>Открываем ${bookLabels[activeBook.id] ?? activeBook.title}</h2>
        </div>
        <p class="rail-copy">${scene.reference}</p>
      </section>
    </div>
  `;
}

async function render() {
  const requestId = ++renderRequestId;
  const routeScene = parseRoute();
  const routeSceneKey = getSceneKey(routeScene);

  if (state.currentSceneKey !== routeSceneKey) {
    stopGreekPronunciation({ rerender: false });
    state.selectedWord = null;
    state.selectedContext = {
      sceneKey: null,
      refId: null
    };
    state.activeCommentary = {
      sceneKey: null,
      verseNumber: null,
      commentaryId: null
    };
    state.currentSceneKey = routeSceneKey;
  }

  if (!getLoadedBook(routeScene.bookId)) {
    renderLoading(routeScene);
  }
  const fullBook = await ensureBookLoaded(routeScene.bookId);

  if (requestId !== renderRequestId) {
    return;
  }

  const scene =
    fullBook?.chapters
      ?.flatMap((chapter) =>
        chapter.scenes.map((item) => ({
          ...item,
          bookId: fullBook.id,
          bookTitle: fullBook.title,
          bookSubtitle: fullBook.subtitle,
          bookAccent: fullBook.accent,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          chapterSummary: chapter.summary
        }))
      )
      .find(
        (item) =>
          item.bookId === routeScene.bookId &&
          item.chapterNumber === routeScene.chapterNumber &&
          item.id === routeScene.id
      ) ?? routeScene;

  if (state.currentSceneKey !== getSceneKey(scene)) {
    stopGreekPronunciation({ rerender: false });
    state.selectedWord = null;
    state.selectedContext = {
      sceneKey: null,
      refId: null
    };
    state.activeArtwork = null;
    state.activeCommentary = {
      sceneKey: null,
      verseNumber: null,
      commentaryId: null
    };
    state.currentSceneKey = getSceneKey(scene);
  }

  const sceneIndex = getSceneIndex(scene);
  const previousScene = sceneIndex > 0 ? allScenes[sceneIndex - 1] : null;
  const nextScene = sceneIndex < allScenes.length - 1 ? allScenes[sceneIndex + 1] : null;
  const activeBook = fullBook ?? getBookById(scene.bookId) ?? gospelLibrary[0];
  const activeChapter =
    activeBook.chapters.find((chapter) => chapter.number === scene.chapterNumber) ??
    activeBook.chapters[0];
  const verseColumns = state.visibleLanguages.length;
  const activePlace = getPlaceById(scene.scenePlaceId);
  const activePhotos = activePlace?.photos ?? [];
  const journey = getJourneyConfig(activeBook.id, activeBook.chapters);
  const totalChapters = activeBook.chapters.length;
  const sceneArtwork = getSceneArt(scene);

  app.innerHTML = `
    <div class="page-shell">
      <section class="library-shell">
        <div class="library-head">
          <p class="eyebrow">Навигация</p>
          <h2>Книги и главы</h2>
        </div>
        <div class="library-grid">
          <nav class="book-nav book-nav--top" aria-label="Выбор Евангелия">
            ${gospelLibrary
              .map(
                (book) => `
                  <button class="book-button${book.id === activeBook.id ? " is-active" : ""}" type="button" data-book="${book.id}">
                    <span class="book-name">${bookLabels[book.id] ?? book.title}</span>
                    <span class="book-meta">${bookSubtitles[book.id] ?? book.subtitle}</span>
                  </button>
                `
              )
              .join("")}
          </nav>

          <section class="library-copy">
            <p class="section-kicker">Выбранная книга</p>
            <p class="rail-copy">${bookAccents[activeBook.id] ?? activeBook.accent}</p>
          </section>

          <section class="library-chapters">
            <p class="section-kicker">Путь жизни</p>
            <div class="journey-shell">
              <div class="journey-header">
                <div>
                  <p class="journey-label">От рождения до смерти</p>
                  <h3>${bookLabels[activeBook.id] ?? activeBook.title} как единый путь</h3>
                </div>
                <p class="journey-copy">
                  Главы показаны как отрезки внутри больших этапов повествования, а ключевые события отмечены как вехи на общей линии.
                </p>
              </div>

              <div class="journey-scale" aria-hidden="true">
                <div class="journey-caps">
                  <span class="journey-cap journey-cap--start">${journey.startLabel}</span>
                  <span class="journey-cap journey-cap--end">${journey.endLabel}</span>
                </div>

                <div class="journey-rail">
                  ${journey.milestones
                    .map(
                      (milestone) => `
                        <div class="journey-milestone${milestone.chapter === activeChapter.number ? " is-active" : ""}" style="left: ${getMilestonePosition(
                          milestone.chapter,
                          totalChapters
                        )}%;">
                          <span class="journey-milestone__dot"></span>
                          <span class="journey-milestone__card">
                            <strong>${milestone.title}</strong>
                          </span>
                        </div>
                      `
                    )
                    .join("")}
                </div>

                <div class="journey-eras">
                  ${journey.stages
                    .map((stage) => {
                      const range = getRangePosition(stage.chapters, totalChapters);
                      return `
                        <article
                          class="journey-era${chapterInRange(activeChapter.number, stage.chapters) ? " is-active" : ""}"
                          style="left: ${range.left}%; width: ${range.width}%"
                        >
                          <span class="journey-era__range">Главы ${stage.chapters[0]}-${stage.chapters[1]}</span>
                          <strong>${stage.title}</strong>
                          <span class="journey-era__meta">${stage.years}</span>
                          <span class="journey-era__meta">${getLocationsLabel(stage.locations)}</span>
                          <span class="journey-era__story">${stage.story}</span>
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              </div>

              <div class="journey-stages">
                ${journey.stages
                  .map((stage) => {
                    const stageChapters = activeBook.chapters.filter((chapter) =>
                      chapterInRange(chapter.number, stage.chapters)
                    );

                    return `
                      <section class="journey-stage">
                        <div class="journey-stage__meta">
                          <p class="journey-stage__range">Главы ${stage.chapters[0]}-${stage.chapters[1]}</p>
                          <h4>${stage.title}</h4>
                          <p class="journey-stage__details">${stage.years} · ${getLocationsLabel(stage.locations)}</p>
                          <p>${stage.summary}</p>
                        </div>
                        <div class="journey-stage__chapters">
                          ${stageChapters
                            .map((chapter) => {
                              const firstScene = chapter.scenes[0];
                              return `
                                <button class="chapter-segment${chapter.number === activeChapter.number ? " is-active" : ""}" type="button" data-route="${getSceneHref({
                                  bookId: activeBook.id,
                                  chapterNumber: chapter.number,
                                  id: firstScene.id
                                })}">
                                  <span class="chapter-segment__number">${chapter.number}</span>
                                  <strong>${getLocalizedChapterTitle(chapter)}</strong>
                                </button>
                              `;
                            })
                            .join("")}
                        </div>
                      </section>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        </div>
      </section>

      <main class="workspace">
        <section class="reading-room">
          <div class="art-panel">
            <div class="art-frame">
              <img src="${sceneArtwork.src}" alt="${scene.bookTitle} artwork" />
            </div>
            <div class="art-overlay art-overlay--static">
              <p class="art-credit">${sceneArtwork.credit}</p>
              <p class="art-caption">${sceneArtwork.caption}</p>
            </div>
          </div>

          <section class="passage-head">
            <div class="passage-topline">
              <p class="eyebrow">${bookLabels[scene.bookId] ?? scene.bookTitle} · Глава ${scene.chapterNumber}</p>
              <a class="route-link" href="${getSceneHref(scene)}">${scene.reference}</a>
            </div>
            <h2>${scene.sceneTitle}</h2>
            <p class="scene-summary">${scene.sceneSummary}</p>

            <div class="chapter-banner">
              <div>
                <p class="chapter-label">Текущая глава</p>
                <h3>${getLocalizedChapterTitle(activeChapter)}</h3>
              </div>
              <p>${activeChapter.summary}</p>
            </div>

            <div class="scene-strip">
              ${activeChapter.scenes
                .map(
                  (chapterScene) => `
                    <button
                      class="scene-pill${chapterScene.id === scene.id ? " is-active" : ""}"
                      type="button"
                      data-route="${getSceneHref({
                        bookId: activeBook.id,
                        chapterNumber: activeChapter.number,
                        id: chapterScene.id
                      })}"
                    >
                      ${chapterScene.sceneTitle}
                    </button>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="reader-controls">
            <div class="control-group">
              <span class="control-label">Сравнение</span>
              <p class="control-hint">Годы и происхождение перевода теперь показаны прямо у выбора языка.</p>
              <div class="pill-row">
                ${translationOptions.map((option) => renderTranslationToggle(option)).join("")}
              </div>
            </div>
          </section>

          <section class="verse-grid" style="--language-count:${verseColumns}" aria-live="polite">
            ${scene.verses
              .map(
                (verse, verseIndex) => `
                  <article class="verse-block">
                    <div class="verse-row">
                    ${renderVerseAside(scene, verse, verseIndex)}
                    ${state.visibleLanguages
                      .map(
                        (language) => `
                          <section class="verse-card">
                            <p class="verse-language">${translationOptionById[language]?.label ?? language}</p>
                            <div class="verse-line">${renderVerseText(scene, verse, language)}</div>
                            ${verse.note ? `<p class="verse-note">${verse.note}</p>` : ""}
                          </section>
                        `
                      )
                      .join("")}
                    </div>
                    ${renderCommentaryPanel(scene, verse)}
                    ${renderWordPanel(scene, verse)}
                  </article>
                `
              )
              .join("")}
          </section>

          <section class="nuance-panel">
            <div>
              <p class="eyebrow">Переводческие заметки</p>
              <h3>Где смысл раскрывается шире</h3>
            </div>
            <div class="difference-list">
              ${scene.differences
                .map(
                  (item) => `
                    <article class="difference-item">
                      <h4>${item.title}</h4>
                      <p>${item.body}</p>
                    </article>
                  `
                )
                .join("")}
            </div>

            <div class="passage-nav">
              <button class="nav-card${previousScene ? "" : " is-disabled"}" type="button" ${
                previousScene ? `data-route="${getSceneHref(previousScene)}"` : "disabled"
              }>
                <span>Предыдущий фрагмент</span>
                <strong>${previousScene ? previousScene.sceneTitle : "Начало чтения"}</strong>
              </button>
              <button class="nav-card${nextScene ? "" : " is-disabled"}" type="button" ${
                nextScene ? `data-route="${getSceneHref(nextScene)}"` : "disabled"
              }>
                <span>Следующий фрагмент</span>
                <strong>${nextScene ? nextScene.sceneTitle : "Дальше пока нет"}</strong>
              </button>
            </div>
          </section>
        </section>

        <aside class="context-column">
          ${renderContextFocusPanel(scene)}

          <section class="context-card">
            <p class="eyebrow">Карта</p>
            <h3>${scene.map.title}</h3>
            <div id="context-map" class="story-map story-map--real"></div>
            <p class="map-summary">${scene.map.summary}</p>
            ${
              activePlace
                ? `<p class="place-summary"><strong>${activePlace.name}</strong> · ${activePlace.description}</p>`
                : ""
            }
            <div class="place-photo-grid">
              ${activePhotos
                .map(
                  (photo) => `
                    <figure class="place-photo-card">
                      <img src="${photo.src}" alt="${photo.title}" />
                      <figcaption>${photo.title}<span>${photo.credit}</span></figcaption>
                    </figure>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="context-card">
            <p class="eyebrow">Люди и места</p>
            <div class="entity-list">
              ${scene.entities
                .map((item, index) => {
                  const refId = `entity:${index}`;
                  const isActive =
                    state.selectedContext.sceneKey === getSceneKey(scene) &&
                    state.selectedContext.refId === refId;

                  return `
                    <button class="entity-item${isActive ? " is-active" : ""}" type="button" data-context-card="${refId}">
                      <h4>${item.name}</h4>
                      <span class="entity-meta">${item.meta}</span>
                      <p>${item.description}</p>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </section>

          <section class="context-card">
            <p class="eyebrow">Система пояснений</p>
            <div class="glossary-list">
              ${scene.glossary
                .map((item, index) => {
                  const refId = `glossary:${index}`;
                  const isActive =
                    state.selectedContext.sceneKey === getSceneKey(scene) &&
                    state.selectedContext.refId === refId;

                  return `
                    <button class="glossary-item${isActive ? " is-active" : ""}" type="button" data-context-card="${refId}">
                      <h4>${item.term}</h4>
                      <span class="glossary-meta">${item.meta}</span>
                      <p>${item.description}</p>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </section>
        </aside>
      </main>
      ${renderArtworkLightbox()}
    </div>
  `;

  app.querySelectorAll("[data-book]").forEach((button) => {
    button.addEventListener("click", () => {
      const book = getBookById(button.dataset.book);
      if (!book) {
        return;
      }

      const firstChapter = book.chapters[0];
      const firstScene = firstChapter.scenes[0];
      navigateToScene({
        bookId: book.id,
        chapterNumber: firstChapter.number,
        id: firstScene.id
      });
    });
  });

  app.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.route;
      if (route) {
        window.location.hash = route;
      }
    });
  });

  app.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      const { language } = button.dataset;
      const next = state.visibleLanguages.includes(language)
        ? state.visibleLanguages.filter((item) => item !== language)
        : [...state.visibleLanguages, language];

      if (next.length > 0) {
        state.visibleLanguages = sanitizeVisibleLanguages(next);
        persistVisibleLanguages(state.visibleLanguages);
        render();
      }
    });
  });

  app.querySelectorAll("[data-greek-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const [verseNumber, tokenIndex] = button.dataset.greekWord.split(":");
      const verse = scene.verses.find((item) => item.number === verseNumber);
      if (verse) {
        selectGreekWord(scene, verse, Number(tokenIndex));
      }
    });
  });

  app.querySelectorAll("[data-context-ref], [data-context-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const rawValue = button.dataset.contextRef ?? button.dataset.contextCard ?? "";
      const nextRefId = button.dataset.contextRef
        ? rawValue.split(":").slice(1).join(":")
        : rawValue;
      const isSameSelection =
        state.selectedContext.sceneKey === getSceneKey(scene) &&
        state.selectedContext.refId === nextRefId;

      state.selectedContext = isSameSelection
        ? {
            sceneKey: null,
            refId: null
          }
        : {
            sceneKey: getSceneKey(scene),
            refId: nextRefId
          };

      render();
    });
  });

  app.querySelectorAll("[data-commentary-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const [verseNumber, commentaryId] = button.dataset.commentaryToggle.split(":");
      const isSameSelection =
        state.activeCommentary.sceneKey === getSceneKey(scene) &&
        state.activeCommentary.verseNumber === verseNumber &&
        state.activeCommentary.commentaryId === commentaryId;

      state.activeCommentary = isSameSelection
        ? {
            sceneKey: null,
            verseNumber: null,
            commentaryId: null
          }
        : {
            sceneKey: getSceneKey(scene),
            verseNumber,
            commentaryId
          };

      render();
    });
  });

  app.querySelectorAll("[data-artwork-open]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeArtwork = {
        src: button.dataset.artSrc,
        title: decodeURIComponent(button.dataset.artTitle ?? ""),
        credit: decodeURIComponent(button.dataset.artCredit ?? "")
      };
      render();
    });
  });

  app.querySelectorAll("[data-artwork-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeArtwork = null;
      render();
    });
  });

  app.querySelectorAll("[data-artwork-overlay]").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        state.activeArtwork = null;
        render();
      }
    });
  });

  renderLeafletMap(scene);
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && state.activeArtwork) {
    state.activeArtwork = null;
    render();
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("keydown", handleGlobalKeydown);

if (!window.location.hash) {
  window.location.hash = getSceneHref(defaultScene);
} else {
  render();
}

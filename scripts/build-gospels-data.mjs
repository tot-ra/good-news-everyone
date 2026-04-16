import fs from "fs/promises";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "src", "data");
const booksDir = path.join(dataDir, "books");
const indexPath = path.join(dataDir, "library-index.json");
const legacyOutputPath = path.join(dataDir, "gospel-library.json");

const DATA_SOURCES = {
  english: "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json",
  russian: "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/ru_synodal.json",
  greek: "https://jsonbible.github.io/tr.json",
  morph: {
    matthew: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/61-Mt-morphgnt.txt",
    mark: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/62-Mk-morphgnt.txt",
    luke: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/63-Lk-morphgnt.txt",
    john: "https://raw.githubusercontent.com/morphgnt/sblgnt/master/64-Jn-morphgnt.txt"
  }
};

const PLACE_LABELS_RU = {
  nazareth: "Назарет",
  capernaum: "Капернаум",
  "sea-of-galilee": "Галилейское море",
  sychar: "Сихарь",
  jerusalem: "Иерусалим",
  bethlehem: "Вифлеем",
  "jordan-river": "Иордан",
  "wilderness-judea": "Иудейская пустыня",
  egypt: "Египет",
  decapolis: "Десятиградие",
  "tyre-sidon": "Тир и Сидон",
  "caesarea-philippi": "Кесария Филиппова",
  jericho: "Иерихон",
  bethany: "Вифания",
  "mount-of-olives": "Елеонская гора",
  golgotha: "Голгофа",
  emmaus: "Эммаус",
  cana: "Кана Галилейская",
  bethesda: "Вифезда"
};

const RARE_TERM_CATALOG = [
  {
    term: "Завулон",
    aliases: ["Завулон", "Завулона", "Завулоновых", "Завулоновой"],
    meta: "колено Израиля",
    description:
      "Одно из двенадцати колен Израиля. В Евангелиях это имя звучит в цитате о северной Галилее, где начинается служение Иисуса."
  },
  {
    term: "Неффалим",
    aliases: ["Неффалим", "Неффалима", "Неффалимовых", "Неффалимовой"],
    meta: "колено Израиля",
    description:
      "Одно из двенадцати колен Израиля. Упоминание этой земли связывает Галилею со старыми пророчествами."
  },
  {
    term: "Исайя",
    aliases: ["Исайя", "Исайи", "Исаия", "Исаии"],
    meta: "ветхозаветный пророк",
    description:
      "Один из важнейших пророков Ветхого Завета. Евангелисты часто цитируют его, объясняя смысл событий из жизни Иисуса."
  },
  {
    term: "Капернаум",
    aliases: ["Капернаум", "Капернауме", "Капернаума", "Капернауму"],
    meta: "город у Галилейского моря",
    description:
      "Галилейский город, ставший одной из главных точек служения Иисуса: здесь Он учил, исцелял и встречался с толпами."
  },
  {
    term: "Иордан",
    aliases: ["Иордан", "Иордане", "Иордана", "Иорданом", "Иорданскою", "Иорданскою стороною"],
    meta: "река Палестины",
    description:
      "Река, связанная с проповедью Иоанна Крестителя и крещением Иисуса. Часто обозначает рубеж и переход к новому этапу."
  },
  {
    term: "Десятиградие",
    aliases: ["Десятиградие", "Десятиградия"],
    meta: "союз эллинистических городов",
    description:
      "Область десяти городов к востоку и юго-востоку от Галилейского моря, заметно более языческая по культуре, чем Иудея."
  },
  {
    term: "Кана",
    aliases: ["Кана", "Кане"],
    meta: "галилейское селение",
    description:
      "Селение в Галилее, где по Иоанну произошло первое знамение Иисуса на браке."
  },
  {
    term: "Сихарь",
    aliases: ["Сихарь", "Сихаря", "Сихаре"],
    meta: "самарянский город",
    description:
      "Город в Самарии рядом с колодцем Иакова. Здесь Иисус беседует с самарянкой."
  },
  {
    term: "Самария",
    aliases: ["Самария", "Самарии", "самарянка", "самарянин", "самарянский", "самарянских", "самаряне"],
    meta: "область между Иудеей и Галилеей",
    description:
      "Регион с напряжёнными отношениями с иудеями. Поэтому сцены с самарянами в Евангелиях особенно значимы."
  },
  {
    term: "Вифезда",
    aliases: ["Вифезда", "Вифезде"],
    meta: "купальня в Иерусалиме",
    description:
      "Купальня у Овечьих ворот в Иерусалиме, где Иисус исцеляет человека, долго остававшегося больным."
  },
  {
    term: "Силоам",
    aliases: ["Силоам", "Силоаме"],
    meta: "водоём в Иерусалиме",
    description:
      "Иерусалимский водоём, куда Иисус посылает умыться слепорождённого после помазания глаз."
  },
  {
    term: "Вифсаида",
    aliases: ["Вифсаида", "Вифсаиды", "Вифсаиде"],
    meta: "город у моря",
    description:
      "Город на северо-востоке Галилейского моря, связанный с несколькими учениками Иисуса и рядом чудес."
  },
  {
    term: "Кесария Филиппова",
    aliases: ["Кесария Филиппова", "Кесарии Филипповой"],
    meta: "город на севере",
    description:
      "Северный город у подножия Ермона. Здесь Пётр исповедует Иисуса Христом."
  },
  {
    term: "Гефсимания",
    aliases: ["Гефсимания", "Гефсиманию", "Гефсимании", "Гефсиманией"],
    meta: "сад у Елеонской горы",
    description:
      "Место ночной молитвы Иисуса перед арестом. Название связано с последними часами перед страстями."
  },
  {
    term: "Кедрон",
    aliases: ["Кедрон", "Кедрона"],
    meta: "поток у Иерусалима",
    description:
      "Долина и поток к востоку от Иерусалима, через которые Иисус проходит перед арестом."
  },
  {
    term: "Голгофа",
    aliases: ["Голгофа", "Голгофу", "Голгофе"],
    meta: "место распятия",
    description:
      "Место распятия Иисуса. Евангелия поясняют название как «лобное место» или «место черепа»."
  },
  {
    term: "Еммаус",
    aliases: ["Еммаус", "Еммаусе"],
    meta: "селение после воскресения",
    description:
      "Селение, куда шли два ученика после распятия и где воскресший Иисус открылся им в пути."
  },
  {
    term: "Наин",
    aliases: ["Наин", "Наине"],
    meta: "галилейский город",
    description:
      "Селение, где Иисус воскресил сына вдовы, показывая милость к бедствующим."
  },
  {
    term: "Тивериадское море",
    aliases: ["Тивериадского", "Тивериадском", "море Тивериадское", "море Тивериадском"],
    meta: "другое название Галилейского моря",
    description:
      "Иоанн иногда называет Галилейское море Тивериадским, по крупному городу на его берегу."
  },
  {
    term: "Вифавара",
    aliases: ["Вифаваре", "Вифавара"],
    meta: "место при Иордане",
    description:
      "Название места по ту сторону Иордана в некоторых рукописных традициях Евангелия от Иоанна."
  },
  {
    term: "Никодим",
    aliases: ["Никодим", "Никодима", "Никодиму"],
    meta: "фарисей и начальник иудейский",
    description:
      "Иерусалимский учитель, пришедший к Иисусу ночью. В Евангелии от Иоанна он постепенно движется от осторожности к открытой поддержке."
  },
  {
    term: "Каиафа",
    aliases: ["Каиафа", "Каиафы", "Каиафе"],
    meta: "первосвященник",
    description:
      "Первосвященник времени суда над Иисусом, один из ключевых участников религиозного обвинения."
  },
  {
    term: "Анна",
    aliases: ["Анна", "Анны"],
    meta: "важная фигура при храме",
    description:
      "В зависимости от главы это либо пророчица при храме в рассказе о детстве Иисуса, либо имя, связанное с первосвященническим кругом."
  },
  {
    term: "Гавриил",
    aliases: ["Гавриил", "Гавриила", "Гавриилом"],
    meta: "ангел-вестник",
    description:
      "Ангел, приносящий весть Захарии и Марии в начале Евангелия от Луки."
  },
  {
    term: "Захария",
    aliases: ["Захария", "Захарии", "Захариею", "Захарию"],
    meta: "священник, отец Иоанна",
    description:
      "Отец Иоанна Крестителя. Его история открывает Евангелие от Луки сценой в храме."
  },
  {
    term: "Елисавета",
    aliases: ["Елисавета", "Елисаветы", "Елисавете"],
    meta: "мать Иоанна Крестителя",
    description:
      "Жена Захарии и мать Иоанна Крестителя; её поздняя беременность подчёркивает действие Божьего обещания."
  },
  {
    term: "Квириний",
    aliases: ["Квириний", "Квириния"],
    meta: "римский правитель Сирии",
    description:
      "Римский наместник, чьё имя Лука использует как историческую привязку рассказа о рождении Иисуса."
  },
  {
    term: "Симеон",
    aliases: ["Симеон", "Симеона", "Симеону"],
    meta: "праведник в храме",
    description:
      "Старец из храма в Луки 2, который встречает младенца Иисуса и произносит слова о свете для народов."
  },
  {
    term: "Варавва",
    aliases: ["Варавва", "Варавву", "Вараввы"],
    meta: "узник, освобождённый вместо Иисуса",
    description:
      "Человек, которого толпа просит отпустить вместо Иисуса у Пилата."
  },
  {
    term: "Веельзевул",
    aliases: ["Веельзевул", "Веельзевула"],
    meta: "имя князя бесов",
    description:
      "Название, которым противники Иисуса обозначают власть злых духов, пытаясь объяснить Его изгнания бесов."
  },
  {
    term: "Вартимей",
    aliases: ["Вартимей", "Вартимея"],
    meta: "слепой у дороги",
    description:
      "Слепой нищий из рассказа Марка, прозревший по дороге к Иерусалиму."
  },
  {
    term: "Иаир",
    aliases: ["Иаир", "Иаира", "Иаиру"],
    meta: "начальник синагоги",
    description:
      "Отец девочки, которую Иисус возвращает к жизни; одна из памятных историй о вере и страхе."
  },
  {
    term: "Лазарь",
    aliases: ["Лазарь", "Лазаря", "Лазарю"],
    meta: "брат Марфы и Марии",
    description:
      "Друг Иисуса из Вифании, которого Он воскрешает, что резко усиливает конфликт с властями."
  },
  {
    term: "Марфа",
    aliases: ["Марфа", "Марфы", "Марфе"],
    meta: "жительница Вифании",
    description:
      "Сестра Марии и Лазаря. В Евангелиях связана и с гостеприимством, и с сильным исповеданием веры."
  },
  {
    term: "Гадаринская страна",
    aliases: ["Гадаринскую", "Гадаринская", "Гадаринской"],
    meta: "область восточного берега",
    description:
      "Обозначение территории на восточном берегу Галилейского моря в рассказе об одержимых."
  },
  {
    term: "Гергесинская страна",
    aliases: ["Гергесинскую", "Гергесинская", "Гергесинской"],
    meta: "вариант названия той же области",
    description:
      "Один из рукописных вариантов названия местности, где Иисус исцеляет бесноватых у моря."
  },
  {
    term: "дидрахма",
    aliases: ["дидрахма", "дидрахмы", "дидрахм"],
    meta: "храмовый налог",
    description:
      "Монета примерно в размере двух дневных драхм; в Матфея 17 речь идёт о сборе на храм."
  },
  {
    term: "синагога",
    aliases: ["синагога", "синагоге", "синагоги", "синагогу"],
    meta: "место собрания и чтения Писания",
    description:
      "Иудейский дом собрания, где молились, читали Писание и наставляли людей."
  },
  {
    term: "фарисеи",
    aliases: ["фарисеи", "фарисеев", "фарисеям", "фарисеями", "фарисей"],
    meta: "религиозное движение Иудеи",
    description:
      "Влиятельная группа, серьёзно относившаяся к закону и преданию. В Евангелиях они часто спорят с Иисусом о смысле послушания Богу."
  },
  {
    term: "саддукеи",
    aliases: ["саддукеи", "саддукеев", "саддукеям", "саддукей"],
    meta: "храмовая аристократия",
    description:
      "Иудейская группа, тесно связанная с храмом и священнической верхушкой."
  },
  {
    term: "мытари",
    aliases: ["мытари", "мытарей", "мытарь", "мытарю"],
    meta: "сборщики налогов",
    description:
      "Сборщики податей, обычно считавшиеся морально сомнительными из-за связи с оккупационной властью и злоупотреблений."
  }
];

function normalizeLookupToken(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function splitLookupTokens(text = "") {
  return text
    .trim()
    .split(/\s+/)
    .map((token) => normalizeLookupToken(token))
    .filter(Boolean);
}

function includesLookupPhrase(text, phrase) {
  const sourceTokens = splitLookupTokens(text);
  const phraseTokens = splitLookupTokens(phrase);

  if (sourceTokens.length === 0 || phraseTokens.length === 0 || phraseTokens.length > sourceTokens.length) {
    return false;
  }

  for (let index = 0; index <= sourceTokens.length - phraseTokens.length; index += 1) {
    if (phraseTokens.every((part, offset) => sourceTokens[index + offset] === part)) {
      return true;
    }
  }

  return false;
}

function mergeGlossaryEntries(baseGlossary, additionalGlossary) {
  const seen = new Set();
  const merged = [];

  [...(baseGlossary ?? []), ...(additionalGlossary ?? [])].forEach((entry) => {
    const normalizedKeys = [entry.term, ...(entry.aliases ?? [])]
      .map((item) => normalizeLookupToken(item))
      .filter(Boolean);

    if (normalizedKeys.some((key) => seen.has(key))) {
      return;
    }

    normalizedKeys.forEach((key) => seen.add(key));
    merged.push(entry);
  });

  return merged;
}

function buildRareGlossaryEntries(russianTexts) {
  return RARE_TERM_CATALOG.filter((entry) =>
    entry.aliases.some((alias) => russianTexts.some((text) => includesLookupPhrase(text, alias)))
  ).map((entry) => ({
    term: entry.term,
    aliases: [...new Set(entry.aliases)],
    meta: entry.meta,
    description: entry.description
  }));
}

function createMapContext(scenePlaceId, highlightPlaceIds, title, summary) {
  const places = [...new Set((highlightPlaceIds ?? []).filter(Boolean))];
  const labels = places.map((placeId) => PLACE_LABELS_RU[placeId] ?? placeId);
  const autoSummary =
    labels.length <= 1
      ? `Центральная точка главы: ${labels[0] ?? "место не указано"}.`
      : `Основные точки главы: ${labels.join(", ")}.`;

  return {
    scenePlaceId,
    map: {
      title,
      summary: summary ?? autoSummary,
      highlightPlaceIds: places
    }
  };
}

const CHAPTER_MAP_CONTEXT = {
  matthew: {
    1: createMapContext("bethlehem", ["bethlehem", "nazareth"], "Родословие, Иосиф и рождение в Вифлееме"),
    2: createMapContext("bethlehem", ["jerusalem", "bethlehem", "egypt", "nazareth"], "Волхвы, бегство в Египет и возвращение"),
    3: createMapContext("jordan-river", ["wilderness-judea", "jordan-river", "jerusalem"], "Проповедь Иоанна и крещение на Иордане"),
    4: createMapContext("wilderness-judea", ["wilderness-judea", "sea-of-galilee", "capernaum"], "Пустыня, Галилея и начало служения"),
    5: createMapContext("capernaum", ["capernaum", "sea-of-galilee"], "Нагорная проповедь у Галилейского моря"),
    6: createMapContext("capernaum", ["capernaum", "sea-of-galilee"], "Продолжение Нагорной проповеди в Галилее"),
    7: createMapContext("capernaum", ["capernaum", "sea-of-galilee"], "Завершение Нагорной проповеди и спуск к людям"),
    8: createMapContext("capernaum", ["capernaum", "sea-of-galilee", "decapolis"], "Чудеса между Капернаумом, морем и восточным берегом"),
    9: createMapContext("capernaum", ["capernaum"], "Исцеления и призвание Матфея в Капернауме"),
    10: createMapContext("capernaum", ["capernaum", "nazareth"], "Посланничество по городам Галилеи"),
    11: createMapContext("capernaum", ["capernaum", "nazareth"], "Галилейские города перед лицом ответа и неверия"),
    12: createMapContext("sea-of-galilee", ["capernaum", "sea-of-galilee"], "Споры и собрание толп в Галилее"),
    13: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Притчи у моря и возвращение в дом"),
    14: createMapContext("sea-of-galilee", ["sea-of-galilee"], "Чудо хлебов и ночь на Галилейском море"),
    15: createMapContext("tyre-sidon", ["tyre-sidon", "sea-of-galilee", "decapolis"], "Выход к Тиру и Сидону и возвращение к морю"),
    16: createMapContext("caesarea-philippi", ["sea-of-galilee", "caesarea-philippi"], "Поворот к Кесарии Филипповой"),
    17: createMapContext("caesarea-philippi", ["caesarea-philippi", "capernaum"], "Преображение и возвращение в Капернаум"),
    18: createMapContext("capernaum", ["capernaum"], "Наставления ученикам в Капернауме"),
    19: createMapContext("jericho", ["jordan-river", "jericho"], "Иудея за Иорданом и путь к Иерихону"),
    20: createMapContext("jericho", ["jericho", "jerusalem"], "От Иерихона к Иерусалиму"),
    21: createMapContext("jerusalem", ["bethany", "mount-of-olives", "jerusalem"], "Вифания, Елеон и вход в Иерусалим"),
    22: createMapContext("jerusalem", ["jerusalem"], "Храмовые споры в Иерусалиме"),
    23: createMapContext("jerusalem", ["jerusalem"], "Обличительная речь против книжников и фарисеев"),
    24: createMapContext("mount-of-olives", ["jerusalem", "mount-of-olives"], "Елеонская речь о суде и конце"),
    25: createMapContext("mount-of-olives", ["jerusalem", "mount-of-olives"], "Притчи ожидания на фоне Елеонской речи"),
    26: createMapContext("jerusalem", ["bethany", "mount-of-olives", "jerusalem"], "Вифания, вечеря, Гефсимания и арест"),
    27: createMapContext("golgotha", ["jerusalem", "golgotha"], "Суд, Голгофа и погребение"),
    28: createMapContext("jerusalem", ["jerusalem", "sea-of-galilee"], "Пустая гробница и встреча в Галилее")
  },
  mark: {
    1: createMapContext("jordan-river", ["jordan-river", "wilderness-judea", "sea-of-galilee", "capernaum"], "Иордан, пустыня и резкий старт в Галилее"),
    2: createMapContext("capernaum", ["capernaum"], "Дом, исцеление и споры в Капернауме"),
    3: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Толпы у моря и избрание двенадцати"),
    4: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Притчи у моря и буря на воде"),
    5: createMapContext("decapolis", ["sea-of-galilee", "decapolis", "capernaum"], "Переправа, изгнание бесов и возвращение"),
    6: createMapContext("nazareth", ["nazareth", "sea-of-galilee"], "Назарет, умножение хлебов и вода"),
    7: createMapContext("tyre-sidon", ["tyre-sidon", "decapolis", "sea-of-galilee"], "Тир, Сидон и языческие окраины"),
    8: createMapContext("caesarea-philippi", ["decapolis", "sea-of-galilee", "caesarea-philippi"], "От чудес к исповеданию у Кесарии Филипповой"),
    9: createMapContext("caesarea-philippi", ["caesarea-philippi", "capernaum"], "Преображение и путь назад в Капернаум"),
    10: createMapContext("jericho", ["jordan-river", "jericho", "jerusalem"], "Через Иудею и Иерихон к Иерусалиму"),
    11: createMapContext("jerusalem", ["bethany", "mount-of-olives", "jerusalem"], "Вход в город, храм и смоковница"),
    12: createMapContext("jerusalem", ["jerusalem"], "Притчи и споры в храмовом дворе"),
    13: createMapContext("mount-of-olives", ["jerusalem", "mount-of-olives"], "Елеонская речь у храма"),
    14: createMapContext("jerusalem", ["bethany", "mount-of-olives", "jerusalem"], "Вифания, вечеря, Гефсимания и суд"),
    15: createMapContext("golgotha", ["jerusalem", "golgotha"], "Голгофа и погребение"),
    16: createMapContext("jerusalem", ["jerusalem"], "Пустая гробница в Иерусалиме")
  },
  luke: {
    1: createMapContext("nazareth", ["nazareth", "jerusalem"], "Благовещение, храм и первые песни"),
    2: createMapContext("bethlehem", ["nazareth", "bethlehem", "jerusalem"], "От Назарета к Вифлеему и затем в храм"),
    3: createMapContext("jordan-river", ["wilderness-judea", "jordan-river"], "Проповедь Иоанна и крещение на Иордане"),
    4: createMapContext("nazareth", ["wilderness-judea", "nazareth", "capernaum"], "Пустыня, Назарет и первые дни в Капернауме"),
    5: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Лодки, исцеления и призвание у озера"),
    6: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Субботние споры и равнинная проповедь"),
    7: createMapContext("capernaum", ["capernaum"], "Капернаум и окружающие селения милости"),
    8: createMapContext("sea-of-galilee", ["sea-of-galilee"], "Притчи, буря и переходы по озеру"),
    9: createMapContext("caesarea-philippi", ["sea-of-galilee", "caesarea-philippi", "sychar"], "Преображение и начало пути к Иерусалиму"),
    10: createMapContext("bethany", ["jericho", "bethany", "jerusalem"], "Дорога, притча о ближнем и дом Марфы и Марии"),
    11: createMapContext("jerusalem", ["jerusalem"], "Молитва, споры и обличения по пути"),
    12: createMapContext("jerusalem", ["jerusalem"], "Наставления среди тревог и ожидания"),
    13: createMapContext("jerusalem", ["jerusalem"], "Учение о покаянии и дороге в город"),
    14: createMapContext("jerusalem", ["jerusalem"], "Трапеза, притча и цена ученичества"),
    15: createMapContext("jerusalem", ["jerusalem"], "Притчи о потерянном на дорожном этапе"),
    16: createMapContext("jerusalem", ["jerusalem"], "Притчи о богатстве и верности по пути"),
    17: createMapContext("sychar", ["sychar", "jerusalem"], "Самарийский рубеж и ожидание Царства"),
    18: createMapContext("jericho", ["jericho", "jerusalem"], "Притчи, слепой и дорога к Иерихону"),
    19: createMapContext("jerusalem", ["jericho", "bethany", "jerusalem"], "Закхей, подход к городу и вход в Иерусалим"),
    20: createMapContext("jerusalem", ["jerusalem"], "Храмовые споры и вопросы власти"),
    21: createMapContext("mount-of-olives", ["jerusalem", "mount-of-olives"], "Храм, вдовица и речь о будущих днях"),
    22: createMapContext("jerusalem", ["jerusalem", "mount-of-olives"], "Вечеря, Елеон и ночной суд"),
    23: createMapContext("golgotha", ["jerusalem", "golgotha"], "Суд, Голгофа и погребение"),
    24: createMapContext("jerusalem", ["jerusalem", "emmaus", "bethany"], "Пустая гробница, Эммаус и вознесение")
  },
  john: {
    1: createMapContext("jordan-river", ["jordan-river", "cana", "capernaum"], "Свидетельство у Иордана и первые ученики"),
    2: createMapContext("cana", ["cana", "capernaum", "jerusalem"], "Кана, Капернаум и очищение храма"),
    3: createMapContext("jerusalem", ["jerusalem", "jordan-river"], "Разговор с Никодимом и служение у Иордана"),
    4: createMapContext("sychar", ["sychar", "cana"], "Колодец в Самарии и возвращение в Кану"),
    5: createMapContext("bethesda", ["bethesda", "jerusalem"], "Купальня Вифезда и спор о субботе"),
    6: createMapContext("sea-of-galilee", ["sea-of-galilee", "capernaum"], "Хлеб, море и речь в Капернауме"),
    7: createMapContext("jerusalem", ["jerusalem"], "Праздник Кущей и разделение в Иерусалиме"),
    8: createMapContext("jerusalem", ["jerusalem"], "Храмовые речи о свете и свидетельстве"),
    9: createMapContext("jerusalem", ["jerusalem"], "Исцеление слепорождённого у Иерусалима"),
    10: createMapContext("jerusalem", ["jerusalem", "jordan-river"], "Пастырская речь и отход за Иордан"),
    11: createMapContext("bethany", ["bethany", "jerusalem"], "Вифания Лазаря и приближение конфликта"),
    12: createMapContext("bethany", ["bethany", "jerusalem"], "Помазание в Вифании и вход в Иерусалим"),
    13: createMapContext("jerusalem", ["jerusalem"], "Омовение ног и вечерняя горница"),
    14: createMapContext("jerusalem", ["jerusalem"], "Прощальная беседа в Иерусалиме"),
    15: createMapContext("jerusalem", ["jerusalem"], "Виноградная лоза внутри прощальной речи"),
    16: createMapContext("jerusalem", ["jerusalem"], "Скорбь, утешение и обещание Духа"),
    17: createMapContext("jerusalem", ["jerusalem"], "Первосвященническая молитва перед исходом"),
    18: createMapContext("mount-of-olives", ["mount-of-olives", "jerusalem"], "Поток Кедрон, арест и допросы"),
    19: createMapContext("golgotha", ["jerusalem", "golgotha"], "Суд у Пилата, Голгофа и погребение"),
    20: createMapContext("jerusalem", ["jerusalem"], "Пустая гробница и явления в Иерусалиме"),
    21: createMapContext("sea-of-galilee", ["sea-of-galilee"], "Эпилог у Тивериадского моря")
  }
};

const BOOK_METADATA = {
  matthew: {
    title: "Matthew",
    englishName: "Matthew",
    englishAbbrev: "mt",
    greekNumber: 40,
    subtitle: "Fulfillment, teaching, kingdom discourse",
    accent:
      "A Gospel of long-form teaching where mountain scenes, fulfillment language, and kingdom vision shape the reader's moral imagination.",
    art: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bloch-SermonOnTheMount.jpg",
      credit: "Carl Heinrich Bloch, public-domain image via Wikimedia Commons",
      caption:
        "A broad teaching image that suits Matthew's deliberate structure and emphasis on formed discipleship."
    },
    map: {
      title: "Galilee and the teaching landscape of Matthew",
      summary:
        "Matthew repeatedly places Jesus among crowds, disciples, synagogues, hillsides, and routes around Galilee, where teaching and fulfillment converge."
    },
    scenePlaceId: "capernaum",
    entities: [
      {
        name: "Jesus",
        meta: "Teacher, healer, central speaker",
        description:
          "Matthew regularly presents Jesus as a teacher whose words interpret the kingdom and fulfill older scriptural expectation."
      },
      {
        name: "The disciples",
        meta: "Learners drawn into formation",
        description:
          "In Matthew, disciples are not only followers on the road but listeners being shaped by sustained teaching."
      }
    ],
    glossary: [
      {
        term: "kingdom of heaven",
        meta: "Matthew's characteristic expression",
        description:
          "Usually not a distant location alone, but God's reign arriving with moral and spiritual force in the world."
      }
    ],
    differences: [
      {
        title: "Matthew often sounds structured",
        body:
          "Compared with other Gospels, Matthew frequently arranges teaching and fulfillment motifs in a more deliberate literary pattern."
      }
    ],
    chapterOverrides: {
      1: {
        title: "Origins and the birth of Jesus",
        summary:
          "Matthew opens with genealogy, Joseph's crisis, and the birth announcement, tying Jesus to Abraham, David, and the fulfillment of promise.",
        sceneTitle: "Genealogy and birth",
        sceneSummary:
          "The chapter moves from lineage to nativity. Matthew frames Jesus' birth through covenant memory, Joseph's dream, and the naming of the child.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Nativity%20%28John%20Singleton%20Copley%29.jpg",
          credit: "John Singleton Copley, public-domain image via Wikimedia Commons",
          caption:
            "A nativity scene fits Matthew 1 far better than a later teaching image, because the chapter culminates in the birth and naming of Jesus."
        },
        verseArt: {
          23: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Henry%20Ossawa%20Tanner%20-%20The%20Annunciation.jpg",
            credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
            caption:
              "Tanner's Annunciation gives Matthew 1:23 a concentrated visual echo of the promise that the child will be called Emmanuel."
          }
        },
        map: {
          title: "Nazareth, Bethlehem, and Davidic memory",
          summary:
            "Matthew 1 binds family lineage, messianic promise, and the nativity into one opening movement, preparing the transition from Davidic history to the birth of Jesus."
        },
        scenePlaceId: "bethlehem",
        focusWords: ["generation", "David", "Jesus", "Emmanuel"],
        differences: [
          {
            title: "Generation or genealogy",
            body:
              "Matthew's opening phrase can sound like a family register, but it also signals origin story and new beginning, not just a list of names."
          },
          {
            title: "Emmanuel and fulfillment",
            body:
              "The chapter's quotations and naming language matter because Matthew is already teaching the reader how to hear Jesus through fulfilled Scripture."
          }
        ]
      },
      2: {
        title: "The Magi and the threatened child",
        summary:
          "Matthew 2 moves from worship to danger: the Magi arrive, Herod schemes, and the holy family is driven into flight and return.",
        sceneTitle: "The visit of the Magi",
        sceneSummary:
          "This chapter is full of movement and tension. Foreign seekers kneel before the child, while political fear turns Bethlehem into a place of danger.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Peter%20Paul%20Rubens%20Adoration%20of%20the%20Magi.jpg",
          credit: "Peter Paul Rubens, public-domain image via Wikimedia Commons",
          caption:
            "An Adoration of the Magi scene matches Matthew 2 directly, where homage, kingship, and threat appear together around the child Jesus."
        },
        verseArt: {
          11: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Peter%20Paul%20Rubens%20Adoration%20of%20the%20Magi.jpg",
            credit: "Peter Paul Rubens, public-domain image via Wikimedia Commons",
            caption:
              "Matthew 2:11 reaches the moment of kneeling and gift-bearing, so Rubens fits this single verse as well as the chapter as a whole."
          }
        },
        map: {
          title: "Bethlehem, Egypt, and the return to Nazareth",
          summary:
            "Matthew 2 stretches across Judea and beyond it. The chapter is geographically restless because the Messiah is both sought in worship and pursued in fear."
        },
        scenePlaceId: "bethlehem",
        focusWords: ["star", "worship", "child", "king"],
        differences: [
          {
            title: "Wise men or Magi",
            body:
              "The traditional 'wise men' smooths the foreign and courtly texture of the word Magi, which points to learned eastern figures rather than simple sages."
          },
          {
            title: "Worship and homage",
            body:
              "Depending on translation, the action of the Magi can sound either devotional or royal, but Matthew likely wants both senses active together."
          }
        ]
      },
      3: {
        title: "John and the baptism of Jesus",
        summary:
          "Matthew 3 brings the story into public view through John's preaching, repentance at the Jordan, and the baptism of Jesus.",
        sceneTitle: "At the Jordan",
        sceneSummary:
          "The chapter shifts from infancy material to public revelation. The wilderness preacher, the river, and the heavenly voice frame Jesus' appearing before Israel.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Baptism%20of%20Christ%20%28Verrocchio%20and%20Leonardo%29.jpg",
          credit: "Andrea del Verrocchio and Leonardo da Vinci, public-domain image via Wikimedia Commons",
          caption:
            "A baptism scene anchors Matthew 3 in its actual moment of revelation, replacing the mismatch of a later Galilean teaching image."
        },
        verseArt: {
          16: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Baptism%20of%20Christ%20%28Verrocchio%20and%20Leonardo%29.jpg",
            credit: "Andrea del Verrocchio and Leonardo da Vinci, public-domain image via Wikimedia Commons",
            caption:
              "Matthew 3:16 is the exact verse of emergence from the water and opened heaven, making the baptism painting feel especially precise here."
          }
        },
        focusWords: ["repent", "kingdom", "Jordan", "beloved Son"],
        differences: [
          {
            title: "Repent",
            body:
              "The Greek metanoeite is larger than regret alone. It calls for a changed mind, reordered life, and readiness for the kingdom."
          },
          {
            title: "Fulfill all righteousness",
            body:
              "Matthew gives this line special weight, and translations can flatten it unless the reader hears covenant obedience as well as moral correctness."
          }
        ]
      },
      4: {
        title: "Temptation and the opening of ministry",
        summary:
          "Matthew 4 joins the testing in the wilderness to the first public proclamation in Galilee, so struggle and mission arrive together.",
        sceneTitle: "Tempted in the wilderness",
        sceneSummary:
          "The chapter begins in hunger, testing, and scriptural contest, then opens outward into proclamation, calling, and healing.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20in%20the%20Wilderness%20-%20Ivan%20Kramskoy%20-%20Google%20Cultural%20Institute.jpg",
          credit: "Ivan Kramskoy, public-domain image via Wikimedia Commons",
          caption:
            "Kramskoy's wilderness Christ better reflects Matthew 4, where solitude, testing, and resolve precede the beginning of public ministry."
        },
        focusWords: ["tempted", "wilderness", "kingdom", "follow"],
        differences: [
          {
            title: "Tempted or tested",
            body:
              "Matthew's language can be heard as both enticement and proving, which gives the wilderness scene moral and covenant depth."
          },
          {
            title: "Kingdom of heaven is at hand",
            body:
              "Older phrasing can sound distant, but the sense is that God's reign has drawn near and now presses on the present moment."
          }
        ]
      },
      5: {
        title: "The Sermon on the Mount opens",
        summary:
          "The opening of the sermon sets the tone for Matthew's vision of the kingdom by blessing those the world rarely names as fortunate.",
        sceneTitle: "The mountain blessings",
        sceneSummary:
          "Jesus speaks on a hillside above the Sea of Galilee. The language is distilled and rhythmic: each blessing reverses ordinary status and reveals what the kingdom of heaven values.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bloch-SermonOnTheMount.jpg",
          credit: "Carl Heinrich Bloch, public-domain image via Wikimedia Commons",
          caption:
            "Bloch's Sermon on the Mount gives the prototype an expansive teaching image that fits Matthew's long-form moral discourse."
        },
        map: {
          title: "Galilee and the hill country around Capernaum",
          summary:
            "This reading is framed around the northwestern shore of the Sea of Galilee, where crowds could gather near villages yet still move into quieter elevated places."
        },
        scenePlaceId: "capernaum",
        entities: [
          {
            name: "Jesus",
            meta: "Teacher, healer, central speaker",
            description:
              "Matthew presents Jesus here as a new and greater teacher whose words organize the moral imagination of the Gospel."
          },
          {
            name: "Capernaum",
            meta: "Galilee, lakeside town",
            description:
              "A strategic base for ministry, close to fishing routes and large enough to connect surrounding villages."
          },
          {
            name: "The crowds",
            meta: "Disciples, seekers, the sick, the curious",
            description:
              "Matthew often layers the immediate disciples with a larger listening public, which gives the sermon both intimate and universal force."
          }
        ],
        glossary: [
          {
            term: "makarioi",
            meta: "Greek: blessed, flourishing, deeply favored",
            description:
              "Not mere happiness. It signals a state of being recognized by God, even when the outer situation still looks poor or fragile."
          },
          {
            term: "ptochoi to pneumati",
            meta: "Greek: poor in spirit",
            description:
              "A phrase of dependence, not worthlessness. It points to those who know they do not sustain themselves before God."
          },
          {
            term: "praeis",
            meta: "Greek: meek, gentle, strength under discipline",
            description:
              "The meek are not passive. The word suggests restrained power, a life no longer driven by domination."
          }
        ],
        focusWords: ["blessed", "kingdom", "meek"],
        differences: [
          {
            title: "Blessed or flourishing",
            body:
              "English 'blessed' can sound formal or devotional, while the Greek makarioi also carries the sense of a life that is truly well-ordered under God."
          },
          {
            title: "Poor in spirit",
            body:
              "Russian can feel more inward or existential here, while the Greek phrase retains the idea of spiritual dependence rather than psychological weakness."
          }
        ]
      },
      9: {
        verseArt: {
          9: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Calling-of-st-matthew.jpg",
            credit: "Caravaggio, public-domain image via Wikimedia Commons",
            caption:
              "Caravaggio's calling scene gives Matthew 9:9 a direct visual companion at the very moment Matthew rises from the tax booth and follows."
          }
        }
      },
      26: {
        verseArt: {
          26: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20The%20Last%20Supper%20high%20res.jpg",
            credit: "Leonardo da Vinci, public-domain image via Wikimedia Commons",
            caption:
              "The breaking of bread in Matthew 26:26 is so iconic that Leonardo's Last Supper works well as a verse-level image here."
          }
        }
      },
      27: {
        title: "Trial and crucifixion",
        summary:
          "Matthew 27 gathers judgment, mockery, crucifixion, death, and burial into the darkest and most concentrated chapter of the Gospel.",
        sceneTitle: "At the cross",
        sceneSummary:
          "The chapter moves relentlessly through Roman power, public shame, and the death of Jesus, before ending at the tomb.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crucifixion%20of%20Christ%20%28circa%201490%29.jpg",
          credit: "Master from Nuremberg or Bamberg, public-domain image via Wikimedia Commons",
          caption:
            "A crucifixion image gives Matthew 27 the gravity of its actual subject, instead of reusing a scene from much earlier in the Gospel."
        },
        verseArt: {
          35: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crucifixion%20of%20Christ%20%28circa%201490%29.jpg",
            credit: "Master from Nuremberg or Bamberg, public-domain image via Wikimedia Commons",
            caption:
              "Matthew 27:35 names the crucifixion itself, so the painting lands as a strong anchor exactly at that verse."
          }
        },
        scenePlaceId: "jerusalem",
        focusWords: ["cross", "king", "forsaken", "tomb"]
      },
      28: {
        title: "Resurrection and commission",
        summary:
          "Matthew 28 opens at the tomb, announces resurrection, and closes with the risen Christ sending his disciples to all nations.",
        sceneTitle: "The risen Christ",
        sceneSummary:
          "Fear gives way to proclamation. Matthew's final chapter joins the empty tomb to the worldwide commission of the disciples.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Resurrection%20of%20Christ%20.jpg",
          credit: "Cornelis van Haarlem, public-domain image via Wikimedia Commons",
          caption:
            "A resurrection image brings Matthew's ending back into sync with the chapter's actual focus: the empty tomb, the risen Jesus, and the sending of the disciples."
        },
        scenePlaceId: "jerusalem",
        focusWords: ["risen", "fear", "Galilee", "all nations"]
      }
    }
  },
  mark: {
    title: "Mark",
    englishName: "Mark",
    englishAbbrev: "mk",
    greekNumber: 41,
    subtitle: "Urgency, motion, public action",
    accent:
      "A compact Gospel full of movement, decision, and vivid material details that make scenes feel immediate and bodily.",
    art: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20and%20his%20disciples%20on%20the%20Sea%20of%20Galilee.jpg",
      credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
      caption:
        "A sea-edge image fits Mark's pace, where action and recognition often arrive with little delay."
    },
    map: {
      title: "The Sea of Galilee and the movement of Mark",
      summary:
        "Mark repeatedly moves along shorelines, villages, houses, boats, and roads, giving the narrative a strong sense of bodily momentum."
    },
    scenePlaceId: "sea-of-galilee",
    entities: [
      {
        name: "Jesus",
        meta: "Teacher, healer, figure of authority",
        description:
          "Mark reveals identity through action, conflict, healing, and abrupt questions more than through long discourses."
      },
      {
        name: "The disciples",
        meta: "Followers learning under pressure",
        description:
          "They are frequently moving, reacting, misunderstanding, and being formed through rapid events."
      }
    ],
    glossary: [
      {
        term: "euthys",
        meta: "Greek: immediately, at once",
        description:
          "A signature Mark term that keeps the Gospel pressing forward and heightens the sense of urgency."
      }
    ],
    differences: [
      {
        title: "Mark often reads faster in Greek",
        body:
          "Translations can smooth Mark's rougher, more abrupt narrative energy, which is part of the Gospel's distinct voice."
      }
    ],
    chapterOverrides: {
      1: {
        title: "The first disciples",
        summary:
          "The shoreline becomes a place of sudden reorientation as labor, kinship, and vocation are interrupted by a call to follow.",
        sceneTitle: "Called beside the water",
        sceneSummary:
          "Mark is swift and concrete. Nets, shoreline, brothers, movement. The scene is short, but the urgency of discipleship is unmistakable.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20and%20his%20disciples%20on%20the%20Sea%20of%20Galilee.jpg",
          credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
          caption:
            "Tanner's sea image keeps Mark close to movement, labor, weather, and the watery edge where calling happens."
        },
        map: {
          title: "The Sea of Galilee fishing corridor",
          summary:
            "The northern lakeshore was both working landscape and public thoroughfare. Calling disciples here means stepping into the middle of ordinary labor."
        },
        scenePlaceId: "sea-of-galilee",
        entities: [
          {
            name: "Simon Peter",
            meta: "Fisherman, later apostolic leader",
            description:
              "Mark introduces Peter through action before interpretation, which fits the Gospel's brisk narrative energy."
          },
          {
            name: "Andrew, James, John",
            meta: "Brothers and coworkers",
            description:
              "Family and livelihood are both on the line in this calling scene, making the response costly from the start."
          },
          {
            name: "Sea of Galilee",
            meta: "Freshwater lake in northern Israel",
            description:
              "Fishing, travel, and teaching intersect here. The geography helps explain why this becomes a repeated stage for ministry."
          }
        ],
        glossary: [
          {
            term: "deute opiso mou",
            meta: "Greek: come after me",
            description:
              "More than walking behind someone. It is an invitation into apprenticeship, shared road, and transferred allegiance."
          },
          {
            term: "halieis anthropon",
            meta: "Greek: fishers of people",
            description:
              "Mark keeps the original trade image but transforms its purpose. Their craft becomes a metaphor for gathering people toward life."
          },
          {
            term: "euthys",
            meta: "Greek: immediately, at once",
            description:
              "A hallmark Mark word. It gives the Gospel velocity and underlines how quickly decisive moments arrive."
          }
        ],
        focusWords: ["follow", "immediately", "fishers"],
        differences: [
          {
            title: "Follow me",
            body:
              "Greek stresses movement behind the teacher, while English can sound more abstract. The scene is physically embodied discipleship."
          },
          {
            title: "Fishers of men / people",
            body:
              "Older English keeps 'men,' but the wider meaning is human beings. Rendering it as 'people' often restores the broader sense."
          }
        ]
      },
      4: {
        verseArt: {
          39: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20-%20Christ%20in%20the%20Storm%20on%20the%20Sea%20of%20Galilee.jpeg",
            credit: "Rembrandt, public-domain image via Wikimedia Commons",
            caption:
              "Mark 4:39 turns on rebuke, wind, and sudden calm, which Rembrandt's storm scene captures with real force."
          }
        }
      },
      14: {
        verseArt: {
          22: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20The%20Last%20Supper%20high%20res.jpg",
            credit: "Leonardo da Vinci, public-domain image via Wikimedia Commons",
            caption:
              "Mark 14:22 reaches the bread-saying of the supper, and Leonardo's mural remains the most instantly legible visual pairing."
          }
        }
      },
      15: {
        verseArt: {
          24: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crucifixion%20of%20Christ%20%28circa%201490%29.jpg",
            credit: "Master from Nuremberg or Bamberg, public-domain image via Wikimedia Commons",
            caption:
              "Mark 15:24 names the crucifixion with Mark's stark brevity, so a direct crucifixion image supports the verse without softening it."
          }
        }
      }
    }
  },
  luke: {
    title: "Luke",
    englishName: "Luke",
    englishAbbrev: "lk",
    greekNumber: 42,
    subtitle: "Tenderness, reversal, embodied detail",
    accent:
      "Luke attends closely to vulnerability, hospitality, and joy, often binding cosmic claims to intimate human scenes.",
    art: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Nativity%20%28John%20Singleton%20Copley%29.jpg",
      credit: "John Singleton Copley, public-domain image via Wikimedia Commons",
      caption:
        "Luke often works through scenes of tenderness, memory, travel, and welcome, so a quieter visual register suits the reading experience."
    },
    map: {
      title: "Galilee, Judea, and the travel arc of Luke",
      summary:
        "Luke's narrative repeatedly ties place to hospitality, worship, and the movement from local scenes toward larger saving claims."
    },
    scenePlaceId: "bethlehem",
    entities: [
      {
        name: "Jesus",
        meta: "Child, teacher, healer, host",
        description:
          "Luke presents Jesus with unusual attentiveness to embodied life, meals, mercy, prayer, and the dignity of overlooked people."
      },
      {
        name: "Mary and the households of Luke",
        meta: "Memory, reception, hospitality",
        description:
          "Luke's settings often gather theology inside homes, journeys, births, meals, and encounters with the vulnerable."
      }
    ],
    glossary: [
      {
        term: "soteria",
        meta: "Greek: salvation, deliverance",
        description:
          "In Luke, salvation is not abstract alone. It arrives in houses, bodies, forgiveness, and restored lives."
      }
    ],
    differences: [
      {
        title: "Luke often feels more intimate",
        body:
          "Translations may preserve the events well while still missing how carefully Luke joins public history to private human detail."
      }
    ],
    chapterOverrides: {
      1: {
        verseArt: {
          28: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Henry%20Ossawa%20Tanner%20-%20The%20Annunciation.jpg",
            credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
            caption:
              "Luke 1:28 holds the greeting of Gabriel, and Tanner's Annunciation beautifully fits that concentrated moment."
          }
        }
      },
      2: {
        title: "The birth at Bethlehem",
        summary:
          "Luke places the nativity inside imperial history while preserving the hush, fragility, and bodily concreteness of the scene itself.",
        sceneTitle: "The birth at Bethlehem",
        sceneSummary:
          "Luke sets the nativity against imperial administration and quiet domestic vulnerability. The scale moves from Caesar Augustus to a child laid in a manger.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Nativity%20%28John%20Singleton%20Copley%29.jpg",
          credit: "John Singleton Copley, public-domain image via Wikimedia Commons",
          caption:
            "A historical nativity painting gives Luke's birth scene a proper visual companion without crowding the stillness of the text."
        },
        verseArt: {
          7: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Nativity%20%28John%20Singleton%20Copley%29.jpg",
            credit: "John Singleton Copley, public-domain image via Wikimedia Commons",
            caption:
              "Luke 2:7 is the verse of birth, swaddling, and manger, so Copley's nativity fits as a precise verse image."
          }
        },
        map: {
          title: "From Nazareth to Bethlehem",
          summary:
            "Luke's scene links Galilee and Judea. The route underscores displacement, political pressure, and the humility of the setting."
        },
        scenePlaceId: "bethlehem",
        entities: [
          {
            name: "Mary",
            meta: "Mother of Jesus",
            description:
              "Luke's narration pays close attention to receptivity, memory, and embodied obedience, all of which cluster around Mary."
          },
          {
            name: "Joseph",
            meta: "House of David",
            description:
              "Joseph anchors the Davidic line historically and geographically by the journey to Bethlehem."
          },
          {
            name: "Bethlehem",
            meta: "Judea, city of David",
            description:
              "A small town with royal resonance. Luke binds humility and messianic expectation together through place."
          }
        ],
        glossary: [
          {
            term: "apographesthai",
            meta: "Greek: to be registered",
            description:
              "This is census language. Luke uses it to show how large imperial systems press directly into ordinary family life."
          },
          {
            term: "prototokon",
            meta: "Greek: firstborn",
            description:
              "The word marks sequence, inheritance, and consecration. It carries both family and covenant resonance."
          },
          {
            term: "phatne",
            meta: "Greek: manger, feeding place",
            description:
              "Not just a sentimental crib. The term locates the birth in material poverty and animal space."
          }
        ],
        focusWords: ["firstborn", "manger", "city of David"],
        differences: [
          {
            title: "Inn or guest room",
            body:
              "Many readers know 'there was no room in the inn,' but the Greek can also point to a guest space, which changes how the social setting is imagined."
          },
          {
            title: "Wrapped in swaddling clothes",
            body:
              "Russian often preserves the tactile, cloth-based concreteness of the scene, helping the verse feel more domestic and embodied."
          }
        ]
      },
      10: {
        verseArt: {
          33: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Good%20Samaritan%20%28Delacroix%201849%29.jpg",
            credit: "Eugene Delacroix, public-domain image via Wikimedia Commons",
            caption:
              "Luke 10:33 marks the Samaritan's turning toward the wounded man, and Delacroix gives that mercy a vivid visual form."
          }
        }
      },
      15: {
        verseArt: {
          20: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20Harmensz%20van%20Rijn%20-%20Return%20of%20the%20Prodigal%20Son%20-%20Google%20Art%20Project.jpg",
            credit: "Rembrandt, public-domain image via Wikimedia Commons",
            caption:
              "Luke 15:20 is the embrace itself, and Rembrandt's Prodigal Son is almost the canonical painting for that verse."
          }
        }
      },
      24: {
        verseArt: {
          30: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20%E2%80%94%20Supper%20at%20Emmaus.jpg",
            credit: "Caravaggio, public-domain image via Wikimedia Commons",
            caption:
              "Luke 24:30 turns on table fellowship, blessing, and recognition beginning to break open, which makes Emmaus a strong verse image."
          }
        }
      }
    }
  },
  john: {
    title: "John",
    englishName: "John",
    englishAbbrev: "jo",
    greekNumber: 43,
    subtitle: "Symbol, slowness, theological depth",
    accent:
      "John lingers in scenes until physical images open into spiritual claims, making dialogue and symbolism central to the reading experience.",
    art: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/JESUS%20AND%20THE%20WOMAN%20OF%20SAMARIA.jpg",
      credit: "Heinrich Hofmann, public-domain image via Wikimedia Commons",
      caption:
        "John's scenes are often meditative and symbolic, and a quieter image helps the text remain the central event."
    },
    map: {
      title: "Judea, Samaria, and Galilee in John",
      summary:
        "John repeatedly turns real locations into theological stages, where wells, feasts, roads, and cities carry symbolic force."
    },
    scenePlaceId: "sychar",
    entities: [
      {
        name: "Jesus",
        meta: "Revealer and giver of life",
        description:
          "John frames Jesus through long symbolic speech, signs, and intimate conversations that expose deeper realities."
      },
      {
        name: "Dialogue partners",
        meta: "Seekers, opponents, witnesses",
        description:
          "John's scenes often revolve around a single person or group being drawn from literal understanding into deeper recognition."
      }
    ],
    glossary: [
      {
        term: "zoe",
        meta: "Greek: life in the strong Johannine sense",
        description:
          "Not mere biological existence. In John it often signals divine life received through relation to Christ."
      }
    ],
    differences: [
      {
        title: "John layers meanings inside concrete scenes",
        body:
          "Translations can communicate the narrative clearly while still requiring help to surface the symbolic double meanings John is activating."
      }
    ],
    chapterOverrides: {
      3: {
        verseArt: {
          2: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crijn_Hendricksz.jpeg",
            credit: "Crijn Hendricksz. Volmarijn, public-domain image via Wikimedia Commons",
            caption:
              "John 3:2 is the night visit of Nicodemus, and this candlelit painting gives that intimate conversation a fitting visual tone."
          }
        }
      },
      4: {
        title: "The well in Samaria",
        summary:
          "A local encounter at a well becomes one of the Gospel's great revelation scenes, where thirst and gift expand into theology.",
        sceneTitle: "At the well in Samaria",
        sceneSummary:
          "John slows down and lets meaning gather through dialogue. Water, thirst, gift, worship, and identity unfold layer by layer in a deeply local place.",
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/JESUS%20AND%20THE%20WOMAN%20OF%20SAMARIA.jpg",
          credit: "Heinrich Hofmann, public-domain image via Wikimedia Commons",
          caption:
            "A nineteenth-century painting of the Samaritan woman scene adds atmosphere without crowding the text, which stays central."
        },
        map: {
          title: "Jacob's well near Sychar in Samaria",
          summary:
            "This scene sits in a real corridor between Judea and Galilee. Geography matters because Samaria is not only a place on the road but a charged social boundary."
        },
        scenePlaceId: "sychar",
        entities: [
          {
            name: "The Samaritan woman",
            meta: "Primary dialogue partner",
            description:
              "John gives her one of the richest theological conversations in the Gospel, turning a public encounter into a revelation scene."
          },
          {
            name: "Sychar",
            meta: "Town in Samaria",
            description:
              "The place matters because Samaria carries ethnic, historical, and religious tension in first-century Jewish memory."
          },
          {
            name: "Jacob's well",
            meta: "Ancestral landmark",
            description:
              "The well ties present conversation to patriarchal memory, making the scene about inheritance as well as thirst."
          }
        ],
        glossary: [
          {
            term: "hydor zon",
            meta: "Greek: living water",
            description:
              "An expression that can mean flowing water in ordinary speech, but Jesus turns it toward spiritual life that is active, fresh, and God-given."
          },
          {
            term: "dorea",
            meta: "Greek: gift",
            description:
              "The point is not transaction but divine generosity. The encounter shifts from social request to revelation of what God gives freely."
          },
          {
            term: "dipseo",
            meta: "Greek: to thirst",
            description:
              "John uses bodily thirst to open a larger pattern of desire, incompleteness, and the promise of inward renewal."
          }
        ],
        focusWords: ["living water", "gift", "thirst"],
        differences: [
          {
            title: "Living water",
            body:
              "English preserves the metaphor well, but Greek still holds the concrete sense of running water. Both meanings are active at once."
          },
          {
            title: "Never thirst",
            body:
              "Russian often makes the promise feel more existential, while Greek keeps the vivid bodily metaphor alive in the sentence."
          }
        ]
      },
      11: {
        verseArt: {
          43: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sebastiano%20del%20Piombo%2C%20The%20Raising%20of%20Lazarus%20%28cropped3%29.jpg",
            credit: "Sebastiano del Piombo, public-domain image via Wikimedia Commons",
            caption:
              "John 11:43 is the cry to Lazarus himself, so a Raising of Lazarus painting belongs naturally at this verse."
          }
        }
      },
      13: {
        verseArt: {
          5: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Prado%20washing%20feet.jpg",
            credit: "Jacopo Tintoretto, public-domain image via Wikimedia Commons",
            caption:
              "John 13:5 is the foot-washing action in its clearest form, and Tintoretto gives that embodied service scene real presence."
          }
        }
      },
      20: {
        verseArt: {
          27: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20Doubting%20Thomas.jpg",
            credit: "Caravaggio, public-domain image via Wikimedia Commons",
            caption:
              "John 20:27 is the most exact New Testament match for Caravaggio's Thomas painting, so it works especially well here."
          }
        }
      }
    }
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
          reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
          return;
        }

        let data = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => resolve(data.replace(/^\uFEFF/, "")));
      })
      .on("error", reject);
  });
}

function titleCaseBookChapter(bookTitle, chapterNumber) {
  return `${bookTitle} ${chapterNumber}`;
}

function createGenericSummary(bookTitle, chapterNumber, verseCount) {
  return `Read the full text of ${bookTitle} ${chapterNumber} in parallel Greek, English, and Russian. This chapter contains ${verseCount} verses in the generated corpus view.`;
}

function createGenericChapterSummary(bookTitle, chapterNumber) {
  return `A full-chapter reading view for ${bookTitle} ${chapterNumber}, designed for slow comparison across the three text traditions included in the app.`;
}

function createGenericDifferences(bookTitle) {
  return [
    {
      title: "Parallel reading helps surface translation choices",
      body: `${bookTitle} can be compared here line by line across Greek, English, and Russian, which makes wording shifts easier to notice than in a single-language reading.`
    }
  ];
}

function normalizeGreek(text) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeGreekForMatch(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{Letter}]+/gu, "")
    .toLowerCase()
    .replace(/ς/g, "σ");
}

function splitDisplayTokens(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeTargetToken(text, language) {
  if (!text) {
    return "";
  }

  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");

  if (!normalized) {
    return "";
  }

  if (language === "english") {
    return normalized.replace(/(?:'s|s')$/u, "");
  }

  return normalized;
}

function tokenizeTranslation(text, language) {
  return splitDisplayTokens(text).map((display) => ({
    display,
    normalized: normalizeTargetToken(display, language)
  }));
}

function getGreekAlignmentKey(token) {
  return normalizeGreekForMatch(token.lemma || token.text || "");
}

function incrementNestedCount(map, outerKey, innerKey, value) {
  if (!map.has(outerKey)) {
    map.set(outerKey, new Map());
  }

  const inner = map.get(outerKey);
  inner.set(innerKey, (inner.get(innerKey) ?? 0) + value);
}

function getProbability(table, sourceToken, targetToken) {
  return table.get(sourceToken)?.get(targetToken) ?? 0;
}

function trainIbmModel(sentencePairs, iterations = 7) {
  const candidates = new Map();

  sentencePairs.forEach(({ sourceTokens, targetTokens }) => {
    const uniqueSource = [...new Set(sourceTokens.filter(Boolean))];
    const uniqueTarget = [...new Set(targetTokens.filter(Boolean))];

    uniqueSource.forEach((sourceToken) => {
      if (!candidates.has(sourceToken)) {
        candidates.set(sourceToken, new Set());
      }

      const candidateSet = candidates.get(sourceToken);
      uniqueTarget.forEach((targetToken) => candidateSet.add(targetToken));
    });
  });

  let probabilities = new Map();
  candidates.forEach((targetSet, sourceToken) => {
    const targetList = [...targetSet];
    if (targetList.length === 0) {
      return;
    }

    const initialProbability = 1 / targetList.length;
    probabilities.set(
      sourceToken,
      new Map(targetList.map((targetToken) => [targetToken, initialProbability]))
    );
  });

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const counts = new Map();
    const totals = new Map();

    sentencePairs.forEach(({ sourceTokens, targetTokens }) => {
      const filteredSource = sourceTokens.filter(Boolean);
      const filteredTarget = targetTokens.filter(Boolean);
      if (filteredSource.length === 0 || filteredTarget.length === 0) {
        return;
      }

      filteredTarget.forEach((targetToken) => {
        const normalization = filteredSource.reduce(
          (sum, sourceToken) => sum + getProbability(probabilities, sourceToken, targetToken),
          0
        );

        if (!normalization) {
          return;
        }

        filteredSource.forEach((sourceToken) => {
          const contribution = getProbability(probabilities, sourceToken, targetToken) / normalization;
          incrementNestedCount(counts, sourceToken, targetToken, contribution);
          totals.set(sourceToken, (totals.get(sourceToken) ?? 0) + contribution);
        });
      });
    });

    probabilities = new Map();
    counts.forEach((targetCounts, sourceToken) => {
      const total = totals.get(sourceToken) ?? 0;
      if (!total) {
        return;
      }

      probabilities.set(sourceToken, new Map());
      targetCounts.forEach((count, targetToken) => {
        probabilities.get(sourceToken).set(targetToken, count / total);
      });
    });
  }

  return probabilities;
}

function buildAlignmentModel(sentencePairs) {
  const forward = trainIbmModel(sentencePairs);
  const reverse = trainIbmModel(
    sentencePairs.map(({ sourceTokens, targetTokens }) => ({
      sourceTokens: targetTokens,
      targetTokens: sourceTokens
    }))
  );

  return { forward, reverse };
}

function alignTokens(sourceKeys, targetTokens, model) {
  if (!sourceKeys.length || !targetTokens.length) {
    return [];
  }

  const sourceCount = sourceKeys.length;
  const targetCount = targetTokens.length;

  return sourceKeys.map((sourceKey, sourceIndex) => {
    if (!sourceKey) {
      return -1;
    }

    let bestIndex = -1;
    let bestScore = 0;

    targetTokens.forEach((targetToken, targetIndex) => {
      if (!targetToken.normalized) {
        return;
      }

      const forward = getProbability(model.forward, sourceKey, targetToken.normalized);
      const reverse = getProbability(model.reverse, targetToken.normalized, sourceKey);
      const lexicalScore = Math.sqrt(forward * reverse);
      const positionalDistance = Math.abs(
        (sourceCount === 1 ? 0 : sourceIndex / (sourceCount - 1)) -
          (targetCount === 1 ? 0 : targetIndex / (targetCount - 1))
      );
      const positionalScore = 1 - Math.min(positionalDistance, 1);
      const score = lexicalScore * (0.35 + positionalScore * 0.65);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = targetIndex;
      }
    });

    return bestScore >= 0.0005 ? bestIndex : -1;
  });
}

function parseMorphBook(raw) {
  const verseMap = new Map();

  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split(/\s+/);
      if (parts.length < 7) {
        return;
      }

      const reference = parts[0];
      const chapter = Number(reference.slice(2, 4));
      const verse = Number(reference.slice(4, 6));
      const key = `${chapter}:${verse}`;
      const entry = {
        text: parts[4].replace(/[^\p{Letter}]+/gu, ""),
        normalized: normalizeGreekForMatch(parts[5]),
        lemma: parts[6],
        pos: parts[1],
        parsing: parts[2]
      };

      if (!verseMap.has(key)) {
        verseMap.set(key, []);
      }

      verseMap.get(key).push(entry);
    });

  return verseMap;
}

function buildVerseData({ chapterNumber, verseNumber, greekText, englishText, russianText, morphBook }) {
  const morphVerse = morphBook?.get(`${chapterNumber}:${verseNumber}`) ?? [];
  const greekWords = normalizeGreek(greekText).split(" ").filter(Boolean);
  let morphPointer = 0;

  const greekTokens = greekWords.map((token) => {
    const normalized = normalizeGreekForMatch(token);
    let match = null;

    for (let i = morphPointer; i < morphVerse.length; i += 1) {
      if (morphVerse[i].normalized === normalized) {
        match = morphVerse[i];
        morphPointer = i + 1;
        break;
      }
    }

    return {
      text: token,
      lemma: match?.lemma ?? "",
      pos: match?.pos ?? "",
      parsing: match?.parsing ?? "",
      alignmentKey: normalizeGreekForMatch(match?.lemma ?? token)
    };
  });

  return {
    greekTokens,
    englishTokens: tokenizeTranslation(englishText, "english"),
    russianTokens: tokenizeTranslation(russianText, "russian")
  };
}

async function buildLibrary() {
  const [englishRaw, russianRaw, greekRaw] = await Promise.all([
    fetchText(DATA_SOURCES.english),
    fetchText(DATA_SOURCES.russian),
    fetchText(DATA_SOURCES.greek)
  ]);
  const morphEntries = await Promise.all(
    Object.entries(DATA_SOURCES.morph).map(async ([bookId, url]) => [bookId, parseMorphBook(await fetchText(url))])
  );
  const morphBooks = Object.fromEntries(morphEntries);

  const englishData = JSON.parse(englishRaw);
  const russianData = JSON.parse(russianRaw);
  const greekData = JSON.parse(greekRaw);

  const alignmentSentencePairs = {
    english: [],
    russian: []
  };

  Object.entries(BOOK_METADATA).forEach(([bookId, metadata]) => {
    const englishBook = englishData.find((book) => book.abbrev === metadata.englishAbbrev);
    const russianBook = russianData.find((book) => book.abbrev === metadata.englishAbbrev);
    const greekBook = greekData.books.find((book) => book.nr === metadata.greekNumber);
    const morphBook = morphBooks[bookId];

    if (!englishBook || !russianBook || !greekBook) {
      throw new Error(`Missing source book data for ${bookId}`);
    }

    const chapterCount = Math.max(
      englishBook.chapters.length,
      russianBook.chapters.length,
      greekBook.chapters.length
    );

    for (let chapterIndex = 0; chapterIndex < chapterCount; chapterIndex += 1) {
      const chapterNumber = chapterIndex + 1;
      const englishChapter = englishBook.chapters[chapterIndex] ?? [];
      const russianChapter = russianBook.chapters[chapterIndex] ?? [];
      const greekChapter = greekBook.chapters[chapterIndex];
      const verseCount = Math.max(
        englishChapter.length,
        russianChapter.length,
        greekChapter?.verses?.length ?? 0
      );

      for (let verseIndex = 0; verseIndex < verseCount; verseIndex += 1) {
        const greekVerse = greekChapter?.verses?.[verseIndex];
        const verseNumber = Number(greekVerse?.verse ?? verseIndex + 1);
        const englishText = englishChapter[verseIndex] ?? "";
        const russianText = russianChapter[verseIndex] ?? "";
        const { greekTokens, englishTokens, russianTokens } = buildVerseData({
          chapterNumber,
          verseNumber,
          greekText: greekVerse?.text ?? "",
          englishText,
          russianText,
          morphBook
        });

        const sourceTokens = greekTokens.map(getGreekAlignmentKey).filter(Boolean);
        const englishTargetTokens = englishTokens.map((token) => token.normalized).filter(Boolean);
        const russianTargetTokens = russianTokens.map((token) => token.normalized).filter(Boolean);

        if (sourceTokens.length && englishTargetTokens.length) {
          alignmentSentencePairs.english.push({
            sourceTokens,
            targetTokens: englishTargetTokens
          });
        }

        if (sourceTokens.length && russianTargetTokens.length) {
          alignmentSentencePairs.russian.push({
            sourceTokens,
            targetTokens: russianTargetTokens
          });
        }
      }
    }
  });

  const alignmentModels = {
    english: buildAlignmentModel(alignmentSentencePairs.english),
    russian: buildAlignmentModel(alignmentSentencePairs.russian)
  };

  const library = Object.entries(BOOK_METADATA).map(([bookId, metadata]) => {
    const englishBook = englishData.find((book) => book.abbrev === metadata.englishAbbrev);
    const russianBook = russianData.find((book) => book.abbrev === metadata.englishAbbrev);
    const greekBook = greekData.books.find((book) => book.nr === metadata.greekNumber);
    const morphBook = morphBooks[bookId];

    if (!englishBook || !russianBook || !greekBook) {
      throw new Error(`Missing source book data for ${bookId}`);
    }

    const chapters = englishBook.chapters.map((englishChapter, chapterIndex) => {
      const chapterNumber = chapterIndex + 1;
      const russianChapter = russianBook.chapters[chapterIndex] ?? [];
      const greekChapter = greekBook.chapters[chapterIndex];
      const override = metadata.chapterOverrides?.[chapterNumber] ?? {};
      const chapterContext = CHAPTER_MAP_CONTEXT[bookId]?.[chapterNumber] ?? {};
      const verseCount = Math.max(
        englishChapter.length,
        russianChapter.length,
        greekChapter?.verses?.length ?? 0
      );

      const verses = Array.from({ length: verseCount }, (_, verseIndex) => {
        const greekVerse = greekChapter?.verses?.[verseIndex];
        const verseNumber = Number(greekVerse?.verse ?? verseIndex + 1);
        const englishText = englishChapter[verseIndex] ?? "";
        const russianText = russianChapter[verseIndex] ?? "";
        const { greekTokens, englishTokens, russianTokens } = buildVerseData({
          chapterNumber,
          verseNumber,
          greekText: greekVerse?.text ?? "",
          englishText,
          russianText,
          morphBook
        });
        const sourceKeys = greekTokens.map(getGreekAlignmentKey);

        return {
          number: String(verseNumber),
          note: override.verseNotes?.[verseIndex + 1] ?? "",
          art: override.verseArt?.[verseIndex + 1] ?? null,
          translations: {
            greek: greekTokens.map((token) => token.text).join(" "),
            english: englishText,
            russian: russianText
          },
          greekTokens: greekTokens.map(({ alignmentKey, ...token }) => token),
          alignments: {
            english: alignTokens(sourceKeys, englishTokens, alignmentModels.english),
            russian: alignTokens(sourceKeys, russianTokens, alignmentModels.russian)
          }
        };
      });

      const chapterTitle =
        override.title ?? `Chapter ${chapterNumber}`;

      const chapterSummary =
        override.summary ?? createGenericChapterSummary(metadata.title, chapterNumber);

      const sceneMap = {
        ...metadata.map,
        ...override.map,
        ...chapterContext.map
      };
      const russianChapterTexts = verses.map((verse) => verse.translations.russian).filter(Boolean);
      const sceneGlossary = mergeGlossaryEntries(
        override.glossary ?? metadata.glossary,
        buildRareGlossaryEntries(russianChapterTexts)
      );

      return {
        number: chapterNumber,
        title: chapterTitle,
        summary: chapterSummary,
        scenes: [
          {
            id: `chapter-${chapterNumber}`,
            reference: titleCaseBookChapter(metadata.title, chapterNumber),
            sceneTitle: override.sceneTitle ?? `Chapter ${chapterNumber}`,
            sceneSummary:
              override.sceneSummary ??
              createGenericSummary(metadata.title, chapterNumber, verseCount),
            art: override.art ?? metadata.art,
            map: sceneMap,
            scenePlaceId:
              chapterContext.scenePlaceId ?? override.scenePlaceId ?? metadata.scenePlaceId,
            entities: override.entities ?? metadata.entities,
            glossary: sceneGlossary,
            focusWords: override.focusWords ?? [],
            differences: override.differences ?? createGenericDifferences(metadata.title),
            verses
          }
        ]
      };
    });

    return {
      id: bookId,
      title: metadata.title,
      subtitle: metadata.subtitle,
      accent: metadata.accent,
      chapters
    };
  });

  await fs.mkdir(booksDir, { recursive: true });

  const index = library.map((book) => ({
    ...book,
    chapters: book.chapters.map((chapter) => ({
      ...chapter,
      scenes: chapter.scenes.map((scene) => ({
        ...scene,
        verses: []
      }))
    }))
  }));

  await fs.writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  await Promise.all(
    library.map((book) =>
      fs.writeFile(
        path.join(booksDir, `${book.id}.json`),
        `${JSON.stringify(book, null, 2)}\n`,
        "utf8"
      )
    )
  );

  await fs.rm(legacyOutputPath, { force: true });

  console.log(`Wrote ${indexPath}`);
  console.log(`Wrote ${booksDir}`);
}

buildLibrary().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

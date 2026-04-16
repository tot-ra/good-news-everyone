import fs from "node:fs";

const bookPath = new URL("../src/data/books/luke.json", import.meta.url);
const auditPath = new URL("../src/data/books/luke-art-audit.json", import.meta.url);

const luke = JSON.parse(fs.readFileSync(bookPath, "utf8"));

const exactArtByRef = new Map(
  Object.entries({
    "1:28": {
      episode: "Благовещение",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Henry%20Ossawa%20Tanner%20-%20The%20Annunciation.jpg",
        credit:
          "Генри Оссава Таннер, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 1:28 содержится приветствие Гавриила, а Благовещение Таннера прекрасно соответствует этому сосредоточенному моменту."
      }
    },
    "1:41": {
      episode: "Посещение Елисаветы",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/De%20Champaigne%2C%20Philippe%2C%20The%20Visitation%2C%201643-48.jpg",
        credit:
          "Филипп де Шампень, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 1:41 встреча Марии и Елисаветы становится зримой сценой приветствия и узнавания, поэтому \"Посещение\" Шампеня здесь особенно уместно."
      }
    },
    "2:7": {
      episode: "Рождество",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Nativity%20%28John%20Singleton%20Copley%29.jpg",
        credit:
          "Джон Синглтон Копли, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Евангелии от Луки 2:7 говорится о рождении, пеленании и яслях, поэтому рождение Копли подходит как точный образ стиха."
      }
    },
    "2:13": {
      episode: "Благовестие пастухам",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Annunciation%20to%20the%20Shepherds%20sc147.jpg",
        credit:
          "Приписывается Якопо Бассано, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 2:13 внезапно появляется небесное воинство, и сцена благовестия пастухам уже имеет устойчивую живописную традицию, хорошо совпадающую с этим стихом."
      }
    },
    "2:16": {
      episode: "Поклонение пастухов",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Giorgione%2C%20The%20Adoration%20of%20the%20Shepherds%2C%201505-1510%2C%20NGA%20432.jpg",
        credit:
          "Джорджоне, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 2:16 уже переходит от вести к найденной сцене у яслей, поэтому \"Поклонение пастухов\" Джорджоне подходит именно к этому стиху."
      }
    },
    "2:28": {
      episode: "Сретение",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20Presentation%20in%20the%20Temple.jpg",
        credit:
          "Рембрандт, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 2:28 Симеон берет Младенца на руки, и рембрандтово \"Принесение во храм\" почти буквально совпадает с этим моментом."
      }
    },
    "2:46": {
      episode: "Иисус среди учителей",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20Among%20the%20Doctors%2003.jpg",
        credit:
          "Альбрехт Дюрер, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 2:46 описывает найденного в храме Иисуса среди учителей, и этот мотив давно стал самостоятельным живописным сюжетом."
      }
    },
    "3:21": {
      episode: "Крещение Христа",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Baptism%20of%20Christ%20%28Verrocchio%20and%20Leonardo%29.jpg",
        credit:
          "Андреа дель Верроккьо и Леонардо да Винчи, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 3:21 — это сам момент крещения и открытых небес, поэтому классическая сцена Верроккьо и Леонардо здесь очень точна."
      }
    },
    "5:6": {
      episode: "Чудесный улов",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacopo%20Bassano%2C%20The%20Miraculous%20Draught%20of%20Fishes%2C%201545%2C%20NGA%2096688.jpg",
        credit:
          "Якопо Бассано, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 5:6 сети уже наполняются множеством рыбы, и именно этот миг лучше всего поддерживает живописный мотив чудесного улова."
      }
    },
    "7:14": {
      episode: "Воскрешение сына вдовы в Наине",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Martino%20Altomonte%20-%20Raising%20of%20the%20Son%20of%20the%20Widow%20of%20Nain.jpg",
        credit:
          "Мартино Альтомонте, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 7:14 фиксирует решающий жест Христа у носилок, и сцена Наина у Альтомонте подходит именно к этому переломному стиху."
      }
    },
    "10:33": {
      episode: "Добрый самарянин",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Good%20Samaritan%20%28Delacroix%201849%29.jpg",
        credit:
          "Эжен Делакруа, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 10:33 отмечено обращение самаритянина к раненому, а Делакруа придает этому милосердию яркую визуальную форму."
      }
    },
    "10:39": {
      episode: "Марфа и Мария",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/VermeerChristInTheHouseOfMarthaAndMary.jpg",
        credit:
          "Иоганнес Вермеер, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 10:39 показывает Марию у ног Иисуса, и сцена Марфы и Марии у Вермеера хорошо держится именно на этом спокойном центре эпизода."
      }
    },
    "15:20": {
      episode: "Блудный сын",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20Harmensz%20van%20Rijn%20-%20Return%20of%20the%20Prodigal%20Son%20-%20Google%20Art%20Project.jpg",
        credit:
          "Рембрандт, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 15:20 — это само объятие, а \"Блудный сын\" Рембрандта — почти каноническая картина для этого стиха."
      }
    },
    "22:19": {
      episode: "Тайная вечеря",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20The%20Last%20Supper%20high%20res.jpg",
        credit:
          "Леонардо да Винчи, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 22:19 хлеб уже взят, благословлен и подан ученикам, поэтому \"Тайная вечеря\" Леонардо естественно подходит именно к этому стиху."
      }
    },
    "22:43": {
      episode: "Моление в Гефсимании",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Matthias%20Stom%20-%20Christ%20on%20the%20Mount%20of%20Olives.jpg",
        credit:
          "Маттиас Стом, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 22:43 особо выделяет ангела, укрепляющего Иисуса, и поэтому гефсиманская сцена Стома здесь попадает точнее, чем более общие страстные композиции."
      }
    },
    "23:33": {
      episode: "Распятие",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crucifixion%20of%20Christ%20%28circa%201490%29.jpg",
        credit:
          "Мастер из Нюрнберга или Бамберга, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 23:33 называет само распятие и расположение по сторонам, поэтому прямой образ распятия остается здесь самым точным живописным спутником."
      }
    },
    "24:30": {
      episode: "Эммаус",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20%E2%80%94%20Supper%20at%20Emmaus.jpg",
        credit:
          "Караваджо, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "В Луки 24:30 говорится о застольном общении, благословении и признании, которые начинают раскрываться, что делает Эммаус сильным стихотворным образом."
      }
    },
    "24:51": {
      episode: "Вознесение",
      art: {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Wga%20Garofalo%20Ascension%20of%20Christ.jpg",
        credit:
          "Бенвенуто Тизи да Гарофало, изображение из общественного достояния через Wikimedia Commons",
        caption:
          "Луки 24:51 фиксирует само удаление Христа и благословение учеников, поэтому традиционная сцена Вознесения здесь работает как точное завершение книги."
      }
    }
  })
);

const sceneRanges = [
  { start: "1:9", end: "1:22", episode: "Захария в храме" },
  { start: "1:26", end: "1:38", episode: "Благовещение", artRef: "1:28" },
  { start: "1:39", end: "1:56", episode: "Посещение Елисаветы", artRef: "1:41" },
  { start: "2:4", end: "2:20", episode: "Рождество и пастухи", artRef: "2:16" },
  { start: "2:22", end: "2:38", episode: "Сретение", artRef: "2:28" },
  { start: "2:41", end: "2:50", episode: "Иисус среди учителей", artRef: "2:46" },
  { start: "3:21", end: "3:22", episode: "Крещение Христа", artRef: "3:21" },
  { start: "4:1", end: "4:13", episode: "Искушение в пустыне" },
  { start: "5:1", end: "5:11", episode: "Чудесный улов", artRef: "5:6" },
  { start: "7:11", end: "7:17", episode: "Воскрешение сына вдовы в Наине", artRef: "7:14" },
  { start: "7:36", end: "7:50", episode: "Женщина у ног Иисуса" },
  { start: "8:22", end: "8:25", episode: "Укрощение бури" },
  { start: "9:28", end: "9:36", episode: "Преображение" },
  { start: "10:25", end: "10:37", episode: "Добрый самарянин", artRef: "10:33" },
  { start: "10:38", end: "10:42", episode: "Марфа и Мария", artRef: "10:39" },
  { start: "15:11", end: "15:32", episode: "Блудный сын", artRef: "15:20" },
  { start: "16:19", end: "16:31", episode: "Богач и Лазарь" },
  { start: "18:9", end: "18:14", episode: "Фарисей и мытарь" },
  { start: "18:35", end: "18:43", episode: "Исцеление слепого" },
  { start: "19:1", end: "19:10", episode: "Закхей" },
  { start: "19:29", end: "19:40", episode: "Вход в Иерусалим" },
  { start: "19:45", end: "19:48", episode: "Очищение храма" },
  { start: "22:14", end: "22:23", episode: "Тайная вечеря", artRef: "22:19" },
  { start: "22:39", end: "22:46", episode: "Моление в Гефсимании", artRef: "22:43" },
  { start: "23:26", end: "23:49", episode: "Распятие", artRef: "23:33" },
  { start: "24:1", end: "24:12", episode: "Жены у гроба" },
  { start: "24:13", end: "24:35", episode: "Путь в Эммаус и трапеза", artRef: "24:30" },
  { start: "24:50", end: "24:53", episode: "Вознесение", artRef: "24:51" }
];

function parseRef(ref) {
  const [chapter, verse] = ref.split(":").map(Number);
  return { chapter, verse };
}

function compareRefs(left, right) {
  if (left.chapter !== right.chapter) {
    return left.chapter - right.chapter;
  }

  return left.verse - right.verse;
}

function isWithinRange(ref, range) {
  const parsed = parseRef(ref);
  return (
    compareRefs(parsed, parseRef(range.start)) >= 0 &&
    compareRefs(parsed, parseRef(range.end)) <= 0
  );
}

function inferAssessment(text) {
  if (!text) {
    return {
      assessment: "unlikely",
      note: "Пустой или служебный текст не дает основания ожидать устойчивую самостоятельную картину."
    };
  }

  const lower = text.toLowerCase();

  if (
    lower.includes("parable") ||
    lower.includes("there was a certain") ||
    lower.includes("a certain man") ||
    lower.includes("a certain woman")
  ) {
    return {
      assessment: "unlikely",
      note: "Это скорее часть притчи или вводной формулы, чем момент с устойчивой самостоятельной иконографией."
    };
  }

  if (
    lower.includes("said unto") ||
    lower.includes("he said,") ||
    lower.includes("and he said unto") ||
    lower.includes("jesus answered") ||
    lower.includes("and they said")
  ) {
    return {
      assessment: "unlikely",
      note: "Речь здесь доминирует над действием, поэтому точная живописная привязка к одному стиху обычно не складывается."
    };
  }

  if (
    lower.includes("went") ||
    lower.includes("came") ||
    lower.includes("returned") ||
    lower.includes("went up") ||
    lower.includes("went down")
  ) {
    return {
      assessment: "unlikely",
      note: "Это переходный или дорожный стих; для него обычно нет отдельной устойчивой картины вне более широкой сцены."
    };
  }

  return {
    assessment: "unlikely",
    note: "Для этого стиха не просматривается устоявшийся самостоятельный живописный сюжет; если и есть изображения, они обычно работают на уровень всей сцены."
  };
}

function getSceneRange(ref) {
  return sceneRanges.find((range) => isWithinRange(ref, range)) ?? null;
}

function getSceneArt(range) {
  if (!range?.artRef) {
    return null;
  }

  return exactArtByRef.get(range.artRef)?.art ?? null;
}

for (const chapter of luke.chapters) {
  for (const scene of chapter.scenes) {
    for (const verse of scene.verses) {
      const ref = `${chapter.number}:${verse.number}`;
      const exact = exactArtByRef.get(ref);
      if (exact) {
        verse.art = exact.art;
      }
    }
  }
}

const auditVerses = [];

for (const chapter of luke.chapters) {
  for (const scene of chapter.scenes) {
    for (const verse of scene.verses) {
      const ref = `${chapter.number}:${verse.number}`;
      const exact = exactArtByRef.get(ref);
      const sceneRange = getSceneRange(ref);
      const base = {
        reference: `Луки ${ref}`,
        chapter: chapter.number,
        verse: Number(verse.number)
      };

      if (exact) {
        auditVerses.push({
          ...base,
          assessment: "exact",
          episode: exact.episode,
          note: "Есть хорошо узнаваемая существующая картина, попадающая именно в этот стих или его самый напряженный визуальный момент.",
          art: {
            title: exact.art.caption,
            src: exact.art.src,
            credit: exact.art.credit
          }
        });
        continue;
      }

      if (sceneRange) {
        const sceneArt = getSceneArt(sceneRange);
        auditVerses.push({
          ...base,
          assessment: "scene",
          episode: sceneRange.episode,
          note: "Для более широкого эпизода существует живописная традиция, но этот стих сам по себе лучше работает как часть сцены, а не как отдельный образ.",
          ...(sceneArt
            ? {
                art: {
                  title: sceneArt.caption,
                  src: sceneArt.src,
                  credit: sceneArt.credit
                }
              }
            : {})
        });
        continue;
      }

      auditVerses.push({
        ...base,
        ...inferAssessment(verse.translations?.english ?? "")
      });
    }
  }
}

const counts = auditVerses.reduce(
  (acc, verse) => {
    acc[verse.assessment] += 1;
    return acc;
  },
  { exact: 0, scene: 0, unlikely: 0 }
);

const audit = {
  book: "luke",
  title: "Аудит живописных соответствий по стихам Евангелия от Луки",
  generatedAt: "2026-04-17",
  methodology: {
    exact:
      "Есть устоявшаяся живописная работа, которая естественно читается как изображение именно этого стиха.",
    scene:
      "Для эпизода есть известные картины, но стих точнее воспринимается как часть более широкой сцены.",
    unlikely:
      "Для стиха нет устойчивой самостоятельной картины; обычно это переход, реплика, пояснение или деталь без отдельной иконографической традиции."
  },
  counts,
  verses: auditVerses
};

fs.writeFileSync(bookPath, `${JSON.stringify(luke, null, 2)}\n`);
fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);

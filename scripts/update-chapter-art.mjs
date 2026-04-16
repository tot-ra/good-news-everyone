import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const bookPaths = {
  matthew: path.join(root, "src/data/books/matthew.json"),
  mark: path.join(root, "src/data/books/mark.json"),
  luke: path.join(root, "src/data/books/luke.json"),
  john: path.join(root, "src/data/books/john.json")
};

const books = Object.fromEntries(
  await Promise.all(
    Object.entries(bookPaths).map(async ([id, filePath]) => [
      id,
      JSON.parse(await fs.readFile(filePath, "utf8"))
    ])
  )
);

const bookLabels = {
  matthew: "Матфея",
  mark: "Марка",
  luke: "Луки",
  john: "Иоанна"
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getChapter(bookId, chapterNumber) {
  return books[bookId].chapters.find((chapter) => chapter.number === chapterNumber);
}

function getSceneArt(bookId, chapterNumber) {
  return clone(getChapter(bookId, chapterNumber).scenes[0].art);
}

function getVerseArt(bookId, chapterNumber, verseNumber) {
  const chapter = getChapter(bookId, chapterNumber);
  const verse = chapter.scenes[0].verses.find(
    (item) => item.number === String(verseNumber)
  );

  if (!verse?.art) {
    throw new Error(`Missing verse art for ${bookId} ${chapterNumber}:${verseNumber}`);
  }

  return clone(verse.art);
}

function createArt(src, credit) {
  return { src, credit, caption: "" };
}

const library = {
  josephDream: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt_Dream_of_Joseph.jpg",
    "Rembrandt and workshop, изображение из общественного достояния через Wikimedia Commons"
  ),
  keysPeter: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20Handing%20the%20Keys%20to%20St.%20Peter%20by%20Pietro%20Perugino.jpg",
    "Pietro Perugino, изображение из общественного достояния через Wikimedia Commons"
  ),
  lastJudgment: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Last%20Judgement%20by%20Michelangelo.jpg",
    "Michelangelo, изображение из общественного достояния через Wikimedia Commons"
  ),
  greatCommission: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Meister%20der%20Reichenauer%20Schule%20001.jpg",
    "Master of the Reichenau school, изображение из общественного достояния через Wikimedia Commons"
  ),
  weddingAtCana: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Veronese%2C%20The%20Marriage%20at%20Cana%20%281563%29.jpg",
    "Paolo Veronese, изображение из общественного достояния через Wikimedia Commons"
  ),
  bethesda: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Curacion%20del%20paralitico%20Murillo%201670.jpg",
    "Bartolome Esteban Murillo, изображение из общественного достояния через Wikimedia Commons"
  ),
  healingBlind: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/El_Greco_-_Christ_Healing_the_Blind_-_WGA10420.jpg",
    "El Greco, изображение из общественного достояния через Wikimedia Commons"
  ),
  beforePilate: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jacopo%20Tintoretto%20-%20Christ%20before%20Pilate%20-%20WGA22514.jpg",
    "Jacopo Tintoretto, изображение из общественного достояния через Wikimedia Commons"
  ),
  cleansingTemple: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/El%20Greco%20Christ%20Driving%20the%20Money%20Changers%20from%20the%20Temple.jpg",
    "El Greco, изображение из общественного достояния через Wikimedia Commons"
  ),
  breakfastBySea: createArt(
    "https://commons.wikimedia.org/wiki/Special:FilePath/Brooklyn%20Museum%20-%20Meal%20of%20Our%20Lord%20and%20the%20Apostles%20%28Repas%20de%20Notre-Seigneur%20et%20des%20ap%C3%B4tres%29%20-%20James%20Tissot.jpg",
    "James Tissot, изображение из общественного достояния через Wikimedia Commons"
  )
};

function withCaption(art, caption) {
  const next = clone(art);
  next.caption = caption.endsWith(".") ? caption : `${caption}.`;
  return next;
}

function fromLibrary(artKey, bookId, chapterNumber, focus) {
  return withCaption(library[artKey], focus);
}

function fromVerse(bookId, chapterNumber, verseNumber, caption) {
  const art = getVerseArt(bookId, chapterNumber, verseNumber);
  return caption ? withCaption(art, caption) : art;
}

function fromScene(bookId, chapterNumber, caption) {
  return withCaption(getSceneArt(bookId, chapterNumber), caption);
}

const updates = {
  matthew: {
    1: fromLibrary(
      "josephDream",
      "matthew",
      1,
      "Сон Иосифа удерживает главу рядом с именованием Иисуса, семейной линией и давидовым происхождением"
    ),
    2: fromVerse("matthew", 2, 11),
    3: fromVerse("matthew", 3, 16),
    4: fromScene(
      "matthew",
      4,
      "Испытание в пустыне и начало служения по-прежнему лучше всего собираются этим пустынным образом."
    ),
    5: fromScene(
      "matthew",
      5,
      "Нагорная проповедь естественно держит центр этой главы, поэтому образ проповеди здесь уместен."
    ),
    6: fromScene(
      "matthew",
      5,
      "Шестая глава продолжает ту же Нагорную проповедь, поэтому этот образ всё еще остается точным якорем."
    ),
    7: fromScene(
      "matthew",
      5,
      "Седьмая глава завершает ту же речь о распознавании и послушании, поэтому сцена проповеди здесь подходит."
    ),
    8: fromVerse(
      "mark",
      4,
      39,
      "Глава о буре, исцелениях и пугающей власти Иисуса естественно держится рядом с морской сценой, полной страха и внезапной тишины"
    ),
    9: fromVerse("matthew", 9, 9),
    10: fromLibrary(
      "greatCommission",
      "matthew",
      10,
      "Отправка учеников и язык поручения ближе всего подходят к образу посланничества"
    ),
    11: fromScene(
      "matthew",
      5,
      "Хотя глава полемична, в ней по-прежнему звучит публичное учение Иисуса и приглашение к покою."
    ),
    12: fromLibrary(
      "healingBlind",
      "matthew",
      12,
      "Субботний конфликт и исцеление лучше держатся рядом с живым образом публичного милосердия под давлением"
    ),
    13: fromScene(
      "mark",
      1,
      "Для притч у моря береговой образ работает точнее, чем прежняя повторяющаяся сцена с холма"
    ),
    14: fromVerse(
      "mark",
      6,
      41,
      "Смерть Иоанна и насыщение множества делают хлеб в пустыне самым узнаваемым визуальным центром этой главы"
    ),
    15: fromVerse(
      "mark",
      6,
      41,
      "После спора о чистоте глава приходит к хлебу для народов, поэтому сцена хлебов и рыб здесь уместнее общего учебного образа"
    ),
    16: fromLibrary(
      "keysPeter",
      "matthew",
      16,
      "Исповедание Петра и язык ключей делают эту картину самым узнаваемым сюжетом главы"
    ),
    17: fromVerse(
      "mark",
      9,
      2,
      "Преображение задает вершину этой главы и лучше всего удерживает ее рядом со славой и страхом горного откровения"
    ),
    18: fromVerse(
      "mark",
      10,
      16,
      "Ребенок в центре и разговор о малых делают образ благословения детей сильным визуальным якорем этой главы"
    ),
    19: fromVerse(
      "mark",
      10,
      16,
      "Хотя глава говорит и о браке, и о богатстве, прием детей лучше прежней общей сцены показывает требуемую уязвимость ученичества"
    ),
    20: fromVerse(
      "mark",
      10,
      52,
      "Дорога в Иерусалим и прозрение слепых лучше всего собираются в образе исцеленного ученика у дороги"
    ),
    21: fromVerse(
      "mark",
      11,
      7,
      "Торжественный вход задает тон всей главе и гораздо точнее вводит в иерусалимский конфликт"
    ),
    22: fromLibrary(
      "cleansingTemple",
      "matthew",
      22,
      "Храмовая полемика и столкновение властей делают иерусалимский храм лучшим визуальным контекстом главы"
    ),
    23: fromLibrary(
      "lastJudgment",
      "matthew",
      23,
      "Глава построена как пророческое разоблачение и суд, поэтому строгий образ окончательной оценки здесь звучит точнее"
    ),
    24: fromLibrary(
      "lastJudgment",
      "matthew",
      24,
      "Речь о потрясениях, ожидании и конце естественно тяготеет к образу суда"
    ),
    25: fromLibrary(
      "lastJudgment",
      "matthew",
      25,
      "Притчи о готовности завершаются отделением овец и козлов, поэтому образ суда подходит к главе лучше всего"
    ),
    26: fromVerse("matthew", 26, 26),
    27: fromVerse("matthew", 27, 35),
    28: fromScene(
      "matthew",
      28,
      "Воскресение и отправление учеников уже хорошо собраны этой пасхальной сценой."
    )
  },
  mark: {
    1: fromScene(
      "mark",
      1,
      "Берег, движение и быстрый призыв учеников остаются хорошим входом в первую главу Марка."
    ),
    2: fromVerse(
      "matthew",
      9,
      9,
      "Призвание Левия и трапеза с грешниками дают второй главе более точный городской и конфликтный образ"
    ),
    3: fromLibrary(
      "healingBlind",
      "mark",
      3,
      "Для главы о публичном исцелении и растущем сопротивлении лучше подходит образ исцеления, а не случайная береговая сцена"
    ),
    4: fromVerse(
      "mark",
      4,
      39,
      "Притчи у моря и укрощение бури делают водную сцену самым естественным образом для этой главы"
    ),
    5: fromVerse("mark", 5, 41),
    6: fromVerse("mark", 6, 41),
    7: fromLibrary(
      "healingBlind",
      "mark",
      7,
      "Споры о чистоте и исцелениям в языческой зоне лучше служит образ телесного восстановления"
    ),
    8: fromVerse(
      "mark",
      6,
      41,
      "Хлеб, непонимание учеников и путь к исповеданию Петра делают образ насыщения лучшим визуальным входом в эту главу"
    ),
    9: fromVerse("mark", 9, 2),
    10: fromVerse("mark", 10, 16),
    11: fromVerse("mark", 11, 7),
    12: fromVerse("mark", 12, 42),
    13: fromLibrary(
      "lastJudgment",
      "mark",
      13,
      "Апокалиптическое напряжение и язык конца требуют иного образа, чем прежний общий морской мотив"
    ),
    14: fromVerse("mark", 14, 22),
    15: fromVerse("mark", 15, 24),
    16: fromVerse("mark", 16, 6)
  },
  luke: {
    1: fromVerse("luke", 1, 28),
    2: fromScene(
      "luke",
      2,
      "Рождественская сцена уже хорошо соответствует уязвимости и радости второй главы Луки."
    ),
    3: fromVerse("luke", 3, 21),
    4: fromScene(
      "matthew",
      4,
      "Искушение в пустыне и резкий переход к публичному служению делают пустынный образ гораздо уместнее прежнего рождественского"
    ),
    5: fromVerse("luke", 5, 6),
    6: fromScene(
      "matthew",
      5,
      "Шестая глава Луки держится на публичном учении и формировании учеников, поэтому сцена проповеди подходит ей лучше"
    ),
    7: fromVerse("luke", 7, 14),
    8: fromVerse(
      "mark",
      4,
      39,
      "Буря на море хорошо держит вместе страх, власть и ученичество, проходящие через эту главу Луки"
    ),
    9: fromVerse(
      "mark",
      9,
      2,
      "Преображение остается самым узнаваемым и точным образом для девятой главы Луки"
    ),
    10: fromVerse("luke", 10, 33),
    11: fromScene(
      "matthew",
      5,
      "Молитва, наставление и публичная полемика всё же ближе к образу учителя среди слушателей, чем к прежней сцене Рождества"
    ),
    12: fromLibrary(
      "lastJudgment",
      "luke",
      12,
      "Предостережения о богатстве, бодрствовании и конце естественно тяготеют к образу суда"
    ),
    13: fromScene(
      "matthew",
      5,
      "Глава сочетает исцеление, притчи и призыв войти тесными вратами, поэтому образ публичного наставления здесь работает лучше"
    ),
    14: fromVerse("luke", 10, 39),
    15: fromVerse("luke", 15, 20),
    16: fromLibrary(
      "lastJudgment",
      "luke",
      16,
      "Рассказ о богаче и Лазаре делает тему посмертного разворота и суда центральной для главы"
    ),
    17: fromLibrary(
      "lastJudgment",
      "luke",
      17,
      "Разговор о приходе Царства и днях Сына Человеческого требует эсхатологического, а не рождественского образа"
    ),
    18: fromVerse(
      "mark",
      10,
      52,
      "Хотя глава многослойна, исцеление слепого у дороги хорошо собирает ее движение к Иерихону и Иерусалиму"
    ),
    19: fromVerse(
      "mark",
      11,
      7,
      "Закхей и вход в Иерусалим сходятся в этой главе к царскому приближению Иисуса к городу"
    ),
    20: fromLibrary(
      "cleansingTemple",
      "luke",
      20,
      "Храмовые споры и вопросы властей лучше всего читаются в иерусалимском контексте"
    ),
    21: fromVerse(
      "mark",
      12,
      42,
      "Глава начинается с бедной вдовы и затем разворачивается к речи о конце, поэтому ее малое приношение остается сильным входом"
    ),
    22: fromVerse("luke", 22, 19),
    23: fromVerse("luke", 23, 33),
    24: fromVerse("luke", 24, 30)
  },
  john: {
    1: fromScene(
      "mark",
      1,
      "Свидетельство у Иордана и первые ученики требуют образа призвания и движения, а не сцены у самарянского колодца"
    ),
    2: fromLibrary(
      "weddingAtCana",
      "john",
      2,
      "Кана и затем очищение храма делают свадебный пир узнаваемой точкой входа в главу"
    ),
    3: fromVerse("john", 3, 2),
    4: fromScene(
      "john",
      4,
      "Разговор у колодца уже точно совпадает с долгой самарянской сценой четвертой главы."
    ),
    5: fromLibrary(
      "bethesda",
      "john",
      5,
      "Исцеление у Вифезды - самый узнаваемый сюжет этой главы и гораздо точнее прежней самарянской картины"
    ),
    6: fromVerse(
      "mark",
      6,
      41,
      "Насыщение множества задает телесный и знаковый центр шестой главы Иоанна, прежде чем разговор перейдет к хлебу жизни"
    ),
    7: fromScene(
      "matthew",
      5,
      "Для главы о долгом публичном споре на празднике наставнический образ подходит лучше случайной сцены из Самарии"
    ),
    8: fromScene(
      "matthew",
      5,
      "Иоанн 8 почти целиком строится на словах и полемике, поэтому образ учения здесь спокойнее и точнее"
    ),
    9: fromLibrary(
      "healingBlind",
      "john",
      9,
      "Глава о слепорождённом естественно просит именно образ исцеления зрения"
    ),
    10: fromScene(
      "matthew",
      5,
      "Хотя глава сосредоточена на речи о пастыре, образ публичного учения всё равно точнее прежней сцены у колодца"
    ),
    11: fromVerse("john", 11, 43),
    12: fromVerse(
      "mark",
      11,
      7,
      "Вход в Иерусалим задает публичный и праздничный тон всей двенадцатой главы"
    ),
    13: fromVerse("john", 13, 5),
    14: fromVerse(
      "matthew",
      26,
      26,
      "Четырнадцатая глава продолжает верхнюю комнату, поэтому образ трапезы остается естественным контекстом для этой речи"
    ),
    15: fromVerse(
      "matthew",
      26,
      26,
      "Хотя здесь звучит речь о лозе и ветвях, обстановка последней трапезы всё еще точнее прежней самарянской сцены"
    ),
    16: fromVerse(
      "matthew",
      26,
      26,
      "Шестнадцатая глава продолжает прощальную беседу, поэтому образ вечери здесь работает как контекст, а не как случайная замена"
    ),
    17: fromVerse(
      "matthew",
      26,
      26,
      "Молитва Иисуса в семнадцатой главе остается частью той же верхней комнаты, поэтому трапезный образ здесь уместен"
    ),
    18: fromLibrary(
      "beforePilate",
      "john",
      18,
      "Арест и судебное столкновение делают сцену у Пилата самым читаемым образом главы"
    ),
    19: fromVerse(
      "luke",
      23,
      33,
      "Распятие остается центральным и самым узнаваемым визуальным якорем для девятнадцатой главы Иоанна"
    ),
    20: fromVerse("john", 20, 27),
    21: fromLibrary(
      "breakfastBySea",
      "john",
      21,
      "Береговая трапеза после улова точнее собирает финал книги, чем прежняя несвязанная самарянская сцена"
    )
  }
};

for (const [bookId, chapterUpdates] of Object.entries(updates)) {
  for (const [chapterNumber, art] of Object.entries(chapterUpdates)) {
    getChapter(bookId, Number(chapterNumber)).scenes[0].art = art;
  }
}

for (const [bookId, filePath] of Object.entries(bookPaths)) {
  await fs.writeFile(filePath, `${JSON.stringify(books[bookId], null, 2)}\n`);
}

import gospelLibrary from "./data/library-index.json";

export const places = [
  {
    id: "nazareth",
    name: "Назарет",
    lat: 32.6996,
    lng: 35.3035,
    description: "Галилейский город, тесно связанный с ранними годами жизни Иисуса.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Nazareth%20aerial%20view.jpg",
        title: "Назарет с высоты",
        credit: "Wikimedia Commons"
      }
    ]
  },
  {
    id: "capernaum",
    name: "Капернаум",
    lat: 32.8804,
    lng: 35.5735,
    description: "Прибрежный центр служения в Галилее, рядом с северо-западным берегом Галилейского моря.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sea%20of%20Galilee%20from%20Capernaum%20%2834552508191%29.jpg",
        title: "Галилейское море со стороны Капернаума",
        credit: "Eduard Marmet через Wikimedia Commons"
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Capernaum%20synagogue.JPG",
        title: "Синагога в Капернауме",
        credit: "Qasinka через Wikimedia Commons"
      }
    ]
  },
  {
    id: "sea-of-galilee",
    name: "Галилейское море",
    lat: 32.8244,
    lng: 35.5879,
    description: "Пресноводное озеро, вокруг которого разворачивается значительная часть евангельского повествования.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Panorama%20on%20the%20north%20Shore%20of%20the%20Sea%20of%20Galilee%20%285796531006%29.jpg",
        title: "Северный берег Галилейского моря",
        credit: "Wikimedia Commons"
      },
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sea%20of%20Galilee.jpg",
        title: "Галилейское море",
        credit: "Wikimedia Commons"
      }
    ]
  },
  {
    id: "sychar",
    name: "Сихарь",
    lat: 32.2125,
    lng: 35.2861,
    description: "Область Самарии, связываемая с колодцем Иакова и диалогом из Иоанна 4.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Entrace%20to%20Jacob%27s%20Well%2C%20Samaria.jpg",
        title: "Вход к колодцу Иакова в Самарии",
        credit: "Wikimedia Commons"
      }
    ]
  },
  {
    id: "jerusalem",
    name: "Иерусалим",
    lat: 31.778,
    lng: 35.235,
    description: "Город храма, праздников, суда и пасхальной кульминации евангельского рассказа.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem%20from%20the%20Mount%20of%20Olives.jpg",
        title: "Иерусалим с Елеонской горы",
        credit: "Wikimedia Commons"
      }
    ]
  },
  {
    id: "bethlehem",
    name: "Вифлеем",
    lat: 31.7054,
    lng: 35.2024,
    description: "Вифлеем Иудейский, город Давида и место натального повествования у Луки.",
    photos: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bethlehem%20Overlooking.jpg",
        title: "Вид на Вифлеем",
        credit: "Maysa Al Shaer через Wikimedia Commons"
      }
    ]
  },
  {
    id: "jordan-river",
    name: "Иордан",
    lat: 31.837,
    lng: 35.551,
    description: "Река, связанная с проповедью Иоанна Крестителя, крещением Иисуса и переходом от сокрытой жизни к публичному служению.",
    photos: []
  },
  {
    id: "wilderness-judea",
    name: "Иудейская пустыня",
    lat: 31.73,
    lng: 35.39,
    description: "Пустынный пояс к западу от Мёртвого моря, связанный с покаянием, испытанием и уединением.",
    photos: []
  },
  {
    id: "egypt",
    name: "Египет",
    lat: 30.8,
    lng: 31.2,
    description: "Земля убежища в повествовании о младенчестве Иисуса у Матфея, отмечающая тему исхода и возвращения.",
    photos: []
  },
  {
    id: "decapolis",
    name: "Десятиградие",
    lat: 32.02,
    lng: 35.83,
    description: "Область греко-римских городов к востоку и юго-востоку от Галилейского моря, где евангельское действие выходит за привычные иудейские пределы.",
    photos: []
  },
  {
    id: "tyre-sidon",
    name: "Тир и Сидон",
    lat: 33.25,
    lng: 35.2,
    description: "Финикийское побережье к северо-западу от Галилеи, связанное с выходом Иисуса к языческим территориям.",
    photos: []
  },
  {
    id: "caesarea-philippi",
    name: "Кесария Филиппова",
    lat: 33.248,
    lng: 35.694,
    description: "Северная область у подножия Ермона, связанная с исповеданием Петра и важным поворотом в евангельском пути.",
    photos: []
  },
  {
    id: "jericho",
    name: "Иерихон",
    lat: 31.871,
    lng: 35.444,
    description: "Город в Иорданской долине на дороге к Иерусалиму, часто появляющийся в дорожных сценах последних глав.",
    photos: []
  },
  {
    id: "bethany",
    name: "Вифания",
    lat: 31.771,
    lng: 35.269,
    description: "Селение на восточном склоне Елеонской горы, связанное с Марфой, Марией, Лазарем и последними днями перед страстями.",
    photos: []
  },
  {
    id: "mount-of-olives",
    name: "Елеонская гора",
    lat: 31.7784,
    lng: 35.2436,
    description: "Высота к востоку от Иерусалима, связанная с входом в город, пророческой речью, молитвой и арестом.",
    photos: []
  },
  {
    id: "golgotha",
    name: "Голгофа",
    lat: 31.7787,
    lng: 35.2299,
    description: "Место распятия за городскими стенами Иерусалима, центр страстного повествования.",
    photos: []
  },
  {
    id: "emmaus",
    name: "Эммаус",
    lat: 31.841,
    lng: 35.019,
    description: "Селение к западу от Иерусалима, связанное с дорогой узнавания и беседой воскресшего Христа с учениками.",
    photos: []
  },
  {
    id: "cana",
    name: "Кана Галилейская",
    lat: 32.746,
    lng: 35.342,
    description: "Галилейское селение, где у Иоанна происходит первое знамение с водой и вином.",
    photos: []
  },
  {
    id: "bethesda",
    name: "Вифезда",
    lat: 31.7833,
    lng: 35.2381,
    description: "Купальня у Овечьих ворот в Иерусалиме, связанная с исцелением расслабленного в Иоанна 5.",
    photos: []
  }
];

export { gospelLibrary };

export const translationInfo = {
  current: [
    {
      id: "greek",
      title: "Греческий (Textus Receptus)",
      years: "1550 / 1894",
      body:
        "В приложении используется греческий Textus Receptus в линии, обозначенной источником как 1550 / 1894: это традиция печатного текста, связанная прежде всего с изданием Робера Этьена (Stephanus, 1550) и поздней редакционной формой Ф. Х. А. Скривенера (1894). Это не современный критический текст типа NA28 или SBLGNT."
    },
    {
      id: "russianSynodal",
      title: "Русский (Синодальный)",
      years: "НЗ 1820-е, полная Библия 1876",
      body:
        "Классический русский библейский текст, завершённый в XIX веке под эгидой Святейшего Синода. Это базовая точка сравнения для большинства русскоязычных читателей."
    },
    {
      id: "russianCassian",
      title: "Русский (Кассиан)",
      years: "работа комиссии 1951–1964",
      body:
        "Новый Завет, выросший из работы комиссии при Свято-Сергиевском институте в Париже под руководством епископа Кассиана (Безобразова). Обычно ценится за более прямую связь с греческим текстом и меньшую архаичность."
    },
    {
      id: "russianBti",
      title: "Русский (Заокский / Кулакова)",
      years: "работа с 1993, полная Библия в XXI веке",
      body:
        "Современный русский перевод Института перевода Библии им. М. П. Кулакова в Заокском. Он полезен там, где хочется видеть более современную лексику и иную переводческую стратегию."
    },
    {
      id: "english",
      title: "Английский (KJV)",
      years: "1611",
      body:
        "Английский столбец сейчас основан на King James Version. Это раннемодерный английский перевод, подготовленный по поручению короля Якова I и впервые изданный в 1611 году. Он важен исторически и стилистически, но язык у него архаичнее современных переводов."
    }
  ],
  russianAlternatives: [],
  note:
    "Теперь можно сравнивать греческий оригинал с несколькими русскими версиями отдельно: Синодальным, Кассианом и современным Заокским переводом."
};

export const allScenes = gospelLibrary.flatMap((book) =>
  book.chapters.flatMap((chapter) =>
    chapter.scenes.map((scene) => ({
      ...scene,
      bookId: book.id,
      bookTitle: book.title,
      bookSubtitle: book.subtitle,
      bookAccent: book.accent,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      chapterSummary: chapter.summary
    }))
  )
);

export function getSceneHref(scene) {
  return `#/${scene.bookId}/${scene.chapterNumber}/${scene.id}`;
}

export function findSceneByRoute(bookId, chapterNumber, sceneId) {
  return (
    allScenes.find(
      (scene) =>
        scene.bookId === bookId &&
        String(scene.chapterNumber) === String(chapterNumber) &&
        scene.id === sceneId
    ) ?? null
  );
}

export function getBookById(bookId) {
  return gospelLibrary.find((book) => book.id === bookId) ?? null;
}

export function getPlaceById(placeId) {
  return places.find((place) => place.id === placeId) ?? null;
}

const bookModules = import.meta.glob("./data/books/*.json");

export async function loadBookData(bookId) {
  const loader = bookModules[`./data/books/${bookId}.json`];

  if (!loader) {
    return null;
  }

  const module = await loader();
  return module.default ?? null;
}

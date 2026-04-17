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

const MARK_CHAPTER_GLOSSARY_ADDITIONS = {
  1: [
    {
      term: "Иоанн Креститель",
      aliases: ["Иоанн Креститель", "Иоанна Крестителя", "Иоанн"],
      meta: "пророк перед служением Иисуса",
      description:
        "Проповедник покаяния у Иордана, который готовит народ к явлению Иисуса и крестит Его."
    },
    {
      term: "Назарет",
      aliases: ["Назарет", "Назарета", "Назарете", "Назарянин", "Назарянином"],
      meta: "город в Галилее",
      description:
        "Город, с которым связывают раннюю жизнь Иисуса. В Евангелиях название часто звучит как указание на Его происхождение."
    }
  ],
  2: [
    {
      term: "Авиафар",
      aliases: ["Авиафаре", "Авиафар", "Авиафара"],
      meta: "ветхозаветный первосвященник",
      description:
        "Священник времён Давида. Марк вспоминает его в споре о субботе, связывая рассказ Иисуса с историей Писания."
    },
    {
      term: "книжники",
      aliases: ["книжники", "книжников", "книжникам", "книжник"],
      meta: "знатоки закона",
      description:
        "Учёные толкователи Писания и закона. В Евангелиях они часто выступают как религиозные оппоненты Иисуса."
    }
  ],
  3: [
    {
      term: "Идумея",
      aliases: ["Идумея", "Идумеи", "Идумею"],
      meta: "область к югу от Иудеи",
      description:
        "Южный регион, связанный с потомками Едома. У Марка его упоминание показывает, как далеко расходится слух об Иисусе."
    },
    {
      term: "Иуда Искариот",
      aliases: ["Искариот", "Искариотского", "Иуда Искариот"],
      meta: "один из двенадцати",
      description:
        "Ученик, который позже предаст Иисуса. Марк называет его уже в списке двенадцати, заранее создавая напряжение."
    }
  ],
  4: [
    {
      term: "притча",
      aliases: ["притча", "притчи", "притчах", "притчу"],
      meta: "образный способ учить",
      description:
        "Короткий образный рассказ или сравнение, через которое Иисус раскрывает смысл Божьего Царства."
    },
    {
      term: "сеятель",
      aliases: ["сеятель", "сеятеля", "сеятелю"],
      meta: "образ из сельской жизни",
      description:
        "Человек, разбрасывающий зерно. В притче этот образ помогает объяснить, как по-разному люди принимают слово."
    }
  ],
  5: [
    {
      term: "легион",
      aliases: ["легион", "легионом"],
      meta: "римское военное слово",
      description:
        "Изначально крупное подразделение римской армии. В рассказе о бесноватом слово подчёркивает множество злых духов."
    },
    {
      term: "талифа куми",
      aliases: ["талифа куми", "талифа", "куми"],
      meta: "арамейские слова Иисуса",
      description:
        "Фраза, обращённая к умершей девочке, обычно понимаемая как «девица, тебе говорю, встань»."
    }
  ],
  6: [
    {
      term: "Иродиада",
      aliases: ["Иродиада", "Иродиады", "Иродиаде"],
      meta: "жена в доме Ирода",
      description:
        "Фигура при дворе Ирода Антипы, чья вражда к Иоанну Крестителю становится частью рассказа о его смерти."
    },
    {
      term: "Геннисарет",
      aliases: ["Геннисаретскую", "Геннисарет", "Геннисарете"],
      meta: "равнина у Галилейского моря",
      description:
        "Плодородная местность на берегу Галилейского моря, куда причаливает лодка Иисуса после ночного плавания."
    }
  ],
  7: [
    {
      term: "корван",
      aliases: ["корван", "Корван"],
      meta: "дар, посвящённый Богу",
      description:
        "Термин для имущества, объявленного посвящённым храму. Иисус критикует злоупотребление этим обычаем."
    },
    {
      term: "еффафа",
      aliases: ["еффафа", "Еффафа"],
      meta: "арамейское слово",
      description:
        "Слово Иисуса в сцене исцеления глухого, означающее «откройся»."
    }
  ],
  8: [
    {
      term: "Далмануфа",
      aliases: ["Далмануфские", "Далмануфа"],
      meta: "местность на берегу моря",
      description:
        "Редко упоминаемое место в Марка 8. Точное расположение неясно, но оно связано с очередной остановкой Иисуса у озера."
    },
    {
      term: "закваска Иродова",
      aliases: ["Иродовой", "закваски Иродовой", "закваска Иродова"],
      meta: "образ скрытого влияния",
      description:
        "Предупреждение Иисуса о разрушительном влиянии двора Ирода и ложных ожиданий власти."
    }
  ],
  9: [
    {
      term: "Преображение",
      aliases: ["преобразился", "преображение"],
      meta: "явление славы Иисуса",
      description:
        "Сцена на горе, где ученики видят необычную славу Иисуса и слышат небесный голос."
    },
    {
      term: "геенна",
      aliases: ["геенну", "геенна", "геенне"],
      meta: "образ суда",
      description:
        "Название долины южнее Иерусалима, ставшее сильным образом гибели, огня и окончательного суда."
    }
  ],
  10: [
    {
      term: "Иерихон",
      aliases: ["Иерихон", "Иерихона", "Иерихоне"],
      meta: "город на пути к Иерусалиму",
      description:
        "Город в Иорданской долине. В рассказах о последнем пути Иисуса он становится последней крупной остановкой перед Иерусалимом."
    },
    {
      term: "Сын Давидов",
      aliases: ["Давидов", "Сын Давидов"],
      meta: "мессианское обращение",
      description:
        "Титул, связывающий Иисуса с царской линией Давида и ожиданием обещанного помазанника."
    }
  ],
  11: [
    {
      term: "Виффагия",
      aliases: ["Виффагии", "Виффагия"],
      meta: "селение у Иерусалима",
      description:
        "Небольшое селение на склоне Елеонской горы, рядом с дорогой к Иерусалиму."
    },
    {
      term: "осанна",
      aliases: ["Осанна", "осанна"],
      meta: "возглас хвалы и просьбы о спасении",
      description:
        "Еврейский литургический возглас, который в этой сцене звучит как радостное приветствие Царю."
    }
  ],
  12: [
    {
      term: "денарий",
      aliases: ["динарий", "динария", "динарию", "денарий"],
      meta: "римская монета",
      description:
        "Обычная серебряная монета Рима. Вопрос о ней у Марка связан с налогом кесарю."
    },
    {
      term: "лепта",
      aliases: ["лепты", "лепта", "лепту"],
      meta: "очень мелкая монета",
      description:
        "Одна из самых маленьких монет. В рассказе о вдове подчёркивает, что она дала совсем немного по сумме, но всё по сердцу."
    }
  ],
  13: [
    {
      term: "мерзость запустения",
      aliases: ["мерзость запустения", "мерзость"],
      meta: "язык пророческого предупреждения",
      description:
        "Выражение из книги Даниила о святотатственном осквернении святыни и времени великого бедствия."
    },
    {
      term: "Даниил",
      aliases: ["Даниилом", "Даниил", "Даниила"],
      meta: "ветхозаветный пророк",
      description:
        "Пророк, чьи видения о царствах, бедствиях и конце времён особенно важны для языка Марка 13."
    }
  ],
  14: [
    {
      term: "Пасха",
      aliases: ["Пасхи", "Пасха", "Пасху"],
      meta: "главный иудейский праздник исхода",
      description:
        "Праздник памяти об исходе из Египта. У Марка именно на этом фоне разворачиваются последние часы Иисуса."
    },
    {
      term: "Искариот",
      aliases: ["Искариот", "Иуда Искариот"],
      meta: "прозвище Иуды",
      description:
        "Идентифицирующее имя Иуды, ученика-предателя. В страстном повествовании оно сразу вызывает чувство опасности."
    }
  ],
  15: [
    {
      term: "Киринеянин",
      aliases: ["Киринеянина", "Киринеянин"],
      meta: "человек из Кирены",
      description:
        "Житель североафриканской Кирены. Марк упоминает Симона Киринеянина как человека, которого заставили нести крест Иисуса."
    },
    {
      term: "Аримафея",
      aliases: ["Аримафеи", "Аримафея"],
      meta: "родной город Иосифа",
      description:
        "Город, с которым связывают Иосифа Аримафейского, просившего тело Иисуса для погребения."
    }
  ],
  16: [
    {
      term: "Мария Магдалина",
      aliases: ["Мария Магдалина", "Марии Магдалине", "Магдалина", "Магдалине"],
      meta: "ученица Иисуса",
      description:
        "Одна из самых заметных женщин в пасхальном повествовании, первая свидетельница пустой гробницы у Марка."
    },
    {
      term: "Назарянин",
      aliases: ["Назарянина", "Назарянин"],
      meta: "обозначение Иисуса по происхождению",
      description:
        "Имя, связывающее Иисуса с Назаретом; в пасхальном рассказе оно напоминает, что воскрес именно Тот, Кого знали в земной истории."
    }
  ]
};

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

function getBookSpecificGlossaryEntries(bookId, chapterNumber) {
  if (bookId === "mark") {
    return MARK_CHAPTER_GLOSSARY_ADDITIONS[chapterNumber] ?? [];
  }

  return [];
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
      6: {
        title: "Hidden devotion and trust in the Father",
        summary:
          "Matthew 6 turns from public righteousness to secrecy, prayer, fasting, treasure, and freedom from anxiety before God.",
        sceneTitle: "Prayer, treasure, and daily trust",
        sceneSummary:
          "The sermon continues by moving inward. Jesus warns against religious performance, teaches his disciples how to pray, and reorders desire away from display and toward the Father's care.",
        focusWords: ["Father", "pray", "treasure", "seek"],
        differences: [
          {
            title: "Daily bread",
            body:
              "The line about daily bread is simple in English, but the underlying wording has long invited debate about whether it means bread for today, for the coming day, or for what is necessary."
          },
          {
            title: "Single eye and divided loyalty",
            body:
              "The saying about a sound or single eye can be flattened into a modern metaphor, yet in context it points to undivided desire rather than eyesight alone."
          }
        ]
      },
      7: {
        title: "Judging, asking, and the narrow way",
        summary:
          "Matthew 7 brings the sermon toward its close through warnings about judgment, calls to persistence in prayer, and the demand to build on obedient hearing.",
        sceneTitle: "The sermon reaches decision",
        sceneSummary:
          "Images come quickly here: splinters and beams, gates and roads, trees and fruit, rock and sand. The chapter presses listeners toward discernment and response.",
        focusWords: ["judge", "ask", "fruit", "rock"],
        differences: [
          {
            title: "Judge not",
            body:
              "The command is not a ban on all moral discernment. Matthew immediately moves into questions of fruit, false prophets, and wise evaluation."
          },
          {
            title: "Know and do",
            body:
              "The final contrast is not between hearing and ignorance but between hearing that remains verbal and hearing that becomes embodied obedience."
          }
        ]
      },
      8: {
        title: "Healings, storms, and authority",
        summary:
          "Matthew 8 gathers cleansing, healing, exorcism, and command over the sea into a chapter where Jesus' authority is repeatedly tested and revealed.",
        sceneTitle: "Authority in motion",
        sceneSummary:
          "The chapter descends from mountain teaching into embodied need. Lepers, a centurion, a fevered household, frightened disciples, and demoniacs all expose what kind of authority Jesus carries.",
        focusWords: ["authority", "heal", "faith", "follow"],
        differences: [
          {
            title: "Servant or child",
            body:
              "In the centurion scene, translation choices can make the sick person sound strictly like a servant, though the term can also carry a more intimate household sense."
          },
          {
            title: "Little faith",
            body:
              "Matthew's rebuke is not aimed at total unbelief. It exposes fragile, shrinking trust in the middle of danger."
          }
        ]
      },
      9: {
        title: "Mercy, healing, and the call of Matthew",
        summary:
          "Matthew 9 keeps the momentum of healing while adding forgiveness, contested table fellowship, and the calling of Matthew himself.",
        sceneTitle: "Compassion in the crowded town",
        sceneSummary:
          "Paralytics stand up, mourners become witnesses, blind men cry out, and the harvest image closes the chapter. Mercy keeps breaking through settings shaped by doubt or ritual concern.",
        focusWords: ["forgive", "mercy", "faith", "harvest"],
        differences: [
          {
            title: "Take heart",
            body:
              "Jesus' repeated word is stronger than a polite reassurance. It gives courage in a setting where forgiveness and healing are arriving together."
          },
          {
            title: "I desire mercy",
            body:
              "Matthew lets this quotation interpret the whole chapter: covenant loyalty and compassionate restoration take priority over boundary-making righteousness."
          }
        ],
        verseArt: {
          9: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Calling-of-st-matthew.jpg",
            credit: "Caravaggio, public-domain image via Wikimedia Commons",
            caption:
              "Caravaggio's calling scene gives Matthew 9:9 a direct visual companion at the very moment Matthew rises from the tax booth and follows."
          }
        }
      },
      10: {
        title: "The mission of the twelve",
        summary:
          "Matthew 10 sends the twelve outward with authority, instruction, and sober warning that mission will bring both welcome and resistance.",
        sceneTitle: "Sent as messengers",
        sceneSummary:
          "The chapter begins with names and authority, then widens into a demanding discourse about travel, speech, persecution, courage, and costly allegiance.",
        focusWords: ["send", "worthy", "peace", "fear not"],
        differences: [
          {
            title: "Worthy",
            body:
              "The language of worthiness here is not about earning salvation. It marks a response that matches the weight of the kingdom message and the one who carries it."
          },
          {
            title: "Fear not",
            body:
              "This repeated command does not deny danger. It relocates fear by contrasting hostile human power with the Father's deeper care and judgment."
          }
        ]
      },
      11: {
        title: "John's question, unbelief, and rest",
        summary:
          "Matthew 11 moves from John's imprisoned question to Jesus' rebuke of unresponsive cities and his invitation to the weary to find rest in him.",
        sceneTitle: "Question and invitation",
        sceneSummary:
          "The chapter holds tension together: uncertainty, refusal, judgment, and tenderness. Jesus interprets John, names the failures of his generation, and ends by calling burdened people to his yoke.",
        focusWords: ["offended", "rest", "yoke", "little ones"],
        differences: [
          {
            title: "Blessed is the one not offended",
            body:
              "The line can sound mild in English, but the verb suggests stumbling over Jesus, taking offense at him, or refusing him because he does not fit expectation."
          },
          {
            title: "Easy yoke",
            body:
              "Easy does not mean trivial. The point is a yoke that is kind, fitting, and life-giving compared with heavier religious burdens."
          }
        ]
      },
      12: {
        title: "Sabbath conflict and the sign of Jonah",
        summary:
          "Matthew 12 sharpens the conflict around Jesus through Sabbath controversies, exorcism disputes, and demands for a sign.",
        sceneTitle: "Mercy amid hard opposition",
        sceneSummary:
          "The chapter alternates between healing and accusation. What begins in grainfields and a synagogue expands into a struggle over authority, speech, signs, and true kinship.",
        focusWords: ["Sabbath", "mercy", "sign", "house"],
        differences: [
          {
            title: "Lord of the Sabbath",
            body:
              "The phrase is stronger than a claim to interpretive preference. Matthew presents Jesus as standing over the institution whose meaning is under debate."
          },
          {
            title: "Blasphemy against the Spirit",
            body:
              "Translations can make this sound abstract, but in context it arises from the stubborn refusal to name evident divine liberation as the work of evil."
          }
        ]
      },
      13: {
        title: "Parables of the kingdom",
        summary:
          "Matthew 13 gathers parables about sowing, growth, mixture, concealment, value, and final sorting into the Gospel's great discourse on the kingdom.",
        sceneTitle: "Mysteries spoken beside the sea",
        sceneSummary:
          "Jesus teaches crowds from the edge of the water and then explains more privately to disciples. The chapter moves between public story and inner interpretation.",
        focusWords: ["seed", "kingdom", "hear", "treasure"],
        differences: [
          {
            title: "Mysteries of the kingdom",
            body:
              "Mystery here does not mean puzzle for clever readers. It points to divine realities being disclosed in God's way and time."
          },
          {
            title: "Hear and understand",
            body:
              "Matthew keeps hearing tied to reception and fruitfulness. The issue is not bare sound but whether the word takes root deeply enough to endure."
          }
        ]
      },
      14: {
        title: "John's death and bread in the wilderness",
        summary:
          "Matthew 14 places the death of John the Baptist beside compassion for the crowd, the feeding miracle, and Jesus walking on the sea.",
        sceneTitle: "Grief, bread, and the night sea",
        sceneSummary:
          "The chapter moves from court violence to wilderness provision and then into darkness on the water. It is full of vulnerability, fear, and unexpected sustenance.",
        focusWords: ["compassion", "bread", "fear", "worship"],
        differences: [
          {
            title: "Take heart; it is I",
            body:
              "The phrase can be heard as simple self-identification, yet its wording carries an echo of divine self-disclosure that intensifies the scene on the sea."
          },
          {
            title: "Little faith again",
            body:
              "Peter's sinking is not a separate moral tale from the chapter. Matthew uses it to show how fear interrupts trust even in the middle of real encounter."
          }
        ]
      },
      15: {
        title: "Purity, faith, and bread for the nations",
        summary:
          "Matthew 15 challenges inherited purity boundaries, centers the faith of a foreign woman, and returns to the theme of feeding in a mixed-region setting.",
        sceneTitle: "From contested purity to abundant provision",
        sceneSummary:
          "The chapter begins with dispute over tradition and what truly defiles, then widens toward Gentile territory where persistent faith and shared bread become visible.",
        focusWords: ["defile", "heart", "faith", "bread"],
        differences: [
          {
            title: "Defilement from the heart",
            body:
              "Jesus is not dismissing moral seriousness. He relocates impurity from ritual surface to the deep source of speech and action."
          },
          {
            title: "Children's bread",
            body:
              "The exchange with the Canaanite woman is intentionally sharp. Matthew preserves the tension so that her persistence and Jesus' final commendation land with full force."
          }
        ]
      },
      16: {
        title: "Confession and the way of the cross",
        summary:
          "Matthew 16 turns decisively as Peter confesses Jesus, the cross is announced, and discipleship is redefined through self-denial and loss.",
        sceneTitle: "A turning point at Caesarea Philippi",
        sceneSummary:
          "Questions about signs and leaven give way to the central confession of the chapter. From this point forward, recognition of Jesus cannot be separated from the path toward suffering.",
        focusWords: ["Christ", "rock", "cross", "life"],
        differences: [
          {
            title: "Church or assembly",
            body:
              "The term often translated 'church' can sound institutional to modern readers, but in Matthew it first names a gathered community formed around Jesus' confession."
          },
          {
            title: "Lose life to find it",
            body:
              "The word for life can also suggest soul or self. Matthew compresses identity, destiny, and embodied existence into one demanding paradox."
          }
        ]
      },
      17: {
        title: "Transfiguration and the beloved Son",
        summary:
          "Matthew 17 joins the mountain of transfiguration to healing, renewed passion prediction, and the temple-tax episode back in Capernaum.",
        sceneTitle: "Glory on the mountain, humility on the road",
        sceneSummary:
          "The chapter begins in radiance and fear, then returns to ordinary human struggle: failed disciples, a suffering child, hard teaching, and a question about the temple tax.",
        focusWords: ["listen", "faith", "rise", "Son"],
        differences: [
          {
            title: "Listen to him",
            body:
              "The heavenly voice does more than identify Jesus. It redirects authority so that Moses and Elijah now frame the one whom the disciples must hear."
          },
          {
            title: "Faith like a mustard seed",
            body:
              "The point is not the magical power of tiny quantity alone. Matthew pairs smallness with genuine trust that acts from dependence rather than spectacle."
          }
        ]
      },
      18: {
        title: "Greatness, stumbling, and forgiveness",
        summary:
          "Matthew 18 gathers teaching on humility, care for the little ones, communal discipline, and the costly practice of forgiveness.",
        sceneTitle: "Life together among disciples",
        sceneSummary:
          "A child is set in the middle, lost sheep matter, confrontation is regulated, and the chapter ends with an unforgiving servant. Community is measured by humble care and mercy.",
        focusWords: ["child", "little ones", "forgive", "brother"],
        differences: [
          {
            title: "Little ones",
            body:
              "The phrase can refer to literal children, but Matthew also uses it for vulnerable believers who must not be despised or caused to stumble."
          },
          {
            title: "Seventy-seven times",
            body:
              "Whether rendered seventy times seven or seventy-seven, the force is the same: forgiveness is not being turned into a countable limit."
          }
        ]
      },
      19: {
        title: "Marriage, children, and costly discipleship",
        summary:
          "Matthew 19 moves through teaching on marriage and divorce, blessing of children, and the encounter with the rich young man.",
        sceneTitle: "Costly obedience on the road south",
        sceneSummary:
          "Questions that sound practical quickly become searching. Covenant union, childlike reception, wealth, and reward are all drawn into one demanding vision of discipleship.",
        focusWords: ["one flesh", "children", "perfect", "follow"],
        differences: [
          {
            title: "Hardness of heart",
            body:
              "Jesus explains Moses' concession not as ideal law but as accommodation to a resistant human condition that the kingdom now exposes."
          },
          {
            title: "Perfect",
            body:
              "When Jesus says 'be perfect' or 'if you would be perfect,' the sense is closer to completeness or wholeness than to flawless performance."
          }
        ]
      },
      20: {
        title: "Vineyard grace and the road to Jerusalem",
        summary:
          "Matthew 20 holds together the parable of the vineyard workers, another passion prediction, and acts of mercy on the way out of Jericho.",
        sceneTitle: "Grace that unsettles calculation",
        sceneSummary:
          "This chapter keeps overturning rank. Late workers receive generously, the Son of Man defines greatness through service, and two blind men see what many sighted followers still miss.",
        focusWords: ["kingdom", "last and first", "serve", "mercy"],
        differences: [
          {
            title: "Denarius and fairness",
            body:
              "The parable is not mainly about payroll justice in the abstract. It reveals a master whose generosity exceeds normal calculations of proportional reward."
          },
          {
            title: "Ransom for many",
            body:
              "This is one of Matthew's densest sayings. The language evokes liberation through costly substitution without being reduced to a single narrow formula."
          }
        ]
      },
      21: {
        title: "The king enters Jerusalem",
        summary:
          "Matthew 21 brings Jesus into Jerusalem amid acclamation, temple confrontation, judgment on the fig tree, and parables of rejected authority.",
        sceneTitle: "Entry, cleansing, and challenge",
        sceneSummary:
          "The chapter is public and charged from beginning to end. Crowds cry out, children continue the praise, leaders demand explanations, and parables turn accusation back on the hearers.",
        focusWords: ["Hosanna", "king", "temple", "stone"],
        differences: [
          {
            title: "Hosanna",
            body:
              "What sounds like praise also carries the older force of a plea for saving help, which makes the entry scene both celebratory and urgent."
          },
          {
            title: "The stone the builders rejected",
            body:
              "Matthew uses the psalm quotation not as decoration but as an interpretive key for the whole collision between Jesus and the leaders in Jerusalem."
          }
        ]
      },
      22: {
        title: "Parables and questions in the temple",
        summary:
          "Matthew 22 continues the Jerusalem confrontations through the wedding banquet parable and a series of legal and political questions put to Jesus.",
        sceneTitle: "The wisdom contest in Jerusalem",
        sceneSummary:
          "Invitations are refused, a guest is exposed, Caesar's coin is produced, resurrection is debated, and the law is gathered into love of God and neighbor.",
        focusWords: ["invite", "wedding", "Caesar", "love"],
        differences: [
          {
            title: "Render to Caesar",
            body:
              "The saying is not a neat separation of religion and politics. Jesus answers by exposing competing claims of image, loyalty, and belonging."
          },
          {
            title: "On these two commandments",
            body:
              "Matthew presents love of God and neighbor not as a reduction of the law into something easier, but as its living center and summary."
          }
        ]
      },
      23: {
        title: "Woes against performative religion",
        summary:
          "Matthew 23 is a fierce public denunciation of scribes and Pharisees whose visible piety conceals injustice, pride, and resistance to God's messengers.",
        sceneTitle: "Judgment on religious display",
        sceneSummary:
          "The chapter turns repeated woes into a kind of prophetic hammer. External honor, enlarged symbols, and polished surfaces are exposed as masks that hide inner ruin.",
        focusWords: ["woe", "hypocrite", "justice", "Jerusalem"],
        differences: [
          {
            title: "Hypocrite",
            body:
              "The word originally evokes staged performance. Matthew's accusation is not mere inconsistency but spirituality that has become theatrical."
          },
          {
            title: "Weightier matters",
            body:
              "Jesus does not deny tithing minor herbs. He condemns a pattern in which precision on the margins excuses the neglect of justice, mercy, and faithfulness."
          }
        ]
      },
      24: {
        title: "The Olivet discourse",
        summary:
          "Matthew 24 places the disciples before Jesus' long discourse about the temple, tribulation, vigilance, and the coming of the Son of Man.",
        sceneTitle: "Watchfulness from the Mount of Olives",
        sceneSummary:
          "The chapter moves through upheaval, deception, endurance, and delayed expectation. Images of collapse are repeatedly joined to commands for patient alertness.",
        focusWords: ["watch", "endure", "coming", "Son of Man"],
        differences: [
          {
            title: "This generation",
            body:
              "Readers have long debated how narrowly or broadly to hear the phrase. Matthew leaves the saying close to historical urgency while also embedding it in a larger apocalyptic horizon."
          },
          {
            title: "Watch therefore",
            body:
              "Watchfulness here is not panic. It is disciplined readiness in a time when dates cannot be mastered and false certainty is dangerous."
          }
        ]
      },
      25: {
        title: "Readiness, stewardship, and judgment",
        summary:
          "Matthew 25 develops the themes of waiting and accountability through the ten virgins, the talents, and the judgment of the nations.",
        sceneTitle: "Parables of delayed arrival",
        sceneSummary:
          "Each unit tests preparedness in a different way. Oil must be ready before midnight, entrusted wealth must be used faithfully, and the king is finally met in the least visible neighbors.",
        focusWords: ["ready", "talents", "least of these", "inherit"],
        differences: [
          {
            title: "Talents",
            body:
              "Modern readers often hear 'talent' as natural ability, but in the parable it is first a very large sum of money entrusted to servants."
          },
          {
            title: "The least of these",
            body:
              "Matthew's phrase can be read narrowly for Jesus' vulnerable brothers or more broadly for those in need; either way, the chapter refuses to separate final judgment from enacted mercy."
          }
        ]
      },
      26: {
        title: "Anointing, supper, and Gethsemane",
        summary:
          "Matthew 26 moves from plot and anointing to the Passover meal, the agony of Gethsemane, betrayal, arrest, and Peter's denial.",
        sceneTitle: "The night of surrender and failure",
        sceneSummary:
          "The chapter is long and intimate. Love and treachery share the same table, prayer wrestles with impending violence, and even the closest disciple collapses under pressure.",
        focusWords: ["covenant", "watch", "cup", "deny"],
        differences: [
          {
            title: "My blood of the covenant",
            body:
              "Matthew keeps sacrificial and covenant language tightly joined here, so the meal interprets the cross before the arrest has even begun."
          },
          {
            title: "Watch with me",
            body:
              "The failure in Gethsemane is not only physical sleepiness. It reveals how unprepared the disciples are to remain present in the hour of testing."
          }
        ],
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
        term: "эвфюс",
        aliases: ["эвфюс", "euthys"],
        meta: "греческое слово у Марка: сразу, тотчас",
        description:
          "Характерное для Марка слово, которое постоянно ускоряет повествование и подчёркивает срочность действия."
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
            term: "деуте описо му",
            aliases: ["деуте описо му", "deute opiso mou"],
            meta: "греческое выражение: идите за Мной",
            description:
              "Не просто просьба идти следом, а приглашение к ученичеству, общей дороге и новой верности."
          },
          {
            term: "халиеи антропон",
            aliases: ["халиеи антропон", "halieis anthropon"],
            meta: "греческое выражение: ловцы людей",
            description:
              "Марк сохраняет образ рыбаков, но меняет его смысл: прежнее ремесло становится образом собирания людей к жизни."
          },
          {
            term: "эвфюс",
            aliases: ["эвфюс", "euthys"],
            meta: "греческое слово у Марка: сразу, тотчас",
            description:
              "Ключевое слово Марка, задающее скорость повествования и ощущение, что всё происходит без промедления."
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
        ],
        verseArt: {
          9: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Baptism%20of%20Christ%20%28Verrocchio%20and%20Leonardo%29.jpg",
            credit: "Andrea del Verrocchio and Leonardo da Vinci, public-domain image via Wikimedia Commons",
            caption:
              "Mark 1:9 names the baptism itself, so Verrocchio and Leonardo's Baptism of Christ serves as a natural verse-level match."
          },
          13: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Ary%20Scheffer%20-%20The%20Temptation%20of%20Christ%20%281854%29.jpg",
            credit: "Ary Scheffer, public-domain image via Wikimedia Commons",
            caption:
              "Mark 1:13 compresses the wilderness testing into a stark scene, and Scheffer's Temptation of Christ fits that concentrated struggle."
          }
        }
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
      5: {
        verseArt: {
          13: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Briton%20Riviere%20%281840-1920%29%20-%20The%20Miracle%20of%20the%20Gaderene%20Swine%20-%20N01515%20-%20National%20Gallery.jpg",
            credit: "Briton Riviere, public-domain image via Wikimedia Commons",
            caption:
              "Mark 5:13 reaches the violent rush of the swine, and Riviere's Gaderene Swine gives that exact moment a rare, specific painting."
          },
          41: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Peter%20De%20Witte%20%28Candid%29%20-%20Raising%20of%20Jairus%E2%80%99%20Daughter%20from%20the%20Dead%20-%20O%2010652%20-%20National%20Gallery%20Prague.jpg",
            credit: "Peter Candid (Peter de Witte), public-domain image via Wikimedia Commons",
            caption:
              "Mark 5:41 holds the touch and command at Jairus's house, and Peter Candid's scene aligns closely with that awakening moment."
          }
        }
      },
      6: {
        verseArt: {
          41: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacopo%20Tintoretto%20-%20The%20Miracle%20of%20the%20Loaves%20and%20Fishes%20-%20WGA22566.jpg",
            credit: "Jacopo Tintoretto, public-domain image via Wikimedia Commons",
            caption:
              "Mark 6:41 turns on taking, blessing, breaking, and giving, and Tintoretto's loaves-and-fishes painting works well at that verse."
          },
          48: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20walking%20on%20the%20water%2C%20Henry%20Ossawa%20Tanner.jpg",
            credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
            caption:
              "Mark 6:48 names Jesus coming toward the boat on the sea, which Tanner renders with the right mixture of distance, night, and awe."
          }
        }
      },
      9: {
        verseArt: {
          2: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bellini%20Transfiguration.jpg",
            credit: "Giovanni Bellini, public-domain image via Wikimedia Commons",
            caption:
              "Mark 9:2 introduces the transfiguration itself, and Bellini's image remains one of the clearest visual companions to that revelation."
          }
        }
      },
      10: {
        verseArt: {
          16: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20Blessing%20the%20Children%20%28SM%201723%29.png",
            credit: "Lucas Cranach the Elder, public-domain image via Wikimedia Commons",
            caption:
              "Mark 10:16 is the embrace and blessing of the children, so Cranach's painting fits the verse with unusual precision."
          },
          52: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/William%20Blake%20-%20Christ%20Giving%20Sight%20to%20Bartimaeus%20-%20Google%20Art%20Project.jpg",
            credit: "William Blake, public-domain image via Wikimedia Commons",
            caption:
              "Mark 10:52 names Bartimaeus receiving sight and following on the road, and Blake gives that healing a direct visual counterpart."
          }
        }
      },
      11: {
        verseArt: {
          7: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Giotto%20di%20Bondone%20-%20No.%2026%20Scenes%20from%20the%20Life%20of%20Christ%20-%2010.%20Entry%20into%20Jerusalem%20-%20WGA09206.jpg",
            credit: "Giotto, public-domain image via Wikimedia Commons",
            caption:
              "Mark 11:7 places Jesus on the colt before the city, and Giotto's Entry into Jerusalem is a strong verse-level anchor for that approach."
          }
        }
      },
      12: {
        verseArt: {
          42: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/John%20Everett%20Millais%20%281829-1896%29%20-%20A%20Widow%27s%20Mite%20-%201891P26%20-%20Birmingham%20Museums%20Trust.jpg",
            credit: "John Everett Millais, public-domain image via Wikimedia Commons",
            caption:
              "Mark 12:42 isolates the widow's small offering, and Millais gives that exact act a focused and memorable painting."
          }
        }
      },
      14: {
        verseArt: {
          3: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Polidoro%20Lanzani%20-%20Salbung%20Christi%20in%20Bethanien%20GG%2051.jpg",
            credit: "Polidoro Lanzani, public-domain image via Wikimedia Commons",
            caption:
              "Mark 14:3 is the Bethany anointing itself, and Lanzani's Anointing of Christ in Bethany is an unusually exact match."
          },
          22: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20The%20Last%20Supper%20high%20res.jpg",
            credit: "Leonardo da Vinci, public-domain image via Wikimedia Commons",
            caption:
              "Mark 14:22 reaches the bread-saying of the supper, and Leonardo's mural remains the most instantly legible visual pairing."
          },
          35: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Andrea%20Mantegna%20036.jpg",
            credit: "Andrea Mantegna, public-domain image via Wikimedia Commons",
            caption:
              "Mark 14:35 narrows to Jesus praying in Gethsemane, and Mantegna's Agony in the Garden catches the solitude and pressure of that moment."
          },
          72: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Denial%20of%20St.%20Peter%20-%20Gerard%20Seghers%20-%20Google%20Cultural%20Institute.jpg",
            credit: "Gerard Seghers, public-domain image via Wikimedia Commons",
            caption:
              "Mark 14:72 is Peter's collapse under the cockcrow, and Seghers gives that recognition scene a compelling visual form."
          }
        }
      },
      15: {
        verseArt: {
          17: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Titian%20-%20Christ%20crowned%20with%20Thorns%20-%20Louvre.jpg",
            credit: "Titian, public-domain image via Wikimedia Commons",
            caption:
              "Mark 15:17 names the crowning with thorns, and Titian's painting makes that humiliation visible without diffusing its cruelty."
          },
          24: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crucifixion%20of%20Christ%20%28circa%201490%29.jpg",
            credit: "Master from Nuremberg or Bamberg, public-domain image via Wikimedia Commons",
            caption:
              "Mark 15:24 names the crucifixion with Mark's stark brevity, so a direct crucifixion image supports the verse without softening it."
          },
          46: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Caravaggio%20-%20Entombment%20of%20Christ.jpg",
            credit: "Caravaggio, public-domain image via Wikimedia Commons",
            caption:
              "Mark 15:46 turns to wrapping and laying Jesus in the tomb, and Caravaggio's Entombment gives that burial scene a strong visual companion."
          }
        }
      },
      16: {
        verseArt: {
          6: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Annibale%20Carracci%20-%20Holy%20Women%20at%20Christ%27%20s%20Tomb%20-%20WGA4454.jpg",
            credit: "Annibale Carracci, public-domain image via Wikimedia Commons",
            caption:
              "Mark 16:6 is the angelic announcement at the empty tomb, and Carracci's Holy Women at Christ's Tomb matches that scene closely."
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
        art: {
          src: "https://commons.wikimedia.org/wiki/Special:FilePath/Nicodemus%20Visiting%20Jesus%2C%20by%20Henry%20Ossawa%20Tanner%20adjusted3.jpg",
          credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
          caption:
            "Tanner's Nicodemus painting fits John 3 especially well, since the chapter opens with the night visit and unfolds that private conversation at length."
        },
        verseArt: {
          2: {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Nicodemus%20Visiting%20Jesus%2C%20by%20Henry%20Ossawa%20Tanner%20adjusted3.jpg",
            credit: "Henry Ossawa Tanner, public-domain image via Wikimedia Commons",
            caption:
              "John 3:2 is Nicodemus coming to Jesus by night, and Tanner's painting gives that searching conversation a stronger visual match."
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
        [
          ...getBookSpecificGlossaryEntries(bookId, chapterNumber),
          ...buildRareGlossaryEntries(russianChapterTexts)
        ]
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

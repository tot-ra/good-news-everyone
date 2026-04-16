export const commentarySourceLibrary = {
  catena: {
    id: "catena",
    title: "Catena Bible",
    tradition: "Святые отцы и классические комментарии",
    accent: "var(--gold)"
  },
  azbyka: {
    id: "azbyka",
    title: "Азбука веры",
    tradition: "Православная библиотека",
    accent: "var(--red-earth)"
  },
  biblehub: {
    id: "biblehub",
    title: "Bible Hub",
    tradition: "Свод разножанровых комментариев",
    accent: "#58727d"
  }
};

function commentary({
  id,
  sourceId,
  author,
  authorShort,
  era,
  role,
  summary,
  href
}) {
  return {
    id,
    sourceId,
    author,
    authorShort,
    era,
    role,
    summary,
    href
  };
}

export const verseCommentaryLibrary = {
  "mark:1:1": [
    commentary({
      id: "mark-1-1-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин замечает, что Марк начинает не с Рождества, а сразу с явления благой вести. Такой старт делает весь текст книгой действия, где Христос сразу входит в историю как уже пришедший Господь.",
      href: "https://catenabible.com/mk/1/1"
    }),
    commentary({
      id: "mark-1-1-bede",
      sourceId: "catena",
      author: "Беда Достопочтенный",
      authorShort: "Бд",
      era: "VIII век",
      role: "Западный толкователь",
      summary:
        "У Беды начало Евангелия звучит как начало нового творения: как Бытие открывает старый мир, так Марк открывает новую историю спасения во Христе.",
      href: "https://catenabible.com/mk/1/1"
    }),
    commentary({
      id: "mark-1-1-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт читает слово «Евангелие» как не просто жанр, а саму радостную весть о примирении человека с Богом. На первом стихе это помогает увидеть, что книга начинается с дара, а не только с рассказа.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-marka/1"
    }),
    commentary({
      id: "mark-1-1-kineshemsky",
      sourceId: "azbyka",
      author: "Еп. Василий Кинешемский",
      authorShort: "ВК",
      era: "XX век",
      role: "Русский толкователь",
      summary:
        "У Василия Кинешемского первая строка звучит как ответ измученному миру: Евангелие приходит не украшать религиозную жизнь, а спасать и оживлять ее.",
      href: "https://azbyka.ru/otechnik/Vasilij_Kineshemskij/besedy-na-evangelie-ot-marka/1"
    }),
    commentary({
      id: "mark-1-1-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание, что «евангелие» здесь уже почти становится именем самого повествования. Стих стоит на границе между проповедью и книгой.",
      href: "https://biblehub.com/commentaries/mark/1-1.htm"
    }),
    commentary({
      id: "mark-1-1-gill",
      sourceId: "biblehub",
      author: "Джон Гилл",
      authorShort: "Ги",
      era: "XVIII век",
      role: "Баптистский экзегет",
      summary:
        "Гилл подчеркивает, что Марк говорит не об отвлеченной идее, а о Евангелии «Иисуса Христа, Сына Божия», то есть сразу связывает радостную весть с личностью и достоинством Христа.",
      href: "https://biblehub.com/commentaries/mark/1-1.htm"
    }),
    commentary({
      id: "mark-1-1-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия на Bible Hub читает этот стих как краткий заголовок всей книги: читателю заранее дан ключ, что дальше будет разворачиваться история мессианского достоинства Иисуса.",
      href: "https://biblehub.com/commentaries/mark/1-1.htm"
    })
  ],
  "mark:1:2": [
    commentary({
      id: "lapide-prophets",
      sourceId: "catena",
      author: "Корнелий а Ляпиде",
      authorShort: "Ля",
      era: "XVII век",
      role: "Католический экзегет",
      summary:
        "Он поясняет, что Марк соединяет здесь Малахию и Исаию, а Исаию выдвигает на первый план, потому что голос в пустыне открывает сам вход в евангельскую историю.",
      href: "https://catenabible.com/mk/1/1"
    }),
    commentary({
      id: "theophylact-messenger",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "В традиционном православном толковании Иоанн назван ангелом не по природе, а по образу жизни и святости: он готовит не дорогу ногам, а сердца к принятию Мессии.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-marka/"
    })
  ],
  "mark:1:17": [
    commentary({
      id: "benson-fishers",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон читает образ «ловцов человеков» как призвание втягивать людей в жизнь Церкви сетью благой вести. Для интерфейса это хороший тип комментария: короткий, образный и сразу понятный.",
      href: "https://biblehub.com/commentaries/mark/1-17.htm"
    }),
    commentary({
      id: "exp-greek-become",
      sourceId: "biblehub",
      author: "Expositor's Greek Testament",
      authorShort: "EG",
      era: "XIX век",
      role: "Филологический комментарий",
      summary:
        "Здесь особенно важно слово «сделаю вас стать»: ученики не появляются готовыми, а формируются постепенно. Это ценный акцент именно рядом со стихом, потому что помогает заметить динамику глагола.",
      href: "https://biblehub.com/commentaries/mark/1-17.htm"
    }),
    commentary({
      id: "catena-calling",
      sourceId: "catena",
      author: "Катена",
      authorShort: "Ca",
      era: "свод",
      role: "Патристическая подборка",
      summary:
        "Святоотеческая линия здесь обычно читает призвание как переход от ремесла к ученичеству: тот же образ рыбной ловли сохраняется, но цель становится спасительной и обращённой к людям.",
      href: "https://catenabible.com/mk/1/17"
    })
  ],
  "mark:1:18": [
    commentary({
      id: "benson-straightway",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон подчёркивает immediacy ответа: ученики оставляют сети не после длинного расчёта, а на зов. Это хорошо продолжает любимое марковское «тотчас» как тему всей книги.",
      href: "https://biblehub.com/commentaries/mark/1-17.htm"
    })
  ],
  "mark:15:34": [
    commentary({
      id: "mark-15-34-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин видит здесь не распад Троицы, а голос Христа, говорящего от лица нашей смертной природы. Стих открывает глубину воплощения: Он входит даже в опыт богооставленности, который принадлежал нам.",
      href: "https://catenabible.com/mk/15/34"
    }),
    commentary({
      id: "mark-15-34-jerome",
      sourceId: "catena",
      author: "Иероним Стридонский",
      authorShort: "Ие",
      era: "V век",
      role: "Западный толкователь",
      summary:
        "Иероним связывает крик с 21-м псалмом и тем самым показывает, что страдание Христа не хаотично, а лежит внутри уже данного Писанием пути Мессии.",
      href: "https://catenabible.com/mk/15/34"
    }),
    commentary({
      id: "mark-15-34-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт поясняет, что Христос говорит это как человек и за людей: оставлен не Сын Отцом по Божеству, а наше падшее естество, которое Он взял на Себя ради спасения.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-marka/15"
    }),
    commentary({
      id: "mark-15-34-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин подчеркивает и буквальную трагедию креста, и сознательную отсылку к псалму. Поэтому стих соединяет предельную боль и скрытое свидетельство о грядущем оправдании.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_55/"
    }),
    commentary({
      id: "mark-15-34-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон предостерегает читать стих как утрату любви Отца к Сыну. Скорее здесь открывается тяжесть искупительного страдания, которое Христос переносит до конца.",
      href: "https://biblehub.com/commentaries/mark/15-34.htm"
    }),
    commentary({
      id: "mark-15-34-cambridge",
      sourceId: "biblehub",
      author: "Cambridge Bible",
      authorShort: "Ca",
      era: "XIX век",
      role: "Учебный комментарий",
      summary:
        "Кембриджский комментарий делает важный филологический акцент: Марк сохраняет арамейские слова, чтобы передать документальную резкость момента и живое звучание крика.",
      href: "https://biblehub.com/commentaries/mark/15-34.htm"
    }),
    commentary({
      id: "mark-15-34-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия видит в этом крике вершину уничижения Христа: Он принимает не только смерть, но и весь мрак человеческого опыта, чтобы ни одна тьма не осталась без Его присутствия.",
      href: "https://biblehub.com/commentaries/mark/15-34.htm"
    })
  ],
  "matthew:5:3": [
    commentary({
      id: "matt-5-3-hilary",
      sourceId: "catena",
      author: "Иларий Пиктавийский",
      authorShort: "Ил",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Иларий видит в «нищих духом» отказ от человеческого самовозвышения. Первая заповедь блаженства поэтому начинается не с силы, а с внутреннего смирения.",
      href: "https://catenabible.com/mt/5/3"
    }),
    commentary({
      id: "matt-5-3-jerome",
      sourceId: "catena",
      author: "Иероним Стридонский",
      authorShort: "Ие",
      era: "V век",
      role: "Западный толкователь",
      summary:
        "Иероним специально оговаривает, что речь не о бедности как несчастье, а о свободно принятой духовной нищете. Это защищает стих от слишком грубого социального упрощения.",
      href: "https://catenabible.com/mt/5/3"
    }),
    commentary({
      id: "matt-5-3-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт читает нищету духа как сокрушение и смиренномудрие, без которых невозможно войти в логику Царства. Для чтения это делает Нагорную проповедь школой сердца, а не только нормой поведения.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-matfeja/5"
    }),
    commentary({
      id: "matt-5-3-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин обращает внимание, что выражение связано с ветхозаветным языком о бедных Господних. Это не слабые люди вообще, а те, кто знает свою нужду перед Богом.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_51/"
    }),
    commentary({
      id: "matt-5-3-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт подчеркивает, что добавка «духом» переносит разговор из экономической плоскости в антропологическую. Христос описывает внутреннее расположение, открытое для Божьего дара.",
      href: "https://biblehub.com/commentaries/matthew/5-3.htm"
    }),
    commentary({
      id: "matt-5-3-poole",
      sourceId: "biblehub",
      author: "Мэтью Пул",
      authorShort: "Пу",
      era: "XVII век",
      role: "Пуританский комментатор",
      summary:
        "Пул связывает нищету духа с отказом надеяться на собственную праведность. Поэтому первая заповедь блаженства уже заранее ведет читателя к благодати.",
      href: "https://biblehub.com/commentaries/matthew/5-3.htm"
    }),
    commentary({
      id: "matt-5-3-jfb",
      sourceId: "biblehub",
      author: "Jamieson-Fausset-Brown",
      authorShort: "JFB",
      era: "XIX век",
      role: "Библейский свод",
      summary:
        "JFB видит здесь основание всех остальных блаженств: пока человек полон собой, он не может принять Царство. Чувство духовной нужды оказывается уже началом богатства.",
      href: "https://biblehub.com/commentaries/matthew/5-3.htm"
    })
  ],
  "matthew:26:26": [
    commentary({
      id: "matt-26-26-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст подчеркивает, что Христос сам дает смысл происходящему за трапезой: хлеб уже нельзя читать как обычный пасхальный знак, потому что Господь относит его к Себе.",
      href: "https://catenabible.com/mt/26/26"
    }),
    commentary({
      id: "matt-26-26-jerome",
      sourceId: "catena",
      author: "Иероним Стридонский",
      authorShort: "Ие",
      era: "V век",
      role: "Западный толкователь",
      summary:
        "Иероним видит в жестах взятия, благословения и преломления установление нового заветного действия. В стихе важно не только слово, но и литургический ритм самого поступка.",
      href: "https://catenabible.com/mt/26/26"
    }),
    commentary({
      id: "matt-26-26-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт особенно подчеркивает, что слова «сие есть Тело Мое» нельзя свести к пустому символу. При этом благодарение Христа показывает и добровольность будущей жертвы.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-matfeja/26"
    }),
    commentary({
      id: "matt-26-26-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин показывает, как Тайная вечеря завершает ветхозаветную Пасху и одновременно преобразует ее. Здесь память об исходе становится участием в личности Христа.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_51/"
    }),
    commentary({
      id: "matt-26-26-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт делает акцент на том, что Иисус интерпретирует Свою смерть заранее. Ученики еще не видят Голгофу, но уже получают язык, которым ее потом поймут.",
      href: "https://biblehub.com/commentaries/matthew/26-26.htm"
    }),
    commentary({
      id: "matt-26-26-barnes",
      sourceId: "biblehub",
      author: "Альберт Барнс",
      authorShort: "Ба",
      era: "XIX век",
      role: "Пресвитерианский комментатор",
      summary:
        "Барнс подчеркивает мемориальный и заветный характер жеста: преломление хлеба связывает учеников в общину, которая будет постоянно возвращаться к кресту как к центру своей памяти.",
      href: "https://biblehub.com/commentaries/matthew/26-26.htm"
    }),
    commentary({
      id: "matt-26-26-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторский комментарий видит здесь соединение дара и призыва: Христос не только отдает Себя, но и учит учеников жить из этого принятого дара дальше.",
      href: "https://biblehub.com/commentaries/matthew/26-26.htm"
    })
  ],
  "luke:2:7": [
    commentary({
      id: "luke-2-7-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл видит в яслях знак снисхождения: Тот, Кто питает мир, Сам ложится в место, откуда питаются бессловесные. Это делает смирение Рождества богословски насыщенным, а не просто трогательным.",
      href: "https://catenabible.com/lk/2/7"
    }),
    commentary({
      id: "luke-2-7-bede",
      sourceId: "catena",
      author: "Беда Достопочтенный",
      authorShort: "Бд",
      era: "VIII век",
      role: "Западный толкователь",
      summary:
        "Беда читает пелены и ясли как знаки подлинного воплощения: Христос приходит не призраком, а в реальную человеческую хрупкость и нужду.",
      href: "https://catenabible.com/lk/2/7"
    }),
    commentary({
      id: "luke-2-7-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт видит в отсутствии места в гостинице образ мира, который не готов принять Бога. Тем сильнее звучит тайна Рождества: слава приходит в отвержение и тесноту.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-luki/2"
    }),
    commentary({
      id: "luke-2-7-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин обращает внимание на историческую простоту сцены. Лука сознательно не украшает рассказ, чтобы величие события раскрылось именно через его внешнюю незаметность.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_53/"
    }),
    commentary({
      id: "luke-2-7-gill",
      sourceId: "biblehub",
      author: "Джон Гилл",
      authorShort: "Ги",
      era: "XVIII век",
      role: "Баптистский экзегет",
      summary:
        "Гилл связывает ясли с мессианской темой доступности: Христос приходит не к немногим избранным, а в пространство, открытое для простых и бедных.",
      href: "https://biblehub.com/commentaries/luke/2-7.htm"
    }),
    commentary({
      id: "luke-2-7-cambridge",
      sourceId: "biblehub",
      author: "Cambridge Bible",
      authorShort: "Ca",
      era: "XIX век",
      role: "Учебный комментарий",
      summary:
        "Кембриджский комментарий подчеркивает реализм словаря Луки: пелены, ясли, отсутствие места. Благодаря этому Рождество не растворяется в символике, а стоит в конкретном мире.",
      href: "https://biblehub.com/commentaries/luke/2-7.htm"
    }),
    commentary({
      id: "luke-2-7-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия читает этот стих как вечный переворот ценностей: небесное величие становится узнаваемым не в роскоши, а в бедной близости к человеку.",
      href: "https://biblehub.com/commentaries/luke/2-7.htm"
    })
  ],
  "luke:15:20": [
    commentary({
      id: "luke-15-20-lapide",
      sourceId: "catena",
      author: "Корнелий а Ляпиде",
      authorShort: "Ля",
      era: "XVII век",
      role: "Католический экзегет",
      summary:
        "Ляпиде подчеркивает, что отец видит сына издали и как бы опережает его покаяние. В центре притчи оказывается не только возвращение человека, но и стремительность милости Божией.",
      href: "https://catenabible.com/lk/15/20"
    }),
    commentary({
      id: "luke-15-20-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "В патристической линии, переданной на Catena, объятие отца читается как действие самого Божьего милосердия, которое не просто принимает виновного, а восстанавливает его в сыновстве.",
      href: "https://catenabible.com/lk/15/20"
    }),
    commentary({
      id: "luke-15-20-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт подчеркивает, что сын еще идет в унижении, а отец уже бежит к нему. Это редкий евангельский образ, где величие Бога раскрывается как поспешность любви.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-luki/15"
    }),
    commentary({
      id: "luke-15-20-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин отмечает необычность поведения восточного отца, который сам бежит навстречу. Этим притча нарочно ломает социальную норму, чтобы сильнее показать Божье снисхождение.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_53/"
    }),
    commentary({
      id: "luke-15-20-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон видит здесь образ того, как благодать встречает человека раньше, чем он успеет закончить свою исповедь. Покаяние истинно, но оно уже окружено милостью.",
      href: "https://biblehub.com/commentaries/luke/15-20.htm"
    }),
    commentary({
      id: "luke-15-20-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание на телесность жестов: увидел, сжалился, побежал, пал на шею, целовал. Притча говорит о прощении не абстрактно, а через плотную драму встречи.",
      href: "https://biblehub.com/commentaries/luke/15-20.htm"
    }),
    commentary({
      id: "luke-15-20-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия видит в этом стихе сердце всей притчи: раскаяние сына важно, но радость отца оказывается еще больше и определяет весь финал сцены.",
      href: "https://biblehub.com/commentaries/luke/15-20.htm"
    })
  ],
  "john:1:1": [
    commentary({
      id: "john-1-1-alcuin",
      sourceId: "catena",
      author: "Алкуин Йоркский",
      authorShort: "Ал",
      era: "IX век",
      role: "Средневековый толкователь",
      summary:
        "Алкуин замечает, что Иоанн начинает с вечности Слова, чтобы никто не свел Христа только к Его рождению во времени. Пролог сразу поднимает читателя выше Вифлеема к доисторической тайне.",
      href: "https://catenabible.com/jn/1/1"
    }),
    commentary({
      id: "john-1-1-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин любит различать внутреннее слово человека и вечное Слово Божие. Так стих помогает почувствовать, что речь идет не просто о звуке или имени, а о Божественной Личности.",
      href: "https://catenabible.com/jn/1/1"
    }),
    commentary({
      id: "john-1-1-basil",
      sourceId: "catena",
      author: "Василий Великий",
      authorShort: "Ва",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Василий подчеркивает, что это не человеческое слово, возникшее во времени, а Единородный, пребывающий у Отца. Поэтому слово «был» в стихе несет огромную богословскую нагрузку.",
      href: "https://catenabible.com/jn/1/1"
    }),
    commentary({
      id: "john-1-1-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт показывает, что Иоанн нарочно избегает более приземленных формулировок и сразу говорит о Божестве Слова. Для читателя это сразу задает высоту всего Евангелия.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/1"
    }),
    commentary({
      id: "john-1-1-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин связывает пролог Иоанна с полемикой против ранних учений, умалявших достоинство Христа. Уже первый стих звучит как исповедание, а не просто как вступление.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-1-1-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание на напряжение между «у Бога» и «Бог был Слово»: в стихе удерживаются и различие Лиц, и единство Божества.",
      href: "https://biblehub.com/commentaries/john/1-1.htm"
    }),
    commentary({
      id: "john-1-1-meyer",
      sourceId: "biblehub",
      author: "Генрих Майер",
      authorShort: "Ма",
      era: "XIX век",
      role: "Филологический комментарий",
      summary:
        "Майер особенно ценен для близкого чтения греческого текста: он показывает, что грамматика стиха не позволяет растворить Слово ни в безличном принципе, ни в младшем божестве.",
      href: "https://biblehub.com/commentaries/john/1-1.htm"
    })
  ],
  "john:20:28": [
    commentary({
      id: "john-20-28-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл видит в исповедании Фомы исцеление его недавнего неверия. Сомнение не просто исчезает, а превращается в ясное богословское признание воскресшего Христа.",
      href: "https://catenabible.com/jn/20/28"
    }),
    commentary({
      id: "john-20-28-lapide",
      sourceId: "catena",
      author: "Корнелий а Ляпиде",
      authorShort: "Ля",
      era: "XVII век",
      role: "Католический экзегет",
      summary:
        "Ляпиде подчеркивает, что Фома исповедует и человечество, и Божество Христа: «Господь» и «Бог» принадлежат одному и тому же лицу воскресшего Иисуса.",
      href: "https://catenabible.com/jn/20/28"
    }),
    commentary({
      id: "john-20-28-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт замечает, что Фома от прикосновения к ранам становится богословом. Это очень сильный евангельский поворот: путь к исповеданию проходит через воскресшее тело Христа.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/20"
    }),
    commentary({
      id: "john-20-28-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин читает этот стих как одну из самых прямых новозаветных формул божественности Христа. У Иоанна это почти вершина всего повествования.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-20-28-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт подчеркивает личный характер исповедания: Фома говорит не только «Господь» и «Бог», но «мой». Вера достигает здесь не общей формулы, а личного присвоения.",
      href: "https://biblehub.com/commentaries/john/20-28.htm"
    }),
    commentary({
      id: "john-20-28-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон видит в ответе Фомы не восклицание удивления, а сознательное исповедание веры. Это важно для чтения стиха как богословского свидетельства, а не только эмоциональной реакции.",
      href: "https://biblehub.com/commentaries/john/20-28.htm"
    }),
    commentary({
      id: "john-20-28-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия называет это кульминацией пути Фомы и одной из вершин всего Евангелия от Иоанна: сомневающийся ученик произносит одно из самых полных исповеданий во всей книге.",
      href: "https://biblehub.com/commentaries/john/20-28.htm"
    })
  ]
};

export function getVerseCommentaries(bookId, chapterNumber, verseNumber) {
  return verseCommentaryLibrary[`${bookId}:${chapterNumber}:${verseNumber}`] ?? [];
}

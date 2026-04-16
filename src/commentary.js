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
  "john:2:11": [
    commentary({
      id: "john-2-11-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст видит в Кане не просто помощь на свадьбе, а тихое начало откровения. Христос не ищет внешнего эффекта, но через знак постепенно вводит учеников в веру.",
      href: "https://catenabible.com/jn/2/11"
    }),
    commentary({
      id: "john-2-11-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт подчеркивает, что чудо называется знамением, потому что ведет дальше самой воды и вина. Оно открывает славу Христа и учит читать события не только буквально.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/2"
    }),
    commentary({
      id: "john-2-11-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание, что у Иоанна это первое из знаков, а не просто первое чудо. Стих задает важную линию всей книги: дела Иисуса раскрывают Его славу и вызывают веру.",
      href: "https://biblehub.com/commentaries/john/2-11.htm"
    })
  ],
  "john:3:3": [
    commentary({
      id: "john-3-3-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин читает рождение свыше как вход в новую жизнь, которую человек не может произвести из себя сам. Разговор с Никодимом сразу переводит тему спасения из плоскости заслуг в плоскость дара.",
      href: "https://catenabible.com/jn/3/3"
    }),
    commentary({
      id: "john-3-3-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт поясняет, что Христос говорит не о втором телесном рождении, а о духовном обновлении. Именно поэтому Никодим сначала слышит слова буквально и теряется.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/3"
    }),
    commentary({
      id: "john-3-3-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон подчеркивает категоричность стиха: без нового рождения нельзя даже увидеть Царство. Это помогает услышать ответ Иисуса как необходимость, а не как совет для особенно ревностных.",
      href: "https://biblehub.com/commentaries/john/3-3.htm"
    })
  ],
  "john:4:14": [
    commentary({
      id: "john-4-14-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст видит здесь контраст между обычной водой, которая снимает жажду лишь на время, и даром Христа, который меняет самого человека изнутри. Образ источника делает обещание особенно личным и постоянным.",
      href: "https://catenabible.com/jn/4/14"
    }),
    commentary({
      id: "john-4-14-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин читает воду как образ благодати, ведущей к вечной жизни. Важно, что у Иоанна речь идет не просто об утолении нужды, а о появлении внутри человека новой, текущей жизни.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-4-14-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия подчеркивает, что обещанный источник не просто снабжает человека, но начинает бить в нем самом. Это хорошо передает иоанновскую тему внутренне усвоенной благодати.",
      href: "https://biblehub.com/commentaries/john/4-14.htm"
    })
  ],
  "john:5:24": [
    commentary({
      id: "john-5-24-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл подчеркивает, что вера здесь соединена со слушанием слова Сына и доверием Отцу, Который Его послал. Жизнь вечная у Иоанна уже начинается в настоящем, а не только обещается на будущее.",
      href: "https://catenabible.com/jn/5/24"
    }),
    commentary({
      id: "john-5-24-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт отмечает сильный переход в формулировке: верующий уже перешел от смерти в жизнь. Стих звучит как объявление о совершившемся переносе, а не только как дальняя надежда.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/5"
    }),
    commentary({
      id: "john-5-24-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание на глаголы настоящего времени: имеет, не приходит, перешел. Для Иоанна спасение здесь не только будущий приговор, но уже начавшаяся реальность общения с Богом.",
      href: "https://biblehub.com/commentaries/john/5-24.htm"
    })
  ],
  "john:6:35": [
    commentary({
      id: "john-6-35-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин любит объяснять этот стих через движение веры: прийти ко Христу значит уверовать в Него. Образ хлеба говорит о постоянном насыщении души, а не о единичном религиозном переживании.",
      href: "https://catenabible.com/jn/6/35"
    }),
    commentary({
      id: "john-6-35-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин показывает, что после насыщения множества Иисус переводит разговор от земной пищи к Себе Самому. Так знак хлеба становится входом в христологическое откровение.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-6-35-meyer",
      sourceId: "biblehub",
      author: "Генрих Майер",
      authorShort: "Ма",
      era: "XIX век",
      role: "Филологический комментарий",
      summary:
        "Майер подчеркивает параллель между приходом и верой, голодом и жаждой. Стих построен так, чтобы показать полноту удовлетворения, которое Христос дает человеку.",
      href: "https://biblehub.com/commentaries/john/6-35.htm"
    })
  ],
  "john:7:37": [
    commentary({
      id: "john-7-37-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст замечает силу момента: в кульминационный день праздника Иисус встает и громко зовет жаждущих к Себе. На фоне храмовых обрядов это звучит как смелое присвоение мессианского центра.",
      href: "https://catenabible.com/jn/7/37"
    }),
    commentary({
      id: "john-7-37-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт читает жажду как стремление души к истине и благодати. Призыв «иди ко Мне и пей» показывает, что в центре праздника стоит уже не обряд, а Сам Христос.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/7"
    }),
    commentary({
      id: "john-7-37-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт связывает стих с водной символикой праздника Кущей. Поэтому приглашение Иисуса особенно сильно: Он ставит Себя на место того, что обряд только изображал.",
      href: "https://biblehub.com/commentaries/john/7-37.htm"
    })
  ],
  "john:8:12": [
    commentary({
      id: "john-8-12-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин видит в свете мира не внешнее озарение, а истину, которая просвещает внутреннего человека. Следование Христу здесь означает не только видеть свет, но и жить в нем.",
      href: "https://catenabible.com/jn/8/12"
    }),
    commentary({
      id: "john-8-12-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин отмечает возможную связь слов Иисуса с праздничным освещением храма. На этом фоне заявление становится еще острее: Христос называет источником подлинного света не храмовый ритуал, а Себя.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-8-12-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон подчеркивает практическую сторону стиха: тот, кто идет за Христом, не остается во тьме нравственной и духовной. Образ света сразу соединен с путем ученичества.",
      href: "https://biblehub.com/commentaries/john/8-12.htm"
    })
  ],
  "john:9:3": [
    commentary({
      id: "john-9-3-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст замечает, что Христос отвергает упрощенную схему, по которой всякая беда прямо объясняется чьим-то конкретным грехом. В центре стиха не поиск виновного, а грядущее явление дел Божиих.",
      href: "https://catenabible.com/jn/9/3"
    }),
    commentary({
      id: "john-9-3-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт поясняет, что слова Иисуса не отрицают всякую связь страдания с падшим миром, но отвергают механическое обвинение именно этого человека и его родителей. Слепота становится местом откровения милости.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/9"
    }),
    commentary({
      id: "john-9-3-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия видит здесь поворот от теоретического спора к сострадательному действию. Стих помогает читать историю исцеления как откровение Божьего дела, а не как судебное расследование.",
      href: "https://biblehub.com/commentaries/john/9-3.htm"
    })
  ],
  "john:10:11": [
    commentary({
      id: "john-10-11-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин подчеркивает, что добрый пастырь отличается не только заботой, но и готовностью положить жизнь за овец. Образ пастыря у Иоанна сразу несет в себе тень креста.",
      href: "https://catenabible.com/jn/10/11"
    }),
    commentary({
      id: "john-10-11-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт противопоставляет истинного пастыря наемнику: первый любит овец, второй бережет себя. Так стих раскрывает характер мессианского служения Иисуса как жертвенной верности.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/10"
    }),
    commentary({
      id: "john-10-11-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание, что доброта пастыря здесь не абстрактное качество, а красота подлинной пастырской любви, подтвержденной самопожертвованием. Формула ведет прямо к страстям.",
      href: "https://biblehub.com/commentaries/john/10-11.htm"
    })
  ],
  "john:11:25": [
    commentary({
      id: "john-11-25-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл видит в словах к Марфе не отвлеченное учение о будущем воскресении, а откровение о Самом Христе. Он не только дает жизнь, но и Сам является воскресением и жизнью.",
      href: "https://catenabible.com/jn/11/25"
    }),
    commentary({
      id: "john-11-25-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин подчеркивает, что Иисус переводит разговор Марфы от общей веры в последний день к личной вере в Него. Так центр надежды смещается от события к Личности.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-11-25-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон подчеркивает утешительный парадокс стиха: верующий может умереть, но не теряет жизни во Христе. Здесь Иоанн особенно ясно соединяет нынешнюю веру и будущую победу над смертью.",
      href: "https://biblehub.com/commentaries/john/11-25.htm"
    })
  ],
  "john:12:24": [
    commentary({
      id: "john-12-24-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин читает зерно прежде всего христологически: Христос умирает как одно зерно, чтобы принести множество плодов в Своем народе. Крест здесь уже представлен как плодоносящая смерть.",
      href: "https://catenabible.com/jn/12/24"
    }),
    commentary({
      id: "john-12-24-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт показывает, что образ зерна одновременно объясняет крест и задает образ для ученичества. Потеря и смерть у Иоанна не бесплодны, если они соединены со Христом.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/12"
    }),
    commentary({
      id: "john-12-24-meyer",
      sourceId: "biblehub",
      author: "Генрих Майер",
      authorShort: "Ма",
      era: "XIX век",
      role: "Филологический комментарий",
      summary:
        "Майер подчеркивает логику сравнения: сохранение зерна означает одиночество, а его смерть ведет к множественному плоду. Стих готовит читателя к тому, что слава Иисуса пройдет через умирание.",
      href: "https://biblehub.com/commentaries/john/12-24.htm"
    })
  ],
  "john:13:34": [
    commentary({
      id: "john-13-34-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст замечает, что новизна заповеди не в самом слове любовь, а в мере и образце: «как Я возлюбил вас». Христос делает Свою собственную любовь нормой для общины учеников.",
      href: "https://catenabible.com/jn/13/34"
    }),
    commentary({
      id: "john-13-34-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин подчеркивает контекст Тайной вечери: заповедь дана на пороге страстей и потому наполнена конкретным содержанием жертвенной любви. Это не отвлеченный этический принцип, а завещание Учителя.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-13-34-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия отмечает, что эта любовь становится отличительным знаком христианской общины. У Иоанна истина никогда не остается чисто доктринальной, а принимает форму взаимоотношений.",
      href: "https://biblehub.com/commentaries/john/13-34.htm"
    })
  ],
  "john:14:6": [
    commentary({
      id: "john-14-6-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин кратко раскладывает формулу так: Христос как путь ведет нас, как истина наставляет, как жизнь доводит до цели. Стих поэтому читался как почти целая карта христианского пути.",
      href: "https://catenabible.com/jn/14/6"
    }),
    commentary({
      id: "john-14-6-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт подчеркивает, что Иисус не только показывает дорогу к Отцу, но Сам является этой дорогой. Через это стих приобретает исключительную христоцентричность.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/14"
    }),
    commentary({
      id: "john-14-6-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт отмечает внутреннюю связность тройной формулы: путь был бы бесполезен без истины, а истина без жизни не довела бы к Отцу. Вся полнота посредничества собрана в одной строке.",
      href: "https://biblehub.com/commentaries/john/14-6.htm"
    })
  ],
  "john:15:5": [
    commentary({
      id: "john-15-5-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл видит в образе лозы не просто нравственную зависимость, а реальное жизненное единение учеников со Христом. Плод возникает не из автономной силы ветви, а из пребывания в источнике жизни.",
      href: "https://catenabible.com/jn/15/5"
    }),
    commentary({
      id: "john-15-5-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин обращает внимание, что речь идет не о редком религиозном подъеме, а о постоянном пребывании. Последняя фраза стиха особенно сильна: без Христа ученик лишается не части силы, а самой плодотворности.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-15-5-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон подчеркивает практический вывод: всякий духовный плод обязан своему происхождению союзу со Христом. Поэтому стих одновременно утешает и смиряет.",
      href: "https://biblehub.com/commentaries/john/15-5.htm"
    })
  ],
  "john:16:33": [
    commentary({
      id: "john-16-33-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст замечает, что Христос заранее говорит ученикам о скорби не для устрашения, а для укрепления. Мир побежден еще до Голгофы в уверенности слова Иисуса.",
      href: "https://catenabible.com/jn/16/33"
    }),
    commentary({
      id: "john-16-33-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт соединяет обе половины стиха: ученики неизбежно встретят скорбь в мире, но во Христе получают мир и дерзновение. Утешение здесь не отменяет страдание, а удерживает среди него.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/16"
    }),
    commentary({
      id: "john-16-33-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт подчеркивает контраст между «во Мне» и «в мире». Именно эта двойная перспектива делает стих одной из самых насыщенных формул ученичества у Иоанна.",
      href: "https://biblehub.com/commentaries/john/16-33.htm"
    })
  ],
  "john:17:21": [
    commentary({
      id: "john-17-21-cyril",
      sourceId: "catena",
      author: "Кирилл Александрийский",
      authorShort: "Ки",
      era: "V век",
      role: "Святой отец",
      summary:
        "Кирилл читает единство учеников как участие в Божественной любви и истине, а не как простое внешнее согласие. Молитва Иисуса показывает, что церковное единство имеет источник в жизни Отца и Сына.",
      href: "https://catenabible.com/jn/17/21"
    }),
    commentary({
      id: "john-17-21-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин подчеркивает миссионерский нерв стиха: единство учеников связано с тем, чтобы мир уверовал. У Иоанна видимая жизнь общины становится частью свидетельства о посланничестве Христа.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-17-21-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия отмечает, что Иисус просит не о стирании личных различий, а о глубоком единении в Боге. Именно такое единство имеет убедительную силу для мира.",
      href: "https://biblehub.com/commentaries/john/17-21.htm"
    })
  ],
  "john:18:37": [
    commentary({
      id: "john-18-37-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин замечает парадокс суда: обвиняемый перед Пилатом говорит как Царь, пришедший свидетельствовать об истине. Стих показывает достоинство Христа именно в момент Его унижения.",
      href: "https://catenabible.com/jn/18/37"
    }),
    commentary({
      id: "john-18-37-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт подчеркивает, что царство Иисуса раскрывается через истину, а не через политическое насилие. Поэтому ответ Пилату одновременно признает царское достоинство и переопределяет его смысл.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/18"
    }),
    commentary({
      id: "john-18-37-benson",
      sourceId: "biblehub",
      author: "Джозеф Бенсон",
      authorShort: "Бе",
      era: "XVIII век",
      role: "Методистский комментатор",
      summary:
        "Бенсон обращает внимание на последнюю строку стиха: принадлежность истине узнается в способности слышать голос Христа. Судебная сцена внезапно становится духовным испытанием для слушателя.",
      href: "https://biblehub.com/commentaries/john/18-37.htm"
    })
  ],
  "john:19:30": [
    commentary({
      id: "john-19-30-chrysostom",
      sourceId: "catena",
      author: "Иоанн Златоуст",
      authorShort: "Зл",
      era: "IV век",
      role: "Святой отец",
      summary:
        "Златоуст слышит в слове «совершилось» не крик поражения, а объявление о завершении дела. Даже смерть Иисуса у Иоанна сохраняет черты царственной сознательности и власти.",
      href: "https://catenabible.com/jn/19/30"
    }),
    commentary({
      id: "john-19-30-lopukhin",
      sourceId: "azbyka",
      author: "А. П. Лопухин",
      authorShort: "Лп",
      era: "XIX век",
      role: "Русский библеист",
      summary:
        "Лопухин подчеркивает, что здесь завершается исполнение воли Отца и ветхозаветных предначертаний. Крест у Иоанна не просто страдание, но доведение миссии до полноты.",
      href: "https://azbyka.ru/otechnik/Lopuhin/tolkovaja_biblija_54/"
    }),
    commentary({
      id: "john-19-30-ellicott",
      sourceId: "biblehub",
      author: "Чарльз Элликотт",
      authorShort: "Эл",
      era: "XIX век",
      role: "Англиканский комментатор",
      summary:
        "Элликотт обращает внимание на последовательность жестов: Иисус произносит слово, склоняет голову и предает дух. Повествование подчеркивает добровольность и завершенность Его исхода.",
      href: "https://biblehub.com/commentaries/john/19-30.htm"
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
  ],
  "john:21:15": [
    commentary({
      id: "john-21-15-augustine",
      sourceId: "catena",
      author: "Августин",
      authorShort: "Авг",
      era: "V век",
      role: "Святой отец",
      summary:
        "Августин видит в троекратном вопросе Иисуса исцеление троекратного отречения Петра. Любовь здесь становится не просто чувством, а основанием пастырского поручения.",
      href: "https://catenabible.com/jn/21/15"
    }),
    commentary({
      id: "john-21-15-theophylact",
      sourceId: "azbyka",
      author: "Блж. Феофилакт Болгарский",
      authorShort: "ФБ",
      era: "XI век",
      role: "Святой отец",
      summary:
        "Феофилакт подчеркивает, что Христос сначала спрашивает о любви, а уже потом вверяет овец. В иоанновской логике подлинное руководство Церковью вырастает из личной привязанности ко Христу.",
      href: "https://azbyka.ru/otechnik/Feofilakt_Bolgarskij/tolkovanie-na-evangelie-ot-ioanna/21"
    }),
    commentary({
      id: "john-21-15-pulpit",
      sourceId: "biblehub",
      author: "Pulpit Commentary",
      authorShort: "Pu",
      era: "XIX век",
      role: "Пасторский комментарий",
      summary:
        "Пасторская линия подчеркивает мягкость восстановления Петра: публичное поручение отвечает на публичное падение. Финал Евангелия превращает провал ученика в зрелое служение.",
      href: "https://biblehub.com/commentaries/john/21-15.htm"
    })
  ]
};

export function getVerseCommentaries(bookId, chapterNumber, verseNumber) {
  return verseCommentaryLibrary[`${bookId}:${chapterNumber}:${verseNumber}`] ?? [];
}

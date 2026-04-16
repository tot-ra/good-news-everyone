import fs from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.resolve(
  process.cwd(),
  "src/data/assessments/matthew-art-assessment.json"
);
const MATTHEW_PATH = path.resolve(process.cwd(), "src/data/books/matthew.json");
const matthew = JSON.parse(await fs.readFile(MATTHEW_PATH, "utf8"));

const artworks = {
  annunciation: {
    id: "annunciation",
    title: "The Annunciation",
    artist: "Henry Ossawa Tanner",
    year: "1898",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Henry_Ossawa_Tanner_-_The_Annunciation.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Henry%20Ossawa%20Tanner%20-%20The%20Annunciation.jpg"
  },
  josephDream: {
    id: "josephDream",
    title: "Joseph's Dream",
    artist: "Rembrandt and workshop",
    year: "1645/1646",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_Dream_of_Joseph.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt_Dream_of_Joseph.jpg"
  },
  magi: {
    id: "magi",
    title: "Adoration of the Magi",
    artist: "Peter Paul Rubens",
    year: "1609, later reworked 1628/1629",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:La_adoraci%C3%B3n_de_los_Reyes_Magos_(Rubens,_Prado).jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/La%20adoraci%C3%B3n%20de%20los%20Reyes%20Magos%20%28Rubens%2C%20Prado%29.jpg"
  },
  flightEgypt: {
    id: "flightEgypt",
    title: "Flight into Egypt",
    artist: "Titian",
    year: "circa 1508",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Titian_-_Flight_into_Egypt,_Circa_1508FXD.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Titian%20-%20Flight%20into%20Egypt%2C%20Circa%201508FXD.jpg"
  },
  massacreInnocents: {
    id: "massacreInnocents",
    title: "Massacre of the Innocents",
    artist: "Pieter Bruegel the Elder",
    year: "1565/1567",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_Massacre_of_the_Innocents_-_Google_Art_Project.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pieter%20Bruegel%20the%20Elder%20-%20Massacre%20of%20the%20Innocents%20-%20Google%20Art%20Project.jpg"
  },
  baptism: {
    id: "baptism",
    title: "The Baptism of Christ",
    artist: "Andrea del Verrocchio and Leonardo da Vinci",
    year: "circa 1470/1475",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:The_Baptism_of_Christ_(Verrocchio_and_Leonardo).jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Baptism%20of%20Christ%20%28Verrocchio%20and%20Leonardo%29.jpg"
  },
  temptation: {
    id: "temptation",
    title: "Temptations of Christ",
    artist: "Sandro Botticelli",
    year: "1481/1482",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_036.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sandro%20Botticelli%20036.jpg"
  },
  callingPeterAndrew: {
    id: "callingPeterAndrew",
    title: "The Calling of St. Peter and St. Andrew",
    artist: "Pietro da Cortona",
    year: "1630s",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Pietro_da_Cortona_-_Calling_of_St._Peter_and_St._Andrew.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pietro%20da%20Cortona%20-%20Calling%20of%20St.%20Peter%20and%20St.%20Andrew.jpg"
  },
  sermonMount: {
    id: "sermonMount",
    title: "The Sermon on the Mount",
    artist: "Carl Heinrich Bloch",
    year: "1877",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Bloch-SermonOnTheMount.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bloch-SermonOnTheMount.jpg"
  },
  stormGalilee: {
    id: "stormGalilee",
    title: "Christ in the Storm on the Sea of Galilee",
    artist: "Rembrandt",
    year: "1633",
    commonsPage:
      "https://commons.wikimedia.org/wiki/Category:Christ_in_the_Storm_on_the_Sea_of_Galilee_(Rembrandt)",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20Christ%20in%20the%20Storm%20on%20the%20Lake%20of%20Galilee.jpg"
  },
  callingMatthew: {
    id: "callingMatthew",
    title: "The Calling of Saint Matthew",
    artist: "Caravaggio",
    year: "1599/1600",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:The_Calling_of_Saint_Matthew_by_Carvaggio.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Calling%20of%20Saint%20Matthew%20by%20Carvaggio.jpg"
  },
  loavesFishes: {
    id: "loavesFishes",
    title: "The Miracle of the Loaves and Fishes",
    artist: "Jacopo Tintoretto",
    year: "1545/1550",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Jacopo_Tintoretto_-_The_Miracle_of_the_Loaves_and_Fishes_-_WGA22566.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jacopo%20Tintoretto%20-%20The%20Miracle%20of%20the%20Loaves%20and%20Fishes%20-%20WGA22566.jpg"
  },
  walkingWater: {
    id: "walkingWater",
    title: "Walking on Water",
    artist: "Ivan Aivazovsky",
    year: "1888",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Po_vodam_1888.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Po%20vodam%201888.jpg"
  },
  keysPeter: {
    id: "keysPeter",
    title: "Christ Handing the Keys to St. Peter",
    artist: "Pietro Perugino",
    year: "1481/1482",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Christ_Handing_the_Keys_to_St._Peter_by_Pietro_Perugino.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20Handing%20the%20Keys%20to%20St.%20Peter%20by%20Pietro%20Perugino.jpg"
  },
  transfiguration: {
    id: "transfiguration",
    title: "Transfiguration",
    artist: "Raphael",
    year: "1516/1520",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Raphael_-_The_Transfiguration_-_Google_Art_Project.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Raphael%20-%20The%20Transfiguration%20-%20Google%20Art%20Project.jpg"
  },
  entryJerusalem: {
    id: "entryJerusalem",
    title: "Entry into Jerusalem",
    artist: "Giotto di Bondone",
    year: "circa 1305",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Giotto_-_Scrovegni_-_-26-_-_Entry_into_Jerusalem2.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Giotto%20-%20Scrovegni%20-%20-26-%20-%20Entry%20into%20Jerusalem2.jpg"
  },
  cleansingTemple: {
    id: "cleansingTemple",
    title: "Christ Driving the Money Changers from the Temple",
    artist: "El Greco",
    year: "circa 1600",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:El_Greco_Christ_Driving_the_Money_Changers_from_the_Temple.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/El%20Greco%20Christ%20Driving%20the%20Money%20Changers%20from%20the%20Temple.jpg"
  },
  lastJudgment: {
    id: "lastJudgment",
    title: "The Last Judgment",
    artist: "Michelangelo",
    year: "1536/1541",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Last_Judgement_by_Michelangelo.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Last%20Judgement%20by%20Michelangelo.jpg"
  },
  lastSupper: {
    id: "lastSupper",
    title: "The Last Supper",
    artist: "Leonardo da Vinci",
    year: "1495/1498",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_(1452-1519)_-_The_Last_Supper_(1495-1498).jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20%281452-1519%29%20-%20The%20Last%20Supper%20%281495-1498%29.jpg"
  },
  agonyGarden: {
    id: "agonyGarden",
    title: "Agony in the Garden",
    artist: "Giovanni Bellini",
    year: "circa 1458/1460",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Bellini,Giovanni_-_Agony_in_the_Garden_-_National_Gallery.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bellini%2CGiovanni%20-%20Agony%20in%20the%20Garden%20-%20National%20Gallery.jpg"
  },
  kissJudas: {
    id: "kissJudas",
    title: "Kiss of Judas",
    artist: "Giotto di Bondone",
    year: "circa 1305",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Giotto_-_Scrovegni_-_-31-_-_Kiss_of_Judas.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Giotto%20-%20Scrovegni%20-%20-31-%20-%20Kiss%20of%20Judas.jpg"
  },
  beforeCaiaphas: {
    id: "beforeCaiaphas",
    title: "Christ Before Caiaphas",
    artist: "Matthias Stom",
    year: "1630s",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Mattias_Stom,_Christ_before_Caiaphas.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mattias%20Stom%2C%20Christ%20before%20Caiaphas.jpg"
  },
  peterDenial: {
    id: "peterDenial",
    title: "Peter Denying Christ",
    artist: "Rembrandt",
    year: "1660",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Rembrandt_-_Peter_Denying_Christ_-_WGA19121.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt%20-%20Peter%20Denying%20Christ%20-%20WGA19121.jpg"
  },
  beforePilate: {
    id: "beforePilate",
    title: "Christ before Pilate",
    artist: "Jacopo Tintoretto",
    year: "1566/1567",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Jacopo_Tintoretto_-_Christ_before_Pilate_-_WGA22514.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jacopo%20Tintoretto%20-%20Christ%20before%20Pilate%20-%20WGA22514.jpg"
  },
  crucifixion: {
    id: "crucifixion",
    title: "Crucifixion",
    artist: "Master of Nuremberg or Bamberg",
    year: "circa 1420/1430",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Kreuzigung_Christi_(Meister_von_Bamberg).jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kreuzigung%20Christi%20%28Meister%20von%20Bamberg%29.jpg"
  },
  resurrection: {
    id: "resurrection",
    title: "The Resurrection",
    artist: "Piero della Francesca",
    year: "circa 1463/1465",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Resurrection.JPG",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Resurrection.JPG"
  },
  greatCommission: {
    id: "greatCommission",
    title: "Jesus Gives the Great Commission to the Disciples",
    artist: "Master of the Reichenau school",
    year: "circa 1010",
    commonsPage:
      "https://commons.wikimedia.org/wiki/File:Meister_der_Reichenauer_Schule_001.jpg",
    previewSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Meister%20der%20Reichenauer%20Schule%20001.jpg"
  }
};

const exactText =
  "Есть устоявшаяся картина или иконографическая сцена, которая хорошо ложится именно на этот стих.";
const sceneText =
  "Есть подходящая картина всей сцены, но обычно она относится к эпизоду целиком, а не строго к одной строке.";
const weakText =
  "Устойчивой отдельной картины именно для этого стиха обычно нет; лучше не подбирать изображение насильно.";

const rules = [
  { chapter: 1, from: 18, to: 19, rating: "scene", artworkId: "josephDream" },
  { chapter: 1, from: 20, to: 22, rating: "exact", artworkId: "josephDream" },
  { chapter: 1, from: 23, to: 23, rating: "exact", artworkId: "annunciation" },
  { chapter: 1, from: 24, to: 25, rating: "scene", artworkId: "josephDream" },
  { chapter: 2, from: 1, to: 8, rating: "scene", artworkId: "magi" },
  { chapter: 2, from: 9, to: 11, rating: "exact", artworkId: "magi" },
  { chapter: 2, from: 12, to: 12, rating: "scene", artworkId: "magi" },
  { chapter: 2, from: 13, to: 15, rating: "exact", artworkId: "flightEgypt" },
  { chapter: 2, from: 16, to: 18, rating: "exact", artworkId: "massacreInnocents" },
  { chapter: 2, from: 19, to: 23, rating: "scene", artworkId: "josephDream" },
  { chapter: 3, from: 1, to: 12, rating: "scene" },
  { chapter: 3, from: 13, to: 17, rating: "exact", artworkId: "baptism" },
  { chapter: 4, from: 1, to: 11, rating: "exact", artworkId: "temptation" },
  { chapter: 4, from: 18, to: 22, rating: "exact", artworkId: "callingPeterAndrew" },
  { chapter: 5, from: 1, to: 2, rating: "exact", artworkId: "sermonMount" },
  { chapter: 8, from: 23, to: 27, rating: "exact", artworkId: "stormGalilee" },
  { chapter: 9, from: 9, to: 9, rating: "exact", artworkId: "callingMatthew" },
  { chapter: 14, from: 13, to: 21, rating: "exact", artworkId: "loavesFishes" },
  { chapter: 14, from: 22, to: 33, rating: "exact", artworkId: "walkingWater" },
  { chapter: 15, from: 29, to: 39, rating: "scene", artworkId: "loavesFishes" },
  { chapter: 16, from: 13, to: 17, rating: "scene", artworkId: "keysPeter" },
  { chapter: 16, from: 18, to: 19, rating: "exact", artworkId: "keysPeter" },
  { chapter: 16, from: 20, to: 20, rating: "scene", artworkId: "keysPeter" },
  { chapter: 17, from: 1, to: 8, rating: "exact", artworkId: "transfiguration" },
  { chapter: 19, from: 13, to: 15, rating: "scene" },
  { chapter: 21, from: 1, to: 11, rating: "exact", artworkId: "entryJerusalem" },
  { chapter: 21, from: 12, to: 17, rating: "exact", artworkId: "cleansingTemple" },
  { chapter: 25, from: 31, to: 46, rating: "exact", artworkId: "lastJudgment" },
  { chapter: 26, from: 17, to: 29, rating: "exact", artworkId: "lastSupper" },
  { chapter: 26, from: 36, to: 46, rating: "exact", artworkId: "agonyGarden" },
  { chapter: 26, from: 47, to: 56, rating: "exact", artworkId: "kissJudas" },
  { chapter: 26, from: 57, to: 68, rating: "exact", artworkId: "beforeCaiaphas" },
  { chapter: 26, from: 69, to: 75, rating: "exact", artworkId: "peterDenial" },
  { chapter: 27, from: 11, to: 26, rating: "exact", artworkId: "beforePilate" },
  { chapter: 27, from: 32, to: 56, rating: "exact", artworkId: "crucifixion" },
  { chapter: 27, from: 57, to: 61, rating: "scene", artworkId: "crucifixion" },
  { chapter: 28, from: 1, to: 10, rating: "exact", artworkId: "resurrection" },
  { chapter: 28, from: 16, to: 20, rating: "scene", artworkId: "greatCommission" }
];

function parseVerseNumber(raw) {
  return Number.parseInt(String(raw).split("-")[0], 10);
}

function describeRating(rating) {
  if (rating === "exact") return exactText;
  if (rating === "scene") return sceneText;
  return weakText;
}

function getRule(chapter, verse) {
  return rules.find(
    (rule) => rule.chapter === chapter && verse >= rule.from && verse <= rule.to
  );
}

const assessments = [];
const counts = { exact: 0, scene: 0, weak: 0 };

for (const chapter of matthew.chapters) {
  for (const scene of chapter.scenes) {
    for (const verse of scene.verses) {
      const numericVerse = parseVerseNumber(verse.number);
      const rule = getRule(chapter.number, numericVerse);
      const rating = rule?.rating ?? "weak";
      const artwork = rule?.artworkId ? artworks[rule.artworkId] : null;

      counts[rating] += 1;

      assessments.push({
        reference: `Мф ${chapter.number}:${verse.number}`,
        chapter: chapter.number,
        verse: verse.number,
        rating,
        keyEvent: rating === "exact",
        note: describeRating(rating),
        artworkId: artwork?.id ?? null,
        artwork
      });
    }
  }
}

const output = {
  book: "Матфей",
  generatedAt: new Date().toISOString(),
  methodology: {
    scale: {
      exact: "Есть хорошо известная существующая картина, подходящая именно к этому стиху или почти буквально к нему.",
      scene: "Есть хорошая картина эпизода в целом, но она не уникально привязана к одному стиху.",
      weak: "Отдельная подходящая картина для этого стиха обычно не сложилась в традиции."
    },
    note: "Оценка сделана консервативно: для речевых, переходных и генеалогических стихов предпочтён статус weak, чтобы не привязывать иллюстрации искусственно."
  },
  summary: {
    totalVerses: assessments.length,
    exact: counts.exact,
    scene: counts.scene,
    weak: counts.weak
  },
  artworkLibrary: Object.values(artworks),
  assessments
};

await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
await fs.writeFile(OUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Wrote ${OUT_PATH}`);
console.log(output.summary);

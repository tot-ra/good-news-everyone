import assert from "node:assert/strict";
import test from "node:test";

import { findPersonCatalogMatch, getPlaceAliases, peopleCatalog } from "../src/wiki.js";

test("an explicit John son of Zebedee reference wins over an ambiguous name", () => {
  const person = findPersonCatalogMatch("Иоанн", "codex:john-zebedee:17");

  assert.equal(person?.id, "john-zebedee");
  assert.equal(person?.name, "Иоанн, сын Зеведея");
});

test("an unqualified John keeps the existing Baptist fallback", () => {
  assert.equal(findPersonCatalogMatch("Иоанн")?.id, "john-baptist");
});

test("Jesus uses the God-man label and exposes a local reference image", () => {
  const person = findPersonCatalogMatch("Иисус");

  assert.equal(person?.kindLabel, "Богочеловек");
  assert.equal(person?.image?.src, "/reference-images/jesus.jpg");
  assert.ok(person?.image?.alt);
});

test("every catalog person exposes a local reference image with accessible copy", () => {
  for (const person of peopleCatalog) {
    assert.match(person.image?.src ?? "", /^\/reference-images\/[a-z-]+\.jpg$/);
    assert.ok(person.image?.alt, `${person.id} is missing image alt text`);
    assert.ok(person.image?.caption, `${person.id} is missing an image caption`);
  }
});

test("Jeremiah inflections resolve to the prophet catalog entry", () => {
  assert.equal(findPersonCatalogMatch("Иеремию")?.id, "jeremiah");
  assert.equal(findPersonCatalogMatch("Иеремия", "codex:jeremiah:27")?.id, "jeremiah");
});

test("Mary Magdalene stays distinct from Mary of Nazareth", () => {
  assert.equal(findPersonCatalogMatch("Мария Магдалина")?.id, "mary-magdalene");
  assert.equal(findPersonCatalogMatch("Магдалина")?.id, "mary-magdalene");
  assert.equal(findPersonCatalogMatch("Магдалиною")?.id, "mary-magdalene");
  assert.equal(findPersonCatalogMatch("Магдалина Мария")?.id, "mary-magdalene");
  assert.equal(findPersonCatalogMatch("Мария")?.id, "mary");
  assert.equal(findPersonCatalogMatch("Мария", "codex:mary-magdalene:27")?.id, "mary-magdalene");
});

test("Barabbas inflections resolve to a person rather than a place", () => {
  for (const inflection of ["Варавва", "Варавву", "Вараввы"]) {
    assert.equal(findPersonCatalogMatch(inflection)?.id, "barabbas");
  }
});

test("Arimathea exposes the inflection used in the Gospel text", () => {
  const aliases = getPlaceAliases({ id: "arimathea", name: "Аримафея" });

  assert.ok(aliases.includes("Аримафеи"));
});

test("Tyre and Sidon expose the adjectival forms used in Mark 7:24", () => {
  const aliases = getPlaceAliases({ id: "tyre-sidon", name: "Тир и Сидон" });

  assert.ok(aliases.includes("Тирские"));
  assert.ok(aliases.includes("Сидонские"));
});

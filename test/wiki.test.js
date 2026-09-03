import assert from "node:assert/strict";
import test from "node:test";

import { findPersonCatalogMatch, getPlaceAliases } from "../src/wiki.js";

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

test("Jeremiah inflections resolve to the prophet catalog entry", () => {
  assert.equal(findPersonCatalogMatch("Иеремию")?.id, "jeremiah");
  assert.equal(findPersonCatalogMatch("Иеремия", "codex:jeremiah:27")?.id, "jeremiah");
});

test("Barabbas inflections resolve to a person rather than a place", () => {
  for (const inflection of ["Варавва", "Варавву", "Вараввы"]) {
    assert.equal(findPersonCatalogMatch(inflection)?.id, "barabbas");
  }
});

test("Akeldama exposes the Field of Blood inflection used in Matthew 27", () => {
  const aliases = getPlaceAliases({ id: "akeldama", name: "Акелдама" });

  assert.ok(aliases.includes("Полем Крови"));
});

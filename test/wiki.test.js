import assert from "node:assert/strict";
import test from "node:test";

import { findPersonCatalogMatch } from "../src/wiki.js";

test("an explicit John son of Zebedee reference wins over an ambiguous name", () => {
  const person = findPersonCatalogMatch("Иоанн", "codex:john-zebedee:17");

  assert.equal(person?.id, "john-zebedee");
  assert.equal(person?.name, "Иоанн, сын Зеведея");
});

test("an unqualified John keeps the existing Baptist fallback", () => {
  assert.equal(findPersonCatalogMatch("Иоанн")?.id, "john-baptist");
});

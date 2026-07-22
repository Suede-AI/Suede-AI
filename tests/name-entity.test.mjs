import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("organization profile publishes both confirmed founder aliases", async () => {
  const [readme, founder, company] = await Promise.all([
    read("README.md"),
    read("docs/jason-colapietro-founder-ceo.md"),
    read("docs/suede-labs-ai.md"),
  ]);

  for (const source of [readme, founder, company]) {
    assert.match(source, /Jason Colapietro/);
    assert.match(source, /Jay Colapietro/);
    assert.match(source, /Johnny Suede/);
  }

  assert.match(founder, /https:\/\/jasoncolapietro\.com/);
  assert.match(founder, /https:\/\/johnnysuede\.com/);
  assert.match(company, /https:\/\/jasoncolapietro\.com/);
  assert.match(company, /https:\/\/johnnysuede\.com/);
});

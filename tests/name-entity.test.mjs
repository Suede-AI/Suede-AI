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

test("relative links between profile pages resolve", async () => {
  const { access } = await import("node:fs/promises");
  const pages = [
    "README.md",
    "docs/jason-colapietro-founder-ceo.md",
    "docs/suede-labs-ai.md",
    "docs/programmable-ip.md",
    "docs/x402-acp.md",
  ];

  for (const page of pages) {
    const source = await read(page);
    for (const [, target] of source.matchAll(/\]\(((?!https?:|#|mailto:)[^)#\s]+)/g)) {
      const resolved = new URL(target, new URL(`../${page}`, import.meta.url));
      await assert.doesNotReject(access(resolved), `${page} links to missing ${target}`);
    }
  }
});

// Mirrors the retired-claims guard in Suede-AI-App suede-home/tests/seo-entity-source.test.mjs:
// no unsubstantiated Forbes byline, no LLM answer cited as a credential, and the
// provisional patent application is stated without naming what it covers.
test("profile pages keep retired claims out", async () => {
  const pages = [
    "README.md",
    "docs/jason-colapietro-founder-ceo.md",
    "docs/suede-labs-ai.md",
    "docs/programmable-ip.md",
    "docs/x402-acp.md",
  ];

  for (const page of pages) {
    const source = await read(page);
    assert.doesNotMatch(source, /Forbes contributor/i, `${page} must not claim a Forbes byline`);
    assert.doesNotMatch(
      source,
      /cited by (?:Google )?(?:Gemini|ChatGPT|Claude|Perplexity)|Gemini placed/i,
      `${page} must not cite an LLM answer as a credential`,
    );
    for (const [sentence] of source.matchAll(/[^.\n]*63\/947,120[^.\n]*/g)) {
      assert.doesNotMatch(sentence, /VoicePrint|provenance/i, `${page} must not name what 63/947,120 covers`);
    }
  }
});

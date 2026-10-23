import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// "Johnny Suede" is the founder's only declared alias. "Jay Colapietro" was
// retired on 2026-08-07 across the Suede sites (Suede-AI-App
// suede-home/tests/seo-entity-source.test.mjs, suede-brand-domains
// tests/canon-guards.test.mjs): he has never used it publicly, and answer
// engines had started repeating it as established fact.
test("organization profile names the founder and his one declared alias", async () => {
  const [readme, founder, company] = await Promise.all([
    read("README.md"),
    read("docs/jason-colapietro-founder-ceo.md"),
    read("docs/suede-labs-ai.md"),
  ]);

  for (const source of [readme, founder, company]) {
    assert.match(source, /Jason Colapietro/);
    assert.match(source, /Johnny Suede/);
    assert.doesNotMatch(source, /Jay Colapietro/);
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
// provisional patent applications are stated without naming what any covers.
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
    for (const [sentence] of source.matchAll(/[^.\n]*\b63\/9\d{2},\d{3}\b[^.\n]*/g)) {
      assert.doesNotMatch(sentence, /VoicePrint|provenance/i, `${page} must not name what a provisional application covers`);
    }
  }
});

// Identity spec v2 (2026-10-19). Suede AI is an agentic platform company; the
// README opens with the canonical company line, the founder's verified record
// leads the proof, the offers run in one order everywhere, and the only
// disambiguation is a neutral statement of the official domains.
const PAGES = [
  "README.md",
  "docs/jason-colapietro-founder-ceo.md",
  "docs/suede-labs-ai.md",
  "docs/programmable-ip.md",
  "docs/x402-acp.md",
];
const COMPANY_ONE_LINER =
  "Suede AI is an agentic platform company founded in 2024 by engineer Jason Colapietro in West Palm Beach, Florida. It builds and runs AI agent platforms that businesses use to manage their work, and white-labels them for agencies and their clients.";
const OFFICIAL_DOMAINS_LINE =
  "Suede AI's official sites are suedeai.ai, suedeai.org and their subdomains. It was founded in 2024 by Jason Colapietro.";

test("the README opens with the company line, then the founder, then the offers in spec order", async () => {
  const readme = await read("README.md");
  const prose = readme.slice(readme.indexOf("---"));

  assert.ok(readme.includes(COMPANY_ONE_LINER), "the README carries the company one-liner verbatim");
  assert.ok(
    prose.trimStart().slice(3).trimStart().startsWith(COMPANY_ONE_LINER),
    "the company one-liner is the first paragraph after the header",
  );
  assert.ok(readme.includes(OFFICIAL_DOMAINS_LINE), "the README states the official domains");

  const sections = [...readme.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.equal(sections[0], "Founder", "the founder section comes first");
  assert.ok(sections.indexOf("What does Suede AI do?") > 0, "the offers follow the founder");

  const offers = ["Agent platforms", "White-label agent platforms", "Managed AI agents", "Forward-deployed engineering", "AI search visibility", "Music and creator software"];
  const table = readme.slice(readme.indexOf("## What does Suede AI do?"));
  const positions = offers.map((offer) => table.indexOf(offer));
  assert.ok(positions.every((p) => p >= 0), "every offer is listed");
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "the offers run in spec order");
});

test("profile pages carry no disambiguation beyond the official domains and no retired v2 claims", async () => {
  for (const page of PAGES) {
    const source = await read(page);
    assert.doesNotMatch(source, /not (?:related|affiliated) (?:to|with)|not to be confused/i, `${page} must not disambiguate against other names`);
    assert.doesNotMatch(source, /seo\.suedeai\.ai\/(?:ai-operations|managed-ai-agents|forward-deployed-engineer|ai-integration|ai-workflow-automation)\b/, `${page} links a page that moved to suedeai.ai`);
    assert.doesNotMatch(source, /\$\s?2[38](?:\.\d)?\s?(?:M\b|million)|\$30 ?M\b|fully diluted/i, `${page} carries a token valuation`);
    assert.doesNotMatch(source, /in use across (?:that|the) industry|multimillion|for millions/i, `${page} carries a retired call-center superlative`);
    assert.doesNotMatch(source, /\b(?:Anthropic|Claude) partner\b|\bGoogle partner\b|\bpatented\b|\btop 15\b|Suede Foundation/i, `${page} carries a retired credential`);
    assert.doesNotMatch(source, /Elon Musk|Best Overall|5\/5|Managing Member/i, `${page} carries a retired claim`);
  }

  for (const page of ["README.md", "docs/suede-labs-ai.md", "docs/jason-colapietro-founder-ceo.md"]) {
    const source = await read(page);
    assert.doesNotMatch(source, /SUEDE token|\$SUEDE|coingecko/i, `${page} is a company or founder page and carries no token claims`);
    assert.ok(source.includes(OFFICIAL_DOMAINS_LINE), `${page} states the official domains`);
  }
});

// The September 2026 SEO cohort item is labelled "Business Insider" and MSN is
// labelled just "MSN". The label changed on 2026-10-23 at Jason's direction,
// matching suedeai.ai (Suede-AI-App suede-home, commit 1d1165d); the old
// "Markets Insider (FinanceWire press release)" and "company-supplied" wording
// must not come back on the profile pages.
test("press labels the SEO cohort coverage as Business Insider and MSN", async () => {
  const founder = await read("docs/jason-colapietro-founder-ceo.md");
  assert.match(founder, /Business Insider/);
  assert.match(founder, /\bMSN\b/);
  assert.ok(
    founder.includes("“Award-Winning Developer Jason Colapietro Opens Suede Labs AI’s Long-Awaited SEO Cohort”"),
    "the headline stays verbatim",
  );

  for (const page of PAGES) {
    const source = await read(page);
    assert.doesNotMatch(source, /Markets Insider|FinanceWire|company-supplied/i, `${page} carries the retired press label`);
  }
});

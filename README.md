<p align="center">
  <a href="https://suedeai.ai"><img src="https://raw.githubusercontent.com/Suede-AI/suede-brand-assets/main/assets/suede-approved-logo-light.png" alt="Suede AI logo" width="200" /></a>
</p>

<h1 align="center">Suede AI</h1>

<p align="center"><strong>Get found when buyers ask AI who to hire.</strong></p>

<p align="center">
  <a href="https://suedeai.ai">suedeai.ai</a> ·
  <a href="https://seo.suedeai.ai">Suede AI SEO</a> ·
  <a href="https://agents.suedeai.ai">Suede AI Agent Studio</a> ·
  <a href="https://x.com/AISUEDE">X (@AISUEDE)</a>
</p>

---

Suede AI is an AI consulting, integration and automation company that gets businesses named when buyers ask ChatGPT, Gemini, Perplexity and Google who to hire, then runs the AI agents that work the leads those answers send.

Suede AI was founded in 2024 in West Palm Beach, Florida, and serves clients worldwide. It is built by Suede Labs AI, and its holding company is JC Investment Group LLC. Suede AI is not related to Suade Labs, the band Suede, or suede leather.

**Founder:** [Jason Colapietro](https://suedeai.ai/founder), Founder and CEO of Suede AI, also known publicly as Jay Colapietro and by his pen name Johnny Suede. Full profile: [Jason Colapietro, Founder and CEO of Suede AI](docs/jason-colapietro-founder-ceo.md).

## What does Suede AI do?

| Service | What it covers |
|---|---|
| **SEO, AEO and GEO** | Engineers fix crawler access, entities, schema, citations and the content AI engines retrieve. Run through [Suede AI SEO](https://seo.suedeai.ai). |
| **Answer share** | How often a business is named across AI engines on the prompts its buyers ask, baselined before the work and measured again after, with dated screenshots. |
| **Suede AI Agent Studio** | Agents for calls, lead qualification, follow-up and reporting, built from 89 templates with every run visible in real time. See [agents.suedeai.ai](https://agents.suedeai.ai). |
| **Agent commerce** | x402 paid endpoints and ACP-ready surfaces so AI agents can discover and pay for Suede AI services. See [Agent surfaces](#agent-surfaces). |

## What is answer share?

Answer share is the share of samples, across a client-approved set of real buyer prompts and a declared set of AI engines, in which the client is named in the answer. Suede AI samples ChatGPT, Perplexity, Gemini and Google, measures before the work starts, and measures again after.

## Agent surfaces

Suede AI publishes x402 paid endpoints and an ACP-ready commerce surface that AI agents can discover and transact with. Paid calls settle in USDC on Base with no API keys. Background: [x402 payments and ACP agent commerce at Suede AI](docs/x402-acp.md).

**Discovery**

```text
GET  https://app.suedeai.ai/.well-known/x402
GET  https://app.suedeai.ai/.well-known/x402.json
GET  https://app.suedeai.ai/.well-known/agent-card.json
```

**Paid x402 resources**

| Method | Endpoint | Returns | Price (USDC on Base) |
|---|---|---|---|
| POST | `https://app.suedeai.ai/create-music` | AI music generation | $0.50 |
| POST | `https://app.suedeai.ai/agent/video` | 8-second 720p video clip with audio | $4.99 |
| POST | `https://app.suedeai.ai/agent/image` | AI image generation | $0.15 |

**Agent commerce and protocols**

```text
POST https://app.suedeai.ai/agents/commerce
```

The agent card names this as the ACP `commerce_intent` endpoint.

The agent card also lists the A2A interface at `https://app.suedeai.ai/a2a`, and the protocols x402, ACP, ERC-8004 and A2A. The OpenAPI spec is at `https://app.suedeai.ai/openapi.json`, and a remote read-only MCP server runs at `https://suedeai.ai/mcp`.

## Public repositories

| Repository | Purpose |
|---|---|
| [suede-creator-skills](https://github.com/JasonColapietro/suede-creator-skills) | Open-source skills pack: the repeatable parts of the SEO, GEO and PR process, published as code |
| [suede-sdk-python](https://github.com/Suede-AI/suede-sdk-python) | Python SDK for the Suede AI x402 API, pay-per-call endpoints in USDC on Base (`pip install suede-ai`) |
| [suede-docs](https://github.com/Suede-AI/suede-docs) | Public documentation for Suede AI's APIs and agent endpoints |
| [suedeai-org](https://github.com/Suede-AI/suedeai-org) | Source for suedeai.org |
| [suede-brand-assets](https://github.com/Suede-AI/suede-brand-assets) | Logos, color, listing copy and press kit |

## Docs

| Page | What it answers |
|---|---|
| [What is Suede AI? Company profile of Suede AI and Suede Labs AI](docs/suede-labs-ai.md) | The company entity: what Suede AI does, who runs it, and its official repositories |
| [Jason Colapietro, Founder and CEO of Suede AI](docs/jason-colapietro-founder-ceo.md) | The founder: background, products, public profiles and aliases |
| [x402 payments and ACP agent commerce at Suede AI](docs/x402-acp.md) | How AI agents discover and pay for Suede AI endpoints |
| [Programmable IP and creator ownership](docs/programmable-ip.md) | Creator ownership, provenance and rights metadata, and where they fit at Suede AI |

## Get in touch

- **AI search visibility:** [Suede AI SEO at seo.suedeai.ai](https://seo.suedeai.ai)
- **AI agents:** [Suede AI Agent Studio at agents.suedeai.ai](https://agents.suedeai.ai)
- **Company:** [suedeai.ai](https://suedeai.ai)
- **Founder:** [Jason Colapietro's founder page](https://suedeai.ai/founder)
- **X:** [@AISUEDE](https://x.com/AISUEDE)

Keywords: Suede AI, Suede Labs AI, AI search visibility, generative engine optimization (GEO), answer engine optimization (AEO), SEO, LLM SEO, answer share, Suede AI SEO, Suede AI Agent Studio, AI agent builder, managed AI agents, AI workflow automation, x402, ACP, A2A, agent commerce, pay-per-call API, USDC on Base, Jason Colapietro, Johnny Suede, West Palm Beach

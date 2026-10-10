# x402 Payments and ACP Agent Commerce at Suede AI

Suede AI exposes public x402 payment surfaces and an ACP-ready agent commerce endpoint, so AI agents can discover Suede AI's paid music, video and image resources for AI-native media workflows, pay per call in USDC on Base, and transact without API keys.

This page explains what x402 and ACP are, what each Suede AI agent surface does, and where to find the endpoints and tooling. Suede AI is built by Suede Labs AI, and the machine-readable surfaces name the provider as "Suede Labs".

## What is x402?

x402 is an open payment protocol built on the HTTP `402 Payment Required` status code. When a client calls a paid resource, the server answers with its payment requirements, the client pays, and the request goes through with proof of payment attached. There are no API keys to manage.

At Suede AI, x402 payments settle in USDC on Base, and the manifest uses x402 version 2.

## What is ACP?

ACP is the commerce protocol Suede AI lists alongside x402 in its agent card. Where x402 handles payment for a single request, the ACP surface is where an AI agent submits a commerce intent to Suede AI. The agent card names this endpoint as the ACP `commerce_intent` endpoint.

## What does Suede AI expose to AI agents?

Suede AI publishes three kinds of agent surface. The canonical list of full URLs, methods and prices is [Agent surfaces in the Suede AI README](../README.md#agent-surfaces).

### Discovery: the x402 manifest

The x402 manifest is a public JSON document that tells an agent which Suede AI resources are paid, what each one costs, and where payment goes. It is served at two equivalent well-known paths, so clients that look for either one find the same content.

### Identity: the agent card

The agent card describes the Suede AI Agent as a whole. It lists:

- **Skills:** `create_music`, `agent_video` and `agent_image`.
- **Protocols:** x402, ACP, ERC-8004 and A2A.
- **A2A interface:** a JSON-RPC endpoint other agents can call directly.
- **ERC-8004 identity:** agentId 1 on Base mainnet (chainId 8453), registered at `0x9bdcb06c1a1688693767C6A32DE9ca7b17cB4085`.
- **Provider:** Suede Labs, with JC Investment Group LLC as the legal entity.

### Paid resources and commerce

Suede AI offers three paid x402 resources:

- **AI music generation** (text-to-music): `POST /create-music`, $0.50.
- **AI video generation:** an 8-second 720p clip with audio, `POST /agent/video`, $4.99.
- **AI image generation:** `POST /agent/image`, $0.15.

Each call is priced per request and settled in USDC on Base. The ACP commerce endpoint sits next to these resources for agents that transact through a commerce intent.

## How do developers call Suede AI's x402 API?

- **Python:** [suede-sdk-python](https://github.com/Suede-AI/suede-sdk-python) is the Python SDK for Suede AI's public x402 music, video and image resources, settled in USDC on Base with no API keys. Install it with `pip install suede-ai`.
- **Documentation:** [suede-docs](https://github.com/Suede-AI/suede-docs) holds the public documentation for Suede AI's APIs and agent endpoints.
- **Developer hub:** the [Suede AI developer docs](https://suedeai.ai/docs/developers) cover the OpenAPI spec, the remote read-only MCP server, the `@suedeai/mcp-server` and `@suedeai/agents` npm packages (the `suede` CLI), and the `@suedeai/plugin-suede` ElizaOS plugin.

## Can I publish my own pay-per-call agent?

Yes. [Suede AI Agent Studio](https://agents.suedeai.ai) is Suede AI's visual AI agent builder. Agents built there can be published as x402 pay-per-call endpoints that settle in USDC on Base, with no API keys. Pricing is usage cost plus a 5% platform fee.

## Related

- [Agent surfaces in the Suede AI README](../README.md#agent-surfaces): the canonical endpoint list and an overview of services and repositories
- [What is Suede AI? Company profile of Suede AI and Suede Labs AI](./suede-labs-ai.md)
- [Jason Colapietro, Founder and CEO of Suede AI](./jason-colapietro-founder-ceo.md)
- [Programmable IP and creator ownership](./programmable-ip.md)

Keywords: x402 payments, x402 agent payments, HTTP 402 Payment Required, ACP, agent commerce, commerce intent, A2A, ERC-8004, agent card, x402 manifest, pay-per-call API, USDC on Base, AI agent payments, no API keys, AI music API, text-to-music API, text-to-video API, text-to-image API, Suede AI, Suede Labs AI, Suede AI Agent Studio, suede-ai Python SDK

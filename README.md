# Vinyl Tap

Vinyl Tap is a Base Mini App that provides a simple interface for three onchain actions:

- `Tap Beat`
- `Tap Bass`
- `Tap Echo`

The project combines a lightweight frontend, a Solidity contract, and a small set of contract write interactions.

## Repository

https://github.com/SidneyJonson/vinyl-tap.git

## Overview

Vinyl Tap presents a friendly, focused interface for calling three contract functions.

Each button in the app maps directly to one onchain action.

The experience is intentionally minimal so the app stays easy to understand and use.

User-facing messages are written in clear English and avoid exposing low-level technical failure details.

## Features

- Base Mini App experience
- Three onchain tap actions
- Friendly transaction status messages
- English-only visible interface text
- Frontend ABI paired with the Solidity contract
- Native Wagmi configuration
- TypeScript-first Next.js application
- Tailwind CSS styling

## Tech Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Tailwind CSS
- Solidity

## Project Structure

```text
app/
  layout.tsx
  page.tsx

contracts/
  VinylTap.sol

lib/
  abi.ts
  wagmi.ts
```

## Contract

The Solidity contract is located at:

```text
contracts/VinylTap.sol
```

The matching frontend ABI is located at:

```text
lib/abi.ts
```

The frontend exposes three write actions:

- `Tap Beat` calls `tapBeat()`
- `Tap Bass` calls `tapBass()`
- `Tap Echo` calls `tapEcho()`

Each write call explicitly passes:

```ts
dataSuffix: BASE_ATTRIBUTION_SUFFIX
```

## Required Deployment Values

Before publishing or deploying the app, review the placeholder values below and replace them as needed.

In `app/layout.tsx`, replace:

```text
REPLACE_WITH_BASE_DEV_VERIFY_TOKEN
```

In `lib/wagmi.ts`, review:

```text
BASE_ATTRIBUTION_SUFFIX
```

It currently contains the encoded build code for:

```text
bc_dofxoaa1
```

In `app/page.tsx`, replace the placeholder contract address:

```text
CONTRACT_ADDRESS
```

The current placeholder value is:

```text
0x0000000000000000000000000000000000000000
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/SidneyJonson/vinyl-tap.git
cd vinyl-tap
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

## Verification

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Usage

1. Start the app locally or deploy it to a supported environment.
2. Open the Mini App experience.

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

# Vinyl Tap

Vinyl Tap is a Base Mini App that provides three simple onchain actions:

- `Tap Beat`
- `Tap Bass`
- `Tap Echo`

The app is built with a lightweight frontend, a Solidity contract, and a small set of contract write interactions.

## Repository

https://github.com/SidneyJonson/vinyl-tap.git

## Overview

Vinyl Tap presents a friendly interface for calling three contract functions.

Each button in the app maps directly to one onchain action.

The interface is intentionally simple and keeps user-facing messages clear and approachable.

Raw technical failure details are not displayed in the UI.

## Features

- Base Mini App experience
- Three onchain tap actions
- Friendly transaction status messages
- English-only visible interface text
- Frontend ABI paired with the Solidity contract
- Native Wagmi configuration
- TypeScript-first Next.js application
- Tailwind CSS styling

## Stack

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

The Solidity source is located at:

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

Before deploying to production, review and replace the placeholder values below.

In `app/layout.tsx`, replace:

```text
REPLACE_WITH_BASE_DEV_VERIFY_TOKEN
```

In `lib/wagmi.ts`, review:

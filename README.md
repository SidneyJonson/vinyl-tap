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

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local development URL shown in your terminal.

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
2. Connect through the Mini App flow.
3. Choose one of the available actions:
   - `Tap Beat`
   - `Tap Bass`
   - `Tap Echo`
4. Confirm the transaction when prompted.
5. Wait for the app to show a friendly status update.

## UI Behavior

Vinyl Tap keeps visible messages concise and user-friendly.

The interface does not render raw RPC errors, revert data, environment values, calldata, or backend configuration details.

This helps keep the app focused on the tap experience rather than low-level implementation output.

## Development Notes

Keep the contract ABI in `lib/abi.ts` aligned with `contracts/VinylTap.sol`.

Update the configured contract address before using the app outside local development.

Review deployment-specific values before publishing a production build.

Keep visible copy in English to match the current app language.

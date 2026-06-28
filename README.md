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

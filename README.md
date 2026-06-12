# Vinyl Tap

Vinyl Tap is a Base Mini App with three onchain actions: `Tap Beat`, `Tap Bass`, and `Tap Echo`.

## Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Tailwind CSS

## Required Deployment Values

Before production deployment, replace these placeholders:

- `app/layout.tsx`: `REPLACE_WITH_BASE_DEV_VERIFY_TOKEN`
- `lib/wagmi.ts`: `BASE_ATTRIBUTION_SUFFIX`, currently the encoded build code for `bc_dofxoaa1`
- `app/page.tsx`: `CONTRACT_ADDRESS`, currently `0x0000000000000000000000000000000000000000`

The Mini App keeps all visible UI text in English and only exposes friendly transaction states. Raw RPC errors, revert data, environment values, calldata, tokens, and backend configuration are not rendered in the interface.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

## Contract

The Solidity source is in `contracts/VinylTap.sol`, and the matching frontend ABI is in `lib/abi.ts`.

Only these three frontend buttons call `writeContract`:

- `Tap Beat` calls `tapBeat()`
- `Tap Bass` calls `tapBass()`
- `Tap Echo` calls `tapEcho()`

Each write call explicitly passes `dataSuffix: BASE_ATTRIBUTION_SUFFIX`.

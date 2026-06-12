"use client";

import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const BASE_ATTRIBUTION_SUFFIX =
  "0x" as `0x${string}`;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: "Vinyl Tap",
      preference: "all",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

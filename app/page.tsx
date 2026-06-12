"use client";

import {
  Activity,
  Cable,
  CheckCircle2,
  CircleOff,
  Disc3,
  Loader2,
  Music2,
  PlugZap,
  Radio,
  SlidersHorizontal,
  Unplug,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Connector } from "wagmi";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Address, Hash } from "viem";
import { base } from "wagmi/chains";
import { vinylTapAbi } from "@/lib/abi";
import { BASE_ATTRIBUTION_SUFFIX } from "@/lib/wagmi";

const CONTRACT_ADDRESS = "0xc3185c8f243f9ce4cbc987af11c7836c608c76ed" as Address;
const hasContractAddress = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

type TapAction = {
  key: "beat" | "bass" | "echo";
  label: string;
  functionName: "tapBeat" | "tapBass" | "tapEcho";
  icon: typeof Music2;
  accent: string;
  meter: string;
};

const actions: TapAction[] = [
  {
    key: "beat",
    label: "Tap Beat",
    functionName: "tapBeat",
    icon: Music2,
    accent: "bg-[#0052ff] text-white shadow-[0_0_24px_rgba(0,82,255,0.38)]",
    meter: "from-[#0052ff] to-[#c8ff3d]",
  },
  {
    key: "bass",
    label: "Tap Bass",
    functionName: "tapBass",
    icon: Waves,
    accent: "bg-[#ff4ecd] text-[#090806] shadow-[0_0_24px_rgba(255,78,205,0.32)]",
    meter: "from-[#ff4ecd] to-[#ffb84d]",
  },
  {
    key: "echo",
    label: "Tap Echo",
    functionName: "tapEcho",
    icon: Radio,
    accent: "bg-[#c8ff3d] text-[#090806] shadow-[0_0_24px_rgba(200,255,61,0.28)]",
    meter: "from-[#c8ff3d] to-[#0052ff]",
  },
];

function shortAddress(address?: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function countValue(value: unknown) {
  return typeof value === "bigint" ? value.toString() : "0";
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("rejected") || message.includes("denied") || message.includes("user denied")) {
    return "Request rejected.";
  }
  if (message.includes("network") || message.includes("timeout")) {
    return "Network busy. Try again soon.";
  }
  return "Transaction failed. Please try again.";
}

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect({
    mutation: {
      onError(error) {
        console.error("Wallet connection failed", error);
        setLastStatus("Request rejected.");
      },
    },
  });
  const { disconnect } = useDisconnect();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<TapAction["key"] | null>(null);
  const [lastStatus, setLastStatus] = useState("Ready");
  const [lastHash, setLastHash] = useState<Hash | undefined>();

  const reads = useMemo(
    () => [
      {
        address: CONTRACT_ADDRESS,
        abi: vinylTapAbi,
        functionName: "userBeats",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
      {
        address: CONTRACT_ADDRESS,
        abi: vinylTapAbi,
        functionName: "userBasses",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
      {
        address: CONTRACT_ADDRESS,
        abi: vinylTapAbi,
        functionName: "userEchoes",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
      { address: CONTRACT_ADDRESS, abi: vinylTapAbi, functionName: "totalBeats", chainId: base.id },
      { address: CONTRACT_ADDRESS, abi: vinylTapAbi, functionName: "totalBasses", chainId: base.id },
      { address: CONTRACT_ADDRESS, abi: vinylTapAbi, functionName: "totalEchoes", chainId: base.id },
    ],
    [address],
  );

  const { data, refetch, isLoading } = useReadContracts({
    contracts: reads,
    query: {
      enabled: hasContractAddress,
      refetchInterval: 12000,
    },
  });

  const { writeContractAsync, isPending: isWritePending } = useWriteContract({
    mutation: {
      onError(error) {
        console.error("Write failed", error);
        setLastStatus(friendlyError(error));
        setActiveAction(null);
      },
    },
  });

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: lastHash,
    chainId: base.id,
    query: {
      enabled: Boolean(lastHash),
    },
  });

  const stats = [
    {
      label: "My Beats",
      totalLabel: "Total Beats",
      mine: countValue(data?.[0]?.result),
      total: countValue(data?.[3]?.result),
    },
    {
      label: "My Bass Taps",
      totalLabel: "Total Bass Taps",
      mine: countValue(data?.[1]?.result),
      total: countValue(data?.[4]?.result),
    },
    {
      label: "My Echo Taps",
      totalLabel: "Total Echo Taps",
      mine: countValue(data?.[2]?.result),
      total: countValue(data?.[5]?.result),
    },
  ];

  async function handleTap(action: TapAction) {
    if (!isConnected) {
      setLastStatus("Connect a wallet first.");
      setWalletMenuOpen(true);
      return;
    }

    if (!hasContractAddress) {
      setLastStatus("Contract setup is pending.");
      return;
    }

    try {
      setActiveAction(action.key);
      setLastStatus("Pending");
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: vinylTapAbi,
        functionName: action.functionName,
        chainId: base.id,
        dataSuffix: BASE_ATTRIBUTION_SUFFIX,
      });
      setLastHash(hash);
      setLastStatus("Confirmed");
      await refetch();
    } catch (error) {
      console.error("Transaction request failed", error);
      setLastStatus(friendlyError(error));
    } finally {
      setActiveAction(null);
    }
  }

  function handleConnect(connector: Connector) {
    setLastStatus("Connecting");
    connect({ connector, chainId: base.id });
    setWalletMenuOpen(false);
  }

  const walletStatus = isConnected ? `Connected on ${chain?.name ?? "Base"}` : "Disconnected";
  const transactionStatus = isWritePending || isConfirming ? "Pending" : lastStatus;

  return (
    <main className="min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-3 rounded-[8px] border border-[#f4edda24] bg-[#090806cc] p-3 shadow-2xl shadow-black/35 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-[#f4edda] text-[#090806]">
              <Disc3 size={25} />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase text-[#c8ff3d]">Base Mini App</p>
              <h1 className="truncate text-2xl font-black tracking-normal text-[#f4edda]">Vinyl Tap</h1>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-[8px] border border-[#f4edda24] px-3 py-2 text-xs text-[#b8ad92]">
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-[#c8ff3d]" : "bg-[#ff4ecd]"}`} />
              {shortAddress(address)}
            </span>
            <button
              type="button"
              onClick={() => setWalletMenuOpen((open) => !open)}
              className="flex min-h-10 items-center gap-2 rounded-[8px] bg-[#0052ff] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              <PlugZap size={17} />
              {isConnected ? "Wallet" : "Connect"}
            </button>
            {isConnected && (
              <button
                type="button"
                aria-label="Disconnect wallet"
                onClick={() => disconnect()}
                className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#f4edda2f] text-[#f4edda] transition hover:border-[#ff4ecd]"
              >
                <Unplug size={17} />
              </button>
            )}
            {walletMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-64 rounded-[8px] border border-[#f4edda2f] bg-[#161511] p-2 shadow-2xl shadow-black/50">
                {connectors.map((connector) => (
                  <button
                    type="button"
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={isConnecting}
                    className="flex w-full items-center justify-between rounded-[8px] px-3 py-3 text-left text-sm text-[#f4edda] transition hover:bg-[#f4edda14] disabled:opacity-60"
                  >
                    <span>{connector.name}</span>
                    <Cable size={16} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[8px] border border-[#f4edda24] bg-[#161511] p-4 shadow-2xl shadow-black/30 sm:p-6">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(244,237,218,.08)_1px,transparent_1px),linear-gradient(rgba(244,237,218,.08)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="relative grid gap-5 md:grid-cols-[1fr_0.72fr]">
              <div className="flex flex-col gap-5">
                <div className="relative mx-auto aspect-square w-full max-w-[360px] rounded-full border border-[#f4edda33] bg-[#090806] p-6 shadow-[inset_0_0_52px_rgba(0,0,0,.7)]">
                  <div className="absolute inset-5 rounded-full border border-[#f4edda1f]" />
                  <div className="absolute inset-14 rounded-full border border-[#0052ff99]" />
                  <div className="absolute inset-24 rounded-full border border-[#ff4ecd80]" />
                  <div className="h-full w-full animate-[slow-spin_18s_linear_infinite] rounded-full bg-[repeating-radial-gradient(circle,#0b0a07_0,#0b0a07_8px,#1e1b14_9px,#1e1b14_12px)]">
                    <div className="grid h-full place-items-center">
                      <div className="grid h-28 w-28 place-items-center rounded-full border border-[#f4edda44] bg-[#f4edda] text-center text-[#090806]">
                        <div>
                          <Disc3 className="mx-auto mb-1" size={28} />
                          <p className="text-xs font-black uppercase">Onchain</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-3 top-10 h-36 w-3 rotate-[28deg] rounded-full bg-[#f4edda] shadow-[0_0_18px_rgba(244,237,218,.25)]" />
                  <div className="absolute right-8 top-36 h-5 w-14 rotate-[28deg] rounded-[8px] bg-[#ff4ecd]" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    const pending = activeAction === action.key || (isWritePending && activeAction === action.key);
                    return (
                      <button
                        type="button"
                        key={action.key}
                        onClick={() => handleTap(action)}
                        disabled={isWritePending || isConfirming}
                        className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-[8px] px-2 py-3 text-center text-sm font-black transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${action.accent}`}
                      >
                        {pending ? <Loader2 className="animate-spin" size={22} /> : <Icon size={22} />}
                        <span className="leading-tight">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[8px] border border-[#f4edda24] bg-[#09080699] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-[#b8ad92]">Mixer Rail</p>
                      <h2 className="text-lg font-black text-[#f4edda]">Signal Deck</h2>
                    </div>
                    <SlidersHorizontal className="text-[#c8ff3d]" size={23} />
                  </div>
                  <div className="flex h-44 items-end gap-2">
                    {Array.from({ length: 18 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-[#0052ff] via-[#c8ff3d] to-[#ff4ecd]"
                        style={{
                          height: `${36 + ((index * 19) % 62)}%`,
                          animation: `meter-rise ${1.1 + (index % 5) * 0.18}s ease-in-out infinite`,
                          animationDelay: `${index * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {actions.map((action, index) => (
                    <div key={action.key} className="rounded-[8px] border border-[#f4edda24] bg-[#09080699] p-3">
                      <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${action.meter}`} />
                      <div className="relative mx-auto h-32 w-8 rounded-full bg-[#0d0c09] p-1">
                        <div className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-[#f4edda30]" />
                        <div
                          className="absolute left-1/2 h-6 w-8 -translate-x-1/2 rounded-[6px] border border-[#f4edda44] bg-[#f4edda]"
                          style={{ top: `${22 + index * 18}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-[8px] border border-[#f4edda24] bg-[#161511e6] p-4 shadow-2xl shadow-black/25">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-[#b8ad92]">Live Counts</p>
                  <h2 className="text-xl font-black">Tap Console</h2>
                </div>
                {isLoading ? <Loader2 className="animate-spin text-[#0052ff]" /> : <Activity className="text-[#c8ff3d]" />}
              </div>
              <div className="grid gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[8px] border border-[#f4edda1f] bg-[#09080699] p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#b8ad92]">{stat.label}</p>
                        <p className="text-3xl font-black text-[#f4edda]">{stat.mine}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#b8ad92]">{stat.totalLabel}</p>
                        <p className="text-2xl font-black text-[#c8ff3d]">{stat.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-[#f4edda24] bg-[#161511e6] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-[#b8ad92]">Recent Activity</p>
                  <h2 className="text-xl font-black">Last Transaction</h2>
                </div>
                {transactionStatus === "Confirmed" ? (
                  <CheckCircle2 className="text-[#c8ff3d]" />
                ) : transactionStatus === "Pending" ? (
                  <Loader2 className="animate-spin text-[#0052ff]" />
                ) : (
                  <CircleOff className="text-[#ff4ecd]" />
                )}
              </div>
              <dl className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#09080699] px-3 py-3">
                  <dt className="text-[#b8ad92]">Wallet Status</dt>
                  <dd className="text-right font-bold text-[#f4edda]">{walletStatus}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#09080699] px-3 py-3">
                  <dt className="text-[#b8ad92]">Last Transaction</dt>
                  <dd className="text-right font-bold text-[#f4edda]">{transactionStatus}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#09080699] px-3 py-3">
                  <dt className="text-[#b8ad92]">Network</dt>
                  <dd className="text-right font-bold text-[#f4edda]">Base</dd>
                </div>
              </dl>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

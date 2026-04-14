"use client";

import {
  acceptConnectionAction,
  ConnectionDTO,
  declineConnectionAction,
  removeConnectionAction,
  sendConnectionRequestAction,
  SuggestionDTO,
} from "@/lib/actions/connections";
import ProfilePhoto from "@/components/shared/ProfilePhoto";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function ConnectionCard({
  connection,
  showActions,
}: {
  connection: ConnectionDTO;
  showActions: "accept_decline" | "remove" | "none";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
        toast.success(success);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Action failed.");
      }
    });
  }

  return (
    <div className="flex items-start gap-3 glass-panel rounded-2xl p-5 hover-card-glow transition-all duration-500">
      <ProfilePhoto src={connection.user.avatarUrl} name={connection.user.name} />
      <div className="min-w-0 flex-1">
        <Link href={`/profile/${connection.user.handle}`} className="text-sm font-bold text-foreground hover:text-[#2FA4D7] transition-colors duration-300">
          {connection.user.name}
        </Link>
        <p className="truncate text-xs text-white/55">
          {connection.user.headline || `@${connection.user.handle}`}
        </p>
        {connection.user.institution && (
          <p className="truncate text-xs text-white/45">{connection.user.institution}</p>
        )}
        {connection.note && (
          <p className="mt-2 text-xs text-white/55 italic">&ldquo;{connection.note}&rdquo;</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        {showActions === "accept_decline" && (
          <>
            <button
              onClick={() => runAction(() => acceptConnectionAction(connection.id), "Connection accepted!")}
              disabled={isPending}
              className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-4 py-2 text-xs font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-60"
            >
              Accept
            </button>
            <button
              onClick={() => runAction(() => declineConnectionAction(connection.id), "Request declined.")}
              disabled={isPending}
              className="rounded-xl border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-xs font-bold text-white/65 hover:bg-white/[0.08] transition-all active:scale-95 disabled:opacity-60"
            >
              Decline
            </button>
          </>
        )}
        {showActions === "remove" && (
          <button
            onClick={() => runAction(() => removeConnectionAction(connection.id), "Connection removed.")}
            disabled={isPending}
            className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2 text-xs font-bold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95 disabled:opacity-60"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: SuggestionDTO }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConnect() {
    startTransition(async () => {
      try {
        await sendConnectionRequestAction(suggestion.user.id);
        router.refresh();
        toast.success("Connection request sent!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed.");
      }
    });
  }

  return (
    <div className="flex items-start gap-3 glass-panel rounded-2xl p-5 hover-card-glow transition-all duration-500">
      <ProfilePhoto src={suggestion.user.avatarUrl} name={suggestion.user.name} />
      <div className="min-w-0 flex-1">
        <Link href={`/profile/${suggestion.user.handle}`} className="text-sm font-bold text-foreground hover:text-[#2FA4D7] transition-colors duration-300">
          {suggestion.user.name}
        </Link>
        <p className="truncate text-xs text-white/55">
          {suggestion.user.headline || `@${suggestion.user.handle}`}
        </p>
        <span className="mt-1 inline-block rounded-full bg-white/[0.08] border border-white/[0.1] px-2 py-0.5 text-xs text-white/65">
          {suggestion.reason}
        </span>
      </div>
      <button
        onClick={handleConnect}
        disabled={isPending}
        className="shrink-0 rounded-xl border border-[#2FA4D7]/20 bg-[#2FA4D7]/[0.06] px-4 py-2 text-xs font-bold text-[#2FA4D7]/85 hover:bg-[#2FA4D7]/10 hover:text-[#2FA4D7] transition-all active:scale-95 disabled:opacity-60"
      >
        Connect
      </button>
    </div>
  );
}

const TABS = [
  { key: "requests", label: "Requests" },
  { key: "connections", label: "My Connections" },
  { key: "suggestions", label: "Suggestions" },
] as const;

export default function ConnectionsPage({
  requests,
  connections,
  suggestions,
  activeTab,
}: {
  requests: ConnectionDTO[];
  connections: ConnectionDTO[];
  suggestions: SuggestionDTO[];
  activeTab: string;
}) {
  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-white/[0.1]">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/connections?tab=${tab.key}`}
            className={`relative px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.key
                ? "text-[#2FA4D7]"
                : "text-white/55 hover:text-white/60"
            }`}
          >
            {tab.label}
            {tab.key === "requests" && requests.length > 0 && (
              <span className="ml-1.5 rounded-full bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-1.5 text-[10px] font-bold text-black">
                {requests.length}
              </span>
            )}
            {activeTab === tab.key && (
              <motion.div
                layoutId="connections-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] shadow-[0_0_10px_rgba(47,164,215,0.5)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>

      {activeTab === "requests" && (
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-sm text-white/65">No pending requests.</p>
            </div>
          ) : (
            requests.map((r) => <ConnectionCard key={r.id} connection={r} showActions="accept_decline" />)
          )}
        </div>
      )}

      {activeTab === "connections" && (
        <div className="grid gap-4">
          {connections.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-sm text-white/65">No connections yet.</p>
            </div>
          ) : (
            connections.map((c) => <ConnectionCard key={c.id} connection={c} showActions="remove" />)
          )}
        </div>
      )}

      {activeTab === "suggestions" && (
        <div className="grid gap-4">
          {suggestions.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-sm text-white/65">No suggestions right now.</p>
            </div>
          ) : (
            suggestions.map((s) => <SuggestionCard key={s.user.id} suggestion={s} />)
          )}
        </div>
      )}
    </div>
  );
}

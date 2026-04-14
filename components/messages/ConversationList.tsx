"use client";

import { ConversationDTO } from "@/lib/actions/messages";
import ProfilePhoto from "@/components/shared/ProfilePhoto";
import Link from "next/link";
import ReactTimeago from "react-timeago";

export default function ConversationList({
  conversations,
  viewerId,
}: {
  conversations: ConversationDTO[];
  viewerId: string;
}) {
  if (conversations.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-sm text-white/50">
          No conversations yet. Visit someone&apos;s profile to start a chat.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl divide-y divide-white/[0.08] overflow-hidden">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-all duration-300"
        >
          <ProfilePhoto
            src={conv.otherUser.avatarUrl}
            name={conv.otherUser.name}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-white/70"}`}>
                {conv.otherUser.name}
              </h3>
              <span className="shrink-0 text-xs text-white/45">
                <ReactTimeago date={new Date(conv.lastMessageAt)} />
              </span>
            </div>
            <p className={`truncate text-xs ${conv.unreadCount > 0 ? "font-semibold text-white/70" : "text-white/55"}`}>
              {conv.lastMessageBody || "No messages yet"}
            </p>
          </div>
          {conv.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-1.5 text-[10px] font-bold text-black">
              {conv.unreadCount}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

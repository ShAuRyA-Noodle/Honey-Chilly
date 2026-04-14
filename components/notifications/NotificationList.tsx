"use client";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
  NotificationDTO,
  NotificationFeedDTO,
} from "@/lib/actions/notifications";
import ProfilePhoto from "@/components/shared/ProfilePhoto";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ReactTimeago from "react-timeago";
import { toast } from "sonner";

const ACTION_TEXT: Record<string, string> = {
  reaction: "reacted to your post",
  comment: "commented on your post",
  reply: "replied to your comment",
  follow: "started following you",
  connection_request: "sent you a connection request",
  connection_accept: "accepted your connection request",
  mention: "mentioned you in a post",
};

function NotificationItem({ notification }: { notification: NotificationDTO }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (!notification.read) {
        await markNotificationReadAction(notification.id);
      }
      if (notification.postId) {
        router.push("/feed");
      } else if (notification.type === "follow") {
        router.push(`/profile/${notification.actor.handle}`);
      } else if (notification.type === "connection_request" || notification.type === "connection_accept") {
        router.push("/connections");
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition-all duration-300 hover:bg-white/[0.03] ${
        !notification.read ? "border-l-2 border-[#2FA4D7] bg-[#2FA4D7]/[0.03]" : ""
      }`}
    >
      <ProfilePhoto
        src={notification.actor.avatarUrl}
        name={notification.actor.name}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white/80">
          <span className="font-bold text-foreground">{notification.actor.name}</span>{" "}
          {ACTION_TEXT[notification.type] || "interacted with your content"}
        </p>
        <p className="text-xs text-white/45 mt-0.5">
          <ReactTimeago date={new Date(notification.createdAt)} />
        </p>
      </div>
      {!notification.read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2FA4D7] shadow-[0_0_8px_rgba(47,164,215,0.5)]" />
      )}
    </button>
  );
}

export default function NotificationList({
  initialFeed,
}: {
  initialFeed: NotificationFeedDTO;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function markAllRead() {
    startTransition(async () => {
      try {
        await markAllNotificationsReadAction();
        router.refresh();
        toast.success("All marked as read.");
      } catch {
        toast.error("Failed to mark notifications.");
      }
    });
  }

  if (initialFeed.notifications.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-sm text-white/50">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={markAllRead}
          disabled={isPending}
          className="text-xs font-semibold text-[#2FA4D7]/80 hover:text-[#2FA4D7] transition-colors duration-300 disabled:opacity-60"
        >
          Mark all as read
        </button>
      </div>
      <div className="glass-panel rounded-2xl divide-y divide-white/[0.08] overflow-hidden">
        {initialFeed.notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}

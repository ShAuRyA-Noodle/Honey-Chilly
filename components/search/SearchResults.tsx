"use client";

import { UserDTO } from "@/lib/actions/users";
import { toggleFollowAction } from "@/lib/actions/follows";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import ProfilePhoto from "@/components/shared/ProfilePhoto";

export default function SearchResults({ users }: { users: UserDTO[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleFollow(userId: string) {
    startTransition(async () => {
      try {
        await toggleFollowAction(userId);
        router.refresh();
        toast.success("Updated.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed.");
      }
    });
  }

  if (users.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-sm text-white/50">No people found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 glass-panel rounded-2xl p-5 hover-card-glow transition-all duration-500"
        >
          <ProfilePhoto src={user.avatarUrl} name={user.name} />
          <div className="min-w-0 flex-1">
            <Link href={`/profile/${user.handle}`} className="text-sm font-bold text-foreground hover:text-[#2FA4D7] transition-colors duration-300">
              {user.name}
            </Link>
            <p className="truncate text-xs text-white/55">
              {user.headline || `@${user.handle}`}
            </p>
            {user.institution && (
              <p className="truncate text-xs text-white/45">{user.institution}</p>
            )}
          </div>
          <button
            onClick={() => handleFollow(user.id)}
            disabled={isPending}
            className="shrink-0 rounded-xl border border-[#2FA4D7]/20 bg-[#2FA4D7]/[0.06] px-4 py-2 text-xs font-bold text-[#2FA4D7]/85 hover:bg-[#2FA4D7]/10 hover:text-[#2FA4D7] transition-all duration-300 active:scale-95 disabled:opacity-60"
          >
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
}

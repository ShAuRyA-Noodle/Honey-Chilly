import { toggleFollowAction } from "@/lib/actions/follows";
import { getSuggestedProfiles } from "@/lib/actions/users";
import Link from "next/link";
import ProfilePhoto from "./shared/ProfilePhoto";
import { UserPlus, TrendingUp } from "lucide-react";

export default async function SuggestedProfiles() {
  const profiles = await getSuggestedProfiles();

  return (
    <aside className="sticky top-28 hidden h-fit w-full flex-col gap-5 lg:flex z-10">
      {/* People card */}
      <div className="glass-panel rounded-2xl overflow-hidden hover-lift transition-all duration-300">
        <div className="h-[2px] bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E]" />
        <div className="p-5">
          <h2 className="mb-4 text-xs font-bold tracking-[0.15em] text-[#2FA4D7] uppercase">
            People you may know
          </h2>

          {profiles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.1] p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-xs font-medium text-white/45">More builders will appear here soon.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="group flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <ProfilePhoto src={profile.avatarUrl} name={profile.name} size="sm" />
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[hsl(20,15%,11%)]" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/profile/${profile.handle}`} className="block truncate text-sm font-bold text-foreground hover:text-[#2FA4D7] transition-colors">
                        {profile.name}
                      </Link>
                      <p className="truncate text-xs text-white/45">{profile.headline || `@${profile.handle}`}</p>
                    </div>
                  </div>
                  <form action={toggleFollowAction.bind(null, profile.id)} className="shrink-0">
                    <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2FA4D7]/10 text-[#2FA4D7] border border-[#2FA4D7]/20 hover:bg-[#2FA4D7]/20 hover:scale-110 active:scale-95 transition-all" title="Subscribe">
                      <UserPlus size={14} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="glass-panel rounded-2xl overflow-hidden hover-lift transition-all duration-300">
        <div className="h-[2px] bg-gradient-to-r from-[#E76F2E] to-[#F5E9D8]" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#E76F2E]" />
            <h2 className="text-xs font-bold tracking-[0.15em] text-[#E76F2E] uppercase">Trending</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["#buildinpublic", "#nextjs", "#ai", "#design", "#vibely"].map((tag) => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/55 border border-white/[0.08] hover:border-[#E76F2E]/30 hover:text-white/80 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-[#E76F2E] font-bold">#</span>{tag.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

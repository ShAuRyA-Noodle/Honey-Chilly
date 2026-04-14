import { getDashboardStats } from "@/lib/actions/analytics";
import { requireOnboardedUserProfile } from "@/lib/actions/users";
import { BarChart3, Eye, FileText, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireOnboardedUserProfile();
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Impressions", value: stats.totalImpressions, icon: Eye, color: "cyan" },
    { label: "Profile Views (7d)", value: stats.profileViewsLast7Days, icon: BarChart3, color: "orange" },
    { label: "Profile Views (30d)", value: stats.profileViewsLast30Days, icon: BarChart3, color: "blue" },
    { label: "Total Posts", value: stats.totalPosts, icon: FileText, color: "green" },
    { label: "Total Reactions", value: stats.totalReactions, icon: Heart, color: "amber" },
  ];

  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    cyan: { bg: "bg-[#2FA4D7]/[0.08]", text: "text-[#2FA4D7]", glow: "hover:shadow-[0_0_30px_rgba(47,164,215,0.1)]" },
    orange: { bg: "bg-[#E76F2E]/[0.08]", text: "text-[#E76F2E]", glow: "hover:shadow-[0_0_30px_rgba(231,111,46,0.1)]" },
    blue: { bg: "bg-[#2FA4D7]/[0.08]", text: "text-[#2FA4D7]", glow: "hover:shadow-[0_0_30px_rgba(47,164,215,0.1)]" },
    green: { bg: "bg-green-500/[0.08]", text: "text-green-400", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" },
    amber: { bg: "bg-amber-500/[0.08]", text: "text-amber-400", glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]" },
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const c = colorMap[card.color] || colorMap.cyan;
          return (
            <div
              key={card.label}
              className={`glass-panel rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 hover:border-white/[0.12] ${c.glow}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
                <card.icon size={24} className={c.text} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{card.value.toLocaleString()}</p>
                <p className="text-xs text-white/55 font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

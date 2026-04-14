"use client";

import { ProfileStatsDTO, UserDTO } from "@/lib/actions/users";
import Link from "next/link";
import ProfilePhoto from "./shared/ProfilePhoto";
import { Home, Users, MessageSquare, Compass, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar({
  user,
  stats,
}: {
  user: UserDTO;
  stats: ProfileStatsDTO;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/feed", icon: Home, label: "Home" },
    { href: "/search", icon: Compass, label: "Explore" },
    { href: "/connections", icon: Users, label: "Network" },
    { href: "/messages", icon: MessageSquare, label: "Messages" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="sticky top-28 hidden h-fit w-full flex-col gap-5 md:flex z-10">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative overflow-hidden rounded-2xl glass-panel hover-lift"
      >
        {/* Gradient accent top bar */}
        <div className="h-1 bg-gradient-to-r from-[#2FA4D7] via-[#E76F2E] to-[#F5E9D8]" />

        {/* Banner */}
        <div className="h-16 bg-gradient-to-br from-[#2FA4D7]/15 via-[#3E2C23]/30 to-[#E76F2E]/10" />

        <div className="-mt-8 flex flex-col items-center px-4 pb-5 text-center relative z-10">
          <div className="rounded-full p-0.5 bg-gradient-to-br from-[#2FA4D7] to-[#E76F2E]">
            <div className="rounded-full bg-[hsl(20,15%,11%)] p-1">
              <ProfilePhoto src={user.avatarUrl} name={user.name} size="lg" />
            </div>
          </div>
          <Link
            href={`/profile/${user.handle}`}
            className="mt-3 text-base font-bold text-foreground hover:text-[#2FA4D7] transition-colors duration-300"
          >
            {user.name}
          </Link>
          <p className="mt-0.5 text-xs font-medium text-white/55">
            {user.headline || "Gen Z Builder"}
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Link href={`/profile/${user.handle}`} className="flex flex-col items-center py-3 hover:bg-white/[0.03] transition-all duration-300">
            <span className="text-lg font-bold text-foreground">{stats.subscriberCount}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#2FA4D7]/70 font-semibold">Subscribers</span>
          </Link>
          <Link href={`/profile/${user.handle}`} className="flex flex-col items-center py-3 hover:bg-white/[0.03] transition-all duration-300">
            <span className="text-lg font-bold text-foreground">{stats.postCount}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#E76F2E]/70 font-semibold">Posts</span>
          </Link>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-panel rounded-2xl p-2"
      >
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#2FA4D7]/10 text-[#2FA4D7]"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#2FA4D7]"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </aside>
  );
}

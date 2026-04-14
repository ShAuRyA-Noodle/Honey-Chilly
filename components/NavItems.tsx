"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageSquare, Compass, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NavItems({ handle }: { handle?: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/feed", icon: Home, label: "Home" },
    { href: "/search", icon: Compass, label: "Explore" },
    { href: "/connections", icon: Users, label: "Network" },
    { href: "/messages", icon: MessageSquare, label: "Messages" },
    { href: handle ? `/profile/${handle}` : "/onboarding", icon: UserCircle, label: "Profile", hideMobile: true },
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              link.hideMobile ? "hidden md:flex" : "flex"
            } ${isActive ? "text-[#2FA4D7]" : "text-white/55 hover:text-white/70"}`}
          >
            <Icon
              size={22}
              className={`transition-all duration-300 ${
                isActive ? "scale-110" : "group-hover:scale-105"
              }`}
              style={isActive ? { filter: "drop-shadow(0 0 8px rgba(47, 164, 215, 0.5))" } : {}}
            />
            {isActive && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#2FA4D7] shadow-[0_0_8px_rgba(47,164,215,0.8)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

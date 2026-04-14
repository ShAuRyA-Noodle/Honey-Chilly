"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const TABS = [
  { key: "posts", label: "Posts" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
] as const;

export default function ProfileTabs({
  activeTab,
  handle,
}: {
  activeTab: string;
  handle: string;
}) {
  return (
    <div className="mt-6 flex gap-1 border-b border-white/[0.1]">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/profile/${handle}${tab.key === "posts" ? "" : `?tab=${tab.key}`}`}
          className={`relative px-5 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === tab.key
              ? "text-[#2FA4D7]"
              : "text-white/55 hover:text-white/60"
          }`}
        >
          {tab.label}
          {activeTab === tab.key && (
            <motion.div
              layoutId="profile-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] shadow-[0_0_10px_rgba(47,164,215,0.5)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </Link>
      ))}
    </div>
  );
}

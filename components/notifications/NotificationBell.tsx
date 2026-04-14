"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  return (
    <Link
      href="/notifications"
      className="rounded-xl p-2 text-white/80 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
      aria-label="Notifications"
    >
      <Bell size={20} />
    </Link>
  );
}

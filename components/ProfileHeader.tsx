"use client";

import { toggleFollowAction } from "@/lib/actions/follows";
import { ProfileDTO, updateProfileAction } from "@/lib/actions/users";
import Link from "next/link";
import ProfilePhoto from "./shared/ProfilePhoto";
import { motion } from "framer-motion";
import { MapPin, Link as LinkIcon, Edit3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTransition } from "react";

function AnimatedCounter({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl px-5 py-3 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <motion.span key={value} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-display font-bold text-foreground">
        {value.toLocaleString()}
      </motion.span>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</span>
    </div>
  );
}

export default function ProfileHeader({ profile }: { profile: ProfileDTO }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await updateProfileAction(formData); toast.success("Profile updated"); setIsEditing(false); }
      catch (err) { toast.error("Failed to update profile."); }
    });
  };

  return (
    <section className="overflow-hidden glass-panel rounded-2xl">
      {/* Gradient top accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#2FA4D7] via-[#E76F2E] to-[#F5E9D8]" />

      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2FA4D7]/20 via-[#3E2C23]/40 to-[#E76F2E]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,15%,11%)] via-transparent to-transparent" />
      </div>

      <div className="px-6 pb-6">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div className="rounded-full p-0.5 bg-gradient-to-br from-[#2FA4D7] to-[#E76F2E]">
              <div className="rounded-full bg-[hsl(20,15%,11%)] p-1">
                <ProfilePhoto src={profile.avatarUrl} name={profile.name} size="xl" />
              </div>
            </div>
          </motion.div>

          <div className="flex gap-2">
            {!profile.isSelf ? (
              <form action={toggleFollowAction.bind(null, profile.id)}>
                <button type="submit" className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                  profile.isSubscribed
                    ? "bg-white/[0.08] text-foreground border border-white/[0.1] hover:bg-white/[0.12]"
                    : "bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] text-white shadow-[0_0_20px_rgba(47,164,215,0.2)]"
                }`}>
                  {profile.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </form>
            ) : (
              <button onClick={() => setIsEditing(!isEditing)} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-5 py-2.5 text-sm font-bold text-foreground hover:bg-white/[0.1] hover:scale-105 active:scale-95 transition-all">
                <Edit3 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mt-5">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{profile.name}</h1>
          <p className="mt-1 text-base font-medium text-[#2FA4D7]">{profile.headline || `@${profile.handle}`}</p>

          {(profile.location || profile.website) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/55">
              {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#E76F2E]" />{profile.location}</span>}
              {profile.website && (
                <Link href={profile.website} className="flex items-center gap-1.5 text-[#2FA4D7]/80 hover:text-[#2FA4D7] transition-colors" target="_blank">
                  <LinkIcon size={14} />{profile.website.replace(/^https?:\/\//, "")}
                </Link>
              )}
            </div>
          )}

          {profile.bio && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">{profile.bio}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <AnimatedCounter value={profile.subscriberCount} label="Subscribers" color="text-[#2FA4D7]/70" />
            <AnimatedCounter value={profile.subscribingCount} label="Subscribing" color="text-[#E76F2E]/70" />
            <AnimatedCounter value={profile.postCount} label="Posts" color="text-[#F5E9D8]/50" />
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={false} animate={{ height: isEditing ? "auto" : 0, opacity: isEditing ? 1 : 0 }} className="overflow-hidden">
          <div className="mt-6 rounded-xl border border-white/[0.08] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#2FA4D7]">Edit details</h3>
            <form onSubmit={handleEditSubmit} className="grid md:grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm font-semibold text-white/60">Handle <input name="handle" defaultValue={profile.handle} required minLength={3} maxLength={24} className="glass-input" /></label>
              <label className="grid gap-2 text-sm font-semibold text-white/60">Headline <input name="headline" defaultValue={profile.headline} maxLength={140} className="glass-input" /></label>
              <label className="grid gap-2 text-sm font-semibold text-white/60 md:col-span-2">Bio <textarea name="bio" defaultValue={profile.bio} maxLength={500} rows={4} className="glass-input resize-none" /></label>
              <label className="grid gap-2 text-sm font-semibold text-white/60">Location <input name="location" defaultValue={profile.location} maxLength={100} className="glass-input" /></label>
              <label className="grid gap-2 text-sm font-semibold text-white/60">Website <input name="website" defaultValue={profile.website} maxLength={180} className="glass-input" /></label>
              <div className="md:col-span-2 mt-2 flex justify-end">
                <button type="submit" disabled={isPending} className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-50">
                  {isPending ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

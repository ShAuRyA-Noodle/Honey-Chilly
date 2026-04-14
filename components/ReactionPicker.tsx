"use client";

import { ReactionType } from "@/models/reaction.model";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REACTION_EMOJI: Record<ReactionType, string> = {
  fire: "\u{1F525}",
  heart: "\u2764\uFE0F",
  mindblown: "\u{1F92F}",
  clap: "\u{1F44F}",
  laugh: "\u{1F602}",
  sad: "\u{1F622}",
};

const REACTION_LABELS: Record<ReactionType, string> = {
  fire: "Fire",
  heart: "Love",
  mindblown: "Mind Blown",
  clap: "Clap",
  laugh: "Haha",
  sad: "Sad",
};

export function ReactionPicker({
  currentReaction,
  onReact,
  disabled,
}: {
  currentReaction: ReactionType | null;
  onReact: (type: ReactionType) => void;
  disabled: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      <button
        type="button"
        onClick={() => onReact(currentReaction || "heart")}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
          currentReaction
            ? "text-[#2FA4D7] bg-[#2FA4D7]/[0.08]"
            : "text-white/55 hover:bg-white/[0.04] hover:text-white/70"
        }`}
      >
        <span className="text-lg">
          {currentReaction ? REACTION_EMOJI[currentReaction] : REACTION_EMOJI.heart}
        </span>
        {currentReaction ? REACTION_LABELS[currentReaction] : "React"}
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-full left-0 z-50 mb-2 flex gap-1 rounded-2xl border border-white/[0.12] bg-white/[0.1] px-2.5 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          >
            {(Object.keys(REACTION_EMOJI) as ReactionType[]).map((type, i) => (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: i * 0.04,
                }}
                key={type}
                type="button"
                onClick={() => {
                  onReact(type);
                  setShowPicker(false);
                }}
                disabled={disabled}
                title={REACTION_LABELS[type]}
                whileHover={{ scale: 1.3, originY: 0.5 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-all duration-200 ${
                  currentReaction === type
                    ? "bg-white/[0.12] ring-2 ring-[#2FA4D7]/30 shadow-[0_0_15px_rgba(47,164,215,0.2)]"
                    : "hover:bg-white/[0.09]"
                }`}
              >
                {REACTION_EMOJI[type]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

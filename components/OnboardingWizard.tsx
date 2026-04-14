"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";

export default function OnboardingWizard({
  user,
  action,
}: {
  user: { handle: string };
  action: (formData: FormData) => void;
}) {
  const [step, setStep] = useState(0);

  const [values, setValues] = useState({
    handle: user.handle || "",
    headline: "",
    bio: "",
    location: "",
    website: "",
    institution: "",
    department: "",
  });

  function update(field: string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const steps = [
    {
      title: "Claim your identity",
      description: "How should people find you on Vibely?",
      content: (
        <div className="grid gap-6 py-4">
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Handle
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-white/50">@</span>
              <input
                value={values.handle}
                onChange={(e) => update("handle", e.target.value)}
                required
                minLength={3}
                maxLength={24}
                className="glass-input w-full pl-10 text-lg font-bold"
              />
            </div>
          </label>
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Headline
            </span>
            <input
              value={values.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="e.g. Frontend developer, founder-in-progress..."
              maxLength={140}
              className="glass-input text-lg font-bold"
            />
          </label>
        </div>
      ),
    },
    {
      title: "What\u2019s your story?",
      description: "Share what you're building, learning, or proving.",
      content: (
        <div className="grid gap-6 py-4">
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Bio
            </span>
            <textarea
              value={values.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="I'm currently building..."
              maxLength={500}
              rows={4}
              className="glass-input resize-none text-lg font-bold"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Institution
            </span>
            <input
              value={values.institution}
              onChange={(e) => update("institution", e.target.value)}
              placeholder="Your school or company"
              maxLength={200}
              className="glass-input text-lg font-bold"
            />
          </label>
        </div>
      ),
    },
    {
      title: "Drop your coordinates",
      description: "Where are you based? Where can people see your work?",
      content: (
        <div className="grid gap-6 py-4">
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Location
            </span>
            <input
              value={values.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Earth, Milky Way..."
              maxLength={100}
              className="glass-input text-lg font-bold"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
              Website
            </span>
            <input
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://yourportfolio.com"
              maxLength={180}
              className="glass-input text-lg font-bold"
            />
          </label>
        </div>
      ),
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 0) setStep(step - 1);
  };

  return (
    <form action={action} className="relative mx-auto w-full max-w-xl">
      <input type="hidden" name="handle" value={values.handle} />
      <input type="hidden" name="headline" value={values.headline} />
      <input type="hidden" name="bio" value={values.bio} />
      <input type="hidden" name="location" value={values.location} />
      <input type="hidden" name="website" value={values.website} />
      <input type="hidden" name="institution" value={values.institution} />
      <input type="hidden" name="department" value={values.department} />

      {/* Progress Bar */}
      <div className="mb-8 flex gap-2">
        {steps.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.1]">
            <motion.div
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] shadow-[0_0_10px_rgba(47,164,215,0.3)]"
            />
          </div>
        ))}
      </div>

      <div className="relative h-[420px] w-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={step}
            initial={{ x: 80, opacity: 0, filter: "blur(4px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: -80, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full glass-panel-strong rounded-3xl p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">
              {steps[step].title}
            </h2>
            <p className="mt-2 text-base text-white/55">
              {steps[step].description}
            </p>
            <div className="mt-4">{steps[step].content}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white/55 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/60 ${
            step === 0 ? "pointer-events-none opacity-0" : ""
          }`}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-white/[0.1] border border-white/[0.12] px-6 py-3 text-sm font-bold text-foreground transition-all duration-300 hover:bg-white/[0.1] active:scale-95"
          >
            Next
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(47,164,215,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(47,164,215,0.5)] hover:scale-105 active:scale-95"
          >
            Enter Vibely
            <Send size={16} />
          </button>
        )}
      </div>
    </form>
  );
}

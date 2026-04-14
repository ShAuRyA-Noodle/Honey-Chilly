"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, Code2, Globe2, Sparkles, Zap, Shield, Layers } from "lucide-react";
import { useRef, useState } from "react";

function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function FloatingCard({ icon: Icon, title, description, color, delay }: {
  icon: typeof Code2; title: string; description: string; color: string; delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const colorMap: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    cyan: { border: "hover:border-[#2FA4D7]/30", glow: "group-hover:shadow-[0_0_60px_rgba(47,164,215,0.15)]", text: "text-[#2FA4D7]", bg: "bg-[#2FA4D7]/10" },
    orange: { border: "hover:border-orange-500/30", glow: "group-hover:shadow-[0_0_60px_rgba(231,111,46,0.15)]", text: "text-orange-400", bg: "bg-orange-500/10" },
    amber: { border: "hover:border-amber-500/30", glow: "group-hover:shadow-[0_0_60px_rgba(245,158,11,0.15)]", text: "text-amber-400", bg: "bg-amber-500/10" },
    blue: { border: "hover:border-blue-500/30", glow: "group-hover:shadow-[0_0_60px_rgba(59,130,246,0.15)]", text: "text-blue-400", bg: "bg-blue-500/10" },
    green: { border: "hover:border-green-500/30", glow: "group-hover:shadow-[0_0_60px_rgba(16,185,129,0.15)]", text: "text-green-400", bg: "bg-green-500/10" },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative glass-panel rounded-3xl p-8 ${c.border} ${c.glow} transition-all duration-700 cursor-default overflow-hidden`}
      style={{ perspective: "1000px" }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />

      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-2xl ${c.bg} mb-5`}>
          <Icon size={28} className={`${c.text} transition-all duration-500 group-hover:scale-110`} />
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors duration-500">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${c.text.replace('text-', 'via-')}/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </motion.div>
  );
}

function StatCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div className="font-display text-4xl md:text-5xl font-bold gradient-text-primary mb-1">{value}</div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/30 font-medium">{label}</div>
    </motion.div>
  );
}

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div style={{ opacity, scale }} className="z-10 flex flex-col items-center text-center max-w-6xl mx-auto">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2FA4D7] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2FA4D7]" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Now Live — Join the Builders
              </span>
            </div>
          </motion.div>

          {/* Main Headline with stagger */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold tracking-tight leading-[0.9]"
            >
              <span className="text-white">Where Builders</span>
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2FA4D7] via-[#4DB8E0] to-[#E76F2E] bg-[length:200%_auto] animate-gradient-shift">
                  Prove Their Work
                </span>
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed"
          >
            The professional network for engineers, designers, and visionaries
            who let their work speak louder than their resume.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <MagneticButton
              href="/sign-up"
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] px-8 py-4 font-display font-bold text-white shadow-[0_0_30px_rgba(47,164,215,0.25)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(47,164,215,0.4)] active:scale-[0.97]"
            >
              <span className="relative z-10 text-base tracking-wide">Get Started</span>
              <ArrowRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" size={18} />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </MagneticButton>

            <MagneticButton
              href="/sign-in"
              className="group flex items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.05] px-8 py-4 font-display font-bold text-white/80 transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.2] hover:text-white active:scale-[0.97]"
            >
              <span className="text-base tracking-wide">Sign In</span>
              <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-20 flex items-center gap-12 md:gap-20"
          >
            <StatCounter value="10K+" label="Builders" delay={1.3} />
            <div className="h-8 w-px bg-white/[0.08]" />
            <StatCounter value="50K+" label="Projects" delay={1.5} />
            <div className="h-8 w-px bg-white/[0.08]" />
            <StatCounter value="99%" label="Satisfaction" delay={1.7} />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/[0.1] flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-white/30"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-32 px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2FA4D7]/60 mb-4 block">Why Vibely</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Built Different, <span className="gradient-text-primary">By Design</span>
          </h2>
          <p className="text-lg text-white/30 leading-relaxed">
            Not another LinkedIn clone. Vibely is purpose-built for people who ship code, design pixels, and build the future.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FloatingCard
            icon={Code2}
            title="Proof of Work"
            description="Your code, your commits, your shipped products. Share deep technical progress that proves you build, not just talk."
            color="cyan"
            delay={0}

          />
          <FloatingCard
            icon={Globe2}
            title="Global Builder Network"
            description="Connect with the top 1% of engineers, designers, and founders. Quality over quantity, always."
            color="orange"
            delay={0.1}

          />
          <FloatingCard
            icon={Sparkles}
            title="Smart Matching"
            description="AI-powered suggestions that connect you with builders working on complementary problems and technologies."
            color="amber"
            delay={0.2}

          />
          <FloatingCard
            icon={Zap}
            title="Real-time Collaboration"
            description="Instant messaging, threaded discussions, and live reactions. Built for the speed builders operate at."
            color="amber"
            delay={0.1}

          />
          <FloatingCard
            icon={Shield}
            title="Privacy First"
            description="Your data, your rules. No ads, no tracking, no selling your professional graph to recruiters."
            color="green"
            delay={0.2}

          />
          <FloatingCard
            icon={Layers}
            title="Rich Profiles"
            description="Education, experience, skills, and project portfolios. Everything a builder needs to showcase their journey."
            color="blue"
            delay={0.3}

          />
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative glass-panel-strong rounded-[2rem] p-12 md:p-20 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[200px] bg-gradient-to-r from-[#2FA4D7]/20 via-[#E76F2E]/20 to-[#F5E9D8]/20 blur-3xl rounded-full" />

            <h2 className="relative z-10 font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to prove <br className="hidden md:block" />
              <span className="gradient-text-primary">what you&apos;ve built?</span>
            </h2>
            <p className="relative z-10 text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join thousands of builders who are already sharing their work, growing their network, and landing opportunities.
            </p>

            <motion.div className="relative z-10">
              <MagneticButton
                href="/sign-up"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] px-10 py-5 font-display text-lg font-bold text-white shadow-[0_0_30px_rgba(47,164,215,0.25)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(47,164,215,0.4)] active:scale-[0.97]"
              >
                <span>Start Building Your Profile</span>
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 text-sm text-white/15"
        >
          Free forever for builders. No credit card required.
        </motion.p>
      </section>
    </div>
  );
}

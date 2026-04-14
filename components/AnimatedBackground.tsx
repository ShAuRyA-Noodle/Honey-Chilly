"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[hsl(20,20%,5%)]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 15% 20%, rgba(47,164,215,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 85% 30%, rgba(231,111,46,0.03) 0%, transparent 55%),
            radial-gradient(ellipse 60% 60% at 50% 80%, rgba(62,44,35,0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

export default function PostSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-6">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-10 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-white/[0.04]" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded-lg bg-white/[0.04]" />
          <div className="h-3 w-24 rounded-lg bg-white/[0.03]" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-4 w-full rounded-lg bg-white/[0.04]" />
        <div className="h-4 w-[90%] rounded-lg bg-white/[0.03]" />
        <div className="h-4 w-[60%] rounded-lg bg-white/[0.03]" />
      </div>

      <div className="mt-5 h-64 w-full rounded-2xl bg-white/[0.03]" />

      <div className="mt-5 grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.04]">
        <div className="h-8 rounded-xl bg-white/[0.03]" />
        <div className="h-8 rounded-xl bg-white/[0.03]" />
        <div className="h-8 rounded-xl bg-white/[0.03]" />
        <div className="h-8 rounded-xl bg-white/[0.03]" />
      </div>
    </div>
  );
}

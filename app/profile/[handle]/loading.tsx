export default function ProfileLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      {/* Banner + avatar */}
      <div className="glass-panel rounded-3xl overflow-hidden animate-pulse">
        <div className="h-64 bg-white/[0.03]" />
        <div className="px-6 pb-6">
          <div className="-mt-16 flex items-end justify-between">
            <div className="h-28 w-28 rounded-full bg-white/[0.06] ring-4 ring-background" />
            <div className="h-10 w-28 rounded-xl bg-white/[0.04]" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-8 w-48 rounded bg-white/[0.04]" />
            <div className="h-4 w-36 rounded bg-white/[0.03]" />
            <div className="h-3 w-64 rounded bg-white/[0.03]" />
          </div>
          <div className="mt-8 flex gap-4">
            <div className="h-16 w-28 rounded-2xl bg-white/[0.03]" />
            <div className="h-16 w-28 rounded-2xl bg-white/[0.03]" />
            <div className="h-16 w-28 rounded-2xl bg-white/[0.03]" />
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="mt-6 flex gap-4 border-b border-white/[0.06] pb-3">
        <div className="h-4 w-14 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-20 rounded bg-white/[0.03] animate-pulse" />
        <div className="h-4 w-20 rounded bg-white/[0.03] animate-pulse" />
        <div className="h-4 w-14 rounded bg-white/[0.03] animate-pulse" />
      </div>
    </section>
  );
}

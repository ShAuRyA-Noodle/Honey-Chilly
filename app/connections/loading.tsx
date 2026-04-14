export default function ConnectionsLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="h-8 w-40 rounded bg-white/[0.04] animate-pulse mb-8" />
      <div className="flex gap-4 mb-6 border-b border-white/[0.06] pb-3">
        <div className="h-5 w-20 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-5 w-28 rounded bg-white/[0.03] animate-pulse" />
        <div className="h-5 w-24 rounded bg-white/[0.03] animate-pulse" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/[0.04]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 rounded bg-white/[0.04]" />
              <div className="h-3 w-44 rounded bg-white/[0.03]" />
            </div>
            <div className="h-8 w-20 rounded-xl bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </section>
  );
}

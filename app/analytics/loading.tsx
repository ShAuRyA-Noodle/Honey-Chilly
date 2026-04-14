export default function AnalyticsLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="h-8 w-36 rounded bg-white/[0.04] animate-pulse mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex items-center gap-4 animate-pulse">
            <div className="h-12 w-12 rounded-xl bg-white/[0.04]" />
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-white/[0.04]" />
              <div className="h-3 w-28 rounded bg-white/[0.03]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

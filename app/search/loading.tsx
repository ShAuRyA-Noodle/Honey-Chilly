export default function SearchLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="h-12 w-full rounded-xl bg-white/[0.04] animate-pulse mb-8" />
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/[0.04]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-white/[0.04]" />
              <div className="h-3 w-48 rounded bg-white/[0.03]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

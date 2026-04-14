export default function MessagesLoading() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <div className="h-8 w-36 rounded bg-white/[0.04] animate-pulse mb-8" />
      <div className="glass-panel rounded-2xl divide-y divide-white/[0.04] overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/[0.04]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 rounded bg-white/[0.04]" />
              <div className="h-3 w-44 rounded bg-white/[0.03]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

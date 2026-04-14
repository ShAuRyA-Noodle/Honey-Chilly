import PostSkeleton from "@/components/PostSkeleton";

export default function FeedLoading() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 md:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
      <div className="hidden md:block">
        <div className="h-[400px] rounded-3xl glass-panel animate-pulse" />
      </div>
      <div className="min-w-0 space-y-6">
        <div className="h-20 w-full rounded-3xl glass-panel animate-pulse" />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
      <div className="hidden xl:block">
        <div className="h-[500px] rounded-3xl glass-panel animate-pulse" />
      </div>
    </div>
  );
}

import PostList from "@/components/PostList";
import SearchResults from "@/components/search/SearchResults";
import { searchUsers, searchPosts, searchByHashtag, getTrendingHashtags } from "@/lib/actions/search";
import { requireOnboardedUserProfile } from "@/lib/actions/users";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string };
}) {
  await requireOnboardedUserProfile();

  const query = searchParams.q || "";
  const tab = searchParams.tab || "people";
  const isHashtagSearch = query.startsWith("#");

  let users: Awaited<ReturnType<typeof searchUsers>> = [];
  let postResults: Awaited<ReturnType<typeof searchPosts>> = { posts: [], nextCursor: null };
  let trending: Awaited<ReturnType<typeof getTrendingHashtags>> = [];

  if (query) {
    if (tab === "people" && !isHashtagSearch) {
      users = await searchUsers(query);
    } else if (tab === "posts" || isHashtagSearch) {
      postResults = isHashtagSearch
        ? await searchByHashtag(query)
        : await searchPosts(query);
    }
  }

  trending = await getTrendingHashtags();

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <form action="/search" method="GET" className="mb-8">
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search people, posts, or #hashtags..."
          className="glass-input w-full text-base py-4"
        />
      </form>

      {query && !isHashtagSearch && (
        <div className="mb-6 flex gap-1 border-b border-white/[0.1]">
          {["people", "posts"].map((t) => (
            <Link
              key={t}
              href={`/search?q=${encodeURIComponent(query)}&tab=${t}`}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-all duration-300 ${
                tab === t
                  ? "border-b-2 border-[#2FA4D7] text-[#2FA4D7]"
                  : "text-white/55 hover:text-white/60"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {isHashtagSearch && (
        <h2 className="mb-6 font-display text-xl font-bold text-foreground">
          Posts tagged with <span className="gradient-text-primary">{query}</span>
        </h2>
      )}

      {query && tab === "people" && !isHashtagSearch && <SearchResults users={users} />}
      {query && (tab === "posts" || isHashtagSearch) && (
        <PostList posts={postResults.posts} emptyMessage={`No posts found for "${query}".`} />
      )}

      {!query && trending.length > 0 && (
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Trending Hashtags
          </h2>
          <div className="flex flex-wrap gap-2">
            {trending.map((tag) => (
              <Link
                key={tag.name}
                href={`/search?q=%23${tag.name}&tab=posts`}
                className="rounded-full glass-panel px-4 py-2 text-sm font-semibold text-white/65 transition-all duration-300 hover:text-white/80 hover:border-white/[0.12]"
              >
                <span className="gradient-text-primary">#</span>{tag.name}{" "}
                <span className="text-xs text-white/45">{tag.postCount}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

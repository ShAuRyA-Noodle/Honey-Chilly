"use client";

import { FeedDTO } from "@/lib/actions/posts";
import { UserDTO } from "@/lib/actions/users";
import { useEffect, useState } from "react";
import PostComposer from "./PostComposer";
import PostList from "./PostList";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Feed({
  user,
  initialFeed,
}: {
  user: UserDTO;
  initialFeed: FeedDTO;
}) {
  const [posts, setPosts] = useState(initialFeed.posts);
  const [nextCursor, setNextCursor] = useState(initialFeed.nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPosts(initialFeed.posts);
    setNextCursor(initialFeed.nextCursor);
  }, [initialFeed]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/feed?cursor=${encodeURIComponent(nextCursor)}`);
      const data = (await response.json()) as FeedDTO;
      setPosts((currentPosts) => [...currentPosts, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  }

  async function simulateRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  }

  return (
    <section className="min-w-0 pb-20 md:pb-0 relative">
      <div
        className="h-2 w-full absolute top-0 left-0 cursor-pointer md:hidden opacity-0"
        onTouchMove={simulateRefresh}
      />

      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 40, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex justify-center items-center overflow-hidden text-[#2FA4D7]"
          >
            <Loader2 size={24} className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 z-10 relative">
        <PostComposer user={user} />
      </div>

      <div className="mt-3 relative z-0">
        <PostList
          posts={posts}
          emptyMessage="No posts found. Write something to get the vibe going!"
        />
      </div>

      {nextCursor && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-8 w-full glass-panel rounded-2xl border-[#2FA4D7]/10 px-4 py-4 text-sm font-semibold text-[#2FA4D7]/85 overflow-hidden relative transition-all duration-300 hover:border-[#2FA4D7]/20 hover:text-[#2FA4D7] disabled:opacity-50"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#2FA4D7]" />
              Loading more...
            </span>
          ) : (
            "Load more posts"
          )}
        </motion.button>
      )}
    </section>
  );
}

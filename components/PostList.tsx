"use client";

import { PostDTO } from "@/lib/actions/posts";
import PostCard from "./PostCard";
import { motion } from "framer-motion";

export default function PostList({
  posts,
  emptyMessage,
}: {
  posts: PostDTO[];
  emptyMessage: string;
}) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center rounded-3xl glass-panel p-16 text-center"
      >
        <div className="mb-5 rounded-2xl bg-white/[0.08] p-5 ring-1 ring-white/[0.1]">
          <span className="text-4xl">&#10024;</span>
        </div>
        <p className="text-base font-medium text-white/55">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

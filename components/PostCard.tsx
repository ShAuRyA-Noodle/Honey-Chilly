"use client";

import {
  createCommentAction,
  deletePostAction,
  EmbeddedPostDTO,
  PostDTO,
  repostPostAction,
  toggleReactionAction,
  CommentDTO,
} from "@/lib/actions/posts";
import { ReactionType } from "@/models/reaction.model";
import {
  ExternalLink,
  MessageCircle,
  PlayCircle,
  Repeat2,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import ReactTimeago from "react-timeago";
import { toast } from "sonner";
import ProfilePhoto from "./shared/ProfilePhoto";
import { motion, AnimatePresence } from "framer-motion";
import { ReactionPicker } from "./ReactionPicker";

type MediaItem = PostDTO["media"][number];

const REACTION_EMOJI: Record<ReactionType, string> = {
  fire: "\u{1F525}", heart: "\u2764\uFE0F", mindblown: "\u{1F92F}",
  clap: "\u{1F44F}", laugh: "\u{1F602}", sad: "\u{1F622}",
};

function formatDuration(duration?: number) {
  if (!duration) return null;
  const totalSeconds = Math.round(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function VideoAttachment({ item }: { item: MediaItem }) {
  const [loaded, setLoaded] = useState(false);
  const duration = formatDuration(item.duration);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-black/40">
      {loaded ? (
        <video key={item.publicId} src={item.url} controls playsInline className="block aspect-video max-h-[560px] w-full bg-black object-contain" />
      ) : (
        <div className="flex aspect-video max-h-[560px] min-h-[220px] w-full flex-col items-center justify-center gap-4 px-4 text-center">
          <PlayCircle size={56} className="text-white/60" />
          <div>
            <p className="text-sm font-bold text-white/80">Video ready</p>
            <p className="mt-1 text-xs text-white/45">{duration ? `${duration} MP4` : "MP4"} - click to preview</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setLoaded(true)} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/90 active:scale-95 transition-all">Load video</button>
            <Link href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-sm font-bold text-white hover:bg-white/[0.1] active:scale-95 transition-all">Open <ExternalLink size={16} /></Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageAttachment({ item }: { item: MediaItem }) {
  return (
    <div className="group relative mt-4 flex max-h-[620px] min-h-[160px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={item.publicId} src={item.url} alt="Post media" className="block h-auto max-h-[620px] w-auto max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]" loading="lazy" />
    </div>
  );
}

function Media({ media }: { media: PostDTO["media"] }) {
  if (media.length === 0) return null;
  return (
    <div className="grid gap-3">
      {media.map((item) => item.type === "video" ? <VideoAttachment key={item.publicId} item={item} /> : <ImageAttachment key={item.publicId} item={item} />)}
    </div>
  );
}

function AuthorLine({ post }: { post: Pick<PostDTO, "author" | "createdAt"> }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProfilePhoto src={post.author.avatarUrl} name={post.author.name} />
      <div className="min-w-0">
        <Link href={`/profile/${post.author.handle}`} className="truncate text-[15px] font-bold text-foreground hover:text-[#2FA4D7] transition-colors">
          {post.author.name}
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <p className="truncate text-white/45">{post.author.headline || `@${post.author.handle}`}</p>
          <span className="text-white/20">&middot;</span>
          <p className="text-white/40"><ReactTimeago date={new Date(post.createdAt)} /></p>
        </div>
      </div>
    </div>
  );
}

function EmbeddedPost({ post }: { post: EmbeddedPostDTO }) {
  return (
    <div className="mt-4 rounded-xl border border-white/[0.08] p-4 transition-all duration-300 hover:border-white/[0.12]" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <AuthorLine post={post} />
      {post.body && <p className="mt-3 text-sm leading-relaxed text-foreground/80">{post.body}</p>}
      {post.quoteText && <p className="mt-3 text-sm leading-relaxed text-foreground/80">{post.quoteText}</p>}
      <Media media={post.media} />
    </div>
  );
}

function ReactionSummary({ reactions, total }: { reactions: PostDTO["reactions"]; total: number }) {
  if (total === 0) return <span className="opacity-0">0</span>;
  const sorted = (Object.entries(reactions) as [ReactionType, number][]).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <span className="flex -space-x-1">{sorted.map(([type]) => (<span key={type} className="flex h-5 w-5 items-center justify-center rounded-full text-xs z-10" style={{ background: 'hsl(20 15% 15%)', boxShadow: '0 0 0 2px hsl(20 20% 5%)' }}>{REACTION_EMOJI[type]}</span>))}</span>
      <span className="ml-1 text-xs text-white/50">{total}</span>
    </span>
  );
}

function CommentThread({ comment, postId, onReply, isPending }: { comment: CommentDTO; postId: string; onReply: (parentId: string, text: string) => void; isPending: boolean }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    const text = replyText.trim();
    if (!text) return;
    onReply(comment.id, text);
    setReplyText("");
    setShowReplyInput(false);
  }

  return (
    <div className={comment.depth > 0 ? "ml-6 border-l-2 border-[#2FA4D7]/10 pl-4" : ""}>
      <div className="flex gap-3">
        <ProfilePhoto src={comment.author.avatarUrl} name={comment.author.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="inline-block rounded-2xl rounded-tl-sm px-4 py-2.5 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="flex flex-wrap items-baseline gap-2">
              <Link href={`/profile/${comment.author.handle}`} className="text-sm font-bold hover:text-[#2FA4D7] transition-colors">{comment.author.name}</Link>
              <span className="text-[10px] uppercase font-medium tracking-wider text-white/35"><ReactTimeago date={new Date(comment.createdAt)} /></span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{comment.body}</p>
          </div>
          {comment.depth < 2 && (
            <div className="mt-1 pl-2">
              <button type="button" onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs font-semibold text-white/40 hover:text-[#2FA4D7] transition-colors">
                Reply {comment.replyCount > 0 && `(${comment.replyCount})`}
              </button>
            </div>
          )}
          <AnimatePresence>
            {showReplyInput && (
              <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} onSubmit={handleReplySubmit} className="mt-3 flex gap-2 overflow-hidden">
                <input value={replyText} onChange={(e) => setReplyText(e.target.value)} maxLength={1000} placeholder={`Reply to ${comment.author.name}...`} className="glass-input min-w-0 flex-1" />
                <button type="submit" disabled={isPending} className="rounded-lg bg-[#2FA4D7] px-4 py-2 text-sm font-bold text-white hover:bg-[#2FA4D7]/90 active:scale-95 disabled:opacity-60 transition-all">Reply</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      {comment.replies.map((reply) => (<div key={reply.id} className="mt-3"><CommentThread comment={reply} postId={postId} onReply={onReply} isPending={isPending} /></div>))}
    </div>
  );
}

export default function PostCard({ post }: { post: PostDTO }) {
  const router = useRouter();
  const [commentsOpen, setCommentsOpen] = useState(post.comments.length > 0);
  const [comment, setComment] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [isPending, startTransition] = useTransition();
  const repostTargetId = post.repostOf?.id || post.id;
  const isPlainRepost = Boolean(post.repostOf) && !post.quoteText && !post.body && post.media.length === 0;

  function runAction(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try { await action(); router.refresh(); toast.success(success); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Action failed."); }
    });
  }

  function handleReaction(reactionType: ReactionType) { runAction(() => toggleReactionAction(post.id, reactionType), "Reaction updated."); }

  function onCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;
    runAction(async () => { await createCommentAction(post.id, text); setComment(""); setCommentsOpen(true); }, "Comment added.");
  }

  function onReply(parentId: string, text: string) {
    runAction(async () => { await createCommentAction(post.id, text, parentId); setCommentsOpen(true); }, "Reply added.");
  }

  function onQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = quoteText.trim();
    if (!text) { toast.error("Add a note for your quote repost."); return; }
    runAction(async () => { await repostPostAction(repostTargetId, text); setQuoteText(""); setQuoteOpen(false); }, "Quote reposted.");
  }

  const content = post.repostOf ? (
    <>
      {post.quoteText && <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.quoteText}</p>}
      {!isPlainRepost && post.body && <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.body}</p>}
      <EmbeddedPost post={post.repostOf} />
    </>
  ) : (
    <>
      {post.body && <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.body}</p>}
      <Media media={post.media} />
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative glass-panel rounded-2xl overflow-hidden hover-lift"
    >
      {/* Colored top accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#2FA4D7]/60 via-transparent to-[#E76F2E]/40" />

      <div className="p-5">
        {isPlainRepost && (
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/50">
            <Repeat2 size={14} className="text-green-400" />
            <span>{post.author.name} reposted</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          {!isPlainRepost && <AuthorLine post={post} />}
          {isPlainRepost && post.repostOf && <AuthorLine post={post.repostOf} />}
          {post.canDelete && (
            <button type="button" onClick={() => runAction(() => deletePostAction(post.id), "Post deleted.")} disabled={isPending} className="rounded-full p-2 text-white/15 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100" aria-label="Delete post">
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {content}

        {/* Stats */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-3 text-xs font-medium text-white/45">
          <ReactionSummary reactions={post.reactions} total={post.totalReactions} />
          <div className="flex gap-4">
            <button type="button" onClick={() => setCommentsOpen((o) => !o)} className="hover:text-white/70 transition-colors">{post.commentCount} comments</button>
            <span>{post.repostCount} reposts</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-4 gap-1">
          <ReactionPicker currentReaction={post.viewerReaction} onReact={handleReaction} disabled={isPending} />
          <button type="button" onClick={() => setCommentsOpen((o) => !o)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/45 hover:bg-white/[0.04] hover:text-white/70 active:scale-95 transition-all">
            <MessageCircle size={17} /><span className="hidden sm:inline">Comment</span>
          </button>
          <button type="button" onClick={() => runAction(() => repostPostAction(repostTargetId), "Repost updated.")} disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/45 hover:bg-green-500/[0.06] hover:text-green-400 active:scale-95 transition-all">
            <Repeat2 size={17} /><span className="hidden sm:inline">Repost</span>
          </button>
          <button type="button" onClick={() => setQuoteOpen((o) => !o)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/45 hover:bg-[#2FA4D7]/[0.06] hover:text-[#2FA4D7] active:scale-95 transition-all">
            <Send size={17} /><span className="hidden sm:inline">Quote</span>
          </button>
        </div>

        <AnimatePresence>
          {quoteOpen && (
            <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 flex gap-3 overflow-hidden border-t border-white/[0.06] pt-4" onSubmit={onQuoteSubmit}>
              <input value={quoteText} onChange={(e) => setQuoteText(e.target.value)} maxLength={1000} placeholder="Add your take..." className="glass-input min-w-0 flex-1" />
              <button type="submit" disabled={isPending} className="rounded-lg bg-[#2FA4D7] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2FA4D7]/90 active:scale-95 disabled:opacity-50 transition-all">Quote</button>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {commentsOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <form onSubmit={onCommentSubmit} className="flex gap-3">
                  <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} placeholder="Add a comment..." className="glass-input min-w-0 flex-1" />
                  <button type="submit" disabled={isPending} className="rounded-lg bg-[#2FA4D7] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2FA4D7]/90 active:scale-95 disabled:opacity-50 transition-all">Send</button>
                </form>
                <div className="mt-6 grid gap-5">
                  {post.comments.map((item) => (<CommentThread key={item.id} comment={item} postId={post.id} onReply={onReply} isPending={isPending} />))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

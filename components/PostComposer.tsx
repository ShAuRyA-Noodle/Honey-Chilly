"use client";

import { createPostAction, MediaInput } from "@/lib/actions/posts";
import { UserDTO } from "@/lib/actions/users";
import { ImagePlus, Loader2, Video, X, BarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import ProfilePhoto from "./shared/ProfilePhoto";
import { motion, AnimatePresence } from "framer-motion";

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function validateFiles(files: File[]) {
  if (files.length > MAX_IMAGES) throw new Error("Choose up to 4 images or 1 video.");
  const imageFiles = files.filter((f) => f.type.startsWith("image/"));
  const videoFiles = files.filter((f) => f.type.startsWith("video/"));
  if (imageFiles.length + videoFiles.length !== files.length) throw new Error("Only image and video uploads are supported.");
  if (videoFiles.length > 1 || (videoFiles.length === 1 && files.length > 1)) throw new Error("Choose either 1 video or up to 4 images.");
  for (const f of imageFiles) { if (f.size > MAX_IMAGE_BYTES) throw new Error("Images must be 8MB or smaller."); }
  for (const f of videoFiles) { if (f.size > MAX_VIDEO_BYTES) throw new Error("Videos must be 50MB or smaller."); }
}

async function uploadFiles(files: File[]): Promise<MediaInput[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const response = await fetch("/api/uploads", { method: "POST", body: formData });
  if (!response.ok) { const p = await response.json().catch(() => null); throw new Error(p?.error || "Media upload failed."); }
  return ((await response.json()) as { media: MediaInput[] }).media;
}

export default function PostComposer({ user }: { user: UserDTO }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    try { validateFiles([...files, ...selectedFiles]); setFiles(prev => [...prev, ...selectedFiles]); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Invalid media."); }
    if (event.target) event.target.value = "";
  }

  function removeFile(index: number) { setFiles(files.filter((_, i) => i !== index)); }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = body.trim();
    if (!text && files.length === 0) { toast.error("Add an update, image, or video before posting."); return; }
    setIsSubmitting(true);
    try {
      const media = files.length > 0 ? await uploadFiles(files) : [];
      await createPostAction({ body: text, media });
      setBody(""); setFiles([]); setIsOpen(false); router.refresh(); toast.success("Posted successfully");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Post failed."); }
    finally { setIsSubmitting(false); }
  }

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-text glass-panel rounded-2xl overflow-hidden hover-lift transition-all duration-300">
        <div className="h-[2px] bg-gradient-to-r from-[#2FA4D7]/50 via-transparent to-[#E76F2E]/30" />
        <div className="p-4 flex gap-3 items-center">
          <ProfilePhoto src={user.avatarUrl} name={user.name} />
          <div className="min-w-0 flex-1 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/40 hover:bg-white/[0.03] transition-all" style={{ background: 'rgba(255,255,255,0.02)' }}>
            What&apos;s on your mind?
          </div>
          <div className="hidden sm:flex gap-1 text-white/35">
            <button className="p-2 hover:text-[#2FA4D7] transition-colors rounded-lg hover:bg-[#2FA4D7]/10"><ImagePlus size={19} /></button>
            <button className="p-2 hover:text-green-400 transition-colors rounded-lg hover:bg-green-500/10"><Video size={19} /></button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-[100] bg-black/70" />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="w-full max-w-lg pointer-events-auto rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'hsl(20 14% 12%)' }}>
                <div className="h-[2px] bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E]" />
                <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
                  <h2 className="text-lg font-display font-bold text-foreground">Create Post</h2>
                  <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-white/50 hover:bg-white/[0.06] hover:text-white/70 transition-all"><X size={20} /></button>
                </div>
                <form onSubmit={onSubmit} className="p-5">
                  <div className="flex gap-3 mb-4">
                    <ProfilePhoto src={user.avatarUrl} name={user.name} />
                    <div>
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-white/40">Posting to everyone</p>
                    </div>
                  </div>
                  <textarea autoFocus value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share an accomplishment, project update, or thought..." rows={4} maxLength={3000} className="w-full resize-none bg-transparent px-1 text-base text-foreground placeholder:text-white/25 outline-none" />
                  {files.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto rounded-xl">
                      {files.map((file, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-white/[0.08] bg-black/20 aspect-video">
                          {file.type.startsWith('image/') ? <img src={previews[i]} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Video size={32} className="text-white/40" /></div>}
                          <button type="button" onClick={() => removeFile(i)} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex gap-1 text-white/35">
                      <button type="button" onClick={() => inputRef.current?.click()} disabled={isSubmitting || files.length >= MAX_IMAGES} className="rounded-lg p-2 hover:bg-[#2FA4D7]/10 hover:text-[#2FA4D7] transition-all disabled:opacity-50" title="Add photo or video"><ImagePlus size={19} /></button>
                      <button type="button" onClick={() => toast.info('Polls feature coming soon!')} className="rounded-lg p-2 hover:bg-[#E76F2E]/10 hover:text-[#E76F2E] transition-all" title="Create poll"><BarChart2 size={19} /></button>
                      <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={onFileChange} className="hidden" />
                    </div>
                    <button type="submit" disabled={isSubmitting || (!body.trim() && files.length === 0)} className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] px-6 py-2.5 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
                      {isSubmitting && <span className="absolute inset-0 flex items-center justify-center bg-black/30"><Loader2 size={18} className="animate-spin text-white" /></span>}
                      <span className={isSubmitting ? "opacity-0" : ""}>Post</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

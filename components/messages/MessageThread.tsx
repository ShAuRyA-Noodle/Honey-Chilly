"use client";

import { MessageDTO, sendMessageAction } from "@/lib/actions/messages";
import { UserDTO } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function MessageThread({
  conversationId,
  viewerId,
  initialMessages,
  otherUser,
}: {
  conversationId: string;
  viewerId: string;
  initialMessages: MessageDTO[];
  otherUser: UserDTO;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;

    const optimistic: MessageDTO = {
      id: `temp-${Date.now()}`,
      senderId: viewerId,
      body: msg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    startTransition(async () => {
      try {
        await sendMessageAction(conversationId, msg);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send.");
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      }
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col glass-panel rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ maxHeight: "60vh", minHeight: "300px" }}>
        {messages.length === 0 && (
          <p className="text-center text-sm text-white/45 py-10">
            Start the conversation with {otherUser.name}!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === viewerId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-all duration-300 ${
                  isMine
                    ? "bg-gradient-to-r from-[#2FA4D7]/90 to-[#2587B5]/90 text-black rounded-br-md shadow-[0_4px_15px_rgba(47,164,215,0.2)]"
                    : "bg-white/[0.09] text-foreground rounded-bl-md border border-white/[0.08]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-black/40" : "text-white/45"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-white/[0.08] p-4"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Type a message..."
          className="glass-input min-w-0 flex-1"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] p-2.5 text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

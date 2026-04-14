import MessageThread from "@/components/messages/MessageThread";
import { getMessages, markConversationReadAction } from "@/lib/actions/messages";
import { requireOnboardedUserProfile } from "@/lib/actions/users";
import { Conversation } from "@/models/conversation.model";
import { serializeUser } from "@/lib/actions/users";
import connectDB from "@/lib/db";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const viewer = await requireOnboardedUserProfile();
  await connectDB();

  if (!Types.ObjectId.isValid(params.conversationId)) notFound();

  const conv = await Conversation.findOne({
    _id: params.conversationId,
    participants: new Types.ObjectId(viewer.id),
  }).populate("participants");

  if (!conv) notFound();

  await markConversationReadAction(params.conversationId);

  const otherUser = (conv.participants as any[]).find(
    (p: any) => p._id.toString() !== viewer.id
  );

  if (!otherUser) notFound();

  const otherUserDTO = await serializeUser(otherUser);
  const { messages } = await getMessages(params.conversationId);

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/messages" className="rounded-xl p-2 text-white/30 hover:bg-white/[0.05] hover:text-white/60 transition-all duration-300">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">{otherUserDTO.name}</h1>
          <p className="text-xs text-white/30">@{otherUserDTO.handle}</p>
        </div>
      </div>
      <MessageThread
        conversationId={params.conversationId}
        viewerId={viewer.id}
        initialMessages={messages}
        otherUser={otherUserDTO}
      />
    </section>
  );
}

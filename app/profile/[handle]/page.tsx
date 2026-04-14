import PostList from "@/components/PostList";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EducationSection from "@/components/profile/EducationSection";
import ExperienceSection from "@/components/profile/ExperienceSection";
import SkillsSection from "@/components/profile/SkillsSection";
import { getProfilePosts } from "@/lib/actions/posts";
import { getProfileByHandle } from "@/lib/actions/users";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { tab?: string };
}) {
  const profile = await getProfileByHandle(params.handle);

  if (!profile) {
    notFound();
  }

  const activeTab = searchParams.tab || "posts";
  const posts = activeTab === "posts" ? await getProfilePosts(profile.id) : [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <ProfileHeader profile={profile} />
      <ProfileTabs activeTab={activeTab} handle={profile.handle} />
      <div className="mt-6">
        {activeTab === "posts" && (
          <PostList posts={posts} emptyMessage="No posts here yet." />
        )}
        {activeTab === "education" && (
          <EducationSection items={profile.education} isSelf={profile.isSelf} />
        )}
        {activeTab === "experience" && (
          <ExperienceSection items={profile.experience} isSelf={profile.isSelf} />
        )}
        {activeTab === "skills" && (
          <SkillsSection items={profile.skills} isSelf={profile.isSelf} />
        )}
      </div>
    </section>
  );
}

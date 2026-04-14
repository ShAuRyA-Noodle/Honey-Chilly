import { completeOnboardingAction, requireUserProfile } from "@/lib/actions/users";
import { redirect } from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireUserProfile();

  if (user.onboardingComplete) {
    redirect("/feed");
  }

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden px-4 py-10">
      {/* Background Graphic */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-color-dodge opacity-20">
        <div className="h-[800px] w-[800px] animate-gradient-shift rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E76F2E]/40 via-amber-500/10 to-transparent blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
            Vibely setup
          </p>
          <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-5xl font-black tracking-tighter text-transparent">
            Welcome to the future.
          </h1>
        </div>

        <OnboardingWizard user={user} action={completeOnboardingAction} />
      </div>
    </section>
  );
}

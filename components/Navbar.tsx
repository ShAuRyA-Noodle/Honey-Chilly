import { getCurrentUserProfile } from "@/lib/actions/users";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NotificationBell from "./notifications/NotificationBell";
import NavItems from "./NavItems";

export default async function Navbar() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 pointer-events-none">
      <header className="w-full max-w-5xl pointer-events-auto" style={{ background: 'hsl(20 14% 10% / 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
        <div className="flex h-14 items-center justify-between px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-base font-black text-black bg-gradient-to-br from-[#2FA4D7] to-[#E76F2E] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(47,164,215,0.4)] group-hover:scale-110">
              V
            </span>
            <span className="hidden text-lg font-display font-bold tracking-tight text-foreground sm:inline">
              Vibely
            </span>
          </Link>

          {/* Desktop Nav */}
          {profile ? (
            <nav className="fixed bottom-3 left-3 right-3 z-50 flex h-14 items-center justify-around md:static md:bottom-auto md:left-auto md:right-auto md:h-auto md:w-auto md:justify-center md:gap-4 md:border-0 md:bg-transparent md:shadow-none pointer-events-auto" style={{ background: 'hsl(20 14% 10% / 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
              <NavItems handle={profile.handle} />
            </nav>
          ) : null}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {profile ? (
              <>
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8 ring-2 ring-white/10 hover:ring-[#2FA4D7]/40 transition-all",
                    },
                  }}
                />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#E76F2E] px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(47,164,215,0.4)] active:scale-95"
                >
                  Join Vibely
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

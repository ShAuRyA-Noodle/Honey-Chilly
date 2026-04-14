import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibely",
  description: "A proof-of-work professional network for builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2FA4D7",
          colorBackground: "#1a1512",
          colorText: "#e8ddd0",
          colorTextSecondary: "#a89a8c",
          colorInputBackground: "#241f1b",
          colorInputText: "#e8ddd0",
          colorNeutral: "#e8ddd0",
          colorTextOnPrimaryBackground: "#ffffff",
        },
        elements: {
          userButtonPopoverCard: "!bg-[#1a1512] !border !border-white/10 !shadow-2xl",
          userButtonPopoverActionButton: "!text-[#e8ddd0] hover:!bg-white/5",
          userButtonPopoverActionButtonText: "!text-[#e8ddd0]",
          userButtonPopoverActionButtonIcon: "!text-[#a89a8c]",
          userButtonPopoverFooter: "hidden",
          userPreviewMainIdentifier: "!text-[#e8ddd0]",
          userPreviewSecondaryIdentifier: "!text-[#a89a8c]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <body
          className="font-sans min-h-screen bg-background text-foreground overflow-x-hidden antialiased"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AnimatedBackground />
            <Navbar />
            <main className="min-h-screen pt-20 pb-20 md:pb-0 relative">{children}</main>
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: "!bg-white/[0.06] !backdrop-blur-sm !border !border-white/[0.1] !text-foreground !rounded-2xl !shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

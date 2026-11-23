"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  UsersRound,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Consultations", href: "/consultations", icon: ClipboardList },
  { label: "AI doctors", href: "/doctors", icon: Stethoscope },
  { label: "Specialties", href: "/specialties", icon: Activity },
  { label: "My profile", href: "/profile", icon: UsersRound },
];

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/consultations": "Consultations",
  "/doctors": "AI doctors",
  "/specialties": "Specialties",
  "/profile": "My profile",
};

export function AppNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (isStandalone) return children;

  const title =
    Object.entries(titles).find(([href]) => pathname.startsWith(href))?.[1] ??
    "Your care";

  return (
    <div className="min-h-screen bg-[#f7fafd] text-[#172b4d] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden border-r border-[#e2eaf2] bg-white lg:flex lg:flex-col">
        <Link
          href="/dashboard"
          className="flex h-[76px] items-center gap-3 border-b border-[#edf2f7] px-6"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#1673d1] text-white shadow-[0_8px_20px_rgba(22,115,209,.2)]">
            <HeartPulse className="size-5" />
          </span>
          <span className="text-[18px] font-bold tracking-[-.04em]">
            Doctor <span className="text-[#1673d1]">AI</span>
          </span>
        </Link>
        <div className="px-4 pt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#91a3b8]">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="mt-3 space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${active ? "bg-[#eaf4ff] text-[#1269bd]" : "text-[#60738a] hover:bg-[#f5f9fd] hover:text-[#172b4d]"}`}
                >
                  <Icon className="size-[17px]" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[#dcecf8] bg-[#f4faff] p-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#1673d1]">
              <HeartPulse className="size-4" />
            </span>
            <p className="mt-3 text-xs font-bold text-[#173c65]">
              Need urgent help?
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#647b92]">
              For emergencies, contact your local emergency services.
            </p>
            <p className="mt-3 text-[11px] font-bold text-[#1673d1]">
              Contact local emergency services
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f7] pt-4 text-[11px] text-[#8a9bad]">
            <span>Private health guidance</span>
            <span className="size-2 rounded-full bg-[#18a987]" />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-20 border-b border-[#e2eaf2] bg-white/95 backdrop-blur-md">
          <div className="flex h-[64px] items-center justify-between px-4 sm:px-6 lg:h-[76px] lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/dashboard"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1673d1] text-white lg:hidden"
              >
                <HeartPulse className="size-4" />
              </Link>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#91a3b8]">
                  Doctor AI / Workspace
                </p>
                <h1 className="mt-0.5 truncate text-sm font-semibold text-[#173c65]">
                  {title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full bg-[#eaf8f5] px-3 py-1.5 text-[11px] font-semibold text-[#168a75] sm:inline-flex">
                <span className="size-1.5 rounded-full bg-[#16a085]" /> Guidance
                available
              </span>
              <div className="border-l border-[#e7edf4] pl-3">
                <UserButton />
              </div>
            </div>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="flex gap-1 overflow-x-auto border-t border-[#edf2f7] px-3 py-2 lg:hidden"
          >
            {navigation.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${active ? "bg-[#eaf4ff] text-[#1269bd]" : "text-[#60738a]"}`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

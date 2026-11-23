"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  Plus,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Consultation = {
  id: string;
  title: string | null;
  status: string;
  createdAt: string;
  doctor?: { name: string } | null;
};

type DashboardCard = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  caption: string;
  href: string;
};

export default function DashboardPage() {
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    getToken()
      .then((token) =>
        token ? apiFetch<Consultation[]>("/consultations", token) : null,
      )
      .then((data) => data && setConsultations(data))
      .catch((error) => {
        console.error("Error loading consultations:", error);

        setError(
          error instanceof Error
            ? error.message
            : "We could not load your consultations. Please try again.",
        );
      });
  }, [getToken, isLoaded]);

  const dashboardCards: DashboardCard[] = [
    {
      icon: ClipboardList,
      label: "Consultations",
      value: consultations.length,
      caption: "Your conversation history",
      href: "/consultations",
    },
    {
      icon: Stethoscope,
      label: "AI doctors",
      value: "Explore",
      caption: "Find a specialty assistant",
      href: "/doctors",
    },
    {
      icon: Activity,
      label: "Specialties",
      value: "Browse",
      caption: "Explore care pathways",
      href: "/specialties",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <section className="relative overflow-hidden rounded-xl bg-[#0b3b75] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9bcdfa]">
            Your health workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.03em] sm:text-[30px]">
            Welcome{user?.firstName ? `, ${user.firstName}` : " back"}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#c5d8eb]">
            A thoughtful place to organize health questions and explore clear,
            specialized information.
          </p>
          <Link
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#0b3b75] transition hover:bg-[#edf6ff]"
            href="/consultations/new"
          >
            <Plus className="size-4" /> Start a consultation
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-16 hidden size-72 rounded-full border-[34px] border-white/[.06] sm:block" />
        <div className="pointer-events-none absolute right-16 top-9 hidden size-36 rounded-full border border-white/[.12] sm:block" />
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {dashboardCards.map(({ icon: Icon, label, value, caption, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-[#e2eaf2] bg-white p-5 transition hover:border-[#b8d7f0] hover:shadow-[0_8px_24px_rgba(34,76,120,.05)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#eaf4ff] text-[#1673d1]">
                <Icon className="size-[17px]" />
              </span>
              <ArrowRight className="size-4 text-[#a2b3c3] transition group-hover:translate-x-0.5 group-hover:text-[#1673d1]" />
            </div>
            <p className="mt-5 text-xs font-medium text-[#71839a]">{label}</p>
            <p className="mt-1 text-xl font-semibold text-[#173c65]">{value}</p>
            <p className="mt-1 text-[11px] text-[#91a3b8]">{caption}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">
        <section className="overflow-hidden rounded-xl border border-[#e2eaf2] bg-white">
          <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-[#173c65]">
                Recent consultations
              </h3>
              <p className="mt-1 text-xs text-[#8192a5]">
                Continue a conversation or review your history.
              </p>
            </div>
            <Link
              href="/consultations"
              className="text-xs font-semibold text-[#1673d1]"
            >
              View all
            </Link>
          </div>
          {error ? (
            <p className="px-5 py-8 text-sm text-[#a83b45]">{error}</p>
          ) : consultations.length === 0 ? (
            <div className="px-5 py-9 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-[#f1f7fc] text-[#6d9ac1]">
                <ClipboardList className="size-[18px]" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#173c65]">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-[#8192a5]">
                Your consultations will appear here.
              </p>
              <Link
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1673d1]"
                href="/consultations/new"
              >
                Start one now <ArrowRight className="size-3" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#edf2f7]">
              {consultations.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/consultations/${item.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#f8fbfe]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#173c65]">
                      {item.title || item.doctor?.name || "Health conversation"}
                    </p>
                    <p className="mt-1 text-xs capitalize text-[#8192a5]">
                      {item.status.toLowerCase()}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-[#9bb4cc]" />
                </Link>
              ))}
            </div>
          )}
        </section>
        <aside className="rounded-xl border border-[#dcecf8] bg-[#f4faff] p-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#1673d1]">
            <ShieldCheck className="size-[18px]" />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-[#173c65]">
            A note about your care
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#647b92]">
            Doctor AI offers general health information, not diagnosis or
            treatment. A licensed clinician can provide care tailored to you.
          </p>
          <p className="mt-4 border-t border-[#dcecf8] pt-3 text-xs font-semibold leading-5 text-[#315b7e]">
            If you may be experiencing an emergency, contact your local
            emergency services now.
          </p>
        </aside>
      </div>
    </main>
  );
}

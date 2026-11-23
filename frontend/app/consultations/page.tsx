"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Plus,
  Stethoscope,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Item = {
  id: string;
  title?: string;
  status: string;
  createdAt: string;
  doctor?: { name: string };
};

export default function Consultations() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getToken()
      .then((token) =>
        token ? apiFetch<Item[]>("/consultations", token) : null,
      )
      .then((data) => data && setItems(data))
      .catch(() =>
        setError("We could not load your consultations. Please try again."),
      )
      .finally(() => setLoading(false));
  }, [getToken]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
            Your care history
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-[30px]">
            Consultations
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
            Pick up where you left off or start a new conversation with an AI
            doctor.
          </p>
        </div>
        <Link
          href="/consultations/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1673d1] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(22,115,209,.18)] transition hover:bg-[#0b5fac]"
        >
          <Plus className="size-4" /> New consultation
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-[#e2eaf2] bg-white">
        <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#eaf4ff] text-[#1673d1]">
              <ClipboardList className="size-[18px]" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[#173c65]">
                Recent conversations
              </h3>
              <p className="mt-0.5 text-xs text-[#8192a5]">
                {items.length}{" "}
                {items.length === 1 ? "consultation" : "consultations"}
              </p>
            </div>
          </div>
          <CalendarDays className="size-[17px] text-[#91a3b8]" />
        </div>
        {error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#a83b45]">{error}</p>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-[62px] animate-pulse rounded-lg bg-[#f3f7fb]" />
            <div className="h-[62px] animate-pulse rounded-lg bg-[#f3f7fb]" />
          </div>
        ) : items.length ? (
          <div className="divide-y divide-[#edf2f7]">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/consultations/${item.id}`}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#f8fbfe] sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f7fc] text-[#4c83b7]">
                    <Stethoscope className="size-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#173c65]">
                      {item.title || item.doctor?.name || "Health conversation"}
                    </p>
                    <p className="mt-1 text-xs text-[#8192a5]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        : "Date unavailable"}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-[#eaf8f5] px-2.5 py-1 text-[10px] font-bold capitalize text-[#168a75]">
                    {item.status.toLowerCase()}
                  </span>
                  <ArrowRight className="size-4 text-[#9bb4cc] transition group-hover:translate-x-0.5 group-hover:text-[#1673d1]" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center sm:py-16">
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
              <ClipboardList className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-[#173c65]">
              Your care history starts here
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#71839a]">
              Start a private conversation to organize your questions and get
              thoughtful health information.
            </p>
            <Link
              href="/consultations/new"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1673d1]"
            >
              Start your first consultation <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

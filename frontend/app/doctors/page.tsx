"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Search, ShieldCheck, Stethoscope } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  description?: string;
  specialist?: { name: string };
  reviews?: { rating: number }[];
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/doctors`,
    )
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setDoctors)
      .catch(() =>
        setError(
          "The doctor directory is temporarily unavailable. Please try again later.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
            Specialized health guidance
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-[30px]">
            Meet your AI doctors
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
            Explore focused assistants designed to make health information
            easier to understand.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#eaf8f5] px-3 py-2 text-[11px] font-semibold text-[#168a75] sm:self-auto">
          <span className="size-1.5 rounded-full bg-[#16a085]" /> Available any
          time
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-[#e2eaf2] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5d748b]">
          <Search className="size-4 text-[#91a3b8]" /> Browse all assistants
        </div>
        <span className="text-xs text-[#8192a5]">
          {doctors.length} {doctors.length === 1 ? "assistant" : "assistants"}
        </span>
      </div>
      {error ? (
        <div className="mt-6 rounded-xl border border-[#f1d8d7] bg-[#fff9f8] px-5 py-8 text-center text-sm text-[#a83b45]">
          {error}
        </div>
      ) : loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-xl border border-[#e2eaf2] bg-white"
            />
          ))}
        </div>
      ) : doctors.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Link
              key={doctor.id}
              href={`/doctors/${doctor.id}`}
              className="group flex min-h-56 flex-col rounded-xl border border-[#e2eaf2] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#b8d7f0] hover:shadow-[0_12px_30px_rgba(34,76,120,.08)]"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
                  <Stethoscope className="size-5" />
                </span>
                <span className="rounded-full bg-[#eaf8f5] px-2.5 py-1 text-[10px] font-bold text-[#168a75]">
                  Available
                </span>
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[.12em] text-[#1673d1]">
                {doctor.specialist?.name || "Health information"}
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#173c65]">
                {doctor.name}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#71839a]">
                {doctor.description ||
                  "An AI health information assistant ready to help you organize your questions."}
              </p>
              <span className="mt-4 flex items-center justify-between border-t border-[#edf2f7] pt-3 text-xs font-semibold text-[#1673d1]">
                <span className="flex items-center gap-1.5 text-[#8192a5]">
                  <ShieldCheck className="size-3.5" /> AI health assistant
                </span>
                View profile{" "}
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-[#cbdbe9] bg-white px-5 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
            <Stethoscope className="size-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-[#173c65]">
            No assistants to show yet
          </h3>
          <p className="mt-2 text-sm text-[#71839a]">
            Please check back soon for available specialties.
          </p>
        </div>
      )}
      <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#8192a5]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#4c9a8b]" />
        AI doctors provide general health information and do not replace a
        licensed clinician or emergency care.
      </p>
    </main>
  );
}

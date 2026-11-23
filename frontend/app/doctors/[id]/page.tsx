"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";

type Doctor = {
  name: string;
  description?: string;
  specialist?: { name: string };
};

export default function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/doctors/${id}`,
      )
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then(setDoctor)
        .catch(() =>
          setError(
            "We could not load this assistant. Please return to the directory and try again.",
          ),
        ),
    );
  }, [params]);

  if (error)
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-[#f1d8d7] bg-white p-6 text-sm text-[#a83b45]">
          {error}
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1673d1]"
          href="/doctors"
        >
          <ArrowLeft className="size-4" /> Back to AI doctors
        </Link>
      </main>
    );
  if (!doctor)
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-72 animate-pulse rounded-xl border border-[#e2eaf2] bg-white" />
      </main>
    );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#71839a] transition hover:text-[#1673d1]"
      >
        <ArrowLeft className="size-3.5" /> All AI doctors
      </Link>
      <section className="mt-5 overflow-hidden rounded-xl border border-[#e2eaf2] bg-white">
        <div className="h-2 bg-[#1673d1]" />
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-10">
          <div>
            <div className="flex size-14 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
              <Stethoscope className="size-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
              {doctor.specialist?.name || "Health information"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-3xl">
              {doctor.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748b]">
              {doctor.description ||
                "A specialized AI health information assistant, ready to help you organize questions and explore general guidance."}
            </p>
            <div className="mt-7 border-t border-[#edf2f7] pt-5">
              <h3 className="text-sm font-semibold text-[#173c65]">
                How this assistant can help
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#64748b]">
                <li className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#16a085]" />
                  Understand general information related to this specialty
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#16a085]" />
                  Organize questions to discuss with a clinician
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#16a085]" />
                  Explore possible next steps for non-emergency concerns
                </li>
              </ul>
            </div>
          </div>
          <aside className="rounded-xl border border-[#dcecf8] bg-[#f4faff] p-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#1673d1]">
              <ShieldCheck className="size-[18px]" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-[#173c65]">
              Start a conversation
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#647b92]">
              Share your question and get clear, general health information.
            </p>
            <Link
              href="/consultations/new"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1673d1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5fac]"
            >
              Start consultation <ArrowRight className="size-4" />
            </Link>
            <p className="mt-4 text-[10px] leading-5 text-[#8192a5]">
              Not a diagnosis or emergency service.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

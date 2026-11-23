"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  HeartPulse,
  ScanFace,
  Stethoscope,
} from "lucide-react";

type Specialist = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { doctors: number };
};
const icons = [Stethoscope, HeartPulse, Brain, ScanFace];

export default function SpecialtiesPage() {
  const [items, setItems] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/specialists`,
    )
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setItems)
      .catch(() =>
        setError(
          "Specialties are temporarily unavailable. Please try again later.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
          Explore care pathways
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-[30px]">
          Medical specialties
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
          Browse focused areas of health information and find the right AI
          assistant for your questions.
        </p>
      </div>
      {error ? (
        <div className="mt-7 rounded-xl border border-[#f1d8d7] bg-white p-6 text-sm text-[#a83b45]">
          {error}
        </div>
      ) : loading ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-xl border border-[#e2eaf2] bg-white"
            />
          ))}
        </div>
      ) : items.length ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((specialty, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link
                key={specialty.id}
                href={`/doctors?specialty=${specialty.slug}`}
                className="group rounded-xl border border-[#e2eaf2] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#b8d7f0] hover:shadow-[0_12px_30px_rgba(34,76,120,.08)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-medium text-[#8192a5]">
                    {specialty._count?.doctors ?? 0} assistants
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#173c65]">
                  {specialty.name}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#71839a]">
                  {specialty.description ||
                    "Explore general health information in this specialty."}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 border-t border-[#edf2f7] pt-3 text-xs font-semibold text-[#1673d1]">
                  Explore specialists{" "}
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-[#cbdbe9] bg-white px-5 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
            <Stethoscope className="size-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-[#173c65]">
            No specialties available yet
          </h3>
          <p className="mt-2 text-sm text-[#71839a]">
            Please check back soon as more assistants are added.
          </p>
        </div>
      )}
    </main>
  );
}

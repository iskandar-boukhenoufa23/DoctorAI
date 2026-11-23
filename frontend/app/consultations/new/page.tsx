"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
export default function NewConsultation() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const item = await apiFetch<{ id: string }>("/consultations", token, {
        method: "POST",
        body: JSON.stringify({ title: title || undefined }),
      });
      router.push(`/consultations/${item.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start consultation");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <Link
        href="/consultations"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#71839a] transition hover:text-[#1673d1]"
      >
        <ArrowLeft className="size-3.5" /> All consultations
      </Link>
      <div className="mt-5 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
          A thoughtful next step
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-[30px]">
          Start a consultation
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          Give this conversation a name so it is easy to find later. You can
          describe what is on your mind in the next step.
        </p>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">
        <form
          onSubmit={submit}
          className="rounded-xl border border-[#e2eaf2] bg-white p-5 sm:p-7"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-[#eaf4ff] text-[#1673d1]">
            <Sparkles className="size-[18px]" />
          </span>
          <label
            htmlFor="consultation-title"
            className="mt-6 block text-sm font-semibold text-[#173c65]"
          >
            What would you like to discuss?
          </label>
          <p className="mt-1 text-xs leading-5 text-[#8192a5]">
            A short title is enough. This is optional and can be changed later.
          </p>
          <input
            id="consultation-title"
            className="mt-3 h-12 w-full rounded-lg border border-[#dce6ef] bg-[#fbfdff] px-4 text-sm text-[#173c65] outline-none transition placeholder:text-[#9aa9b8] focus:border-[#78b3e8] focus:ring-4 focus:ring-[#1673d1]/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="For example, questions about my sleep"
          />
          <div className="mt-2 flex justify-between text-[11px] text-[#9aa9b8]">
            <span>Keep personal details private</span>
            <span>{title.length}/100</span>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-[#fff3f2] px-3 py-2 text-sm text-[#a83b45]"
            >
              {error}
            </p>
          )}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#edf2f7] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/consultations"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-[#71839a] hover:bg-[#f5f9fd]"
            >
              Cancel
            </Link>
            <button
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1673d1] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(22,115,209,.18)] transition hover:bg-[#0b5fac] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Starting…" : "Continue to conversation"}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
        <aside className="rounded-xl border border-[#dcecf8] bg-[#f4faff] p-5 sm:p-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[#1673d1]">
            <ShieldCheck className="size-5" />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-[#173c65]">
            A private space for your questions
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#647b92]">
            Your conversation can help you organize concerns and understand
            general health information.
          </p>
          <ul className="mt-5 space-y-3 border-t border-[#dcecf8] pt-4 text-xs leading-5 text-[#5d748b]">
            <li className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#16a085]" />
              Share only what feels comfortable.
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#16a085]" />
              This service does not provide a diagnosis.
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#16a085]" />
              For emergencies, contact local emergency services.
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

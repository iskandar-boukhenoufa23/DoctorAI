"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Paperclip,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  appendMessages,
  replaceMessages,
  type RootState,
  type ConsultationMessage,
} from "@/lib/store";
export default function Consultation() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const messages = useSelector((s: RootState) => s.chat.messages[id] || []);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    getToken()
      .then((t) =>
        t
          ? apiFetch<{ messages: ConsultationMessage[] }>(
              `/consultations/${id}`,
              t,
            )
          : null,
      )
      .then(
        (x) =>
          x &&
          dispatch(
            replaceMessages({ consultationId: id, messages: x.messages }),
          ),
      )
      .catch(() => setError("Unable to load this consultation."));
  }, [id, getToken, dispatch]);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const form = new FormData();
      form.set("message", text);
      if (file) form.set("image", file);
      const r = await apiFetch<{
        patientMessage: ConsultationMessage;
        doctorMessage: ConsultationMessage;
      }>(`/consultations/${id}/messages`, token, {
        method: "POST",
        body: form,
      });
      dispatch(
        appendMessages({
          consultationId: id,
          messages: [r.patientMessage, r.doctorMessage],
        }),
      );
      setText("");
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Message failed to send.");
    } finally {
      setSending(false);
    }
  }
  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <div className="flex items-center justify-between gap-4 border-b border-[#e2eaf2] pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/consultations"
            aria-label="Back to consultations"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#e2eaf2] bg-white text-[#71839a] transition hover:border-[#b8d7f0] hover:text-[#1673d1]"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#173c65]">
              Health conversation
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8192a5]">
              <span className="size-1.5 rounded-full bg-[#16a085]" /> Private
              consultation
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-[#f0f7fc] px-3 py-1.5 text-[10px] font-semibold text-[#5f7891] sm:flex">
          <ShieldCheck className="size-3.5 text-[#1673d1]" /> Health information
          only
        </div>
      </div>

      <div className="flex flex-1 flex-col py-5">
        <div className="flex flex-1 flex-col gap-4 pb-5">
          {messages.length === 0 && !error && (
            <div className="m-auto max-w-md px-4 py-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#1673d1]">
                <Bot className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-[#173c65]">
                What would you like help understanding?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#71839a]">
                Share what you have noticed, when it started, and any questions
                on your mind. You can attach a photo if it helps explain your
                concern.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] text-[#71839a]">
                <span className="rounded-full border border-[#e2eaf2] bg-white px-3 py-1.5">
                  Describe a symptom
                </span>
                <span className="rounded-full border border-[#e2eaf2] bg-white px-3 py-1.5">
                  Ask a health question
                </span>
              </div>
            </div>
          )}
          {messages.map((message) => {
            const patient = message.role === "PATIENT";
            return (
              <article
                key={message.id}
                className={`flex max-w-[88%] items-start gap-2.5 sm:max-w-[76%] ${patient ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <span
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${patient ? "bg-[#1673d1] text-white" : "bg-[#eaf4ff] text-[#1673d1]"}`}
                >
                  {patient ? (
                    <UserRound className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </span>
                <div
                  className={`min-w-0 rounded-xl px-4 py-3 ${patient ? "bg-[#1673d1] text-white" : "border border-[#e2eaf2] bg-white text-[#314c68]"}`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold ${patient ? "text-white/75" : "text-[#1673d1]"}`}
                  >
                    {patient ? "You" : "Doctor AI"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </p>
                </div>
              </article>
            );
          })}
          {error && (
            <p
              role="alert"
              className="mx-auto rounded-lg bg-[#fff3f2] px-4 py-2 text-xs text-[#a83b45]"
            >
              {error}
            </p>
          )}
        </div>

        <form
          onSubmit={send}
          className="rounded-xl border border-[#dce6ef] bg-white p-3 shadow-[0_8px_24px_rgba(34,76,120,.05)] sm:p-4"
        >
          <textarea
            aria-label="Your message"
            className="min-h-[96px] w-full resize-y border-0 bg-transparent px-1 py-1 text-sm leading-6 text-[#173c65] outline-none placeholder:text-[#9aa9b8] focus:ring-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={10000}
            placeholder="Tell us what’s been going on…"
          />
          {file && (
            <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-[#f3f8fc] px-3 py-2 text-xs text-[#526b84]">
              <span className="truncate">Attached: {file.name}</span>
              <button
                type="button"
                aria-label="Remove attachment"
                onClick={() => setFile(null)}
                className="flex size-6 shrink-0 items-center justify-center rounded-md hover:bg-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-[#edf2f7] pt-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-[#71839a] transition hover:bg-[#f4f8fc] hover:text-[#1673d1]">
              <Paperclip className="size-4" /> Attach image
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-[#9aa9b8] sm:block">
                For emergencies, contact local emergency services.
              </span>
              <button
                disabled={sending || !text.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1673d1] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0b5fac] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send"}
                <Send className="size-3.5" />
              </button>
            </div>
          </div>
        </form>
        <p className="mt-3 text-center text-[10px] leading-5 text-[#91a3b8] sm:hidden">
          Health information only. Contact local emergency services for urgent
          symptoms.
        </p>
      </div>
    </main>
  );
}

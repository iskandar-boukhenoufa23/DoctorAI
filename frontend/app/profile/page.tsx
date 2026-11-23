"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Check, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Profile = { fullName?: string; email?: string; avatarUrl?: string };

export default function ProfilePage() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<Profile>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getToken()
      .then((token) => (token ? apiFetch<Profile>("/profile/me", token) : null))
      .then((data) => data && setProfile(data))
      .catch(() => setNotice("Unable to load your profile."));
  }, [getToken]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      setProfile(
        await apiFetch<Profile>("/profile/me", token, {
          method: "PATCH",
          body: JSON.stringify(profile),
        }),
      );
      setNotice("Profile saved.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#1673d1]">
          Account settings
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-[#0b3b75] sm:text-[30px]">
          Your profile
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          Manage the personal details associated with your Doctor AI account.
        </p>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)]">
        <form
          onSubmit={save}
          className="rounded-xl border border-[#e2eaf2] bg-white p-5 sm:p-7"
        >
          <div className="flex items-center gap-3 border-b border-[#edf2f7] pb-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#eaf4ff] text-[#1673d1]">
              <UserRound className="size-[18px]" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[#173c65]">
                Personal information
              </h3>
              <p className="mt-0.5 text-xs text-[#8192a5]">
                Your account details
              </p>
            </div>
          </div>
          <label
            htmlFor="full-name"
            className="mt-5 block text-xs font-semibold text-[#526b84]"
          >
            Full name
            <input
              id="full-name"
              className="mt-2 h-11 w-full rounded-lg border border-[#dce6ef] bg-[#fbfdff] px-3 text-sm text-[#173c65] outline-none transition focus:border-[#78b3e8] focus:ring-4 focus:ring-[#1673d1]/10"
              value={profile.fullName || ""}
              onChange={(event) =>
                setProfile({ ...profile, fullName: event.target.value })
              }
              autoComplete="name"
            />
          </label>
          <label
            htmlFor="email"
            className="mt-4 block text-xs font-semibold text-[#526b84]"
          >
            Email address
            <input
              id="email"
              type="email"
              className="mt-2 h-11 w-full rounded-lg border border-[#dce6ef] bg-[#fbfdff] px-3 text-sm text-[#173c65] outline-none transition focus:border-[#78b3e8] focus:ring-4 focus:ring-[#1673d1]/10"
              value={profile.email || ""}
              onChange={(event) =>
                setProfile({ ...profile, email: event.target.value })
              }
              autoComplete="email"
            />
          </label>
          {notice && (
            <p
              role="status"
              className={`mt-4 text-xs ${notice === "Profile saved." ? "text-[#168a75]" : "text-[#a83b45]"}`}
            >
              {notice}
            </p>
          )}
          <div className="mt-6 flex justify-end border-t border-[#edf2f7] pt-5">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1673d1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5fac] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
              {saving ? null : <Save className="size-4" />}
            </button>
          </div>
        </form>
        <aside className="rounded-xl border border-[#dcecf8] bg-[#f4faff] p-5 sm:p-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[#1673d1]">
            <LockKeyhole className="size-5" />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-[#173c65]">
            Your information stays yours
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#647b92]">
            Your details help personalize your account. Only share information
            that is necessary for your experience.
          </p>
          <div className="mt-5 flex items-start gap-2 border-t border-[#dcecf8] pt-4 text-xs leading-5 text-[#5d748b]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16a085]" />
            <span>
              Use a secure, private device when updating your personal
              information.
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#168a75]">
            <Check className="size-3.5" /> Account details are protected
          </div>
        </aside>
      </div>
    </main>
  );
}

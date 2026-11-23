import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { HeartPulse, ShieldCheck } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7fafd] px-4 py-10">
      <Link href="/" className="mb-7 flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#1673d1] text-white shadow-[0_8px_20px_rgba(22,115,209,.2)]">
          <HeartPulse className="size-5" />
        </span>
        <span className="text-[18px] font-bold tracking-[-.04em] text-[#172b4d]">
          Doctor <span className="text-[#1673d1]">AI</span>
        </span>
      </Link>
      <div className="w-full max-w-[440px] rounded-xl border border-[#e2eaf2] bg-white p-2 shadow-[0_18px_50px_rgba(34,76,120,.08)]">
        <SignUp />
      </div>
      <p className="mt-5 flex items-center gap-1.5 text-[11px] text-[#8192a5]">
        <ShieldCheck className="size-3.5 text-[#16a085]" />
        Private, thoughtful health guidance
      </p>
    </main>
  );
}

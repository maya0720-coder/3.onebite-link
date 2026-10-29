"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full cursor-pointer rounded-xl bg-[var(--accent)] px-5 py-3.5 text-[17px] font-bold text-white"
    >
      {pending ? "저장 중..." : "저장"}
    </button>
  );
}

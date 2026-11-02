"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/lib/auth-actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutSubmit />
    </form>
  );
}

function LogoutSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="sidebar-item block w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-[var(--text-sub)] disabled:cursor-not-allowed"
    >
      {pending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}

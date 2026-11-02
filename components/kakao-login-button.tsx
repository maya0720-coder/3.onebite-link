"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom";
import { signInWithKakao } from "@/lib/auth-actions";

function KakaoSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="카카오 로그인"
      className="block w-full cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
    >
      {/* 카카오 공식 버튼 이미지(600x90, 고해상도용)를 버튼 너비에 맞춰 줄여 쓴다. */}
      <Image
        src="/kakao_login_large_wide.png"
        alt="카카오 로그인"
        width={600}
        height={90}
        priority
        className="h-auto w-full"
      />
    </button>
  );
}

export default function KakaoLoginButton() {
  return (
    <form action={signInWithKakao}>
      <KakaoSubmit />
    </form>
  );
}

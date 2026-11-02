import type { Metadata } from "next";
import NextLink from "next/link";
import SignupForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <SignupForm />
      <p className="text-center text-xs text-[var(--placeholder)]">
        회원가입 시{" "}
        <NextLink href="/privacy" className="underline hover:text-[var(--text-sub)]">
          개인정보 처리방침
        </NextLink>
        이 적용돼요.
      </p>
      <p className="text-center text-sm text-[var(--text-sub)]">
        이미 계정이 있으신가요?{" "}
        <NextLink href="/login" className="font-semibold text-[var(--accent)] hover:underline">
          로그인
        </NextLink>
      </p>
    </section>
  );
}

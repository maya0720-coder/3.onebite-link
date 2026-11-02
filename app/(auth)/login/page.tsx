import type { Metadata } from "next";
import NextLink from "next/link";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <LoginForm />
      <div className="flex flex-col gap-3">
        <p className="text-center text-sm">
          <NextLink href="/forgot-password" className="text-[var(--text-sub)] hover:underline">
            비밀번호를 잊으셨나요?
          </NextLink>
        </p>
        <p className="text-center text-sm text-[var(--text-sub)]">
          계정이 없으신가요?{" "}
          <NextLink href="/signup" className="font-semibold text-[var(--accent)] hover:underline">
            회원가입
          </NextLink>
        </p>
      </div>
    </section>
  );
}

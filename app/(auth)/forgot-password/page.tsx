import NextLink from "next/link";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-center text-[20px] font-bold">비밀번호 찾기</h1>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-[var(--text-sub)]">
        비밀번호가 기억나셨나요?{" "}
        <NextLink href="/login" className="font-semibold text-[var(--accent)] hover:underline">
          로그인
        </NextLink>
      </p>
    </section>
  );
}

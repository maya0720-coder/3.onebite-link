import NextLink from "next/link";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <LoginForm />
      <p className="text-center text-sm text-[var(--text-sub)]">
        계정이 없으신가요?{" "}
        <NextLink href="/signup" className="font-semibold text-[var(--accent)] hover:underline">
          회원가입
        </NextLink>
      </p>
    </section>
  );
}

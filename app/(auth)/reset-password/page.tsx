import ResetPasswordForm from "@/components/reset-password-form";

// 재설정 메일의 링크(/auth/confirm)로 세션이 만들어진 뒤에만 들어올 수 있다. (proxy에서 확인)
export default function ResetPasswordPage() {
  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-center text-[20px] font-bold">비밀번호 재설정</h1>
      <ResetPasswordForm />
    </section>
  );
}

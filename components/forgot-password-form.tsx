"use client";

import { type FormEvent, Suspense, useActionState, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthInput from "@/components/auth-input";
import SaveButton from "@/components/save-button";
import { useToast } from "@/components/toast";
import { type AuthActionState, sendPasswordResetEmail } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

// /auth/confirm에서 링크 확인에 실패하면 ?error=invalid_link로 돌아온다.
const LINK_ERROR_MESSAGE = "재설정 링크가 만료되었거나 올바르지 않아요. 다시 요청해주세요.";

// useSearchParams는 요청 시점에만 알 수 있으므로, 프리렌더 단계에서는 안내 없이 먼저 보여준다.
export default function ForgotPasswordForm() {
  return (
    <Suspense fallback={<Form />}>
      <FormWithLinkError />
    </Suspense>
  );
}

function FormWithLinkError() {
  const linkError = useSearchParams().get("error") === "invalid_link";
  return <Form initialMessage={linkError ? LINK_ERROR_MESSAGE : undefined} />;
}

function Form({ initialMessage }: { initialMessage?: string }) {
  const [email, setEmail] = useState("");
  const [toast, showToast] = useToast(initialMessage);
  // 응답을 기다리는 동안 들어온 중복 제출을 막는다.
  const submittingRef = useRef(false);

  const [, formAction] = useActionState(
    async (prevState: AuthActionState, formData: FormData) => {
      try {
        const result = await sendPasswordResetEmail(prevState, formData);
        const message = result.error ?? result.message;
        if (message) showToast(message);
        return result;
      } finally {
        submittingRef.current = false;
      }
    },
    initialState,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
  };

  return (
    <>
      {toast}
      <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-[15px] leading-[1.6] text-[var(--text-sub)]">
          가입한 이메일을 입력하면 비밀번호를 다시 설정할 수 있는 링크를 보내드려요.
        </p>
        <AuthInput
          id="email"
          label="이메일"
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <div className="mt-2">
          <SaveButton
            label="비밀번호 재설정 링크 발송"
            pendingLabel="발송 중..."
            disabled={email.trim() === ""}
          />
        </div>
      </form>
    </>
  );
}

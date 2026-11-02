"use client";

import { type FormEvent, Suspense, useActionState, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthInput from "@/components/auth-input";
import KakaoLoginButton from "@/components/kakao-login-button";
import SaveButton from "@/components/save-button";
import { useToast } from "@/components/toast";
import { type AuthActionState, login } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

// 카카오 로그인이 취소되거나 실패하면 ?error=kakao로 돌아온다.
const KAKAO_ERROR_MESSAGE = "카카오 로그인에 실패했어요. 다시 시도해주세요.";

// useSearchParams는 요청 시점에만 알 수 있으므로, 프리렌더 단계에서는 안내 없이 먼저 보여준다.
export default function LoginForm() {
  return (
    <Suspense fallback={<Form />}>
      <FormWithOAuthError />
    </Suspense>
  );
}

function FormWithOAuthError() {
  const kakaoError = useSearchParams().get("error") === "kakao";
  return <Form initialMessage={kakaoError ? KAKAO_ERROR_MESSAGE : undefined} />;
}

function Form({ initialMessage }: { initialMessage?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, showToast] = useToast(initialMessage);
  // 응답을 기다리는 동안 들어온 중복 제출을 막는다.
  const submittingRef = useRef(false);

  const [, formAction] = useActionState(
    async (prevState: AuthActionState, formData: FormData) => {
      try {
        const result = await login(prevState, formData);
        if (result.error) showToast(result.error);
        return result;
      } finally {
        submittingRef.current = false;
      }
    },
    initialState,
  );

  const isFilled = email.trim() !== "" && password !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
  };

  return (
    <div className="flex flex-col gap-3">
      {toast}
      <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          id="email"
          label="이메일"
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          id="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        <div className="mt-2">
          <SaveButton label="로그인" pendingLabel="로그인 중..." disabled={!isFilled} />
        </div>
      </form>
      {/* form 안에 form을 넣을 수 없어서 로그인 폼 바로 아래에 따로 둔다. */}
      <KakaoLoginButton />
    </div>
  );
}

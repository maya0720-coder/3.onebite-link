"use client";

import { type FormEvent, useActionState, useRef, useState } from "react";
import AuthInput from "@/components/auth-input";
import SaveButton from "@/components/save-button";
import { useToast } from "@/components/toast";
import { type AuthActionState, login } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, showToast] = useToast();
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
    <>
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
    </>
  );
}

"use client";

import { type FormEvent, useActionState, useRef, useState } from "react";
import AuthInput from "@/components/auth-input";
import SaveButton from "@/components/save-button";
import { useToast } from "@/components/toast";
import { type AuthActionState, signup } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toast, showToast] = useToast();
  // 응답을 기다리는 동안 들어온 중복 제출을 막는다.
  const submittingRef = useRef(false);

  const [, formAction] = useActionState(
    async (prevState: AuthActionState, formData: FormData) => {
      try {
        const result = await signup(prevState, formData);
        if (result.error) showToast(result.error);
        return result;
      } finally {
        submittingRef.current = false;
      }
    },
    initialState,
  );

  const isFilled = email.trim() !== "" && password !== "" && passwordConfirm !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    // 회원가입 버튼을 누르면 먼저 비밀번호가 같은지 확인한다.
    if (password !== passwordConfirm) {
      event.preventDefault();
      showToast("비밀번호가 일치하지 않아요.");
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
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <AuthInput
          id="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
        />
        <div className="mt-2">
          <SaveButton label="회원가입" pendingLabel="가입 중..." disabled={!isFilled} />
        </div>
      </form>
    </>
  );
}

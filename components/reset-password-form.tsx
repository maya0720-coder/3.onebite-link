"use client";

import { type FormEvent, useActionState, useRef, useState } from "react";
import AuthInput from "@/components/auth-input";
import SaveButton from "@/components/save-button";
import { useToast } from "@/components/toast";
import { type AuthActionState, updatePassword } from "@/lib/auth-actions";

const initialState: AuthActionState = {};

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toast, showToast] = useToast();
  // 응답을 기다리는 동안 들어온 중복 제출을 막는다.
  const submittingRef = useRef(false);

  const [, formAction] = useActionState(
    async (prevState: AuthActionState, formData: FormData) => {
      try {
        const result = await updatePassword(prevState, formData);
        if (result.error) showToast(result.error);
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
          id="password"
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <AuthInput
          id="passwordConfirm"
          label="새 비밀번호 확인"
          type="password"
          placeholder="새 비밀번호를 한 번 더 입력해 주세요"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
        />
        <div className="mt-2">
          <SaveButton
            label="비밀번호 변경"
            pendingLabel="변경 중..."
            disabled={password === "" || passwordConfirm === ""}
          />
        </div>
      </form>
    </>
  );
}

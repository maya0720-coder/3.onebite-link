"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthActionState = {
  error?: string;
  // 성공했을 때 알려줄 안내 문구
  message?: string;
  // 같은 오류가 연달아 나도 토스트를 다시 띄우기 위한 값
  attempt?: number;
};

// Supabase 오류 코드 → 한국어 메시지
const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: "이미 가입된 이메일이에요.",
  email_exists: "이미 가입된 이메일이에요.",
  weak_password: "비밀번호는 6자 이상으로 입력해주세요.",
  email_address_invalid: "올바른 이메일 주소를 입력해주세요.",
  validation_failed: "이메일과 비밀번호를 다시 확인해주세요.",
  email_address_not_authorized: "이 이메일 주소로는 인증 메일을 보낼 수 없어요.",
  over_email_send_rate_limit: "인증 메일 요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
  over_request_rate_limit: "요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
  signup_disabled: "지금은 회원가입을 할 수 없어요.",
  email_provider_disabled: "지금은 이메일로 회원가입을 할 수 없어요.",
};

const DEFAULT_SIGNUP_ERROR = "회원가입에 실패했어요. 잠시 후 다시 시도해주세요.";

export async function signup(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const fail = (error: string) => ({ error, attempt: (prevState.attempt ?? 0) + 1 });

  if (!email || !password || !passwordConfirm) {
    return fail("이메일과 비밀번호를 모두 입력해주세요.");
  }
  if (password !== passwordConfirm) {
    return fail("비밀번호가 일치하지 않아요.");
  }

  try {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return fail((error.code && SIGNUP_ERROR_MESSAGES[error.code]) || DEFAULT_SIGNUP_ERROR);
    }
  } catch {
    return fail(DEFAULT_SIGNUP_ERROR);
  }

  redirect("/");
}

const RESET_ERROR_MESSAGES: Record<string, string> = {
  email_address_invalid: "올바른 이메일 주소를 입력해주세요.",
  validation_failed: "올바른 이메일 주소를 입력해주세요.",
  email_address_not_authorized: "이 이메일 주소로는 메일을 보낼 수 없어요.",
  over_email_send_rate_limit: "메일 요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
  over_request_rate_limit: "요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
};

const DEFAULT_RESET_ERROR = "메일을 보내지 못했어요. 잠시 후 다시 시도해주세요.";

export async function sendPasswordResetEmail(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const attempt = (prevState.attempt ?? 0) + 1;
  const fail = (error: string) => ({ error, attempt });

  if (!email) {
    return fail("이메일을 입력해주세요.");
  }

  try {
    // 메일의 링크를 누르면 /auth/confirm에서 세션을 만든 뒤 재설정 페이지로 보낸다.
    const origin = (await headers()).get("origin") ?? "http://localhost:3000";
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=/reset-password`,
    });
    if (error) {
      return fail((error.code && RESET_ERROR_MESSAGES[error.code]) || DEFAULT_RESET_ERROR);
    }
  } catch {
    return fail(DEFAULT_RESET_ERROR);
  }

  // 가입 여부를 알려주지 않도록 성공 문구는 항상 같게 보여준다.
  return { message: "비밀번호 재설정 링크를 보냈어요. 메일함을 확인해주세요.", attempt };
}

const UPDATE_PASSWORD_ERROR_MESSAGES: Record<string, string> = {
  same_password: "기존 비밀번호와 다른 비밀번호를 입력해주세요.",
  weak_password: "비밀번호는 6자 이상으로 입력해주세요.",
  session_not_found: "재설정 링크가 만료되었어요. 다시 요청해주세요.",
  reauthentication_needed: "재설정 링크가 만료되었어요. 다시 요청해주세요.",
};

const DEFAULT_UPDATE_PASSWORD_ERROR = "비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해주세요.";

export async function updatePassword(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const fail = (error: string) => ({ error, attempt: (prevState.attempt ?? 0) + 1 });

  if (!password || !passwordConfirm) {
    return fail("새 비밀번호를 모두 입력해주세요.");
  }
  if (password !== passwordConfirm) {
    return fail("비밀번호가 일치하지 않아요.");
  }

  try {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return fail(
        (error.code && UPDATE_PASSWORD_ERROR_MESSAGES[error.code]) || DEFAULT_UPDATE_PASSWORD_ERROR,
      );
    }
  } catch {
    return fail(DEFAULT_UPDATE_PASSWORD_ERROR);
  }

  redirect("/");
}

export async function logout() {
  const supabase = createClient(await cookies());
  // 서버 세션을 끝내고 인증 쿠키를 지운다.
  await supabase.auth.signOut();
  redirect("/login");
}

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않아요.",
  email_not_confirmed: "이메일 인증을 완료한 뒤 로그인해주세요.",
  user_banned: "이용이 제한된 계정이에요.",
  over_request_rate_limit: "로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.",
  validation_failed: "이메일과 비밀번호를 다시 확인해주세요.",
  email_provider_disabled: "지금은 이메일로 로그인할 수 없어요.",
};

const DEFAULT_LOGIN_ERROR = "로그인에 실패했어요. 잠시 후 다시 시도해주세요.";

export async function login(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fail = (error: string) => ({ error, attempt: (prevState.attempt ?? 0) + 1 });

  if (!email || !password) {
    return fail("이메일과 비밀번호를 모두 입력해주세요.");
  }

  try {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return fail((error.code && LOGIN_ERROR_MESSAGES[error.code]) || DEFAULT_LOGIN_ERROR);
    }
  } catch {
    return fail(DEFAULT_LOGIN_ERROR);
  }

  redirect("/");
}

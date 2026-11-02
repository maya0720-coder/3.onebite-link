import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 비밀번호 재설정 메일의 링크가 도착하는 곳. 링크를 확인해 세션을 만든 뒤 next 경로로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  const supabase = createClient(await cookies());
  let ok = false;
  try {
    if (code) {
      // 기본 메일 템플릿(PKCE): ?code=...
      ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
    } else if (tokenHash && type) {
      // 템플릿을 token_hash 방식으로 바꾼 경우: ?token_hash=...&type=recovery
      ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
    }
  } catch {
    ok = false;
  }

  redirect(ok ? next : "/forgot-password?error=invalid_link");
}

// 외부 주소로 튕겨 나가지 않도록 같은 사이트 안의 경로만 허용한다.
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

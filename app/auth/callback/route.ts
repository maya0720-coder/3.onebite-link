import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 카카오 등 소셜 로그인을 마치고 돌아오는 곳. code로 세션을 만든 뒤 홈으로 보낸다.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  let ok = false;
  if (code) {
    try {
      const supabase = createClient(await cookies());
      ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
    } catch {
      ok = false;
    }
  }

  // 새 계정으로 로그인했으므로 이전 계정의 화면을 버리고 데이터를 처음부터 다시 불러온다.
  if (ok) revalidatePath("/", "layout");

  // 사용자가 동의를 취소했거나 code가 잘못된 경우 로그인 페이지에서 안내한다.
  redirect(ok ? "/" : "/login?error=kakao");
}

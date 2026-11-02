import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";
import type { Folder, Link } from "@/types/link";
import { createClient as createServerClient } from "@/utils/supabase/server";

// 모든 요청은 로그인한 사용자의 세션으로 보낸다.
// DB의 RLS가 auth.uid()로 요청한 사용자를 알아내 자기 데이터만 조회·추가·수정·삭제하게 하고,
// 추가할 때는 user_id 컬럼을 자동으로 채운다.
async function userClient() {
  return createServerClient(await cookies());
}

export const FOLDERS_TAG = "folders";
export const LINKS_TAG = "links";

// 지금 로그인한 사용자의 아이디. 로그인하지 않았으면 null.
// Supabase의 로그인 확인(getUser)은 토큰 만료를 검사하려고 내부에서 Date.now()를 부른다.
// Partial Prefetching이 켜져 있으면 쿠키를 읽은 뒤에도 미리 렌더링(App Shell)이 이어지는데,
// 그 안에서 매번 값이 바뀌는 Date.now()를 쓰면 Next.js가 경고를 띄운다.
// "use cache: private"로 감싸면 이 함수는 요청 시점에만 실행되고, 결과는 그 사용자(세션)의
// 브라우저에만 보관되므로 경고 없이 안전하게 쓸 수 있다.
async function getCurrentUserId(): Promise<string | null> {
  "use cache: private";
  cacheLife({ stale: 300 });
  const supabase = await userClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

// 조회는 로그인한 사용자의 세션(쿠키)으로 해야 RLS를 통과한다.
// 쿠키는 "use cache"에서는 읽을 수 없으므로 "use cache: private"를 쓴다.
// private 캐시는 서버에 공유 저장되지 않고 그 사용자(세션) 브라우저에만 남으므로,
// 다른 계정의 데이터가 섞일 일이 없고 계정이 바뀌면 처음부터 다시 불러온다.
// user_id 조건은 RLS가 이미 걸러 주지만, 인덱스를 타도록 쿼리에도 명시한다.

// 폴더 조회·추가·이름 수정·삭제는 Supabase folders 테이블을 쓴다.
export async function getFolders(): Promise<Folder[]> {
  "use cache: private";
  cacheTag(FOLDERS_TAG);
  cacheLife({ stale: 300 });
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .eq("user_id", userId)
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addFolder(name: string): Promise<Folder> {
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("folders")
    .insert({ name })
    .select("id, name")
    .single();
  if (error) throw error;
  return data;
}

export async function hasFolderName(name: string, excludeId?: number): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const supabase = await userClient();
  let query = supabase.from("folders").select("id").eq("user_id", userId).eq("name", name);
  if (excludeId !== undefined && Number.isInteger(excludeId)) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query.limit(1);
  if (error) throw error;
  return data.length > 0;
}

export async function renameFolder(id: number, name: string): Promise<boolean> {
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("folders")
    .update({ name })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}

// 링크 조회·추가·수정·삭제는 Supabase links 테이블을 쓴다.
const LINK_COLUMNS = "id, url, title, description, thumbnail_url, folder_id";

type LinkRow = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | null;
};

function toLink(row: LinkRow): Link {
  return {
    id: row.id,
    title: row.title ?? "",
    url: row.url,
    description: row.description ?? "",
    image: row.thumbnail_url ?? undefined,
    folderId: row.folder_id ?? 0,
  };
}

export async function getLinks(): Promise<Link[]> {
  "use cache: private";
  cacheTag(LINKS_TAG);
  cacheLife({ stale: 300 });
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("links")
    .select(LINK_COLUMNS)
    .eq("user_id", userId)
    .order("id", { ascending: true });
  if (error) throw error;
  return data.map(toLink);
}

export async function addLink(link: Omit<Link, "id">): Promise<Link> {
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("links")
    .insert({
      url: link.url,
      title: link.title,
      description: link.description,
      thumbnail_url: link.image ?? null,
      folder_id: link.folderId,
    })
    .select(LINK_COLUMNS)
    .single();
  if (error) throw error;
  return toLink(data);
}

export async function removeLink(id: number): Promise<boolean> {
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}

export async function updateLink(
  id: number,
  link: Pick<Link, "title" | "description" | "folderId">,
): Promise<boolean> {
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("links")
    .update({ title: link.title, description: link.description, folder_id: link.folderId })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}

export async function hasFolder(id: number): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const supabase = await userClient();
  const { data, error } = await supabase
    .from("folders")
    .select("id")
    .eq("user_id", userId)
    .eq("id", id)
    .limit(1);
  if (error) throw error;
  return data.length > 0;
}

// 폴더를 지우면 그 폴더에 담긴 링크도 함께 지운다.
// 외래 키가 ON DELETE SET NULL이라 링크를 먼저 직접 지운다.
export async function removeFolder(id: number): Promise<boolean> {
  const supabase = await userClient();
  const { error: linksError } = await supabase.from("links").delete().eq("folder_id", id);
  if (linksError) throw linksError;

  const { data, error } = await supabase
    .from("folders")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}

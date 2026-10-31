import { createClient } from "@supabase/supabase-js";
import { cacheTag } from "next/cache";
import type { Folder, Link } from "@/types/link";

export const FOLDERS_TAG = "folders";
export const LINKS_TAG = "links";

// "use cache" 안에서는 쿠키를 읽을 수 없으므로 쿠키 없는 클라이언트를 쓴다.
// 캐시는 "use cache"와 cacheTag로만 관리한다. fetch 응답까지 캐시되면 태그로 무효화되지 않아
// 이전 빌드의 조회 결과가 남으므로 fetch 캐시는 끈다.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } },
);

// 폴더 조회·추가·이름 수정·삭제는 Supabase folders 테이블을 쓴다.
export async function getFolders(): Promise<Folder[]> {
  "use cache";
  cacheTag(FOLDERS_TAG);
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addFolder(name: string): Promise<Folder> {
  const { data, error } = await supabase
    .from("folders")
    .insert({ name })
    .select("id, name")
    .single();
  if (error) throw error;
  return data;
}

export async function hasFolderName(name: string, excludeId?: number): Promise<boolean> {
  let query = supabase.from("folders").select("id").eq("name", name);
  if (excludeId !== undefined && Number.isInteger(excludeId)) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query.limit(1);
  if (error) throw error;
  return data.length > 0;
}

export async function renameFolder(id: number, name: string): Promise<boolean> {
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
  "use cache";
  cacheTag(LINKS_TAG);
  const { data, error } = await supabase
    .from("links")
    .select(LINK_COLUMNS)
    .order("id", { ascending: true });
  if (error) throw error;
  return data.map(toLink);
}

export async function addLink(link: Omit<Link, "id">): Promise<Link> {
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
  const { data, error } = await supabase
    .from("links")
    .update({ title: link.title, description: link.description, folder_id: link.folderId })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}

export async function hasFolder(id: number): Promise<boolean> {
  const { data, error } = await supabase.from("folders").select("id").eq("id", id).limit(1);
  if (error) throw error;
  return data.length > 0;
}

// 폴더를 지우면 그 폴더에 담긴 링크도 함께 지운다.
// 외래 키가 ON DELETE SET NULL이라 링크를 먼저 직접 지운다.
export async function removeFolder(id: number): Promise<boolean> {
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

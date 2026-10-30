import { createClient } from "@supabase/supabase-js";
import { cacheTag } from "next/cache";
import type { Folder, Link } from "@/types/link";

export const FOLDERS_TAG = "folders";
export const LINKS_TAG = "links";

// "use cache" 안에서는 쿠키를 읽을 수 없으므로 쿠키 없는 클라이언트를 쓴다.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// 폴더 조회·추가·이름 수정·삭제는 Supabase folders 테이블을 쓴다.
// 아래 링크는 아직 서버 메모리에만 저장된다.
const folders: Folder[] = [];

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

let links: Link[] = [
  {
    id: 1,
    title: "Next.js Docs",
    url: "https://nextjs.org/docs",
    description: "Next.js 공식 문서",
    folderId: 1,
  },
  {
    id: 2,
    title: "React",
    url: "https://react.dev",
    description: "React 공식 문서와 튜토리얼",
    folderId: 1,
  },
  {
    id: 3,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "유틸리티 우선 CSS 프레임워크",
    folderId: 1,
  },
  {
    id: 4,
    title: "Figma",
    url: "https://www.figma.com",
    description: "협업 디자인 툴",
    folderId: 2,
  },
  {
    id: 5,
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "디자인 레퍼런스 모음",
    folderId: 2,
  },
  {
    id: 6,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 기술 레퍼런스",
    folderId: 3,
  },
  {
    id: 7,
    title: "GitHub",
    url: "https://github.com",
    description: "코드 호스팅 플랫폼",
    folderId: 4,
  },
  {
    id: 8,
    title: "Vercel",
    url: "https://vercel.com",
    description: "프론트엔드 배포 플랫폼",
    folderId: 4,
  },
];

export async function getLinks(): Promise<Link[]> {
  "use cache";
  cacheTag(LINKS_TAG);
  return links;
}

export function addLink(link: Omit<Link, "id">): Link {
  const id = Math.max(0, ...links.map((link) => link.id)) + 1;
  const newLink = { id, ...link };
  links.push(newLink);
  return newLink;
}

export function removeLink(id: number): Link | undefined {
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) return undefined;
  return links.splice(index, 1)[0];
}

export function updateLink(
  id: number,
  data: Pick<Link, "title" | "description" | "folderId">,
): boolean {
  const link = links.find((link) => link.id === id);
  if (!link) return false;
  Object.assign(link, data);
  return true;
}

export function hasFolder(id: number): boolean {
  return folders.some((folder) => folder.id === id);
}

// 폴더를 지우면 그 폴더에 담긴 링크도 함께 지운다.
export async function removeFolder(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("folders")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (data.length === 0) return false;
  links = links.filter((link) => link.folderId !== id);
  return true;
}

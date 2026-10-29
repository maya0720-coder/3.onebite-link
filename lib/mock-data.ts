import { cacheTag } from "next/cache";
import type { Folder, Link } from "@/types/link";

export const FOLDERS_TAG = "folders";
export const LINKS_TAG = "links";

// 서버 메모리에만 저장되므로 서버를 재시작하면 초기값으로 돌아간다.
const folders: Folder[] = [
  { id: 1, name: "개발" },
  { id: 2, name: "디자인" },
  { id: 3, name: "읽을거리" },
  { id: 4, name: "도구" },
];

export async function getFolders(): Promise<Folder[]> {
  "use cache";
  cacheTag(FOLDERS_TAG);
  return folders;
}

export function addFolder(name: string): Folder {
  const id = Math.max(0, ...folders.map((folder) => folder.id)) + 1;
  const folder = { id, name };
  folders.push(folder);
  return folder;
}

export function hasFolderName(name: string, excludeId?: number): boolean {
  return folders.some((folder) => folder.name === name && folder.id !== excludeId);
}

export function renameFolder(id: number, name: string): boolean {
  const folder = folders.find((folder) => folder.id === id);
  if (!folder) return false;
  folder.name = name;
  return true;
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

// 폴더를 지우면 그 폴더에 담긴 링크도 함께 지운다.
export function removeFolder(id: number): boolean {
  const index = folders.findIndex((folder) => folder.id === id);
  if (index === -1) return false;
  folders.splice(index, 1);
  links = links.filter((link) => link.folderId !== id);
  return true;
}

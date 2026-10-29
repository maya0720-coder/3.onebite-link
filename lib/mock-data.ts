import type { Folder, Link } from "@/types/link";

export const folders: Folder[] = [
  { id: 1, name: "개발" },
  { id: 2, name: "디자인" },
  { id: 3, name: "읽을거리" },
  { id: 4, name: "도구" },
];

export const links: Link[] = [
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

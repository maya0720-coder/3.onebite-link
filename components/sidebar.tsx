import NextLink from "next/link";
import { Suspense } from "react";
import FolderList from "@/components/folder-list";
import LogoutButton from "@/components/logout-button";
import SidebarItem from "@/components/sidebar-item";

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 px-3">
      {/* 헤더(56px) 아래 화면 높이만큼 고정해서 로그아웃 버튼이 항상 사이드바 맨 아래에 오게 한다. */}
      <div className="sticky top-14 flex h-[calc(100vh-56px)] flex-col pt-9 pb-6">
        <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
          <SidebarItem label="전체" href="/" />
          {/* 폴더 목록은 로그인한 사용자마다 달라 요청 시점에 불러온다. */}
          <Suspense fallback={<FolderListSkeleton />}>
            <FolderList />
          </Suspense>
        </nav>
        <div className="mt-4 border-t border-[var(--hover-bg)] pt-4">
          <LogoutButton />
          <NextLink
            href="/privacy"
            className="mt-1 block px-4 py-1.5 text-[13px] text-[var(--placeholder)] hover:underline"
          >
            개인정보 처리방침
          </NextLink>
        </div>
      </div>
    </aside>
  );
}

function FolderListSkeleton() {
  return (
    <div aria-busy="true" aria-label="불러오는 중" className="flex flex-col gap-2 px-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-5 animate-pulse rounded-md bg-[var(--disabled)]" />
      ))}
    </div>
  );
}

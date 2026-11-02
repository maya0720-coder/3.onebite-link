import FolderList from "@/components/folder-list";
import LogoutButton from "@/components/logout-button";
import SidebarItem from "@/components/sidebar-item";
import type { Folder } from "@/types/link";

type SidebarProps = {
  folders: Folder[];
};

export default function Sidebar({ folders }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 px-3">
      {/* 헤더(56px) 아래 화면 높이만큼 고정해서 로그아웃 버튼이 항상 사이드바 맨 아래에 오게 한다. */}
      <div className="sticky top-14 flex h-[calc(100vh-56px)] flex-col pt-9 pb-6">
        <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
          <SidebarItem label="전체" href="/" />
          <FolderList folders={folders} />
        </nav>
        <div className="mt-4 border-t border-[var(--hover-bg)] pt-4">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

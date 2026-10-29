import FolderList from "@/components/folder-list";
import SidebarItem from "@/components/sidebar-item";
import type { Folder } from "@/types/link";

type SidebarProps = {
  folders: Folder[];
};

export default function Sidebar({ folders }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 px-3 pt-9">
      <nav className="sticky top-[92px] flex flex-col gap-6">
        <SidebarItem label="전체" href="/" />
        <FolderList folders={folders} />
      </nav>
    </aside>
  );
}

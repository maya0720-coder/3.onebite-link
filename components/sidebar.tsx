import FolderList from "@/components/folder-list";
import SidebarItem from "@/components/sidebar-item";
import type { Folder } from "@/types/link";

type SidebarProps = {
  folders: Folder[];
};

export default function Sidebar({ folders }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4">
      <nav className="flex flex-col gap-4">
        <SidebarItem label="All" active />
        <FolderList folders={folders} />
      </nav>
    </aside>
  );
}

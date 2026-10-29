import SidebarItem from "@/components/sidebar-item";
import type { Folder } from "@/types/link";

type FolderListProps = {
  folders: Folder[];
};

export default function FolderList({ folders }: FolderListProps) {
  return (
    <div>
      <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-zinc-500">
        폴더
      </h2>
      <ul className="flex flex-col gap-1">
        {folders.map((folder) => (
          <li key={folder.id}>
            <SidebarItem label={folder.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

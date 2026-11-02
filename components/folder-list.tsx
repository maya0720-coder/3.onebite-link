import DeleteFolderButton from "@/components/delete-folder-button";
import EditFolderButton from "@/components/edit-folder-button";
import SidebarItem from "@/components/sidebar-item";
import { getFolders, getLinks } from "@/lib/mock-data";

export default async function FolderList() {
  const [folders, links] = await Promise.all([getFolders(), getLinks()]);

  return (
    <div>
      <h2 className="mb-2 px-4 text-sm font-medium text-[var(--text-sub)]">
        폴더
      </h2>
      <ul className="flex flex-col gap-1">
        {folders.map((folder) => (
          <li key={folder.id} className="sidebar-row relative">
            <SidebarItem label={folder.name} href={`/folder/${folder.id}`} />
            <div className="row-actions absolute top-1/2 right-2 flex -translate-y-1/2 gap-0.5">
              <EditFolderButton folder={folder} />
              <DeleteFolderButton
                folder={folder}
                linkCount={links.filter((link) => link.folderId === folder.id).length}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

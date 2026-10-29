import type { Folder } from "@/types/link";

type FolderSelectProps = {
  folders: Folder[];
};

export default function FolderSelect({ folders }: FolderSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="folderId" className="text-sm font-medium text-zinc-700">
        폴더
      </label>
      <select
        id="folderId"
        name="folderId"
        required
        defaultValue=""
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
      >
        <option value="" disabled>
          폴더를 선택하세요
        </option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </div>
  );
}

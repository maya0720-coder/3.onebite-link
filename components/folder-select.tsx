import type { Folder } from "@/types/link";

type FolderSelectProps = {
  folders: Folder[];
  defaultValue?: string;
};

export default function FolderSelect({ folders, defaultValue = "" }: FolderSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="folderId" className="text-sm font-medium text-[var(--text-sub)]">
        폴더
      </label>
      <select
        id="folderId"
        name="folderId"
        required
        defaultValue={defaultValue}
        className="field select-arrow rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
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

import FolderSelect from "@/components/folder-select";
import LinkUrlInput from "@/components/link-url-input";
import SaveButton from "@/components/save-button";
import type { Folder } from "@/types/link";

type NewLinkFormProps = {
  folders: Folder[];
};

export default function NewLinkForm({ folders }: NewLinkFormProps) {
  return (
    <form className="flex flex-col gap-6 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <LinkUrlInput />
      <FolderSelect folders={folders} />
      <SaveButton />
    </form>
  );
}

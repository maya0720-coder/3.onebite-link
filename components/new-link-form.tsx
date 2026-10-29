import FolderSelect from "@/components/folder-select";
import LinkUrlInput from "@/components/link-url-input";
import SaveButton from "@/components/save-button";
import type { Folder } from "@/types/link";

type NewLinkFormProps = {
  folders: Folder[];
};

export default function NewLinkForm({ folders }: NewLinkFormProps) {
  return (
    <form className="flex flex-col gap-5">
      <LinkUrlInput />
      <FolderSelect folders={folders} />
      <SaveButton />
    </form>
  );
}

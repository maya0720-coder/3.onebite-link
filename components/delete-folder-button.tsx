import DeleteFolderForm from "@/components/delete-folder-form";
import Modal from "@/components/modal";
import TrashIcon from "@/components/trash-icon";
import type { Folder } from "@/types/link";

type DeleteFolderButtonProps = {
  folder: Folder;
  linkCount: number;
};

export default function DeleteFolderButton({ folder, linkCount }: DeleteFolderButtonProps) {
  const modalId = `delete-folder-${folder.id}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={modalId}
        aria-label={`${folder.name} 폴더 삭제`}
        title="폴더 삭제"
        className="row-action row-action-danger flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-sub)]"
      >
        <TrashIcon />
      </button>
      <Modal id={modalId} title="폴더 삭제">
        <DeleteFolderForm folder={folder} linkCount={linkCount} modalId={modalId} />
      </Modal>
    </>
  );
}

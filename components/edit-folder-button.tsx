import EditFolderForm from "@/components/edit-folder-form";
import Modal from "@/components/modal";
import PencilIcon from "@/components/pencil-icon";
import type { Folder } from "@/types/link";

type EditFolderButtonProps = {
  folder: Folder;
};

export default function EditFolderButton({ folder }: EditFolderButtonProps) {
  const modalId = `edit-folder-${folder.id}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={modalId}
        aria-label={`${folder.name} 폴더 이름 수정`}
        title="폴더 이름 수정"
        className="row-action flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-sub)]"
      >
        <PencilIcon />
      </button>
      <Modal id={modalId} title="폴더 이름 수정">
        {/* 이름이 바뀌면 폼을 새로 만들어 입력칸 기본값을 최신 이름으로 맞춘다. */}
        <EditFolderForm key={folder.name} folder={folder} modalId={modalId} />
      </Modal>
    </>
  );
}

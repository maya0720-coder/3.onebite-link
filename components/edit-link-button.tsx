import EditLinkForm from "@/components/edit-link-form";
import Modal from "@/components/modal";
import PencilIcon from "@/components/pencil-icon";
import type { Folder, Link } from "@/types/link";

type EditLinkButtonProps = {
  link: Link;
  folders: Folder[];
};

export default function EditLinkButton({ link, folders }: EditLinkButtonProps) {
  const modalId = `edit-link-${link.id}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={modalId}
        aria-label={`${link.title} 링크 수정`}
        title="링크 수정"
        className="row-action flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-sub)] shadow-[var(--shadow-card)]"
      >
        <PencilIcon />
      </button>
      <Modal id={modalId} title="링크 수정">
        {/* 내용이 바뀌면 폼을 새로 만들어 입력칸 기본값을 최신 값으로 맞춘다. */}
        <EditLinkForm
          key={`${link.folderId}|${link.title}|${link.description}`}
          link={link}
          folders={folders}
          modalId={modalId}
        />
      </Modal>
    </>
  );
}

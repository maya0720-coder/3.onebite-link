import DeleteLinkForm from "@/components/delete-link-form";
import Modal from "@/components/modal";
import TrashIcon from "@/components/trash-icon";
import type { Link } from "@/types/link";

type DeleteLinkButtonProps = {
  link: Link;
};

export default function DeleteLinkButton({ link }: DeleteLinkButtonProps) {
  const modalId = `delete-link-${link.id}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={modalId}
        aria-label={`${link.title} 링크 삭제`}
        title="링크 삭제"
        className="row-action-danger flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-sub)] shadow-[var(--shadow-card)]"
      >
        <TrashIcon />
      </button>
      <Modal id={modalId} title="링크 삭제">
        <DeleteLinkForm link={link} modalId={modalId} />
      </Modal>
    </>
  );
}

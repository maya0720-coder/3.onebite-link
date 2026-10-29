import Modal from "@/components/modal";
import NewFolderForm from "@/components/new-folder-form";

const MODAL_ID = "new-folder-modal";

export default function NewFolderButton() {
  return (
    <>
      <button
        type="button"
        popoverTarget={MODAL_ID}
        className="btn-secondary cursor-pointer rounded-xl bg-[var(--accent-soft)] px-4 py-2 text-[15px] font-bold text-[var(--accent)]"
      >
        + 새 폴더
      </button>
      <Modal id={MODAL_ID} title="새 폴더">
        <NewFolderForm modalId={MODAL_ID} />
      </Modal>
    </>
  );
}

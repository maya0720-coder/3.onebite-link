"use client";

import { useActionState } from "react";
import CancelButton from "@/components/cancel-button";
import FolderNameInput from "@/components/folder-name-input";
import SaveButton from "@/components/save-button";
import { createFolder, type CreateFolderState } from "@/lib/actions";

type NewFolderFormProps = {
  modalId: string;
};

const initialState: CreateFolderState = { ok: false };

export default function NewFolderForm({ modalId }: NewFolderFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: CreateFolderState, formData: FormData) => {
      const result = await createFolder(prevState, formData);
      if (result.ok) document.getElementById(modalId)?.hidePopover();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FolderNameInput error={state.error} />
      <div className="flex gap-2">
        <CancelButton popoverTarget={modalId} />
        <SaveButton />
      </div>
    </form>
  );
}

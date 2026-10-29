"use client";

import { useActionState } from "react";
import CancelButton from "@/components/cancel-button";
import FolderNameInput from "@/components/folder-name-input";
import SaveButton from "@/components/save-button";
import { renameFolder, type FolderActionState } from "@/lib/actions";
import type { Folder } from "@/types/link";

type EditFolderFormProps = {
  folder: Folder;
  modalId: string;
};

const initialState: FolderActionState = { ok: false };

export default function EditFolderForm({ folder, modalId }: EditFolderFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: FolderActionState, formData: FormData) => {
      const result = await renameFolder(prevState, formData);
      if (result.ok) document.getElementById(modalId)?.hidePopover();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={folder.id} />
      <FolderNameInput
        id={`${modalId}-name`}
        defaultValue={folder.name}
        error={state.error}
      />
      <div className="flex gap-2">
        <CancelButton popoverTarget={modalId} />
        <SaveButton />
      </div>
    </form>
  );
}

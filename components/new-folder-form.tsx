"use client";

import { type FormEvent, useActionState, useRef } from "react";
import CancelButton from "@/components/cancel-button";
import FolderNameInput from "@/components/folder-name-input";
import SaveButton from "@/components/save-button";
import { createFolder, type FolderActionState } from "@/lib/actions";

type NewFolderFormProps = {
  modalId: string;
};

const initialState: FolderActionState = { ok: false };

export default function NewFolderForm({ modalId }: NewFolderFormProps) {
  // 버튼이 비활성화되기 전에 들어온 제출까지 막아 폴더가 한 번만 추가되게 한다.
  // onSubmit에서 preventDefault()를 하면 React는 폼 액션을 실행하지 않는다.
  const submittingRef = useRef(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
  };
  const [state, formAction] = useActionState(
    async (prevState: FolderActionState, formData: FormData) => {
      try {
        const result = await createFolder(prevState, formData);
        if (result.ok) document.getElementById(modalId)?.hidePopover();
        return result;
      } finally {
        submittingRef.current = false;
      }
    },
    initialState,
  );

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FolderNameInput error={state.error} />
      <div className="flex gap-2">
        <CancelButton popoverTarget={modalId} />
        <SaveButton />
      </div>
    </form>
  );
}

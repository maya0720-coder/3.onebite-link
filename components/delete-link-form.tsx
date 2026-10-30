"use client";

import { useActionState } from "react";
import CancelButton from "@/components/cancel-button";
import SaveButton from "@/components/save-button";
import { deleteLink, type FolderActionState } from "@/lib/actions";
import type { Link } from "@/types/link";

type DeleteLinkFormProps = {
  link: Link;
  modalId: string;
};

const initialState: FolderActionState = { ok: false };

export default function DeleteLinkForm({ link, modalId }: DeleteLinkFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: FolderActionState, formData: FormData) => {
      const result = await deleteLink(prevState, formData);
      if (result.ok) document.getElementById(modalId)?.hidePopover();
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={link.id} />
      <div className="flex flex-col gap-2">
        <p className="text-[17px] leading-[1.6] break-all">
          <strong className="font-bold">{link.title}</strong> 링크를 삭제할까요?
        </p>
        <p className="text-sm leading-[1.4] text-[var(--text-sub)]">
          삭제한 링크는 되돌릴 수 없어요.
        </p>
        {state.error && <p className="text-sm text-[var(--error)]">{state.error}</p>}
      </div>
      <div className="flex gap-2">
        <CancelButton popoverTarget={modalId} />
        <SaveButton label="삭제" pendingLabel="삭제 중..." variant="danger" />
      </div>
    </form>
  );
}

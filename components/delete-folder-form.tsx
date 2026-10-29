"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import CancelButton from "@/components/cancel-button";
import SaveButton from "@/components/save-button";
import { deleteFolder, type FolderActionState } from "@/lib/actions";
import type { Folder } from "@/types/link";

type DeleteFolderFormProps = {
  folder: Folder;
  linkCount: number;
  modalId: string;
};

const initialState: FolderActionState = { ok: false };

export default function DeleteFolderForm({ folder, linkCount, modalId }: DeleteFolderFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    async (prevState: FolderActionState, formData: FormData) => {
      const result = await deleteFolder(prevState, formData);
      if (result.ok) {
        document.getElementById(modalId)?.hidePopover();
        // 보고 있던 폴더를 지웠다면 전체 목록으로 이동
        if (window.location.pathname === `/folder/${folder.id}`) router.replace("/");
      }
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={folder.id} />
      <div className="flex flex-col gap-2">
        <p className="text-[17px] leading-[1.6]">
          <strong className="font-bold">{folder.name}</strong> 폴더를 삭제할까요?
        </p>
        <p className="text-sm leading-[1.4] text-[var(--text-sub)]">
          {linkCount > 0
            ? `폴더 안의 링크 ${linkCount}개도 함께 삭제되며, 되돌릴 수 없어요.`
            : "삭제한 폴더는 되돌릴 수 없어요."}
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

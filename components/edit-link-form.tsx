"use client";

import { useActionState } from "react";
import CancelButton from "@/components/cancel-button";
import FolderSelect from "@/components/folder-select";
import SaveButton from "@/components/save-button";
import { updateLink, type EditLinkActionState } from "@/lib/actions";
import type { Folder, Link } from "@/types/link";

type EditLinkFormProps = {
  link: Link;
  folders: Folder[];
  modalId: string;
};

const initialState: EditLinkActionState = { ok: false };

export default function EditLinkForm({ link, folders, modalId }: EditLinkFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: EditLinkActionState, formData: FormData) => {
      const result = await updateLink(prevState, formData);
      if (result.ok) document.getElementById(modalId)?.hidePopover();
      return { ...result, attempt: (prevState.attempt ?? 0) + 1 };
    },
    initialState,
  );

  return (
    // 액션 후 폼이 자동 초기화되면 입력값이 원래대로 돌아가므로, 실패할 때마다 다시 마운트해 입력값을 복원한다.
    <form key={state.attempt} action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={link.id} />
      <FolderSelect
        id={`${modalId}-link-folder`}
        folders={folders}
        defaultValue={state.folderId ?? String(link.folderId)}
      />
      <div className="flex flex-col gap-2">
        {/* `${modalId}-title`은 모달 제목이 쓰고 있으므로 겹치지 않게 link- 접두어를 붙인다. */}
        <label htmlFor={`${modalId}-link-title`} className="text-sm font-medium text-[var(--text-sub)]">
          제목
        </label>
        <input
          id={`${modalId}-link-title`}
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={state.title ?? link.title}
          autoComplete="off"
          className="field rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${modalId}-link-description`}
          className="text-sm font-medium text-[var(--text-sub)]"
        >
          설명
        </label>
        <textarea
          id={`${modalId}-link-description`}
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={state.description ?? link.description}
          placeholder="링크에 대한 설명을 입력하세요"
          className="field resize-none rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] leading-[1.5] text-[var(--text)] outline-none"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-[var(--error)]">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <CancelButton popoverTarget={modalId} />
        <SaveButton />
      </div>
    </form>
  );
}

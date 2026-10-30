"use client";

import { useActionState } from "react";
import FolderSelect from "@/components/folder-select";
import LinkUrlInput from "@/components/link-url-input";
import SaveButton from "@/components/save-button";
import { createLink, type LinkActionState } from "@/lib/actions";
import type { Folder } from "@/types/link";

type NewLinkFormProps = {
  folders: Folder[];
};

const initialState: LinkActionState = {};

export default function NewLinkForm({ folders }: NewLinkFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: LinkActionState, formData: FormData) => {
      const result = await createLink(prevState, formData);
      // 프로덕션 빌드에서 캐시를 갱신한 액션 직후 클라이언트 라우팅(redirect, router.push)을 하면
      // 진행 중인 응답이 끊기며 페이지가 깨지는 경우가 있어, 전체 페이지 이동으로 연다.
      if (result.ok) window.location.assign(`/folder/${result.folderId}`);
      return { ...result, attempt: (prevState.attempt ?? 0) + 1 };
    },
    initialState,
  );

  return (
    // 액션 후 폼이 자동 초기화되면 select가 비워지므로, 실패할 때마다 다시 마운트해 입력값을 복원한다.
    <form
      key={state.attempt}
      action={formAction}
      className="flex flex-col gap-6 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
    >
      <LinkUrlInput defaultValue={state.url} />
      <FolderSelect folders={folders} defaultValue={state.folderId} />
      {state.error && (
        <p role="alert" className="text-sm text-[var(--error)]">
          {state.error}
        </p>
      )}
      <SaveButton label="확인" pendingLabel="링크 정보 가져오는 중..." />
    </form>
  );
}

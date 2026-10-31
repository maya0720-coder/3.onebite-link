"use client";

import { useActionState, useRef } from "react";
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
  // 버튼이 비활성화되기 전의 빠른 연속 클릭도 막도록, 제출 중 여부를 렌더링과 무관하게 즉시 기록한다.
  const submittingRef = useRef(false);
  const [state, formAction] = useActionState(
    async (prevState: LinkActionState, formData: FormData) => {
      const result = await createLink(prevState, formData);
      // 프로덕션 빌드에서 캐시를 갱신한 액션 직후 클라이언트 라우팅(redirect, router.push)을 하면
      // 진행 중인 응답이 끊기며 페이지가 깨지는 경우가 있어, 전체 페이지 이동으로 연다.
      // 성공하면 페이지를 떠날 때까지 잠금을 유지한다.
      if (result.ok) window.location.assign(`/folder/${result.folderId}`);
      else submittingRef.current = false;
      return { ...result, attempt: (prevState.attempt ?? 0) + 1 };
    },
    initialState,
  );

  return (
    // 액션 후 폼이 자동 초기화되면 select가 비워지므로, 실패할 때마다 다시 마운트해 입력값을 복원한다.
    <form
      key={state.attempt}
      action={formAction}
      onSubmit={(event) => {
        if (submittingRef.current) event.preventDefault();
        else submittingRef.current = true;
      }}
      className="flex flex-col gap-6 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
    >
      <LinkUrlInput defaultValue={state.url} />
      <FolderSelect folders={folders} defaultValue={state.folderId} />
      {state.error && (
        <p role="alert" className="text-sm text-[var(--error)]">
          {state.error}
        </p>
      )}
      <SaveButton label="확인" pendingLabel="링크 정보 가져오는 중..." disabled={state.ok} />
    </form>
  );
}

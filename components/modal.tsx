"use client";

import { Fragment, useState, type ReactNode, type ToggleEvent } from "react";

type ModalProps = {
  id: string;
  title: string;
  children: ReactNode;
};

// 브라우저 기본 popover로 열고 닫으므로 JS 로딩(하이드레이션) 전에 눌러도 모달이 열린다.
// 열기: <button popoverTarget={id}>, 닫기: <button popoverTarget={id} popoverTargetAction="hide">
export default function Modal({ id, title, children }: ModalProps) {
  const [resetKey, setResetKey] = useState(0);

  const handleToggle = (event: ToggleEvent<HTMLDivElement>) => {
    if (event.newState === "open") {
      event.currentTarget.querySelector<HTMLElement>("input, select, textarea")?.focus();
    } else {
      // 닫힐 때 내용을 초기화해서 다시 열면 빈 상태로 시작한다.
      setResetKey((key) => key + 1);
    }
  };

  return (
    <div
      id={id}
      popover="auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      onToggle={handleToggle}
      className="modal m-auto w-[calc(100%-40px)] max-w-[400px] rounded-2xl border-0 bg-[var(--surface)] p-0 text-[var(--text)] shadow-[var(--shadow-card-hover)] backdrop:bg-[var(--overlay)]"
    >
      <div className="flex flex-col gap-6 p-6">
        <h2 id={`${id}-title`} className="text-xl leading-[1.4] font-bold">
          {title}
        </h2>
        <Fragment key={resetKey}>{children}</Fragment>
      </div>
    </div>
  );
}
